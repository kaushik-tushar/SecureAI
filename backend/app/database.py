"""
SecureAI - Database Configuration

Manages SQLAlchemy database connections,
sessions, declarative models and dependencies.
"""

from contextlib import contextmanager
from typing import Generator

from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
from sqlalchemy.orm import (
    DeclarativeBase,
    Session,
    sessionmaker
)

from app.core.config import settings


# ==========================================
# DATABASE CONFIGURATION
# ==========================================

DATABASE_URL = settings.DATABASE_URL

# ==========================================
# ENGINE CONFIGURATION
# ==========================================

engine_options = {
    "pool_pre_ping": True
}

# SQLite requires special configuration
# when used with FastAPI's request handling.

if DATABASE_URL.startswith("sqlite"):

    engine_options["connect_args"] = {
        "check_same_thread": False,
        "timeout": 30
    }


# ==========================================
# DATABASE ENGINE
# ==========================================

engine: Engine = create_engine(
    DATABASE_URL,
    **engine_options
)


# ==========================================
# SESSION FACTORY
# ==========================================

SessionLocal = sessionmaker(
    bind=engine,
    class_=Session,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False
)


# ==========================================
# DECLARATIVE BASE
# ==========================================

class Base(DeclarativeBase):
    """
    Base class for all SQLAlchemy database models.

    Every database model will inherit from this class.
    """

    pass


# ==========================================
# DATABASE DEPENDENCY
# ==========================================

def get_db() -> Generator[Session, None, None]:

    """
    Provides a database session to FastAPI endpoints.

    Creates a new session for each request
    and closes it after request completion.
    """

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()


# ==========================================
# DATABASE SESSION CONTEXT MANAGER
# ==========================================

@contextmanager
def get_db_context():

    """
    Provides a database session outside FastAPI routes.

    Useful for background tasks and internal services.
    """

    db = SessionLocal()

    try:

        yield db

    except Exception:

        db.rollback()

        raise

    finally:

        db.close()


# ==========================================
# DATABASE CONNECTIVITY CHECK
# ==========================================

def check_database_connection() -> bool:

    """
    Checks whether the database is reachable.

    Returns:
        bool: True if connection succeeds.
    """

    try:

        with engine.connect() as connection:

            connection.execute(
                text("SELECT 1")
            )

        return True

    except Exception:

        return False


# ==========================================
# DATABASE INITIALIZATION
# ==========================================

def init_db() -> None:

    """
    Initializes database tables registered
    with the DeclarativeBase metadata.

    Import all model modules before calling
    this function so their tables are registered.
    """

    Base.metadata.create_all(
        bind=engine
    )


# ==========================================
# DATABASE SHUTDOWN
# ==========================================

def close_db() -> None:

    """
    Disposes database connections during shutdown.
    """

    engine.dispose()