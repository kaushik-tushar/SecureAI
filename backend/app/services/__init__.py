"""
SecureAI - Services Package

Centralized access to application services.

Services:
- Authentication
- GitHub integration
- Security scan management
- Vulnerability remediation
- AI-powered security analysis
"""

from app.services import (
    auth_service,
    github_service,
    scan_service,
    remediation_service,
    ai_review_service
)


__all__ = [
    "auth_service",
    "github_service",
    "scan_service",
    "remediation_service",
    "ai_review_service"
]