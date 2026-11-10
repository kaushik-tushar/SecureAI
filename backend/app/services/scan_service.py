"""
SecureAI - Scan Service

Manages the security scan lifecycle.

Features:
- Scan creation
- Repository ownership verification
- Scan status management
- Scan completion and failure handling
- Vulnerability statistics
- Scan history and pagination
- Scan summary generation
"""

from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from fastapi import HTTPException, status

from app.models.scan import Scan
from app.models.repository import Repository
from app.models.vulnerability import Vulnerability

from app.schemas.scan import (
    ScanCreate,
    ScanSummary,
    VulnerabilityCounts
)


# ==========================================
# VALID SCAN CONFIGURATION
# ==========================================

VALID_SCAN_TYPES = {
    "full",
    "dependency",
    "code",
    "secret",
    "configuration"
}

VALID_SCAN_STATUSES = {
    "queued",
    "running",
    "completed",
    "failed",
    "cancelled"
}

ALLOWED_TRANSITIONS = {
    "queued": {"running", "cancelled", "failed"},
    "running": {"completed", "failed", "cancelled"},
    "completed": set(),
    "failed": set(),
    "cancelled": set()
}


# ==========================================
# DATETIME UTILITIES
# ==========================================

def utc_now() -> datetime:

    """
    Returns the current UTC timestamp.
    """

    return datetime.now(timezone.utc)


# ==========================================
# REPOSITORY OWNERSHIP VALIDATION
# ==========================================

def get_user_repository(
    db: Session,
    repository_id: int,
    user_id: int
) -> Repository:

    """
    Retrieves a repository belonging to a user.

    Prevents users from creating scans against
    repositories owned by other accounts.
    """

    statement = select(Repository).where(
        Repository.id == repository_id,
        Repository.owner_id == user_id
    )

    repository = db.scalar(statement)

    if repository is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Repository not found."
        )

    return repository


# ==========================================
# GET SCAN BY ID
# ==========================================

def get_scan_by_id(
    db: Session,
    scan_id: int,
    user_id: Optional[int] = None
) -> Scan:

    """
    Retrieves a scan by its database ID.

    When user_id is provided, ownership is checked
    through the associated repository.
    """

    statement = (
        select(Scan)
        .join(
            Repository,
            Scan.repository_id == Repository.id
        )
        .where(Scan.id == scan_id)
    )

    if user_id is not None:

        statement = statement.where(
            Repository.owner_id == user_id
        )

    scan = db.scalar(statement)

    if scan is None:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan not found."
        )

    return scan


# ==========================================
# CREATE SECURITY SCAN
# ==========================================

def create_scan(
    db: Session,
    scan_data: ScanCreate,
    user_id: int
) -> Scan:

    """
    Creates a new queued security scan.

    The repository must belong to the
    authenticated user.

    The scan is created in queued status.
    """

    # --------------------------------------
    # VALIDATE SCAN TYPE
    # --------------------------------------

    if scan_data.scan_type not in VALID_SCAN_TYPES:

        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Unsupported scan type."
        )

    # --------------------------------------
    # VALIDATE REPOSITORY OWNERSHIP
    # --------------------------------------

    repository = get_user_repository(
        db=db,
        repository_id=scan_data.repository_id,
        user_id=user_id
    )

    # --------------------------------------
    # CHECK ARCHIVED REPOSITORY
    # --------------------------------------

    if repository.is_archived:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Archived repositories cannot be scanned."
        )

    # --------------------------------------
    # CREATE SCAN RECORD
    # --------------------------------------

    new_scan = Scan(
        repository_id=repository.id,
        scan_type=scan_data.scan_type,
        status="queued",
        critical_count=0,
        high_count=0,
        medium_count=0,
        low_count=0,
        info_count=0
    )

    # --------------------------------------
    # SAVE DATABASE RECORD
    # --------------------------------------

    try:

        db.add(new_scan)

        db.commit()

        db.refresh(new_scan)

        return new_scan

    except Exception:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to create security scan."
        )


# ==========================================
# UPDATE SCAN STATUS
# ==========================================

def update_scan_status(
    db: Session,
    scan_id: int,
    new_status: str,
    user_id: Optional[int] = None
) -> Scan:

    """
    Updates the status of a scan.

    Allowed transitions:

        queued -> running
        queued -> cancelled
        queued -> failed

        running -> completed
        running -> failed
        running -> cancelled

    Completed, failed and cancelled scans
    cannot transition to another status.
    """

    # --------------------------------------
    # VALIDATE REQUESTED STATUS
    # --------------------------------------

    if new_status not in VALID_SCAN_STATUSES:

        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid scan status."
        )

    # --------------------------------------
    # RETRIEVE SCAN
    # --------------------------------------

    scan = get_scan_by_id(
        db=db,
        scan_id=scan_id,
        user_id=user_id
    )

    # --------------------------------------
    # VALIDATE STATUS TRANSITION
    # --------------------------------------

    allowed_statuses = ALLOWED_TRANSITIONS.get(
        scan.status,
        set()
    )

    if new_status not in allowed_statuses:

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                f"Cannot change scan status "
                f"from '{scan.status}' to '{new_status}'."
            )
        )

    # --------------------------------------
    # UPDATE SCAN TIMESTAMPS
    # --------------------------------------

    now = utc_now()

    if new_status == "running":

        scan.started_at = now

    if new_status in {
        "completed",
        "failed",
        "cancelled"
    }:

        scan.completed_at = now

        if scan.started_at is not None:

            started_at = scan.started_at

            if started_at.tzinfo is None:

                started_at = started_at.replace(
                    tzinfo=timezone.utc
                )

            scan.duration_seconds = max(
                0,
                int(
                    (
                        now - started_at
                    ).total_seconds()
                )
            )

    scan.status = new_status

    # --------------------------------------
    # SAVE CHANGES
    # --------------------------------------

    try:

        db.commit()

        db.refresh(scan)

        return scan

    except Exception:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to update scan status."
        )


# ==========================================
# COMPLETE SECURITY SCAN
# ==========================================

def complete_scan(
    db: Session,
    scan_id: int,
    counts: VulnerabilityCounts,
    summary: Optional[str] = None,
    user_id: Optional[int] = None
) -> Scan:

    """
    Marks a running scan as completed.

    Updates vulnerability statistics and
    the associated repository's last scan time.

    The actual vulnerability records must be
    persisted separately before this function
    is called.
    """

    # --------------------------------------
    # RETRIEVE SCAN
    # --------------------------------------

    scan = get_scan_by_id(
        db=db,
        scan_id=scan_id,
        user_id=user_id
    )

    # --------------------------------------
    # VALIDATE CURRENT STATUS
    # --------------------------------------

    if scan.status != "running":

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Only running scans can be completed."
        )

    # --------------------------------------
    # UPDATE VULNERABILITY COUNTS
    # --------------------------------------

    scan.critical_count = counts.critical
    scan.high_count = counts.high
    scan.medium_count = counts.medium
    scan.low_count = counts.low
    scan.info_count = counts.info

    # --------------------------------------
    # UPDATE SUMMARY
    # --------------------------------------

    scan.summary = summary

    # --------------------------------------
    # UPDATE COMPLETION INFORMATION
    # --------------------------------------

    now = utc_now()

    scan.status = "completed"

    scan.completed_at = now

    if scan.started_at is not None:

        started_at = scan.started_at

        if started_at.tzinfo is None:

            started_at = started_at.replace(
                tzinfo=timezone.utc
            )

        scan.duration_seconds = max(
            0,
            int(
                (
                    now - started_at
                ).total_seconds()
            )
        )

    # --------------------------------------
    # UPDATE REPOSITORY LAST SCAN TIME
    # --------------------------------------

    repository = db.get(
        Repository,
        scan.repository_id
    )

    if repository is not None:

        repository.last_scanned_at = now

    # --------------------------------------
    # SAVE COMPLETED SCAN
    # --------------------------------------

    try:

        db.commit()

        db.refresh(scan)

        return scan

    except Exception:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to complete security scan."
        )


# ==========================================
# FAIL SECURITY SCAN
# ==========================================

def fail_scan(
    db: Session,
    scan_id: int,
    error_message: str,
    user_id: Optional[int] = None
) -> Scan:

    """
    Marks a queued or running scan as failed.

    Stores a descriptive error message.
    """

    scan = get_scan_by_id(
        db=db,
        scan_id=scan_id,
        user_id=user_id
    )

    if scan.status not in {"queued", "running"}:

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This scan cannot be marked as failed."
        )

    now = utc_now()

    scan.status = "failed"

    scan.error_message = error_message[:5000]

    scan.completed_at = now

    if scan.started_at is not None:

        started_at = scan.started_at

        if started_at.tzinfo is None:

            started_at = started_at.replace(
                tzinfo=timezone.utc
            )

        scan.duration_seconds = max(
            0,
            int(
                (
                    now - started_at
                ).total_seconds()
            )
        )

    try:

        db.commit()

        db.refresh(scan)

        return scan

    except Exception:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to update failed scan."
        )


# ==========================================
# CANCEL SECURITY SCAN
# ==========================================

def cancel_scan(
    db: Session,
    scan_id: int,
    user_id: int
) -> Scan:

    """
    Cancels a queued or running scan
    belonging to the authenticated user.
    """

    return update_scan_status(
        db=db,
        scan_id=scan_id,
        new_status="cancelled",
        user_id=user_id
    )


# ==========================================
# GET USER SCAN HISTORY
# ==========================================

def get_scan_history(
    db: Session,
    user_id: int,
    page: int = 1,
    page_size: int = 10,
    repository_id: Optional[int] = None
) -> tuple[list[Scan], int]:

    """
    Retrieves paginated scan history
    for repositories belonging to a user.

    Optional repository filtering is supported.
    """

    # --------------------------------------
    # VALIDATE PAGINATION
    # --------------------------------------

    if page < 1:

        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Page must be greater than zero."
        )

    if not 1 <= page_size <= 100:

        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Page size must be between 1 and 100."
        )

    # --------------------------------------
    # BUILD BASE QUERY
    # --------------------------------------

    statement = (
        select(Scan)
        .join(
            Repository,
            Scan.repository_id == Repository.id
        )
        .where(
            Repository.owner_id == user_id
        )
    )

    count_statement = (
        select(func.count(Scan.id))
        .join(
            Repository,
            Scan.repository_id == Repository.id
        )
        .where(
            Repository.owner_id == user_id
        )
    )

    # --------------------------------------
    # APPLY REPOSITORY FILTER
    # --------------------------------------

    if repository_id is not None:

        statement = statement.where(
            Scan.repository_id == repository_id
        )

        count_statement = count_statement.where(
            Scan.repository_id == repository_id
        )

    # --------------------------------------
    # COUNT TOTAL RECORDS
    # --------------------------------------

    total = db.scalar(
        count_statement
    ) or 0

    # --------------------------------------
    # APPLY PAGINATION
    # --------------------------------------

    offset = (page - 1) * page_size

    statement = (
        statement
        .order_by(Scan.created_at.desc())
        .offset(offset)
        .limit(page_size)
    )

    scans = list(
        db.scalars(statement).all()
    )

    return scans, total


# ==========================================
# GET SCAN SUMMARY
# ==========================================

def get_scan_summary(
    db: Session,
    user_id: int
) -> ScanSummary:

    """
    Generates scan statistics for a user.

    Includes:
    - Total scans
    - Completed scans
    - Running scans
    - Failed scans
    - Total vulnerabilities
    - Severity distribution
    """

    # --------------------------------------
    # SCAN STATISTICS
    # --------------------------------------

    statement = (
        select(
            func.count(Scan.id).label("total_scans"),

            func.sum(
                Scan.status == "completed"
            ).label("completed_scans"),

            func.sum(
                Scan.status == "running"
            ).label("running_scans"),

            func.sum(
                Scan.status == "failed"
            ).label("failed_scans"),

            func.sum(
                Scan.critical_count
            ).label("critical_count"),

            func.sum(
                Scan.high_count
            ).label("high_count"),

            func.sum(
                Scan.medium_count
            ).label("medium_count"),

            func.sum(
                Scan.low_count
            ).label("low_count"),

            func.sum(
                Scan.info_count
            ).label("info_count")
        )
        .join(
            Repository,
            Scan.repository_id == Repository.id
        )
        .where(
            Repository.owner_id == user_id
        )
    )

    result = db.execute(
        statement
    ).one()

    # --------------------------------------
    # NORMALIZE AGGREGATE VALUES
    # --------------------------------------

    total_scans = result.total_scans or 0

    completed_scans = result.completed_scans or 0

    running_scans = result.running_scans or 0

    failed_scans = result.failed_scans or 0

    counts = VulnerabilityCounts(
        critical=result.critical_count or 0,
        high=result.high_count or 0,
        medium=result.medium_count or 0,
        low=result.low_count or 0,
        info=result.info_count or 0
    )

    # --------------------------------------
    # BUILD SUMMARY RESPONSE
    # --------------------------------------

    return ScanSummary(
        total_scans=total_scans,
        completed_scans=completed_scans,
        running_scans=running_scans,
        failed_scans=failed_scans,
        total_vulnerabilities=counts.total,
        vulnerability_counts=counts
    )