"""
SecureAI - Repository API Routes

Provides GitHub repository management endpoints.

Endpoints:
- POST   /repositories
- GET    /repositories
- GET    /repositories/{repository_id}
- PATCH  /repositories/{repository_id}
- DELETE /repositories/{repository_id}

Features:
- GitHub repository integration
- Repository metadata retrieval
- Repository ownership validation
- Duplicate repository prevention
- Pagination and filtering
- Repository updates and deletion
"""

from typing import Annotated, Optional

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status
)

from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.repository import Repository

from app.schemas.repository import (
    RepositoryCreate,
    RepositoryUpdate,
    RepositoryResponse,
    RepositoryListResponse
)

from app.services.auth_service import (
    get_current_active_user
)

from app.services.github_service import (
    get_repository_info
)

from app.core.security import authentication_error

from app.core.config import settings


# ==========================================
# ROUTER CONFIGURATION
# ==========================================

router = APIRouter(
    prefix="/repositories",
    tags=["Repositories"]
)


# ==========================================
# DEPENDENCIES
# ==========================================

DatabaseSession = Annotated[
    Session,
    Depends(get_db)
]

oauth2_scheme = __import__(
    "fastapi.security",
    fromlist=["OAuth2PasswordBearer"]
).OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_PREFIX}/auth/login",
    auto_error=False
)


def get_authenticated_user(
    db: DatabaseSession,
    token: Annotated[
        Optional[str],
        Depends(oauth2_scheme)
    ]
):

    if not token:
        raise authentication_error()

    return get_current_active_user(
        db=db,
        token=token
    )


CurrentUser = Annotated[
    object,
    Depends(get_authenticated_user)
]


# ==========================================
# GET OWNED REPOSITORY
# ==========================================

def get_owned_repository(
    db: Session,
    repository_id: int,
    user_id: int
) -> Repository:

    """
    Retrieves a repository only if it belongs
    to the authenticated user.
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
# ADD GITHUB REPOSITORY
# ==========================================

@router.post(
    "",
    response_model=RepositoryResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add GitHub repository"
)
def add_repository(
    repository_data: RepositoryCreate,
    db: DatabaseSession,
    current_user: CurrentUser
):

    """
    Connects a GitHub repository to SecureAI.

    Steps:
    1. Validate the repository URL.
    2. Retrieve metadata from GitHub.
    3. Check whether the repository is already connected.
    4. Save repository metadata in the database.

    Private repositories require an appropriately
    authorized GitHub token in backend configuration.
    """

    # --------------------------------------
    # FETCH GITHUB REPOSITORY INFORMATION
    # --------------------------------------

    github_repository = get_repository_info(
        repository_url=repository_data.github_url
    )

    # --------------------------------------
    # CHECK DUPLICATE CONNECTION
    # --------------------------------------

    existing_statement = select(Repository).where(
        Repository.owner_id == current_user.id,
        Repository.github_repo_id == github_repository.github_repo_id
    )

    existing_repository = db.scalar(
        existing_statement
    )

    if existing_repository:

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This repository is already connected."
        )

    # --------------------------------------
    # CREATE REPOSITORY RECORD
    # --------------------------------------

    new_repository = Repository(
        owner_id=current_user.id,
        github_repo_id=github_repository.github_repo_id,
        name=github_repository.name,
        full_name=github_repository.full_name,
        description=github_repository.description,
        html_url=github_repository.html_url,
        clone_url=github_repository.clone_url,
        default_branch=github_repository.default_branch,
        language=github_repository.language,
        is_private=github_repository.is_private,
        is_archived=github_repository.is_archived,
        stars_count=github_repository.stars_count,
        forks_count=github_repository.forks_count,
        open_issues_count=github_repository.open_issues_count
    )

    # --------------------------------------
    # SAVE DATABASE RECORD
    # --------------------------------------

    try:

        db.add(new_repository)

        db.commit()

        db.refresh(new_repository)

        return new_repository

    except IntegrityError:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This repository is already connected."
        )

    except Exception:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to connect GitHub repository."
        )


# ==========================================
# LIST USER REPOSITORIES
# ==========================================

@router.get(
    "",
    response_model=RepositoryListResponse,
    summary="List connected repositories"
)
def list_repositories(
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

    search: Optional[str] = Query(
        default=None,
        max_length=200
    ),

    include_archived: bool = Query(
        default=True
    )
):

    """
    Retrieves repositories belonging to the
    authenticated user.

    Supports:
    - Pagination
    - Name search
    - Archived repository filtering
    """

    # --------------------------------------
    # BASE QUERY
    # --------------------------------------

    statement = select(Repository).where(
        Repository.owner_id == current_user.id
    )

    count_statement = select(
        func.count(Repository.id)
    ).where(
        Repository.owner_id == current_user.id
    )

    # --------------------------------------
    # SEARCH FILTER
    # --------------------------------------

    if search:

        search_value = search.strip()

        if search_value:

            search_pattern = f"%{search_value}%"

            statement = statement.where(
                Repository.full_name.ilike(search_pattern)
            )

            count_statement = count_statement.where(
                Repository.full_name.ilike(search_pattern)
            )

    # --------------------------------------
    # ARCHIVED FILTER
    # --------------------------------------

    if not include_archived:

        statement = statement.where(
            Repository.is_archived.is_(False)
        )

        count_statement = count_statement.where(
            Repository.is_archived.is_(False)
        )

    # --------------------------------------
    # TOTAL RECORD COUNT
    # --------------------------------------

    total = db.scalar(
        count_statement
    ) or 0

    # --------------------------------------
    # PAGINATION
    # --------------------------------------

    offset = (page - 1) * page_size

    statement = (
        statement
        .order_by(Repository.created_at.desc())
        .offset(offset)
        .limit(page_size)
    )

    repositories = db.scalars(
        statement
    ).all()

    return RepositoryListResponse(
        repositories=list(repositories),
        total=total,
        page=page,
        page_size=page_size
    )


# ==========================================
# GET REPOSITORY DETAILS
# ==========================================

@router.get(
    "/{repository_id}",
    response_model=RepositoryResponse,
    summary="Get repository details"
)
def get_repository(
    repository_id: int,
    db: DatabaseSession,
    current_user: CurrentUser
):

    """
    Retrieves a single repository.

    Only the repository owner can access it.
    """

    return get_owned_repository(
        db=db,
        repository_id=repository_id,
        user_id=current_user.id
    )


# ==========================================
# UPDATE REPOSITORY
# ==========================================

@router.patch(
    "/{repository_id}",
    response_model=RepositoryResponse,
    summary="Update repository information"
)
def update_repository(
    repository_id: int,
    repository_data: RepositoryUpdate,
    db: DatabaseSession,
    current_user: CurrentUser
):

    """
    Updates locally stored repository information.

    Only the description is currently editable.
    Changes are not pushed to GitHub.
    """

    repository = get_owned_repository(
        db=db,
        repository_id=repository_id,
        user_id=current_user.id
    )

    update_data = repository_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():

        setattr(
            repository,
            field,
            value
        )

    try:

        db.commit()

        db.refresh(repository)

        return repository

    except Exception:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to update repository."
        )


# ==========================================
# DELETE REPOSITORY
# ==========================================

@router.delete(
    "/{repository_id}",
    status_code=status.HTTP_200_OK,
    summary="Disconnect repository"
)
def delete_repository(
    repository_id: int,
    db: DatabaseSession,
    current_user: CurrentUser
):

    """
    Disconnects a repository from SecureAI.

    Repository deletion also removes associated
    scans and vulnerabilities through database
    relationships and cascade configuration.

    This does not delete the actual GitHub repository.
    """

    repository = get_owned_repository(
        db=db,
        repository_id=repository_id,
        user_id=current_user.id
    )

    try:

        db.delete(repository)

        db.commit()

        return {
            "success": True,
            "message": "Repository disconnected successfully.",
            "repository_id": repository_id
        }

    except Exception:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to disconnect repository."
        )