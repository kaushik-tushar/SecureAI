"""
SecureAI - Database Models

Centralized model registration.

Importing this package registers all SQLAlchemy
models with the application's declarative Base.
"""

from app.models.user import User
from app.models.repository import Repository
from app.models.scan import Scan
from app.models.vulnerability import Vulnerability


# ==========================================
# PUBLIC MODEL EXPORTS
# ==========================================

__all__ = [
    "User",
    "Repository",
    "Scan",
    "Vulnerability"
]