"""
SecureAI - Repository Schemas

Defines request and response validation schemas
for GitHub repository integration.
"""

import re

from datetime import datetime
from typing import Optional
from urllib.parse import urlparse

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    field_validator
)


# ==========================================
# GITHUB REPOSITORY URL VALIDATION
# ==========================================

def normalize_github_url(value: str) -> str:

    value = value.strip()

    if not value:
        raise ValueError(
            "Repository URL cannot be empty."
        )

    parsed = urlparse(value)

    if parsed.scheme not in ("http", "https"):
        raise ValueError(
            "Repository URL must use HTTP or HTTPS."
        )

    if parsed.hostname != "github.com":
        raise ValueError(
            "Only GitHub repository URLs are supported."
        )

    if parsed.port is not None:
        raise ValueError(
            "Repository URL must not contain a custom port."
        )

    if parsed.username or parsed.password:
        raise ValueError(
            "Repository URL must not contain embedded credentials."
        )

    if parsed.query or parsed.fragment:
        raise ValueError(
            "Repository URL must not contain query parameters or fragments."
        )

    path = parsed.path.strip("/")

    if path.endswith(".git"):
        path = path[:-4]

    parts = path.split("/")

    if len(parts) != 2:
        raise ValueError(
            "Provide a valid GitHub repository URL."
        )

    owner, repository = parts

    github_name_pattern = r"^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$"

    if not re.fullmatch(github_name_pattern, owner):
        raise ValueError(
            "Invalid GitHub owner name."
        )

    if not re.fullmatch(github_name_pattern, repository):
        raise ValueError(
            "Invalid GitHub repository name."
        )

    return f"https://github.com/{owner}/{repository}"


# ==========================================
# REPOSITORY CREATE REQUEST
# ==========================================

class RepositoryCreate(BaseModel):

    github_url: str = Field(
        ...,
        min_length=15,
        max_length=1000,
        examples=[
            "https://github.com/username/project"
        ]
    )

    @field_validator("github_url")
    @classmethod
    def validate_github_url(cls, value: str) -> str:

        return normalize_github_url(value)


# ==========================================
# REPOSITORY UPDATE REQUEST
# ==========================================

class RepositoryUpdate(BaseModel):

    description: Optional[str] = Field(
        default=None,
        max_length=5000
    )

    model_config = ConfigDict(
        extra="forbid"
    )


# ==========================================
# REPOSITORY RESPONSE
# ==========================================

class RepositoryResponse(BaseModel):

    id: int

    owner_id: int

    github_repo_id: int

    name: str

    full_name: str

    description: Optional[str] = None

    html_url: str

    clone_url: Optional[str] = None

    default_branch: str

    language: Optional[str] = None

    is_private: bool

    is_archived: bool

    stars_count: int

    forks_count: int

    open_issues_count: int

    last_scanned_at: Optional[datetime] = None

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


# ==========================================
# REPOSITORY LIST RESPONSE
# ==========================================

class RepositoryListResponse(BaseModel):

    repositories: list[RepositoryResponse]

    total: int

    page: int = 1

    page_size: int = 10


# ==========================================
# GITHUB REPOSITORY INFORMATION
# ==========================================

class GitHubRepositoryInfo(BaseModel):

    github_repo_id: int

    name: str

    full_name: str

    description: Optional[str] = None

    html_url: str

    clone_url: Optional[str] = None

    default_branch: str = "main"

    language: Optional[str] = None

    is_private: bool = False

    is_archived: bool = False

    stars_count: int = 0

    forks_count: int = 0

    open_issues_count: int = 0

    model_config = ConfigDict(
        extra="ignore"
    )