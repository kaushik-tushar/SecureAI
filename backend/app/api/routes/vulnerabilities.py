"""
SecureAI - Vulnerability API Routes

Provides vulnerability management endpoints.

Endpoints:
- GET   /vulnerabilities
- GET   /vulnerabilities/statistics
- GET   /vulnerabilities/{vulnerability_id}
- PATCH /vulnerabilities/{vulnerability_id}/status

Features:
- Vulnerability listing
- Severity filtering
- Status filtering
- Repository and scan filtering
- Text search
- Vulnerability statistics
- Status management
- User ownership verification
"""

from typing import Annotated, Optional

from fastapi import (
    APIRouter,
    Depends,
    Query,
    status
)

from fastapi.security import OAuth2PasswordBearer

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.config import settings

from app.core.security import authentication_error

from app.database import get_db

from app.models.user import User
from app.models.scan import Scan
from app.models.repository import Repository
from app.models.vulnerability import Vulnerability

from app.schemas.vulnerability import (
    VulnerabilityResponse,
    VulnerabilityStatusUpdate,
    VulnerabilityListResponse,
    VulnerabilityStatistics,
    VulnerabilityActionResponse
)

from app.services.auth_service import (
    get_current_active_user
)

from app.services.remediation_service import (
    get_user_vulnerability,
    update_vulnerability_status
)


# ==========================================
# ROUTER CONFIGURATION
# ==========================================

router = APIRouter(
    prefix="/vulnerabilities",
    tags=["Vulnerabilities"]
)


# ==========================================
# DEPENDENCIES
# ==========================================

DatabaseSession = Annotated[
    Session,
    Depends(get_db)
]

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_PREFIX}/auth/login",
    auto_error=False
)


def get_authenticated_user(
    db: DatabaseSession,
    token: Annotated[
        Optional[str],
        Depends(oauth2_scheme)
    ]
) -> User:

    """
    Retrieves the authenticated active user.
    """

    if not token:

        raise authentication_error()

    return get_current_active_user(
        db=db,
        token=token
    )


CurrentUser = Annotated[
    User,
    Depends(get_authenticated_user)
]


# ==========================================
# LIST VULNERABILITIES
# ==========================================

@router.get(
    "",
    response_model=VulnerabilityListResponse,
    summary="List vulnerabilities"
)
def list_vulnerabilities(
    db: DatabaseSession,
    current_user: CurrentUser,

    page: int = Query(
        default=1,
        ge=1
    ),

    page_size: int = Query(
        default=10,
        ge=1,
        le=100
    ),

    severity: Optional[str] = Query(
        default=None,
        pattern="^(critical|high|medium|low|info)$"
    ),

    vulnerability_status: Optional[str] = Query(
        default=None,
        alias="status",
        pattern="^(open|in_progress|resolved|accepted|false_positive)$"
    ),

    scan_id: Optional[int] = Query(
        default=None,
        gt=0
    ),

    repository_id: Optional[int] = Query(
        default=None,
        gt=0
    ),

    search: Optional[str] = Query(
        default=None,
        max_length=200
    )
):

    """
    Retrieves paginated vulnerabilities.

    Supported filters:
    - severity
    - status
    - scan_id
    - repository_id
    - search

    Only vulnerabilities associated with
    the authenticated user's repositories
    are returned.
    """

    # --------------------------------------
    # BASE QUERY
    # --------------------------------------

    statement = (
        select(Vulnerability)
        .join(
            Scan,
            Vulnerability.scan_id == Scan.id
        )
        .join(
            Repository,
            Scan.repository_id == Repository.id
        )
        .where(
            Repository.owner_id == current_user.id
        )
    )

    count_statement = (
        select(
            func.count(Vulnerability.id)
        )
        .join(
            Scan,
            Vulnerability.scan_id == Scan.id
        )
        .join(
            Repository,
            Scan.repository_id == Repository.id
        )
        .where(
            Repository.owner_id == current_user.id
        )
    )

    # --------------------------------------
    # SEVERITY FILTER
    # --------------------------------------

    if severity:

        statement = statement.where(
            Vulnerability.severity == severity
        )

        count_statement = count_statement.where(
            Vulnerability.severity == severity
        )

    # --------------------------------------
    # STATUS FILTER
    # --------------------------------------

    if vulnerability_status:

        statement = statement.where(
            Vulnerability.status == vulnerability_status
        )

        count_statement = count_statement.where(
            Vulnerability.status == vulnerability_status
        )

    # --------------------------------------
    # SCAN FILTER
    # --------------------------------------

    if scan_id is not None:

        statement = statement.where(
            Vulnerability.scan_id == scan_id
        )

        count_statement = count_statement.where(
            Vulnerability.scan_id == scan_id
        )

    # --------------------------------------
    # REPOSITORY FILTER
    # --------------------------------------

    if repository_id is not None:

        statement = statement.where(
            Scan.repository_id == repository_id
        )

        count_statement = count_statement.where(
            Scan.repository_id == repository_id
        )

    # --------------------------------------
    # TEXT SEARCH
    # --------------------------------------

    if search:

        search_value = search.strip()

        if search_value:

            search_pattern = f"%{search_value}%"

            search_filter = (
                Vulnerability.title.ilike(search_pattern)
                |
                Vulnerability.description.ilike(search_pattern)
                |
                Vulnerability.vulnerability_type.ilike(search_pattern)
                |
                Vulnerability.file_path.ilike(search_pattern)
            )

            statement = statement.where(
                search_filter
            )

            count_statement = count_statement.where(
                search_filter
            )

    # --------------------------------------
    # COUNT TOTAL RESULTS
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
        .order_by(
            Vulnerability.created_at.desc()
        )
        .offset(offset)
        .limit(page_size)
    )

    vulnerabilities = db.scalars(
        statement
    ).all()

    # --------------------------------------
    # RESPONSE
    # --------------------------------------

    return VulnerabilityListResponse(
        vulnerabilities=list(vulnerabilities),
        total=total,
        page=page,
        page_size=page_size
    )


# ==========================================
# VULNERABILITY STATISTICS
# ==========================================

@router.get(
    "/statistics",
    response_model=VulnerabilityStatistics,
    summary="Get vulnerability statistics"
)
def get_vulnerability_statistics(
    db: DatabaseSession,
    current_user: CurrentUser,

    repository_id: Optional[int] = Query(
        default=None,
        gt=0
    )
):

    """
    Returns vulnerability statistics
    for the authenticated user's repositories.

    Optional repository filtering is supported.
    """

    # --------------------------------------
    # BASE QUERY
    # --------------------------------------

    statement = (
        select(
            func.count(Vulnerability.id).label("total"),

            func.sum(
                (Vulnerability.severity == "critical").cast(
                    __import__("sqlalchemy").Integer
                )
            ).label("critical"),

            func.sum(
                (Vulnerability.severity == "high").cast(
                    __import__("sqlalchemy").Integer
                )
            ).label("high"),

            func.sum(
                (Vulnerability.severity == "medium").cast(
                    __import__("sqlalchemy").Integer
                )
            ).label("medium"),

            func.sum(
                (Vulnerability.severity == "low").cast(
                    __import__("sqlalchemy").Integer
                )
            ).label("low"),

            func.sum(
                (Vulnerability.severity == "info").cast(
                    __import__("sqlalchemy").Integer
                )
            ).label("info"),

            func.sum(
                (Vulnerability.status == "open").cast(
                    __import__("sqlalchemy").Integer
                )
            ).label("open"),

            func.sum(
                (Vulnerability.status == "in_progress").cast(
                    __import__("sqlalchemy").Integer
                )
            ).label("in_progress"),

            func.sum(
                (Vulnerability.status == "resolved").cast(
                    __import__("sqlalchemy").Integer
                )
            ).label("resolved"),

            func.sum(
                (Vulnerability.status == "accepted").cast(
                    __import__("sqlalchemy").Integer
                )
            ).label("accepted"),

            func.sum(
                (Vulnerability.status == "false_positive").cast(
                    __import__("sqlalchemy").Integer
                )
            ).label("false_positive")
        )
        .join(
            Scan,
            Vulnerability.scan_id == Scan.id
        )
        .join(
            Repository,
            Scan.repository_id == Repository.id
        )
        .where(
            Repository.owner_id == current_user.id
        )
    )

    # --------------------------------------
    # OPTIONAL REPOSITORY FILTER
    # --------------------------------------

    if repository_id is not None:

        statement = statement.where(
            Scan.repository_id == repository_id
        )

    # --------------------------------------
    # EXECUTE QUERY
    # --------------------------------------

    result = db.execute(
        statement
    ).one()

    # --------------------------------------
    # BUILD STATISTICS RESPONSE
    # --------------------------------------

    return VulnerabilityStatistics(
        total=result.total or 0,
        critical=result.critical or 0,
        high=result.high or 0,
        medium=result.medium or 0,
        low=result.low or 0,
        info=result.info or 0,
        open=result.open or 0,
        in_progress=result.in_progress or 0,
        resolved=result.resolved or 0,
        accepted=result.accepted or 0,
        false_positive=result.false_positive or 0
    )


# ==========================================
# GET VULNERABILITY DETAILS
# ==========================================

@router.get(
    "/{vulnerability_id}",
    response_model=VulnerabilityResponse,
    summary="Get vulnerability details"
)
def get_vulnerability_details(
    vulnerability_id: int,
    db: DatabaseSession,
    current_user: CurrentUser
):

    """
    Retrieves detailed information
    about a specific vulnerability.

    Only the vulnerability owner can
    access the record.
    """

    return get_user_vulnerability(
        db=db,
        vulnerability_id=vulnerability_id,
        user_id=current_user.id
    )


# ==========================================
# UPDATE VULNERABILITY STATUS
# ==========================================

@router.patch(
    "/{vulnerability_id}/status",
    response_model=VulnerabilityActionResponse,
    summary="Update vulnerability status"
)
def change_vulnerability_status(
    vulnerability_id: int,
    status_data: VulnerabilityStatusUpdate,
    db: DatabaseSession,
    current_user: CurrentUser
):

    """
    Updates vulnerability status.

    Supported statuses:
    - open
    - in_progress
    - resolved
    - accepted
    - false_positive

    Status transitions are validated by
    the remediation service.
    """

    vulnerability = update_vulnerability_status(
        db=db,
        vulnerability_id=vulnerability_id,
        user_id=current_user.id,
        new_status=status_data.status
    )

    return VulnerabilityActionResponse(
        message="Vulnerability status updated successfully.",
        success=True,
        vulnerability=vulnerability
    )