"""
SecureAI - Scan Schemas

Defines request and response validation schemas
for repository security scans.
"""

from datetime import datetime
from typing import Literal, Optional

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    model_validator
)


# ==========================================
# SCAN TYPE AND STATUS
# ==========================================

ScanType = Literal[
    "full",
    "dependency",
    "code",
    "secret",
    "configuration"
]

ScanStatus = Literal[
    "queued",
    "running",
    "completed",
    "failed",
    "cancelled"
]


# ==========================================
# SCAN CREATE REQUEST
# ==========================================

class ScanCreate(BaseModel):

    repository_id: int = Field(
        ...,
        gt=0,
        description="ID of the repository to scan."
    )

    scan_type: ScanType = Field(
        default="full",
        description="Type of security scan to execute."
    )

    @model_validator(mode="after")
    def validate_scan_request(self):

        if self.repository_id <= 0:
            raise ValueError(
                "Repository ID must be a positive integer."
            )

        return self


# ==========================================
# VULNERABILITY COUNTS
# ==========================================

class VulnerabilityCounts(BaseModel):

    critical: int = Field(
        default=0,
        ge=0
    )

    high: int = Field(
        default=0,
        ge=0
    )

    medium: int = Field(
        default=0,
        ge=0
    )

    low: int = Field(
        default=0,
        ge=0
    )

    info: int = Field(
        default=0,
        ge=0
    )

    @property
    def total(self) -> int:

        return (
            self.critical
            + self.high
            + self.medium
            + self.low
            + self.info
        )


# ==========================================
# SCAN RESPONSE
# ==========================================

class ScanResponse(BaseModel):

    id: int

    repository_id: int

    scan_type: ScanType

    status: ScanStatus

    started_at: Optional[datetime] = None

    completed_at: Optional[datetime] = None

    duration_seconds: Optional[int] = None

    critical_count: int = 0

    high_count: int = 0

    medium_count: int = 0

    low_count: int = 0

    info_count: int = 0

    summary: Optional[str] = None

    error_message: Optional[str] = None

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )

    @property
    def total_vulnerabilities(self) -> int:

        return (
            self.critical_count
            + self.high_count
            + self.medium_count
            + self.low_count
            + self.info_count
        )


# ==========================================
# SCAN SUMMARY RESPONSE
# ==========================================

class ScanSummary(BaseModel):

    total_scans: int = Field(
        default=0,
        ge=0
    )

    completed_scans: int = Field(
        default=0,
        ge=0
    )

    running_scans: int = Field(
        default=0,
        ge=0
    )

    failed_scans: int = Field(
        default=0,
        ge=0
    )

    total_vulnerabilities: int = Field(
        default=0,
        ge=0
    )

    vulnerability_counts: VulnerabilityCounts = Field(
        default_factory=VulnerabilityCounts
    )


# ==========================================
# PAGINATED SCAN HISTORY
# ==========================================

class ScanListResponse(BaseModel):

    scans: list[ScanResponse]

    total: int = Field(
        ge=0
    )

    page: int = Field(
        default=1,
        ge=1
    )

    page_size: int = Field(
        default=10,
        ge=1,
        le=100
    )


# ==========================================
# SCAN ACTION RESPONSE
# ==========================================

class ScanActionResponse(BaseModel):

    message: str

    success: bool = True

    scan: ScanResponse


# ==========================================
# SCAN STATUS RESPONSE
# ==========================================

class ScanStatusResponse(BaseModel):

    scan_id: int

    status: ScanStatus

    progress: int = Field(
        default=0,
        ge=0,
        le=100
    )

    message: Optional[str] = None