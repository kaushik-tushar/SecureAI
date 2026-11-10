"""
SecureAI - Authentication Schemas

Defines request and response validation schemas
for registration, login and authentication.
"""

import re
from datetime import datetime
from typing import Literal

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    field_validator
)


# ==========================================
# SHARED VALIDATION
# ==========================================

def normalize_email(value: str) -> str:
    """
    Normalize email addresses before validation
    and database operations.
    """
    return value.strip().lower()


# ==========================================
# USER REGISTRATION
# ==========================================

class UserRegister(BaseModel):

    full_name: str = Field(
        ...,
        min_length=2,
        max_length=120,
        examples=["John Doe"]
    )

    email: EmailStr = Field(
        ...,
        max_length=255,
        examples=["john@example.com"]
    )

    password: str = Field(
        ...,
        min_length=8,
        max_length=128,
        examples=["SecurePassword123!"]
    )

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, value: str) -> str:

        value = " ".join(value.strip().split())

        if len(value) < 2:
            raise ValueError(
                "Full name must contain at least 2 characters."
            )

        if not re.fullmatch(
            r"[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ\s.'-]*",
            value
        ):
            raise ValueError(
                "Full name contains unsupported characters."
            )

        return value

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: EmailStr) -> str:

        return normalize_email(str(value))

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:

        if value != value.strip():
            raise ValueError(
                "Password cannot begin or end with whitespace."
            )

        if len(value) < 8:
            raise ValueError(
                "Password must contain at least 8 characters."
            )

        if not re.search(r"[A-Za-z]", value):
            raise ValueError(
                "Password must contain at least one letter."
            )

        if not re.search(r"\d", value):
            raise ValueError(
                "Password must contain at least one number."
            )

        return value


# ==========================================
# USER LOGIN
# ==========================================

class UserLogin(BaseModel):

    email: EmailStr = Field(
        ...,
        max_length=255,
        examples=["john@example.com"]
    )

    password: str = Field(
        ...,
        min_length=1,
        max_length=128
    )

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: EmailStr) -> str:

        return normalize_email(str(value))


# ==========================================
# USER PROFILE RESPONSE
# ==========================================

class UserResponse(BaseModel):

    id: int

    full_name: str

    email: EmailStr

    role: Literal["user", "admin"]

    is_active: bool

    is_verified: bool

    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


# ==========================================
# AUTHENTICATION TOKEN RESPONSE
# ==========================================

class TokenResponse(BaseModel):

    access_token: str

    token_type: str = "bearer"

    expires_in: int

    user: UserResponse


# ==========================================
# TOKEN DATA
# ==========================================

class TokenData(BaseModel):

    sub: str | None = None

    model_config = ConfigDict(
        extra="ignore"
    )


# ==========================================
# GENERIC AUTHENTICATION RESPONSE
# ==========================================

class AuthMessage(BaseModel):

    message: str

    success: bool = True