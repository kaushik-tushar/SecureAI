"""
SecureAI - Repository Database Model

Stores GitHub repository information linked to
the user who added the repository.

Features:
- GitHub repository identification
- Repository metadata
- Owner relationship
- Repository visibility and statistics
- Scan timestamps
- Automatic creation and update timestamps
"""

from datetime import datetime
from typing import Optional

from sqlalchemy import (
    BigInteger,
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from app.database import Base


# ==========================================
# REPOSITORY MODEL
# ==========================================

class Repository(Base):

    __tablename__ = "repositories"

    # ======================================
    # TABLE CONSTRAINTS
    # ======================================

    __table_args__ = (
        UniqueConstraint(
            "owner_id",
            "github_repo_id",
            name="uq_user_github_repository"
        ),
    )

    # ======================================
    # PRIMARY KEY
    # ======================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
        index=True
    )

    # ======================================
    # USER OWNERSHIP
    # ======================================

    owner_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    # ======================================
    # GITHUB IDENTIFICATION
    # ======================================

    github_repo_id: Mapped[int] = mapped_column(
        BigInteger,
        nullable=False,
        index=True
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    full_name: Mapped[str] = mapped_column(
        String(512),
        nullable=False,
        index=True
    )

    # ======================================
    # REPOSITORY INFORMATION
    # ======================================

    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )

    html_url: Mapped[str] = mapped_column(
        String(1000),
        nullable=False
    )

    clone_url: Mapped[Optional[str]] = mapped_column(
        String(1000),
        nullable=True
    )

    default_branch: Mapped[str] = mapped_column(
        String(255),
        default="main",
        server_default="main",
        nullable=False
    )

    language: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True
    )

    # ======================================
    # REPOSITORY VISIBILITY
    # ======================================

    is_private: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        server_default="0",
        nullable=False
    )

    is_archived: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        server_default="0",
        nullable=False
    )

    # ======================================
    # GITHUB STATISTICS
    # ======================================

    stars_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        server_default="0",
        nullable=False
    )

    forks_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        server_default="0",
        nullable=False
    )

    open_issues_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        server_default="0",
        nullable=False
    )

    # ======================================
    # SECURITY SCANNING INFORMATION
    # ======================================

    last_scanned_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
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

    owner = relationship(
        "User",
        back_populates="repositories"
    )

    # ======================================
    # REPRESENTATION
    # ======================================

    def __repr__(self) -> str:

        return (
            f"<Repository("
            f"id={self.id}, "
            f"full_name='{self.full_name}', "
            f"owner_id={self.owner_id}"
            f")>"
        )