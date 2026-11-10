"""
SecureAI - AI Review API Routes

Provides AI-powered security review endpoints.

Endpoints:
- POST /ai-review/vulnerability/{vulnerability_id}
- POST /ai-review/code
- GET  /ai-review/vulnerability/{vulnerability_id}

Features:
- Vulnerability analysis
- Source-code security review
- AI-generated explanations
- Security impact assessment
- Remediation recommendations
- Stored analysis retrieval
- Authentication and input validation
"""

from typing import Annotated, Optional, Literal

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from fastapi.security import OAuth2PasswordBearer

from pydantic import (
    BaseModel,
    Field,
    ConfigDict
)

from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import authentication_error

from app.database import get_db

from app.models.user import User

from app.schemas.vulnerability import (
    VulnerabilityAIAnalysis
)

from app.services.auth_service import (
    get_current_active_user
)

from app.services.ai_review_service import (
    analyze_vulnerability,
    review_source_code,
    get_ai_analysis
)


# ==========================================
# ROUTER CONFIGURATION
# ==========================================

router = APIRouter(
    prefix="/ai-review",
    tags=["AI Security Review"]
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

class SourceCodeReviewRequest(BaseModel):

    """
    Request schema for AI source-code review.
    """

    source_code: str = Field(
        ...,
        min_length=1,
        max_length=30000,
        description="Source code to analyze."
    )

    language: str = Field(
        default="python",
        min_length=1,
        max_length=50,
        description="Programming language of the source code."
    )

    model_config = ConfigDict(
        extra="forbid"
    )


# ==========================================
# RESPONSE SCHEMAS
# ==========================================

class AIReviewFinding(BaseModel):

    """
    Represents an individual security finding.
    """

    title: str = Field(
        min_length=1,
        max_length=255
    )

    severity: Literal[
        "critical",
        "high",
        "medium",
        "low",
        "info"
    ]

    description: str

    line_number: Optional[int] = Field(
        default=None,
        ge=1
    )

    evidence: Optional[str] = None

    remediation: Optional[str] = None

    remediation_code: Optional[str] = None

    confidence: float = Field(
        ge=0,
        le=1
    )


class AIReviewResponse(BaseModel):

    """
    Structured response for source-code review.
    """

    summary: str

    risk_level: Literal[
        "critical",
        "high",
        "medium",
        "low",
        "unknown"
    ]

    findings: list[AIReviewFinding]

    recommendations: list[str]


# ==========================================
# ANALYZE VULNERABILITY
# ==========================================

@router.post(
    "/vulnerability/{vulnerability_id}",
    response_model=VulnerabilityAIAnalysis,
    status_code=status.HTTP_200_OK,
    summary="Analyze vulnerability using AI"
)
def analyze_existing_vulnerability(
    vulnerability_id: int,
    db: DatabaseSession,
    current_user: CurrentUser
):

    """
    Generates an AI-powered analysis
    for an existing vulnerability.

    Analysis includes:
    - Technical explanation
    - Security impact
    - Remediation recommendations
    - AI confidence score

    The analysis is saved in the database.
    """

    return analyze_vulnerability(
        db=db,
        vulnerability_id=vulnerability_id,
        user_id=current_user.id
    )


# ==========================================
# REVIEW SOURCE CODE
# ==========================================

@router.post(
    "/code",
    response_model=AIReviewResponse,
    status_code=status.HTTP_200_OK,
    summary="Review source code using AI"
)
def review_code(
    review_data: SourceCodeReviewRequest,
    current_user: CurrentUser
):

    """
    Performs AI-based security review
    of submitted source code.

    Supported analysis areas include:
    - SQL injection
    - Cross-site scripting
    - Authentication weaknesses
    - Authorization weaknesses
    - Insecure cryptography
    - Path traversal
    - SSRF
    - Insecure deserialization
    - Sensitive information exposure

    Submitted code is analyzed as text.
    It is never executed by this endpoint.
    """

    # --------------------------------------
    # GENERATE AI REVIEW
    # --------------------------------------

    result = review_source_code(
        source_code=review_data.source_code,
        language=review_data.language
    )

    # --------------------------------------
    # VALIDATE FINDINGS
    # --------------------------------------

    try:

        response = AIReviewResponse.model_validate(
            result
        )

        return response

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="AI returned an invalid security review."
        )


# ==========================================
# GET EXISTING AI ANALYSIS
# ==========================================

@router.get(
    "/vulnerability/{vulnerability_id}",
    response_model=VulnerabilityAIAnalysis,
    status_code=status.HTTP_200_OK,
    summary="Get stored AI vulnerability analysis"
)
def retrieve_ai_analysis(
    vulnerability_id: int,
    db: DatabaseSession,
    current_user: CurrentUser
):

    """
    Retrieves previously generated AI analysis.

    Does not make a new OpenAI API request.

    Only the owner of the associated repository
    can retrieve the analysis.
    """

    return get_ai_analysis(
        db=db,
        vulnerability_id=vulnerability_id,
        user_id=current_user.id
    )