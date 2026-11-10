"""
SecureAI - Authentication API Routes

Provides authentication endpoints.

Endpoints:
- POST /auth/register
- POST /auth/login
- GET  /auth/me
- POST /auth/logout

Features:
- User registration
- User authentication
- JWT access tokens
- Current-user retrieval
- Protected endpoints
- Active-account verification
"""

from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from fastapi.security import OAuth2PasswordBearer

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.user import User

from app.schemas.auth import (
    UserRegister,
    UserLogin,
    UserResponse,
    TokenResponse,
    AuthMessage
)

from app.services.auth_service import (
    register_user,
    login_user,
    get_current_active_user
)

from app.core.config import settings

from app.core.security import authentication_error


# ==========================================
# ROUTER CONFIGURATION
# ==========================================

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# ==========================================
# AUTHENTICATION CONFIGURATION
# ==========================================

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_PREFIX}/auth/login",
    auto_error=False
)


# ==========================================
# DATABASE DEPENDENCY
# ==========================================

DatabaseSession = Annotated[
    Session,
    Depends(get_db)
]


# ==========================================
# CURRENT USER DEPENDENCY
# ==========================================

def get_authenticated_user(
    db: DatabaseSession,
    token: Annotated[
        str | None,
        Depends(oauth2_scheme)
    ]
) -> User:

    """
    Retrieves the authenticated active user.

    Validates the JWT and verifies that
    the associated account is active.

    Raises:
        401: Missing or invalid authentication token.
        403: Account is inactive.
        404: User account no longer exists.
    """

    if not token:

        raise authentication_error()

    return get_current_active_user(
        db=db,
        token=token
    )


# Reusable dependency for protected routes.

CurrentUser = Annotated[
    User,
    Depends(get_authenticated_user)
]


# ==========================================
# USER REGISTRATION
# ==========================================

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description="Creates a new SecureAI user account."
)
def register(
    user_data: UserRegister,
    db: DatabaseSession
):

    """
    Registers a new SecureAI account.

    Request body:

    {
        "full_name": "John Doe",
        "email": "john@example.com",
        "password": "SecurePassword123!"
    }

    Returns:
        Newly created user profile.

    Security:
        Passwords are hashed before database storage.
    """

    user = register_user(
        db=db,
        user_data=user_data
    )

    return user


# ==========================================
# USER LOGIN
# ==========================================

@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Authenticate user",
    description="Authenticates a user and returns a JWT access token."
)
def login(
    credentials: UserLogin,
    db: DatabaseSession
):

    """
    Authenticates a SecureAI user.

    Request body:

    {
        "email": "john@example.com",
        "password": "SecurePassword123!"
    }

    Returns:
        JWT access token.
        Token expiration.
        Authenticated user profile.
    """

    result = login_user(
        db=db,
        credentials=credentials
    )

    return result


# ==========================================
# GET CURRENT USER PROFILE
# ==========================================

@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current user",
    description="Returns the profile of the authenticated user."
)
def get_me(
    current_user: CurrentUser
):

    """
    Retrieves the currently authenticated user.

    Requires:
        Authorization: Bearer <access_token>

    Returns:
        User profile information.

    Password hashes and other sensitive
    authentication information are never returned.
    """

    return current_user


# ==========================================
# USER LOGOUT
# ==========================================

@router.post(
    "/logout",
    response_model=AuthMessage,
    status_code=status.HTTP_200_OK,
    summary="Logout user",
    description="Confirms logout for the authenticated user."
)
def logout(
    current_user: CurrentUser
):

    """
    Handles logout for the authenticated user.

    SecureAI currently uses stateless JWT
    authentication.

    Therefore, the frontend must remove the
    stored access token after receiving this
    response.

    This endpoint does not revoke the JWT
    server-side.
    """

    return AuthMessage(
        message="Logout successful. Please clear your access token.",
        success=True
    )