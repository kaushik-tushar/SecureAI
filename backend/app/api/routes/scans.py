"""
SecureAI - Scan API Routes

Provides security scan management endpoints.

Endpoints:
- POST /scans
- GET  /scans
- GET  /scans/summary
- GET  /scans/{scan_id}
- GET  /scans/{scan_id}/status
- POST /scans/{scan_id}/cancel

Features:
- Security scan creation
- Scan history and pagination
- Scan status tracking
- Scan cancellation
- Scan statistics
- User ownership verification
"""

from typing import Annotated, Optional

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status
)

from fastapi.security import OAuth2PasswordBearer

from sqlalchemy.orm import Session

from app.core.config import settings

from app.core.security import authentication_error

from app.database import get_db

from app.models.user import User

from app.schemas.scan import (
    ScanCreate,
    ScanResponse,
    ScanSummary,
    ScanListResponse,
    ScanActionResponse,
    ScanStatusResponse
)

from app.services.auth_service import (
    get_current_active_user
)

from app.services.scan_service import (
    create_scan,
    get_scan_by_id,
    get_scan_history,
    get_scan_summary,
    cancel_scan
)


# ==========================================
# ROUTER CONFIGURATION
# ==========================================

router = APIRouter(
    prefix="/scans",
    tags=["Security Scans"]
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
# CREATE SECURITY SCAN
# ==========================================

@router.post(
    "",
    response_model=ScanResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create security scan"
)
def create_security_scan(
    scan_data: ScanCreate,
    db: DatabaseSession,
    current_user: CurrentUser
):

    """
    Creates a new security scan.

    Request body:

    {
        "repository_id": 1,
        "scan_type": "full"
    }

    The scan is initially created with
    queued status.

    Actual scan execution is handled
    by the scanning engine.
    """

    scan = create_scan(
        db=db,
        scan_data=scan_data,
        user_id=current_user.id
    )

    return scan


# ==========================================
# LIST SCAN HISTORY
# ==========================================

@router.get(
    "",
    response_model=ScanListResponse,
    summary="Get scan history"
)
def list_scans(
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

    repository_id: Optional[int] = Query(
        default=None,
        gt=0
    )
):

    """
    Retrieves paginated scan history.

    Optional repository filtering is supported.
    Only scans belonging to the authenticated
    user's repositories are returned.
    """

    scans, total = get_scan_history(
        db=db,
        user_id=current_user.id,
        page=page,
        page_size=page_size,
        repository_id=repository_id
    )

    return ScanListResponse(
        scans=scans,
        total=total,
        page=page,
        page_size=page_size
    )


# ==========================================
# GET SCAN SUMMARY
# ==========================================

@router.get(
    "/summary",
    response_model=ScanSummary,
    summary="Get scan statistics"
)
def get_scans_summary(
    db: DatabaseSession,
    current_user: CurrentUser
):

    """
    Returns scan statistics for the
    authenticated user's repositories.

    Includes:
    - Total scans
    - Completed scans
    - Running scans
    - Failed scans
    - Vulnerability severity counts
    """

    return get_scan_summary(
        db=db,
        user_id=current_user.id
    )


# ==========================================
# GET SCAN DETAILS
# ==========================================

@router.get(
    "/{scan_id}",
    response_model=ScanResponse,
    summary="Get scan details"
)
def get_scan_details(
    scan_id: int,
    db: DatabaseSession,
    current_user: CurrentUser
):

    """
    Retrieves details of a specific scan.

    Users can only access scans associated
    with their own repositories.
    """

    return get_scan_by_id(
        db=db,
        scan_id=scan_id,
        user_id=current_user.id
    )


# ==========================================
# GET SCAN STATUS
# ==========================================

@router.get(
    "/{scan_id}/status",
    response_model=ScanStatusResponse,
    summary="Get scan status"
)
def get_scan_status(
    scan_id: int,
    db: DatabaseSession,
    current_user: CurrentUser
):

    """
    Retrieves the current status of a scan.

    Progress values:
    - queued: 0%
    - running: 0% (execution progress is not yet tracked)
    - completed: 100%
    - failed: 0%
    - cancelled: 0%

    Detailed progress tracking will be connected
    when the scanning engine is implemented.
    """

    scan = get_scan_by_id(
        db=db,
        scan_id=scan_id,
        user_id=current_user.id
    )

    progress_map = {
        "queued": 0,
        "running": 0,
        "completed": 100,
        "failed": 0,
        "cancelled": 0
    }

    message_map = {
        "queued": "Scan is waiting for execution.",
        "running": "Security scan is running.",
        "completed": "Security scan completed.",
        "failed": "Security scan failed.",
        "cancelled": "Security scan was cancelled."
    }

    return ScanStatusResponse(
        scan_id=scan.id,
        status=scan.status,
        progress=progress_map.get(scan.status, 0),
        message=message_map.get(
            scan.status,
            "Unknown scan status."
        )
    )


# ==========================================
# CANCEL SECURITY SCAN
# ==========================================

@router.post(
    "/{scan_id}/cancel",
    response_model=ScanActionResponse,
    summary="Cancel security scan"
)
def cancel_security_scan(
    scan_id: int,
    db: DatabaseSession,
    current_user: CurrentUser
):

    """
    Cancels a queued or running scan.

    Only the owner of the associated repository
    can cancel the scan.

    Note:
    This changes the database status.
    Actual worker cancellation will be integrated
    with the background execution system.
    """

    scan = cancel_scan(
        db=db,
        scan_id=scan_id,
        user_id=current_user.id
    )

    return ScanActionResponse(
        message="Security scan cancelled successfully.",
        success=True,
        scan=scan
    )