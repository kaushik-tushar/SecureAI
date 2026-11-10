"""
SecureAI - Scan Database Model

Stores security scan execution records.

Features:
- Repository association
- Scan type and status
- Scan lifecycle tracking
- Vulnerability statistics
- Scan error handling
- Automatic timestamps
"""

from datetime import datetime
from typing import Optional

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    func
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from app.database import Base


# ==========================================
# SCAN MODEL
# ==========================================

class Scan(Base):

    __tablename__ = "scans"

    # ======================================
    # TABLE CONSTRAINTS
    # ======================================

    __table_args__ = (
        CheckConstraint(
            "status IN ('queued', 'running', 'completed', 'failed', 'cancelled')",
            name="check_scan_status"
        ),
        CheckConstraint(
            "scan_type IN ('full', 'dependency', 'code', 'secret', 'configuration')",
            name="check_scan_type"
        ),
        CheckConstraint(
            "critical_count >= 0 AND high_count >= 0 "
            "AND medium_count >= 0 AND low_count >= 0 "
            "AND info_count >= 0",
            name="check_scan_vulnerability_counts"
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
    # REPOSITORY ASSOCIATION
    # ======================================

    repository_id: Mapped[int] = mapped_column(
        ForeignKey(
            "repositories.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    # ======================================
    # SCAN CONFIGURATION
    # ======================================

    scan_type: Mapped[str] = mapped_column(
        String(30),
        default="full",
        server_default="full",
        nullable=False
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="queued",
        server_default="queued",
        nullable=False,
        index=True
    )

    # ======================================
    # SCAN EXECUTION INFORMATION
    # ======================================

    started_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )

    completed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )

    duration_seconds: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True
    )

    # ======================================
    # VULNERABILITY STATISTICS
    # ======================================

    critical_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        server_default="0",
        nullable=False
    )

    high_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        server_default="0",
        nullable=False
    )

    medium_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        server_default="0",
        nullable=False
    )

    low_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        server_default="0",
        nullable=False
    )

    info_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        server_default="0",
        nullable=False
    )

    # ======================================
    # SCAN RESULT INFORMATION
    # ======================================

    summary: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )

    error_message: Mapped[Optional[str]] = mapped_column(
        Text,
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

    repository = relationship(
        "Repository",
        backref="scans"
    )

    vulnerabilities = relationship(
        "Vulnerability",
        back_populates="scan",
        cascade="all, delete-orphan",
        passive_deletes=True
    )

    # ======================================
    # COMPUTED PROPERTIES
    # ======================================

    @property
    def total_vulnerabilities(self) -> int:

        return (
            self.critical_count
            + self.high_count
            + self.medium_count
            + self.low_count
            + self.info_count
        )

    # ======================================
    # REPRESENTATION
    # ======================================

    def __repr__(self) -> str:

        return (
            f"<Scan("
            f"id={self.id}, "
            f"repository_id={self.repository_id}, "
            f"status='{self.status}', "
            f"scan_type='{self.scan_type}'"
            f")>"
        )