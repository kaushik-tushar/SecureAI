"""
SecureAI - Authentication and Security

Handles password hashing, JWT generation,
JWT validation and OAuth2 bearer authentication.
"""

from datetime import datetime, timedelta, timezone
from typing import Any, Optional

import jwt

from jwt.exceptions import InvalidTokenError

from fastapi import HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from pwdlib import PasswordHash

from app.core.config import settings


# ==========================================
# PASSWORD HASHING CONFIGURATION
# ==========================================

password_hash = PasswordHash.recommended()


# ==========================================
# OAUTH2 CONFIGURATION
# ==========================================

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_PREFIX}/auth/login",
    auto_error=False
)


# ==========================================
# PASSWORD HASHING
# ==========================================

def get_password_hash(password: str) -> str:
    """
    Generates a secure Argon2 password hash.
    """

    if not password:
        raise ValueError("Password cannot be empty.")

    return password_hash.hash(password)


# ==========================================
# PASSWORD VERIFICATION
# ==========================================

def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    """
    Verifies a password against its stored hash.
    """

    if not plain_password or not hashed_password:
        return False

    try:
        return password_hash.verify(
            plain_password,
            hashed_password
        )

    except (ValueError, TypeError):
        return False


# ==========================================
# PASSWORD HASH UPGRADE CHECK
# ==========================================

def needs_password_rehash(
    hashed_password: str
) -> bool:
    """
    PasswordHash does not expose a hash-only
    check_needs_rehash() method.

    pwdlib provides verify_and_update(), which
    requires the original password as well as
    the stored hash.

    Hash upgrades will be handled separately
    during authentication.
    """

    if not hashed_password:
        return False

    # Avoid calling an unsupported pwdlib method.
    return False


# ==========================================
# JWT ACCESS TOKEN GENERATION
# ==========================================

def create_access_token(
    subject: str,
    expires_delta: Optional[timedelta] = None,
    additional_claims: Optional[dict[str, Any]] = None
) -> str:
    """
    Generates a signed JWT access token.
    """

    if not subject:
        raise ValueError("Token subject cannot be empty.")

    now = datetime.now(timezone.utc)

    if expires_delta is None:
        expires_delta = timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    if expires_delta.total_seconds() <= 0:
        raise ValueError(
            "Token expiration must be greater than zero."
        )

    payload = {
        "sub": str(subject),
        "iat": now,
        "exp": now + expires_delta,
        "type": "access"
    }

    if additional_claims:

        reserved_claims = {
            "sub",
            "iat",
            "exp",
            "nbf",
            "jti",
            "type"
        }

        if reserved_claims.intersection(additional_claims):
            raise ValueError(
                "Additional claims cannot override reserved JWT claims."
            )

        payload.update(additional_claims)

    return jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )


# ==========================================
# JWT TOKEN DECODING
# ==========================================

def decode_access_token(token: str) -> dict[str, Any]:
    """
    Decodes and validates a JWT access token.
    """

    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
            options={
                "require": ["exp", "iat", "sub", "type"]
            }
        )

        if payload.get("type") != "access":
            raise InvalidTokenError("Invalid token type.")

        subject = payload.get("sub")

        if not isinstance(subject, str) or not subject.strip():
            raise InvalidTokenError("Invalid token subject.")

        return payload

    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token.",
            headers={
                "WWW-Authenticate": "Bearer"
            }
        )


# ==========================================
# GET USER ID FROM TOKEN
# ==========================================

def get_token_subject(token: str) -> str:
    """
    Extracts the authenticated user identifier
    from a validated access token.
    """

    payload = decode_access_token(token)

    return payload["sub"]


# ==========================================
# AUTHENTICATION ERROR
# ==========================================

def authentication_error() -> HTTPException:
    """
    Returns a standardized authentication error.
    """

    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication required.",
        headers={
            "WWW-Authenticate": "Bearer"
        }
    )


# ==========================================
# TOKEN VALIDATION
# ==========================================

def validate_token(token: str) -> bool:
    """
    Checks whether an access token is valid.
    """

    try:
        decode_access_token(token)
        return True

    except HTTPException:
        return False