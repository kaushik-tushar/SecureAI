/* =========================================
   VALIDATION CONFIGURATION
========================================= */

const VALIDATION_LIMITS = Object.freeze({
    NAME_MIN: 2,
    NAME_MAX: 80,

    EMAIL_MAX: 254,

    PASSWORD_MIN: 8,
    PASSWORD_MAX: 128,

    PROJECT_NAME_MIN: 3,
    PROJECT_NAME_MAX: 80,

    DESCRIPTION_MAX: 500,

    API_KEY_MIN: 16,
    API_KEY_MAX: 512,

    BRANCH_MAX: 255,

    MAX_FILE_SIZE: 50 * 1024 * 1024,
});


/* =========================================
   BASIC HELPERS
========================================= */

/**
 * Converts input into a safe string.
 */
const toString = (value) => {
    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return typeof value === "string"
        ? value
        : String(value);
};


/**
 * Checks whether a value is empty.
 */
export const isEmpty = (value) => {
    if (
        value === null ||
        value === undefined
    ) {
        return true;
    }

    if (typeof value === "string") {
        return value.trim().length === 0;
    }

    if (Array.isArray(value)) {
        return value.length === 0;
    }

    return false;
};


/**
 * Checks whether a value has the required length.
 */
export const hasValidLength = (
    value,
    min,
    max
) => {
    const text = toString(value);

    return (
        text.length >= min &&
        text.length <= max
    );
};


/* =========================================
   NAME VALIDATION
========================================= */

/**
 * Validates a user's full name.
 */
export const validateName = (name) => {
    const value = toString(name).trim();

    if (!value) {
        return {
            valid: false,
            message: "Full name is required.",
        };
    }

    if (
        value.length < VALIDATION_LIMITS.NAME_MIN ||
        value.length > VALIDATION_LIMITS.NAME_MAX
    ) {
        return {
            valid: false,
            message: `Name must be between ${VALIDATION_LIMITS.NAME_MIN} and ${VALIDATION_LIMITS.NAME_MAX} characters.`,
        };
    }

    if (
        /[\u0000-\u001F\u007F]/.test(value)
    ) {
        return {
            valid: false,
            message: "Name contains invalid characters.",
        };
    }

    return {
        valid: true,
        message: "",
    };
};


/* =========================================
   EMAIL VALIDATION
========================================= */

/**
 * Validates an email address.
 *
 * This is frontend validation only.
 * The backend must perform authoritative validation.
 */
export const validateEmail = (email) => {
    const value = toString(email).trim();

    if (!value) {
        return {
            valid: false,
            message: "Email address is required.",
        };
    }

    if (value.length > VALIDATION_LIMITS.EMAIL_MAX) {
        return {
            valid: false,
            message: "Email address is too long.",
        };
    }

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(value)) {
        return {
            valid: false,
            message: "Enter a valid email address.",
        };
    }

    return {
        valid: true,
        message: "",
    };
};


/* =========================================
   PASSWORD VALIDATION
========================================= */

/**
 * Returns password strength details.
 */
export const getPasswordStrength = (password) => {
    const value = toString(password);

    const checks = {
        length: value.length >= 8,

        uppercase: /[A-Z]/.test(value),

        lowercase: /[a-z]/.test(value),

        number: /\d/.test(value),

        special: /[^A-Za-z0-9]/.test(value),
    };

    const score = Object.values(checks)
        .filter(Boolean)
        .length;

    let strength = "weak";

    if (score >= 5 && value.length >= 12) {
        strength = "strong";
    } else if (score >= 4) {
        strength = "good";
    } else if (score >= 3) {
        strength = "medium";
    }

    return {
        score,
        strength,
        checks,
        maxScore: 5,
    };
};


/**
 * Validates a password.
 */
export const validatePassword = (password) => {
    const value = toString(password);

    if (!value) {
        return {
            valid: false,
            message: "Password is required.",
        };
    }

    if (
        value.length < VALIDATION_LIMITS.PASSWORD_MIN
    ) {
        return {
            valid: false,
            message: `Password must contain at least ${VALIDATION_LIMITS.PASSWORD_MIN} characters.`,
        };
    }

    if (
        value.length > VALIDATION_LIMITS.PASSWORD_MAX
    ) {
        return {
            valid: false,
            message: `Password cannot exceed ${VALIDATION_LIMITS.PASSWORD_MAX} characters.`,
        };
    }

    if (
        /[\u0000-\u001F\u007F]/.test(value)
    ) {
        return {
            valid: false,
            message: "Password contains invalid control characters.",
        };
    }

    return {
        valid: true,
        message: "",
        strength: getPasswordStrength(value),
    };
};


/**
 * Validates password confirmation.
 */
export const validatePasswordConfirmation = (
    password,
    confirmPassword
) => {
    if (!toString(confirmPassword)) {
        return {
            valid: false,
            message: "Please confirm your password.",
        };
    }

    if (
        toString(password) !==
        toString(confirmPassword)
    ) {
        return {
            valid: false,
            message: "Passwords do not match.",
        };
    }

    return {
        valid: true,
        message: "",
    };
};


/* =========================================
   LOGIN FORM VALIDATION
========================================= */

/**
 * Validates login form fields.
 */
export const validateLoginForm = (values = {}) => {
    const errors = {};

    const emailResult = validateEmail(values.email);

    const passwordResult = validatePassword(values.password);

    if (!emailResult.valid) {
        errors.email = emailResult.message;
    }

    if (!passwordResult.valid) {
        errors.password = passwordResult.message;
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};


/* =========================================
   REGISTRATION FORM VALIDATION
========================================= */

/**
 * Validates registration form fields.
 */
export const validateRegisterForm = (values = {}) => {
    const errors = {};

    const nameResult = validateName(values.fullName);

    const emailResult = validateEmail(values.email);

    const passwordResult = validatePassword(values.password);

    const confirmResult = validatePasswordConfirmation(
        values.password,
        values.confirmPassword
    );

    if (!nameResult.valid) {
        errors.fullName = nameResult.message;
    }

    if (!emailResult.valid) {
        errors.email = emailResult.message;
    }

    if (!passwordResult.valid) {
        errors.password = passwordResult.message;
    }

    if (!confirmResult.valid) {
        errors.confirmPassword = confirmResult.message;
    }

    if (values.acceptTerms !== true) {
        errors.acceptTerms = "You must accept the terms and conditions.";
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};


/* =========================================
   PROJECT VALIDATION
========================================= */

/**
 * Validates a project name.
 */
export const validateProjectName = (name) => {
    const value = toString(name).trim();

    if (!value) {
        return {
            valid: false,
            message: "Project name is required.",
        };
    }

    if (
        !hasValidLength(
            value,
            VALIDATION_LIMITS.PROJECT_NAME_MIN,
            VALIDATION_LIMITS.PROJECT_NAME_MAX
        )
    ) {
        return {
            valid: false,
            message: "Project name must contain between 3 and 80 characters.",
        };
    }

    if (
        !/^[a-zA-Z0-9][a-zA-Z0-9 _.-]*$/.test(value)
    ) {
        return {
            valid: false,
            message: "Project name contains unsupported characters.",
        };
    }

    return {
        valid: true,
        message: "",
    };
};


/**
 * Validates a project description.
 */
export const validateProjectDescription = (description) => {
    const value = toString(description);

    if (
        value.length > VALIDATION_LIMITS.DESCRIPTION_MAX
    ) {
        return {
            valid: false,
            message: "Description cannot exceed 500 characters.",
        };
    }

    return {
        valid: true,
        message: "",
    };
};


/* =========================================
   GITHUB REPOSITORY VALIDATION
========================================= */

/**
 * Validates a GitHub repository URL.
 *
 * Supports:
 * https://github.com/owner/repository
 *
 * Rejects:
 * Other domains, credentials, query strings,
 * fragments, and unsupported URL formats.
 */
export const validateGitHubRepository = (repositoryUrl) => {
    const value = toString(repositoryUrl).trim();

    if (!value) {
        return {
            valid: false,
            message: "GitHub repository URL is required.",
        };
    }

    let url;

    try {
        url = new URL(value);
    } catch {
        return {
            valid: false,
            message: "Enter a valid repository URL.",
        };
    }

    if (
        url.protocol !== "https:" ||
        url.hostname !== "github.com" ||
        url.port ||
        url.username ||
        url.password ||
        url.search ||
        url.hash
    ) {
        return {
            valid: false,
            message: "Enter a valid HTTPS GitHub repository URL.",
        };
    }

    const segments = url.pathname
        .split("/")
        .filter(Boolean);

    if (
        segments.length !== 2 ||
        segments.some(
            (segment) =>
                segment === "." ||
                segment === ".." ||
                segment.includes("\\")
        )
    ) {
        return {
            valid: false,
            message: "Use the format https://github.com/owner/repository.",
        };
    }

    return {
        valid: true,
        message: "",
        owner: segments[0],
        repository: segments[1].replace(/\.git$/i, ""),
    };
};


/**
 * Validates a Git branch name.
 *
 * Implements common Git ref-name restrictions.
 */
export const validateBranchName = (branch) => {
    const value = toString(branch);

    if (!value.trim()) {
        return {
            valid: false,
            message: "Branch name is required.",
        };
    }

    if (
        value.length > VALIDATION_LIMITS.BRANCH_MAX
    ) {
        return {
            valid: false,
            message: "Branch name is too long.",
        };
    }

    const invalidPatterns = [
        /^\./,
        /\.$/,
        /\.lock$/i,
        /\.\./,
        /@\{/,
        /\/\//,
        /^\/|\/$/,
        /[\s~^:?*\\\[\]]/,
        /[\x00-\x20\x7f]/,
    ];

    if (
        invalidPatterns.some((pattern) =>
            pattern.test(value)
        )
    ) {
        return {
            valid: false,
            message: "Branch name contains invalid Git reference characters.",
        };
    }

    return {
        valid: true,
        message: "",
    };
};


/* =========================================
   API KEY VALIDATION
========================================= */

/**
 * Validates an API key input.
 *
 * This checks format only, not authenticity.
 */
export const validateApiKey = (apiKey) => {
    const value = toString(apiKey).trim();

    if (!value) {
        return {
            valid: false,
            message: "API key is required.",
        };
    }

    if (
        value.length < VALIDATION_LIMITS.API_KEY_MIN ||
        value.length > VALIDATION_LIMITS.API_KEY_MAX
    ) {
        return {
            valid: false,
            message: "API key length is invalid.",
        };
    }

    if (!/^[A-Za-z0-9_.-]+$/.test(value)) {
        return {
            valid: false,
            message: "API key contains invalid characters.",
        };
    }

    return {
        valid: true,
        message: "",
    };
};


/* =========================================
   FILE VALIDATION
========================================= */

/**
 * Validates file size.
 */
export const validateFileSize = (
    file,
    maxSize = VALIDATION_LIMITS.MAX_FILE_SIZE
) => {
    if (!file || typeof file.size !== "number") {
        return {
            valid: false,
            message: "Please select a valid file.",
        };
    }

    if (file.size <= 0) {
        return {
            valid: false,
            message: "Empty files are not allowed.",
        };
    }

    if (file.size > maxSize) {
        return {
            valid: false,
            message: `File size must not exceed ${Math.floor(maxSize / (1024 * 1024))} MB.`,
        };
    }

    return {
        valid: true,
        message: "",
    };
};


/**
 * Validates archive extension.
 *
 * Extension validation is not a security boundary.
 * Backend must inspect file contents and archive entries.
 */
export const validateArchiveFile = (file) => {
    if (!file || typeof file.name !== "string") {
        return {
            valid: false,
            message: "Please select a valid archive file.",
        };
    }

    const allowedExtensions = [
        ".zip",
        ".tar",
        ".gz",
        ".tgz",
    ];

    const filename = file.name.toLowerCase();

    const hasAllowedExtension = allowedExtensions.some(
        (extension) => filename.endsWith(extension)
    );

    if (!hasAllowedExtension) {
        return {
            valid: false,
            message: "Only ZIP, TAR, GZ, and TGZ archives are supported.",
        };
    }

    return validateFileSize(file);
};


/* =========================================
   SCAN CONFIGURATION VALIDATION
========================================= */

/**
 * Validates scan configuration.
 */
export const validateScanConfiguration = (values = {}) => {
    const errors = {};

    if (!values.projectId) {
        errors.projectId = "Please select a project.";
    }

    const supportedScanTypes = [
        "full",
        "sast",
        "sca",
        "secrets",
        "iac",
    ];

    if (
        !supportedScanTypes.includes(values.scanType)
    ) {
        errors.scanType = "Select a valid scan type.";
    }

    if (
        values.branch &&
        !validateBranchName(values.branch).valid
    ) {
        errors.branch = "Enter a valid Git branch name.";
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};


/* =========================================
   REMEDIATION VALIDATION
========================================= */

/**
 * Validates remediation approval input.
 */
export const validateRemediationApproval = (values = {}) => {
    const errors = {};

    if (!values.remediationId) {
        errors.remediationId = "Remediation ID is required.";
    }

    if (
        values.approved !== true &&
        values.approved !== false
    ) {
        errors.approved = "A valid approval decision is required.";
    }

    if (
        values.comment &&
        toString(values.comment).length > 1000
    ) {
        errors.comment = "Comment cannot exceed 1000 characters.";
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};


/* =========================================
   PASSWORD RESET VALIDATION
========================================= */

/**
 * Validates password reset form.
 */
export const validatePasswordReset = (values = {}) => {
    const errors = {};

    const passwordResult = validatePassword(
        values.password
    );

    const confirmResult = validatePasswordConfirmation(
        values.password,
        values.confirmPassword
    );

    if (!passwordResult.valid) {
        errors.password = passwordResult.message;
    }

    if (!confirmResult.valid) {
        errors.confirmPassword = confirmResult.message;
    }

    if (!toString(values.token).trim()) {
        errors.token = "Password reset token is required.";
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};


/* =========================================
   GENERIC FORM VALIDATION
========================================= */

/**
 * Validates fields using supplied validator functions.
 *
 * Example:
 *
 * validateForm(values, {
 *   email: validateEmail,
 *   password: validatePassword
 * });
 */
export const validateForm = (
    values = {},
    schema = {}
) => {
    const errors = {};

    Object.entries(schema).forEach(
        ([field, validator]) => {
            if (typeof validator !== "function") {
                return;
            }

            const result = validator(values[field]);

            if (
                result &&
                result.valid === false
            ) {
                errors[field] = result.message;
            }
        }
    );

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};


/* =========================================
   VALIDATION CONSTANTS
========================================= */

export const VALIDATION_CONFIG = Object.freeze({
    LIMITS: VALIDATION_LIMITS,

    PASSWORD_REQUIREMENTS: Object.freeze({
        MIN_LENGTH: 8,
        MAX_LENGTH: 128,
    }),

    SUPPORTED_ARCHIVE_EXTENSIONS: Object.freeze([
        ".zip",
        ".tar",
        ".gz",
        ".tgz",
    ]),
});