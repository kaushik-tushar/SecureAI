"""
SecureAI - Authentication Service

Handles authentication business logic, including:
- User registration
- Duplicate email detection
- Password hashing and verification
- User login
- JWT access-token generation
- Current-user authentication
- Active-account validation
"""

from datetime import timedelta
from typing import Optional

import jwt

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from fastapi import HTTPException, status

from app.models.user import User

from app.schemas.auth import (
    UserRegister,
    UserLogin
)

from app.core.security import (
    get_password_hash,
    verify_password,
    needs_password_rehash,
    create_access_token,
    decode_access_token,
    authentication_error
)

from app.core.config import settings


# ==========================================
# AUTHENTICATION CONFIGURATION
# ==========================================

ACCESS_TOKEN_EXPIRE = timedelta(
    minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
)


# ==========================================
# USER LOOKUP
# ==========================================

def get_user_by_email(
    db: Session,
    email: str
) -> Optional[User]:

    """
    Retrieves a user using their normalized email.

    Returns:
        User object if found, otherwise None.
    """

    normalized_email = email.strip().lower()

    statement = select(User).where(
        User.email == normalized_email
    )

    return db.scalar(statement)


def get_user_by_id(
    db: Session,
    user_id: int
) -> Optional[User]:

    """
    Retrieves a user using their database ID.
    """

    return db.get(User, user_id)


# ==========================================
# USER REGISTRATION
# ==========================================

def register_user(
    db: Session,
    user_data: UserRegister
) -> User:

    """
    Creates a new SecureAI user account.

    Passwords are hashed before database storage.

    Raises:
        HTTPException 409 if email already exists.
        HTTPException 500 if registration fails.
    """

    email = str(user_data.email).strip().lower()

    # --------------------------------------
    # CHECK EXISTING USER
    # --------------------------------------

    existing_user = get_user_by_email(
        db=db,
        email=email
    )

    if existing_user:

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists."
        )

    # --------------------------------------
    # HASH PASSWORD
    # --------------------------------------

    hashed_password = get_password_hash(
        user_data.password
    )

    # --------------------------------------
    # CREATE USER OBJECT
    # --------------------------------------

    new_user = User(
        full_name=user_data.full_name,
        email=email,
        hashed_password=hashed_password,
        role="user",
        is_active=True,
        is_verified=False
    )

    # --------------------------------------
    # SAVE USER
    # --------------------------------------

    try:

        db.add(new_user)

        db.commit()

        db.refresh(new_user)

        return new_user

    except IntegrityError:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists."
        )

    except Exception:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to create your account."
        )


# ==========================================
# PASSWORD AUTHENTICATION
# ==========================================

def authenticate_user(
    db: Session,
    credentials: UserLogin
) -> Optional[User]:

    """
    Verifies user credentials.

    Returns:
        User object if credentials are valid.
        None if credentials are invalid.

    Also upgrades outdated password hashes
    when a successful login occurs.
    """

    email = str(credentials.email).strip().lower()

    # --------------------------------------
    # FIND USER
    # --------------------------------------

    user = get_user_by_email(
        db=db,
        email=email
    )

    if user is None:
        return None

    # --------------------------------------
    # VERIFY PASSWORD
    # --------------------------------------

    password_valid = verify_password(
        plain_password=credentials.password,
        hashed_password=user.hashed_password
    )

    if not password_valid:
        return None

    # --------------------------------------
    # UPGRADE PASSWORD HASH IF REQUIRED
    # --------------------------------------

    if needs_password_rehash(user.hashed_password):

        try:

            user.hashed_password = get_password_hash(
                credentials.password
            )

            db.commit()

        except Exception:

            db.rollback()

            # Authentication remains valid.
            # Hash upgrade can be retried later.

    return user


# ==========================================
# ACCESS TOKEN GENERATION
# ==========================================

def generate_user_token(user: User) -> str:

    """
    Generates a JWT access token for a user.

    The database user ID is stored as the
    JWT subject.

    Returns:
        Encoded JWT access token.
    """

    return create_access_token(
        subject=str(user.id),
        expires_delta=ACCESS_TOKEN_EXPIRE,
        additional_claims={
            "email": user.email,
            "role": user.role
        }
    )


# ==========================================
# USER LOGIN
# ==========================================

def login_user(
    db: Session,
    credentials: UserLogin
) -> dict:

    """
    Authenticates a user and generates
    an access token.

    Returns:
        Dictionary containing token and user.
    """

    user = authenticate_user(
        db=db,
        credentials=credentials
    )

    # --------------------------------------
    # INVALID CREDENTIALS
    # --------------------------------------

    if user is None:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={
                "WWW-Authenticate": "Bearer"
            }
        )

    # --------------------------------------
    # ACCOUNT STATUS CHECK
    # --------------------------------------

    if not user.is_active:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated."
        )

    # --------------------------------------
    # GENERATE ACCESS TOKEN
    # --------------------------------------

    access_token = generate_user_token(user)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "user": user
    }


# ==========================================
# CURRENT USER AUTHENTICATION
# ==========================================

def get_current_user(
    db: Session,
    token: str
) -> User:

    """
    Validates a JWT and retrieves its associated user.

    Raises:
        HTTPException 401 if token is invalid
        or the associated user does not exist.
    """

    # --------------------------------------
    # DECODE JWT
    # --------------------------------------

    payload = decode_access_token(token)

    subject = payload.get("sub")

    if not subject or not subject.isdigit():

        raise authentication_error()

    # --------------------------------------
    # FIND USER
    # --------------------------------------

    user = get_user_by_id(
        db=db,
        user_id=int(subject)
    )

    if user is None:

        raise authentication_error()

    return user


# ==========================================
# ACTIVE USER VALIDATION
# ==========================================

def get_current_active_user(
    db: Session,
    token: str
) -> User:

    """
    Retrieves the authenticated user and
    verifies that their account is active.
    """

    user = get_current_user(
        db=db,
        token=token
    )

    if not user.is_active:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account is currently inactive."
        )

    return user


# ==========================================
# ADMINISTRATOR VALIDATION
# ==========================================

def require_admin(user: User) -> User:

    """
    Ensures that the authenticated user
    has administrator privileges.
    """

    if user.role != "admin":

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator privileges required."
        )

    return user