"""
SecureAI - User Database Model

Defines the User entity and its database relationships.

Features:
- Unique user identification
- Email uniqueness and indexing
- Secure password hash storage
- User roles and account status
- Automatic timestamps
- Repository relationship
"""

from datetime import datetime

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    String,
    func
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from app.database import Base


# ==========================================
# USER MODEL
# ==========================================

class User(Base):

    __tablename__ = "users"

    # ======================================
    # TABLE CONSTRAINTS
    # ======================================

    __table_args__ = (
        CheckConstraint(
            "role IN ('user', 'admin')",
            name="check_user_role"
        ),
    )

    # ======================================
    # PRIMARY KEY
    # ======================================

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
        index=True
    )

    # ======================================
    # PERSONAL INFORMATION
    # ======================================

    full_name: Mapped[str] = mapped_column(
        String(120),
        nullable=False
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False
    )

    # ======================================
    # AUTHENTICATION INFORMATION
    # ======================================

    hashed_password: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    # ======================================
    # ACCOUNT CONFIGURATION
    # ======================================

    role: Mapped[str] = mapped_column(
        String(30),
        default="user",
        server_default="user",
        nullable=False
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        server_default="1",
        nullable=False
    )

    is_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        server_default="0",
        nullable=False
    )

    # ======================================
    # TIMESTAMPS
    # ======================================

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    # ======================================
    # DATABASE RELATIONSHIPS
    # ======================================

    repositories = relationship(
        "Repository",
        back_populates="owner",
        cascade="all, delete-orphan",
        passive_deletes=True
    )

    # ======================================
    # REPRESENTATION
    # ======================================

    def __repr__(self) -> str:

        return (
            f"<User("
            f"id={self.id}, "
            f"email='{self.email}', "
            f"role='{self.role}'"
            f")>"
        )