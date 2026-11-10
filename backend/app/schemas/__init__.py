"""
SecureAI - Pydantic Schemas

Centralized exports for API request and response schemas.
"""

# ==========================================
# AUTHENTICATION SCHEMAS
# ==========================================

from app.schemas.auth import (
    UserRegister,
    UserLogin,
    UserResponse,
    TokenResponse,
    TokenData,
    AuthMessage
)


# ==========================================
# REPOSITORY SCHEMAS
# ==========================================

from app.schemas.repository import (
    RepositoryCreate,
    RepositoryUpdate,
    RepositoryResponse,
    RepositoryListResponse,
    GitHubRepositoryInfo
)


# ==========================================
# SCAN SCHEMAS
# ==========================================

from app.schemas.scan import (
    ScanCreate,
    ScanResponse,
    ScanSummary,
    ScanListResponse,
    ScanActionResponse,
    ScanStatusResponse,
    VulnerabilityCounts
)


# ==========================================
# VULNERABILITY SCHEMAS
# ==========================================

from app.schemas.vulnerability import (
    VulnerabilityResponse,
    VulnerabilityStatusUpdate,
    VulnerabilityFilter,
    VulnerabilityListResponse,
    VulnerabilityStatistics,
    VulnerabilityAIAnalysis,
    RemediationResponse,
    VulnerabilityActionResponse
)


# ==========================================
# PUBLIC EXPORTS
# ==========================================

__all__ = [
    # Authentication
    "UserRegister",
    "UserLogin",
    "UserResponse",
    "TokenResponse",
    "TokenData",
    "AuthMessage",

    # Repository
    "RepositoryCreate",
    "RepositoryUpdate",
    "RepositoryResponse",
    "RepositoryListResponse",
    "GitHubRepositoryInfo",

    # Scan
    "ScanCreate",
    "ScanResponse",
    "ScanSummary",
    "ScanListResponse",
    "ScanActionResponse",
    "ScanStatusResponse",
    "VulnerabilityCounts",

    # Vulnerability
    "VulnerabilityResponse",
    "VulnerabilityStatusUpdate",
    "VulnerabilityFilter",
    "VulnerabilityListResponse",
    "VulnerabilityStatistics",
    "VulnerabilityAIAnalysis",
    "RemediationResponse",
    "VulnerabilityActionResponse"
]