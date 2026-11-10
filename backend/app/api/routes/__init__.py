"""
SecureAI - API Routes Package

Centralized registration of application routers.

Available API modules:
- Authentication
- GitHub repositories
- Security scans
- Vulnerability management
- Remediation
- AI security review
"""

from app.api.routes.auth import router as auth_router

from app.api.routes.repositories import router as repositories_router

from app.api.routes.scans import router as scans_router

from app.api.routes.vulnerabilities import router as vulnerabilities_router

from app.api.routes.remediation import router as remediation_router

from app.api.routes.ai_review import router as ai_review_router


# ==========================================
# CENTRALIZED ROUTER EXPORTS
# ==========================================

__all__ = [
    "auth_router",
    "repositories_router",
    "scans_router",
    "vulnerabilities_router",
    "remediation_router",
    "ai_review_router"
]