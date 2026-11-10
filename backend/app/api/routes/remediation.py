"""
SecureAI - Remediation API Routes

Provides vulnerability remediation endpoints.

Endpoints:
- GET  /remediation/{vulnerability_id}
- POST /remediation/{vulnerability_id}
- GET  /remediation/{vulnerability_id}/summary
- POST /remediation/{vulnerability_id}/generate

Features:
- Retrieve remediation recommendations
- Save remediation suggestions
- Generate AI-assisted remediation
- Store suggested secure code
- Retrieve remediation summaries
- Ownership verification
- Manual review requirements
"""

import logging

from typing import Annotated, Optional

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from fastapi.security import OAuth2PasswordBearer

from pydantic import BaseModel, Field

from sqlalchemy.orm import Session

from app.core.config import settings

from app.core.security import authentication_error

from app.database import get_db

from app.models.user import User

from app.schemas.vulnerability import (
    RemediationResponse
)

from app.services.auth_service import (
    get_current_active_user
)

from app.services.remediation_service import (
    get_remediation,
    save_remediation,
    get_remediation_summary
)

from app.services.ai_review_service import (
    analyze_vulnerability
)


# ==========================================
# LOGGING CONFIGURATION
# ==========================================

logger = logging.getLogger(__name__)


# ==========================================
# ROUTER CONFIGURATION
# ==========================================

router = APIRouter(
    prefix="/remediation",
    tags=["Remediation"]
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
# REQUEST SCHEMAS
# ==========================================

class RemediationCreateRequest(BaseModel):

    recommendation: str = Field(
        ...,
        min_length=1,
        max_length=20000
    )

    suggested_code: Optional[str] = Field(
        default=None,
        max_length=50000
    )

    explanation: Optional[str] = Field(
        default=None,
        max_length=20000
    )


# ==========================================
# GET REMEDIATION
# ==========================================

@router.get(
    "/{vulnerability_id}",
    response_model=RemediationResponse,
    summary="Get remediation recommendation"
)
def retrieve_remediation(
    vulnerability_id: int,
    db: DatabaseSession,
    current_user: CurrentUser
):

    """
    Retrieves remediation recommendations
    for a vulnerability.

    Returns:
    - Recommended fix
    - Suggested code
    - AI explanation
    - Manual review requirement
    """

    result = get_remediation(
        db=db,
        vulnerability_id=vulnerability_id,
        user_id=current_user.id
    )

    return RemediationResponse(
        vulnerability_id=result["vulnerability_id"],
        recommendation=result["recommendation"] or "",
        suggested_code=result["suggested_code"],
        explanation=result["explanation"],
        requires_manual_review=True
    )


# ==========================================
# SAVE REMEDIATION
# ==========================================

@router.post(
    "/{vulnerability_id}",
    response_model=RemediationResponse,
    status_code=status.HTTP_200_OK,
    summary="Save remediation recommendation"
)
def create_remediation(
    vulnerability_id: int,
    remediation_data: RemediationCreateRequest,
    db: DatabaseSession,
    current_user: CurrentUser
):

    """
    Saves a remediation recommendation
    for an existing vulnerability.

    Suggested code is stored for review.
    It is not automatically applied.
    """

    result = save_remediation(
        db=db,
        vulnerability_id=vulnerability_id,
        user_id=current_user.id,
        recommendation=remediation_data.recommendation,
        suggested_code=remediation_data.suggested_code,
        explanation=remediation_data.explanation
    )

    return RemediationResponse(
        vulnerability_id=result["vulnerability_id"],
        recommendation=result["recommendation"],
        suggested_code=result["suggested_code"],
        explanation=result["explanation"],
        requires_manual_review=True
    )


# ==========================================
# GET REMEDIATION SUMMARY
# ==========================================

@router.get(
    "/{vulnerability_id}/summary",
    summary="Get remediation summary"
)
def retrieve_remediation_summary(
    vulnerability_id: int,
    db: DatabaseSession,
    current_user: CurrentUser
):

    """
    Retrieves complete remediation information.

    Includes:
    - Vulnerability title
    - Severity
    - Current status
    - Description
    - Security impact
    - Recommended remediation
    - Suggested secure code
    - AI explanation
    - Resolution timestamp
    """

    return get_remediation_summary(
        db=db,
        vulnerability_id=vulnerability_id,
        user_id=current_user.id
    )


# ==========================================
# GENERATE AI REMEDIATION
# ==========================================

@router.post(
    "/{vulnerability_id}/generate",
    response_model=RemediationResponse,
    summary="Generate AI remediation"
)
def generate_remediation(
    vulnerability_id: int,
    db: DatabaseSession,
    current_user: CurrentUser
):

    """
    Generates an AI-assisted remediation
    recommendation.

    The AI analysis is saved to the database.

    The generated recommendation requires
    human review before implementation.
    """

    # --------------------------------------
    # GENERATE AI ANALYSIS
    # --------------------------------------

    analysis = analyze_vulnerability(
        db=db,
        vulnerability_id=vulnerability_id,
        user_id=current_user.id
    )

    # --------------------------------------
    # BUILD RESPONSE
    # --------------------------------------

    return RemediationResponse(
        vulnerability_id=analysis.vulnerability_id,
        recommendation=analysis.remediation,
        suggested_code=None,
        explanation=analysis.explanation,
        requires_manual_review=True
    )