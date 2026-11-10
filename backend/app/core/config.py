"""
SecureAI - Application Configuration

Centralized configuration management using Pydantic Settings.
Loads environment variables from the backend/.env file.
"""

from functools import lru_cache
from pathlib import Path
from typing import Optional

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


# ==========================================
# PROJECT PATHS
# ==========================================

BASE_DIR = Path(__file__).resolve().parents[2]

ENV_FILE = BASE_DIR / ".env"


# ==========================================
# APPLICATION SETTINGS
# ==========================================

class Settings(BaseSettings):

    # --------------------------------------
    # Application Information
    # --------------------------------------

    APP_NAME: str = "SecureAI"

    APP_VERSION: str = "1.0.0"

    DEBUG: bool = False

    API_V1_PREFIX: str = "/api/v1"


    # --------------------------------------
    # Database Configuration
    # --------------------------------------

    DATABASE_URL: str = "sqlite:///./secureai.db"


    # --------------------------------------
    # Authentication Configuration
    # --------------------------------------

    JWT_SECRET_KEY: str = Field(
        ...,
        min_length=32
    )

    JWT_ALGORITHM: str = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=30,
        gt=0
    )


    # --------------------------------------
    # GitHub Integration
    # --------------------------------------

    GITHUB_API_BASE_URL: str = "https://api.github.com"

    GITHUB_TOKEN: Optional[str] = None


    # --------------------------------------
    # AI Configuration
    # --------------------------------------

    OPENAI_API_KEY: Optional[str] = None

    OPENAI_MODEL: str = "gpt-4o-mini"


    # --------------------------------------
    # CORS Configuration
    # --------------------------------------

    CORS_ORIGINS: list[str] = Field(
        default_factory=lambda: [
            "http://localhost:5173",
            "http://127.0.0.1:5173"
        ]
    )


    # --------------------------------------
    # Server Configuration
    # --------------------------------------

    HOST: str = "127.0.0.1"

    PORT: int = Field(
        default=8000,
        ge=1,
        le=65535
    )


    # ======================================
    # FIELD VALIDATORS
    # ======================================

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, value):

        if isinstance(value, str):

            return [
                origin.strip().rstrip("/")
                for origin in value.split(",")
                if origin.strip()
            ]

        if isinstance(value, list):

            return [
                str(origin).strip().rstrip("/")
                for origin in value
                if str(origin).strip()
            ]

        raise ValueError(
            "CORS_ORIGINS must be a comma-separated string or a list."
        )


    @field_validator("API_V1_PREFIX")
    @classmethod
    def validate_api_prefix(cls, value):

        value = value.strip()

        if not value.startswith("/"):
            raise ValueError(
                "API_V1_PREFIX must start with '/'."
            )

        return value.rstrip("/")


    @field_validator("GITHUB_API_BASE_URL")
    @classmethod
    def validate_github_url(cls, value):

        return value.rstrip("/")


    # ======================================
    # PYDANTIC SETTINGS CONFIGURATION
    # ======================================

    model_config = SettingsConfigDict(

        env_file=ENV_FILE,

        env_file_encoding="utf-8",

        case_sensitive=False,

        extra="ignore",

        validate_default=True
    )


# ==========================================
# SETTINGS INSTANCE
# ==========================================

@lru_cache(maxsize=1)
def get_settings() -> Settings:

    """
    Returns a cached application settings instance.

    Configuration is loaded only once and reused
    throughout the application lifecycle.
    """

    return Settings()


# ==========================================
# GLOBAL SETTINGS
# ==========================================

settings = get_settings()