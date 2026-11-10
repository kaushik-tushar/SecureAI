"""
SecureAI - GitHub Integration Service

Handles communication with the GitHub REST API.

Features:
- Repository URL parsing
- Repository metadata retrieval
- Public and private repository support
- Optional GitHub token authentication
- API rate-limit handling
- GitHub API error handling
- Response validation
"""

import re

from typing import Optional
from urllib.parse import urlparse

import httpx

from pydantic import ValidationError

from fastapi import HTTPException, status

from app.core.config import settings

from app.schemas.repository import (
    GitHubRepositoryInfo,
    normalize_github_url
)


# ==========================================
# GITHUB API CONFIGURATION
# ==========================================

GITHUB_API_BASE_URL = (
    settings.GITHUB_API_BASE_URL.rstrip("/")
)

GITHUB_TIMEOUT = httpx.Timeout(
    timeout=15.0,
    connect=5.0
)

GITHUB_USER_AGENT = "SecureAI-Repository-Scanner"

GITHUB_API_VERSION = "2022-11-28"


# ==========================================
# GITHUB REQUEST HEADERS
# ==========================================

def get_github_headers() -> dict[str, str]:

    """
    Builds headers for GitHub API requests.

    Adds authorization only when a GitHub
    personal access token is configured.
    """

    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": GITHUB_USER_AGENT,
        "X-GitHub-Api-Version": GITHUB_API_VERSION
    }

    if settings.GITHUB_TOKEN:

        headers["Authorization"] = (
            f"Bearer {settings.GITHUB_TOKEN}"
        )

    return headers


# ==========================================
# REPOSITORY URL PARSING
# ==========================================

def parse_repository_url(
    repository_url: str
) -> tuple[str, str]:

    """
    Extracts GitHub owner and repository name.

    Supported formats:

        https://github.com/owner/repository

        https://github.com/owner/repository.git

    Returns:
        Tuple containing owner and repository name.
    """

    try:

        normalized_url = normalize_github_url(
            repository_url
        )

        parsed = urlparse(normalized_url)

        path_parts = parsed.path.strip("/").split("/")

        if len(path_parts) != 2:

            raise ValueError(
                "Invalid GitHub repository URL."
            )

        owner, repository = path_parts

        return owner, repository

    except (ValueError, TypeError):

        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Please provide a valid GitHub repository URL."
        )


# ==========================================
# GITHUB API ERROR HANDLING
# ==========================================

def handle_github_error(
    response: httpx.Response
) -> None:

    """
    Converts GitHub API errors into
    appropriate FastAPI HTTP exceptions.
    """

    response_status = response.status_code

    # --------------------------------------
    # REPOSITORY NOT FOUND
    # --------------------------------------

    if response_status == 404:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                "GitHub repository was not found "
                "or is not accessible."
            )
        )

    # --------------------------------------
    # AUTHENTICATION FAILURE
    # --------------------------------------

    if response_status == 401:

        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="GitHub authentication failed."
        )

    # --------------------------------------
    # ACCESS DENIED
    # --------------------------------------

    if response_status == 403:

        remaining = response.headers.get(
            "X-RateLimit-Remaining"
        )

        if remaining == "0":

            reset_time = response.headers.get(
                "X-RateLimit-Reset"
            )

            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=(
                    "GitHub API rate limit exceeded. "
                    f"Rate limit reset timestamp: {reset_time}."
                )
            )

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "GitHub denied access to this repository."
            )
        )

    # --------------------------------------
    # RATE LIMIT
    # --------------------------------------

    if response_status == 429:

        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="GitHub API rate limit exceeded."
        )

    # --------------------------------------
    # SERVER ERRORS
    # --------------------------------------

    if response_status >= 500:

        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="GitHub service is temporarily unavailable."
        )

    # --------------------------------------
    # OTHER CLIENT ERRORS
    # --------------------------------------

    raise HTTPException(
        status_code=status.HTTP_502_BAD_GATEWAY,
        detail=(
            f"GitHub API request failed with status "
            f"{response_status}."
        )
    )


# ==========================================
# FETCH REPOSITORY METADATA
# ==========================================

def get_repository_info(
    repository_url: str
) -> GitHubRepositoryInfo:

    """
    Fetches repository metadata from GitHub.

    Supports public repositories without a token
    and private repositories with an authorized token.

    Returns:
        Validated GitHubRepositoryInfo object.
    """

    # --------------------------------------
    # PARSE REPOSITORY URL
    # --------------------------------------

    owner, repository = parse_repository_url(
        repository_url
    )

    # --------------------------------------
    # BUILD API ENDPOINT
    # --------------------------------------

    endpoint = (
        f"{GITHUB_API_BASE_URL}/repos/"
        f"{owner}/{repository}"
    )

    # --------------------------------------
    # SEND GITHUB API REQUEST
    # --------------------------------------

    try:

        with httpx.Client(
            timeout=GITHUB_TIMEOUT,
            follow_redirects=False
        ) as client:

            response = client.get(
                endpoint,
                headers=get_github_headers()
            )

    except httpx.TimeoutException:

        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="GitHub API request timed out."
        )

    except httpx.RequestError:

        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unable to connect to GitHub."
        )

    # --------------------------------------
    # CHECK RESPONSE STATUS
    # --------------------------------------

    if response.status_code != 200:

        handle_github_error(response)

    # --------------------------------------
    # PARSE RESPONSE JSON
    # --------------------------------------

    try:

        repository_data = response.json()

    except ValueError:

        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="GitHub returned an invalid response."
        )

    # --------------------------------------
    # VALIDATE RESPONSE STRUCTURE
    # --------------------------------------

    if not isinstance(repository_data, dict):

        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unexpected GitHub API response format."
        )

    # --------------------------------------
    # CONVERT TO PYDANTIC MODEL
    # --------------------------------------

    try:

        return GitHubRepositoryInfo(
            github_repo_id=repository_data["id"],
            name=repository_data["name"],
            full_name=repository_data["full_name"],
            description=repository_data.get("description"),
            html_url=repository_data["html_url"],
            clone_url=repository_data.get("clone_url"),
            default_branch=repository_data.get(
                "default_branch",
                "main"
            ),
            language=repository_data.get("language"),
            is_private=repository_data.get("private", False),
            is_archived=repository_data.get("archived", False),
            stars_count=repository_data.get("stargazers_count", 0),
            forks_count=repository_data.get("forks_count", 0),
            open_issues_count=repository_data.get("open_issues_count", 0)
        )

    except (KeyError, ValidationError, TypeError):

        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unable to validate GitHub repository metadata."
        )


# ==========================================
# CHECK GITHUB API CONNECTIVITY
# ==========================================

def check_github_connection() -> bool:

    """
    Checks whether the GitHub API is reachable.

    Returns:
        True when GitHub API responds successfully.
        False when connection fails.
    """

    try:

        with httpx.Client(
            timeout=GITHUB_TIMEOUT,
            follow_redirects=False
        ) as client:

            response = client.get(
                f"{GITHUB_API_BASE_URL}/rate_limit",
                headers=get_github_headers()
            )

            return response.status_code == 200

    except httpx.RequestError:

        return False


# ==========================================
# GITHUB RATE LIMIT INFORMATION
# ==========================================

def get_rate_limit() -> dict:

    """
    Retrieves current GitHub API rate-limit information.

    Returns:
        Dictionary containing rate-limit statistics.
    """

    try:

        with httpx.Client(
            timeout=GITHUB_TIMEOUT,
            follow_redirects=False
        ) as client:

            response = client.get(
                f"{GITHUB_API_BASE_URL}/rate_limit",
                headers=get_github_headers()
            )

        if response.status_code != 200:

            handle_github_error(response)

        data = response.json()

        core_limit = data.get(
            "resources",
            {}
        ).get(
            "core",
            {}
        )

        return {
            "limit": core_limit.get("limit", 0),
            "remaining": core_limit.get("remaining", 0),
            "used": core_limit.get("used", 0),
            "reset": core_limit.get("reset")
        }

    except httpx.TimeoutException:

        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="GitHub API request timed out."
        )

    except httpx.RequestError:

        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unable to connect to GitHub."
        )