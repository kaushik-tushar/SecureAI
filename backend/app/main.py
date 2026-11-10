"""
SecureAI - Main Application

Main entry point for the SecureAI backend.

Features:
- FastAPI application initialization
- API router registration
- CORS configuration
- Database initialization
- Application lifecycle management
- Health monitoring
- Global exception handling
- API documentation

Run:
    uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
"""

import logging

from contextlib import asynccontextmanager

from fastapi import (
    FastAPI,
    Request,
    status
)

from fastapi.middleware.cors import CORSMiddleware

from fastapi.responses import JSONResponse

from app.core.config import settings

from app.database import (
    init_db,
    close_db,
    check_database_connection
)

# Import models before database initialization.
# This ensures all SQLAlchemy models are registered.

import app.models

# Import all API routers.

from app.api.routes import (
    auth_router,
    repositories_router,
    scans_router,
    vulnerabilities_router,
    remediation_router,
    ai_review_router
)


# ==========================================
# LOGGING CONFIGURATION
# ==========================================

logging.basicConfig(

    level=(
        logging.DEBUG
        if settings.DEBUG
        else logging.INFO
    ),

    format=(
        "%(asctime)s | "
        "%(levelname)s | "
        "%(name)s | "
        "%(message)s"
    )
)

logger = logging.getLogger("secureai")


# ==========================================
# APPLICATION LIFECYCLE
# ==========================================

@asynccontextmanager
async def lifespan(application: FastAPI):

    """
    Manages application startup and shutdown.

    Startup:
    - Initialize database tables.
    - Verify database connectivity.
    - Log application information.

    Shutdown:
    - Dispose database connections.
    """

    # --------------------------------------
    # APPLICATION STARTUP
    # --------------------------------------

    logger.info(
        "Starting %s v%s",
        settings.APP_NAME,
        settings.APP_VERSION
    )

    try:

        init_db()

        database_available = check_database_connection()

        if not database_available:

            raise RuntimeError(
                "Database connection could not be established."
            )

        logger.info(
            "Database initialized successfully."
        )

        logger.info(
            "%s backend is ready.",
            settings.APP_NAME
        )

    except Exception:

        logger.exception(
            "Application startup failed."
        )

        close_db()

        raise

    yield

    # --------------------------------------
    # APPLICATION SHUTDOWN
    # --------------------------------------

    logger.info(
        "Shutting down %s.",
        settings.APP_NAME
    )

    close_db()

    logger.info(
        "Database connections closed."
    )


# ==========================================
# FASTAPI APPLICATION INITIALIZATION
# ==========================================

app = FastAPI(

    title=settings.APP_NAME,

    description="""
# SecureAI Backend API

SecureAI is an AI-powered application security
platform designed to help developers identify,
understand and remediate software vulnerabilities.

## Core Features

- GitHub repository integration
- Security scan management
- Vulnerability detection management
- AI-powered security analysis
- Intelligent remediation recommendations
- Vulnerability statistics
- JWT-based authentication

## Authentication

Most endpoints require a JWT access token.

Use the login endpoint to obtain an access token.

Then click the Authorize button in Swagger UI
and provide your Bearer token.
""",

    version=settings.APP_VERSION,

    docs_url="/docs",

    redoc_url="/redoc",

    openapi_url="/openapi.json",

    lifespan=lifespan
)


# ==========================================
# CORS CONFIGURATION
# ==========================================

app.add_middleware(

    CORSMiddleware,

    allow_origins=settings.CORS_ORIGINS,

    allow_credentials=True,

    allow_methods=[
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS"
    ],

    allow_headers=[
        "Authorization",
        "Content-Type",
        "Accept",
        "Origin",
        "X-Requested-With"
    ],

    expose_headers=[
        "Content-Length"
    ],

    max_age=600
)


# ==========================================
# GLOBAL EXCEPTION HANDLER
# ==========================================

@app.exception_handler(Exception)
async def global_exception_handler(
    request: Request,
    exc: Exception
):

    """
    Handles unexpected application errors.

    Internal exception details are logged
    but never exposed to API clients.
    """

    logger.exception(
        "Unhandled exception on %s %s",
        request.method,
        request.url.path
    )

    return JSONResponse(

        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,

        content={
            "success": False,
            "message": "An unexpected internal server error occurred."
        }
    )


# ==========================================
# REGISTER AUTHENTICATION ROUTES
# ==========================================

app.include_router(

    auth_router,

    prefix=settings.API_V1_PREFIX
)


# ==========================================
# REGISTER REPOSITORY ROUTES
# ==========================================

app.include_router(

    repositories_router,

    prefix=settings.API_V1_PREFIX
)


# ==========================================
# REGISTER SECURITY SCAN ROUTES
# ==========================================

app.include_router(

    scans_router,

    prefix=settings.API_V1_PREFIX
)


# ==========================================
# REGISTER VULNERABILITY ROUTES
# ==========================================

app.include_router(

    vulnerabilities_router,

    prefix=settings.API_V1_PREFIX
)


# ==========================================
# REGISTER REMEDIATION ROUTES
# ==========================================

app.include_router(

    remediation_router,

    prefix=settings.API_V1_PREFIX
)


# ==========================================
# REGISTER AI REVIEW ROUTES
# ==========================================

app.include_router(

    ai_review_router,

    prefix=settings.API_V1_PREFIX
)


# ==========================================
# ROOT ENDPOINT
# ==========================================

@app.get(
    "/",
    tags=["Application"],
    summary="Application information"
)
async def root():

    """
    Returns basic backend information.
    """

    return {

        "success": True,

        "application": settings.APP_NAME,

        "version": settings.APP_VERSION,

        "message": "SecureAI backend is running.",

        "documentation": "/docs",

        "health": "/health",

        "api_prefix": settings.API_V1_PREFIX

    }


# ==========================================
# HEALTH CHECK ENDPOINT
# ==========================================

@app.get(
    "/health",
    tags=["Application"],
    summary="Backend health check"
)
async def health_check():

    """
    Checks the health of the backend.

    Verifies database connectivity.

    Returns HTTP 200 when healthy.
    Returns HTTP 503 when database connectivity
    is unavailable.
    """

    database_healthy = check_database_connection()

    if not database_healthy:

        logger.error(
            "Health check failed: database unavailable."
        )

        return JSONResponse(

            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,

            content={

                "success": False,

                "status": "unhealthy",

                "application": settings.APP_NAME,

                "database": "disconnected"

            }
        )

    return {

        "success": True,

        "status": "healthy",

        "application": settings.APP_NAME,

        "version": settings.APP_VERSION,

        "database": "connected"

    }


# ==========================================
# API INFORMATION ENDPOINT
# ==========================================

@app.get(
    f"{settings.API_V1_PREFIX}/info",
    tags=["Application"],
    summary="API information"
)
async def api_information():

    """
    Returns available API module information.
    """

    return {

        "success": True,

        "application": settings.APP_NAME,

        "version": settings.APP_VERSION,

        "modules": [

            "Authentication",

            "GitHub Repositories",

            "Security Scans",

            "Vulnerability Management",

            "Remediation",

            "AI Security Review"

        ],

        "documentation": "/docs"

    }


# ==========================================
# APPLICATION METADATA
# ==========================================

logger.info(
    "SecureAI application module loaded."
)