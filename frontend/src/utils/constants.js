/* =========================================
   APPLICATION CONFIGURATION
========================================= */

export const APP_CONFIG = Object.freeze({
    NAME: "SecureAI",
    DESCRIPTION: "AI-Powered Application Security Platform",
    VERSION: "1.0.0",
    AUTHOR: "SecureAI",
    DEFAULT_LANGUAGE: "en",
    DEFAULT_TIMEZONE: "UTC",
});


/* =========================================
   API CONFIGURATION
========================================= */

export const API_CONFIG = Object.freeze({
    BASE_URL:
        import.meta.env.VITE_API_BASE_URL ||
        "http://localhost:8000/api/v1",

    TIMEOUT: 30000,

    UPLOAD_TIMEOUT: 120000,

    DEFAULT_PAGE: 1,

    DEFAULT_PAGE_SIZE: 10,

    MAX_PAGE_SIZE: 100,

    RETRY_ATTEMPTS: 3,
});


/* =========================================
   APPLICATION ROUTES
========================================= */

export const ROUTES = Object.freeze({
    HOME: "/",

    LOGIN: "/login",

    REGISTER: "/register",

    DASHBOARD: "/dashboard",

    PROJECTS: "/projects",

    SCANS: "/scans",

    VULNERABILITIES: "/vulnerabilities",

    AI_REVIEW: "/ai-review",

    REMEDIATION: "/remediation",

    PULL_REQUESTS: "/pull-requests",

    DEPENDENCIES: "/dependencies",

    SETTINGS: "/settings",

    TERMS: "/terms",

    PRIVACY: "/privacy",

    NOT_FOUND: "/404",
});


/* =========================================
   VULNERABILITY SEVERITY
========================================= */

export const SEVERITY = Object.freeze({
    CRITICAL: "critical",

    HIGH: "high",

    MEDIUM: "medium",

    LOW: "low",

    INFO: "info",
});

export const SEVERITY_LABELS = Object.freeze({
    [SEVERITY.CRITICAL]: "Critical",

    [SEVERITY.HIGH]: "High",

    [SEVERITY.MEDIUM]: "Medium",

    [SEVERITY.LOW]: "Low",

    [SEVERITY.INFO]: "Informational",
});

export const SEVERITY_ORDER = Object.freeze([
    SEVERITY.CRITICAL,
    SEVERITY.HIGH,
    SEVERITY.MEDIUM,
    SEVERITY.LOW,
    SEVERITY.INFO,
]);

export const SEVERITY_COLORS = Object.freeze({
    [SEVERITY.CRITICAL]: "#dc2626",

    [SEVERITY.HIGH]: "#f97316",

    [SEVERITY.MEDIUM]: "#eab308",

    [SEVERITY.LOW]: "#22c55e",

    [SEVERITY.INFO]: "#3b82f6",
});


/* =========================================
   SCAN STATUS
========================================= */

export const SCAN_STATUS = Object.freeze({
    QUEUED: "queued",

    PENDING: "pending",

    RUNNING: "running",

    COMPLETED: "completed",

    FAILED: "failed",

    CANCELLED: "cancelled",
});

export const SCAN_STATUS_LABELS = Object.freeze({
    [SCAN_STATUS.QUEUED]: "Queued",

    [SCAN_STATUS.PENDING]: "Pending",

    [SCAN_STATUS.RUNNING]: "Running",

    [SCAN_STATUS.COMPLETED]: "Completed",

    [SCAN_STATUS.FAILED]: "Failed",

    [SCAN_STATUS.CANCELLED]: "Cancelled",
});


/* =========================================
   SCAN TYPES
========================================= */

export const SCAN_TYPES = Object.freeze({
    FULL: "full",

    SAST: "sast",

    SCA: "sca",

    SECRETS: "secrets",

    IAC: "iac",
});

export const SCAN_TYPE_LABELS = Object.freeze({
    [SCAN_TYPES.FULL]: "Full Security Scan",

    [SCAN_TYPES.SAST]: "Static Application Security Testing",

    [SCAN_TYPES.SCA]: "Software Composition Analysis",

    [SCAN_TYPES.SECRETS]: "Secret Detection",

    [SCAN_TYPES.IAC]: "Infrastructure as Code",
});


/* =========================================
   SCANNER CONFIGURATION
========================================= */

export const SCANNERS = Object.freeze({
    SEMGREP: "semgrep",

    GITLEAKS: "gitleaks",

    TRIVY: "trivy",
});

export const SCANNER_LABELS = Object.freeze({
    [SCANNERS.SEMGREP]: "Semgrep",

    [SCANNERS.GITLEAKS]: "Gitleaks",

    [SCANNERS.TRIVY]: "Trivy",
});

export const SCANNER_CATEGORIES = Object.freeze({
    [SCANNERS.SEMGREP]: "SAST",

    [SCANNERS.GITLEAKS]: "Secret Detection",

    [SCANNERS.TRIVY]: "SCA / IaC",
});


/* =========================================
   VULNERABILITY STATUS
========================================= */

export const VULNERABILITY_STATUS = Object.freeze({
    OPEN: "open",

    IN_PROGRESS: "in_progress",

    FIXED: "fixed",

    ACCEPTED: "accepted",

    FALSE_POSITIVE: "false_positive",

    REOPENED: "reopened",
});

export const VULNERABILITY_STATUS_LABELS = Object.freeze({
    [VULNERABILITY_STATUS.OPEN]: "Open",

    [VULNERABILITY_STATUS.IN_PROGRESS]: "In Progress",

    [VULNERABILITY_STATUS.FIXED]: "Fixed",

    [VULNERABILITY_STATUS.ACCEPTED]: "Accepted Risk",

    [VULNERABILITY_STATUS.FALSE_POSITIVE]: "False Positive",

    [VULNERABILITY_STATUS.REOPENED]: "Reopened",
});


/* =========================================
   REMEDIATION STATUS
========================================= */

export const REMEDIATION_STATUS = Object.freeze({
    PENDING: "pending",

    APPROVED: "approved",

    REJECTED: "rejected",

    VALIDATING: "validating",

    VALIDATED: "validated",

    FAILED: "failed",

    PR_CREATED: "pr_created",
});

export const REMEDIATION_STATUS_LABELS = Object.freeze({
    [REMEDIATION_STATUS.PENDING]: "Pending Review",

    [REMEDIATION_STATUS.APPROVED]: "Approved",

    [REMEDIATION_STATUS.REJECTED]: "Rejected",

    [REMEDIATION_STATUS.VALIDATING]: "Validating",

    [REMEDIATION_STATUS.VALIDATED]: "Validated",

    [REMEDIATION_STATUS.FAILED]: "Validation Failed",

    [REMEDIATION_STATUS.PR_CREATED]: "Pull Request Created",
});


/* =========================================
   PULL REQUEST STATUS
========================================= */

export const PR_STATUS = Object.freeze({
    DRAFT: "draft",

    OPEN: "open",

    MERGED: "merged",

    CLOSED: "closed",

    FAILED: "failed",
});

export const PR_STATUS_LABELS = Object.freeze({
    [PR_STATUS.DRAFT]: "Draft",

    [PR_STATUS.OPEN]: "Open",

    [PR_STATUS.MERGED]: "Merged",

    [PR_STATUS.CLOSED]: "Closed",

    [PR_STATUS.FAILED]: "Failed",
});


/* =========================================
   USER ROLES
========================================= */

export const USER_ROLES = Object.freeze({
    OWNER: "owner",

    ADMIN: "admin",

    DEVELOPER: "developer",

    SECURITY_ANALYST: "security_analyst",

    VIEWER: "viewer",
});

export const USER_ROLE_LABELS = Object.freeze({
    [USER_ROLES.OWNER]: "Owner",

    [USER_ROLES.ADMIN]: "Administrator",

    [USER_ROLES.DEVELOPER]: "Developer",

    [USER_ROLES.SECURITY_ANALYST]: "Security Analyst",

    [USER_ROLES.VIEWER]: "Viewer",
});


/* =========================================
   NOTIFICATION TYPES
========================================= */

export const NOTIFICATION_TYPES = Object.freeze({
    SUCCESS: "success",

    ERROR: "error",

    WARNING: "warning",

    INFO: "info",
});


/* =========================================
   AUTHENTICATION CONFIGURATION
========================================= */

export const AUTH_CONFIG = Object.freeze({
    PASSWORD_MIN_LENGTH: 8,

    PASSWORD_MAX_LENGTH: 128,

    SESSION_TIMEOUT: 30 * 60 * 1000,

    TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000,
});


/* =========================================
   STORAGE KEYS
========================================= */

export const STORAGE_KEYS = Object.freeze({
    THEME: "secureai_theme",

    SIDEBAR_COLLAPSED: "secureai_sidebar_collapsed",

    TABLE_PAGE_SIZE: "secureai_table_page_size",

    LAST_PROJECT: "secureai_last_project",

    DASHBOARD_LAYOUT: "secureai_dashboard_layout",
});


/* =========================================
   DATE AND TIME CONFIGURATION
========================================= */

export const DATE_FORMATS = Object.freeze({
    DATE: "DD MMM YYYY",

    DATE_TIME: "DD MMM YYYY, HH:mm",

    TIME: "HH:mm",

    ISO: "YYYY-MM-DD",
});


/* =========================================
   PAGINATION CONFIGURATION
========================================= */

export const PAGINATION = Object.freeze({
    DEFAULT_PAGE: 1,

    DEFAULT_LIMIT: 10,

    PAGE_SIZE_OPTIONS: Object.freeze([
        10,
        20,
        50,
        100,
    ]),

    MAX_LIMIT: 100,
});


/* =========================================
   FILE UPLOAD CONFIGURATION
========================================= */

export const FILE_CONFIG = Object.freeze({
    MAX_UPLOAD_SIZE: 50 * 1024 * 1024,

    MAX_UPLOAD_SIZE_MB: 50,

    ALLOWED_ARCHIVE_TYPES: Object.freeze([
        "application/zip",
        "application/x-zip-compressed",
        "application/gzip",
        "application/x-tar",
    ]),

    ALLOWED_ARCHIVE_EXTENSIONS: Object.freeze([
        ".zip",
        ".tar",
        ".gz",
        ".tgz",
    ]),
});


/* =========================================
   AI CONFIGURATION
========================================= */

export const AI_CONFIG = Object.freeze({
    MAX_PROMPT_LENGTH: 12000,

    MAX_CONTEXT_LENGTH: 50000,

    DEFAULT_TEMPERATURE: 0.2,

    MAX_RETRIES: 2,

    FEATURES: Object.freeze({
        EXPLANATION: "explanation",

        REMEDIATION: "remediation",

        CODE_REVIEW: "code_review",

        RISK_ANALYSIS: "risk_analysis",
    }),
});


/* =========================================
   HTTP STATUS CODES
========================================= */

export const HTTP_STATUS = Object.freeze({
    OK: 200,

    CREATED: 201,

    ACCEPTED: 202,

    NO_CONTENT: 204,

    BAD_REQUEST: 400,

    UNAUTHORIZED: 401,

    FORBIDDEN: 403,

    NOT_FOUND: 404,

    CONFLICT: 409,

    UNPROCESSABLE_ENTITY: 422,

    TOO_MANY_REQUESTS: 429,

    INTERNAL_SERVER_ERROR: 500,

    BAD_GATEWAY: 502,

    SERVICE_UNAVAILABLE: 503,
});


/* =========================================
   ERROR MESSAGES
========================================= */

export const ERROR_MESSAGES = Object.freeze({
    DEFAULT: "Something went wrong. Please try again.",

    NETWORK: "Unable to connect to the server. Check your internet connection.",

    UNAUTHORIZED: "Your session has expired. Please log in again.",

    FORBIDDEN: "You do not have permission to perform this action.",

    NOT_FOUND: "The requested resource could not be found.",

    VALIDATION: "Please check your input and try again.",

    SERVER: "An unexpected server error occurred.",

    REQUEST_CANCELLED: "The request was cancelled.",
});


/* =========================================
   SORT ORDER
========================================= */

export const SORT_ORDER = Object.freeze({
    ASC: "asc",

    DESC: "desc",
});


/* =========================================
   THEME CONFIGURATION
========================================= */

export const THEMES = Object.freeze({
    DARK: "dark",

    LIGHT: "light",

    SYSTEM: "system",
});


/* =========================================
   ENVIRONMENT CONFIGURATION
========================================= */

export const ENVIRONMENT = Object.freeze({
    DEVELOPMENT: "development",

    PRODUCTION: "production",

    TEST: "test",
});