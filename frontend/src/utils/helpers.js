import {
    SEVERITY,
    SEVERITY_LABELS,
    SEVERITY_ORDER,
    SEVERITY_COLORS,
    SCAN_STATUS_LABELS,
    REMEDIATION_STATUS_LABELS,
    VULNERABILITY_STATUS_LABELS,
    PR_STATUS_LABELS,
    ERROR_MESSAGES,
} from "./constants";


/* =========================================
   STRING UTILITIES
========================================= */

/**
 * Converts a value into a safe string.
 */
export const toSafeString = (value, fallback = "") => {
    if (value === null || value === undefined) {
        return fallback;
    }

    if (typeof value === "string") {
        return value;
    }

    if (
        typeof value === "number" ||
        typeof value === "boolean"
    ) {
        return String(value);
    }

    return fallback;
};


/**
 * Capitalizes the first letter of a string.
 */
export const capitalize = (value) => {
    const text = toSafeString(value).trim();

    if (!text) {
        return "";
    }

    return text.charAt(0).toUpperCase() + text.slice(1);
};


/**
 * Converts snake_case or kebab-case into readable text.
 */
export const formatLabel = (value) => {
    return toSafeString(value)
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (character) =>
            character.toUpperCase()
        );
};


/**
 * Truncates a string without exceeding the specified length.
 */
export const truncateText = (
    value,
    maxLength = 50,
    suffix = "..."
) => {
    const text = toSafeString(value);

    if (
        !Number.isInteger(maxLength) ||
        maxLength < 0
    ) {
        return text;
    }

    if (text.length <= maxLength) {
        return text;
    }

    if (maxLength <= suffix.length) {
        return suffix.slice(0, maxLength);
    }

    return (
        text.slice(0, maxLength - suffix.length).trimEnd() +
        suffix
    );
};


/**
 * Generates initials from a name.
 */
export const getInitials = (name, maxLength = 2) => {
    const text = toSafeString(name).trim();

    if (!text) {
        return "U";
    }

    const words = text.split(/\s+/);

    return words
        .slice(0, maxLength)
        .map((word) => word.charAt(0).toUpperCase())
        .join("");
};


/**
 * Validates an email address for basic frontend input validation.
 */
export const isValidEmail = (email) => {
    const value = toSafeString(email).trim();

    if (!value || value.length > 254) {
        return false;
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};


/* =========================================
   DATE UTILITIES
========================================= */

/**
 * Returns a valid Date object or null.
 */
export const toValidDate = (value) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    const date = value instanceof Date
        ? new Date(value.getTime())
        : new Date(value);

    return Number.isNaN(date.getTime())
        ? null
        : date;
};


/**
 * Formats a date using the browser's locale.
 */
export const formatDate = (
    value,
    options = {}
) => {
    const date = toValidDate(value);

    if (!date) {
        return "—";
    }

    const defaultOptions = {
        day: "2-digit",
        month: "short",
        year: "numeric",
    };

    try {
        return new Intl.DateTimeFormat(
            undefined,
            {
                ...defaultOptions,
                ...options,
            }
        ).format(date);
    } catch {
        return "—";
    }
};


/**
 * Formats date and time.
 */
export const formatDateTime = (
    value,
    options = {}
) => {
    const date = toValidDate(value);

    if (!date) {
        return "—";
    }

    const defaultOptions = {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };

    try {
        return new Intl.DateTimeFormat(
            undefined,
            {
                ...defaultOptions,
                ...options,
            }
        ).format(date);
    } catch {
        return "—";
    }
};


/**
 * Formats a date into a time string.
 */
export const formatTime = (value) => {
    const date = toValidDate(value);

    if (!date) {
        return "—";
    }

    return new Intl.DateTimeFormat(
        undefined,
        {
            hour: "2-digit",
            minute: "2-digit",
        }
    ).format(date);
};


/**
 * Returns a human-readable relative time.
 */
export const getRelativeTime = (
    value,
    baseDate = new Date()
) => {
    const date = toValidDate(value);
    const base = toValidDate(baseDate);

    if (!date || !base) {
        return "Unknown time";
    }

    const difference = date.getTime() - base.getTime();

    const seconds = Math.round(difference / 1000);

    const formatter = new Intl.RelativeTimeFormat(
        undefined,
        {
            numeric: "auto",
        }
    );

    const units = [
        ["year", 31536000],
        ["month", 2592000],
        ["week", 604800],
        ["day", 86400],
        ["hour", 3600],
        ["minute", 60],
        ["second", 1],
    ];

    for (const [unit, unitSeconds] of units) {
        if (Math.abs(seconds) >= unitSeconds) {
            return formatter.format(
                Math.round(seconds / unitSeconds),
                unit
            );
        }
    }

    return "just now";
};


/* =========================================
   FILE UTILITIES
========================================= */

/**
 * Converts bytes into a human-readable file size.
 */
export const formatFileSize = (bytes, decimals = 2) => {
    const size = Number(bytes);

    if (
        !Number.isFinite(size) ||
        size < 0
    ) {
        return "0 Bytes";
    }

    if (size === 0) {
        return "0 Bytes";
    }

    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB",
        "TB",
        "PB",
    ];

    const index = Math.min(
        Math.floor(Math.log(size) / Math.log(1024)),
        units.length - 1
    );

    const precision = Math.max(
        0,
        Math.min(10, Number(decimals) || 0)
    );

    const formattedSize = (
        size / Math.pow(1024, index)
    ).toFixed(precision);

    return `${formattedSize} ${units[index]}`;
};


/**
 * Extracts a filename extension.
 */
export const getFileExtension = (filename) => {
    const name = toSafeString(filename).trim();

    const lastDot = name.lastIndexOf(".");

    if (
        lastDot <= 0 ||
        lastDot === name.length - 1
    ) {
        return "";
    }

    return name.slice(lastDot + 1).toLowerCase();
};


/**
 * Extracts a filename from a file path.
 */
export const getFileName = (filePath) => {
    const normalizedPath = toSafeString(filePath)
        .replace(/\\/g, "/");

    if (!normalizedPath) {
        return "";
    }

    return normalizedPath.split("/").pop() || "";
};


/* =========================================
   VULNERABILITY UTILITIES
========================================= */

/**
 * Normalizes vulnerability severity.
 */
export const normalizeSeverity = (severity) => {
    const value = toSafeString(severity)
        .trim()
        .toLowerCase();

    const aliases = {
        critical: SEVERITY.CRITICAL,
        blocker: SEVERITY.CRITICAL,

        high: SEVERITY.HIGH,

        medium: SEVERITY.MEDIUM,
        moderate: SEVERITY.MEDIUM,

        low: SEVERITY.LOW,

        info: SEVERITY.INFO,
        informational: SEVERITY.INFO,
        unknown: SEVERITY.INFO,
    };

    return aliases[value] || SEVERITY.INFO;
};


/**
 * Returns a readable severity label.
 */
export const getSeverityLabel = (severity) => {
    const normalized = normalizeSeverity(severity);

    return SEVERITY_LABELS[normalized] || "Informational";
};


/**
 * Returns severity color.
 */
export const getSeverityColor = (severity) => {
    const normalized = normalizeSeverity(severity);

    return SEVERITY_COLORS[normalized] || "#64748b";
};


/**
 * Returns the severity priority.
 * Lower number means higher severity.
 */
export const getSeverityPriority = (severity) => {
    const normalized = normalizeSeverity(severity);

    const index = SEVERITY_ORDER.indexOf(normalized);

    return index === -1
        ? SEVERITY_ORDER.length
        : index;
};


/**
 * Sorts vulnerabilities by severity.
 */
export const sortBySeverity = (
    vulnerabilities = [],
    direction = "asc"
) => {
    if (!Array.isArray(vulnerabilities)) {
        return [];
    }

    const multiplier = direction === "desc" ? -1 : 1;

    return [...vulnerabilities].sort((a, b) => {
        return (
            getSeverityPriority(a?.severity) -
            getSeverityPriority(b?.severity)
        ) * multiplier;
    });
};


/**
 * Formats a CVSS score.
 */
export const formatCVSS = (score) => {
    if (
        score === null ||
        score === undefined ||
        score === ""
    ) {
        return "N/A";
    }

    const value = Number(score);

    if (
        !Number.isFinite(value) ||
        value < 0 ||
        value > 10
    ) {
        return "N/A";
    }

    return value.toFixed(1);
};


/**
 * Determines CVSS severity based on score.
 * Uses CVSS v3.x score ranges.
 */
export const getCVSSSeverity = (score) => {
    const value = Number(score);

    if (
        score === null ||
        score === undefined ||
        score === "" ||
        !Number.isFinite(value) ||
        value < 0 ||
        value > 10
    ) {
        return null;
    }

    if (value === 0) {
        return SEVERITY.INFO;
    }

    if (value < 4) {
        return SEVERITY.LOW;
    }

    if (value < 7) {
        return SEVERITY.MEDIUM;
    }

    if (value < 9) {
        return SEVERITY.HIGH;
    }

    return SEVERITY.CRITICAL;
};


/* =========================================
   STATUS UTILITIES
========================================= */

/**
 * Returns a readable scan status.
 */
export const getScanStatusLabel = (status) => {
    const value = toSafeString(status).toLowerCase();

    return SCAN_STATUS_LABELS[value] ||
        formatLabel(value) ||
        "Unknown";
};


/**
 * Returns a readable remediation status.
 */
export const getRemediationStatusLabel = (status) => {
    const value = toSafeString(status).toLowerCase();

    return REMEDIATION_STATUS_LABELS[value] ||
        formatLabel(value) ||
        "Unknown";
};


/**
 * Returns a readable vulnerability status.
 */
export const getVulnerabilityStatusLabel = (status) => {
    const value = toSafeString(status).toLowerCase();

    return VULNERABILITY_STATUS_LABELS[value] ||
        formatLabel(value) ||
        "Unknown";
};


/**
 * Returns a readable pull request status.
 */
export const getPRStatusLabel = (status) => {
    const value = toSafeString(status).toLowerCase();

    return PR_STATUS_LABELS[value] ||
        formatLabel(value) ||
        "Unknown";
};


/* =========================================
   NUMBER UTILITIES
========================================= */

/**
 * Formats a number with locale separators.
 */
export const formatNumber = (
    value,
    options = {}
) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return new Intl.NumberFormat(
        undefined,
        options
    ).format(number);
};


/**
 * Formats a percentage.
 */
export const formatPercentage = (
    value,
    decimals = 1
) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0%";
    }

    const precision = Math.max(
        0,
        Math.min(10, Number(decimals) || 0)
    );

    return `${number.toFixed(precision)}%`;
};


/**
 * Clamps a number within a given range.
 */
export const clamp = (
    value,
    min,
    max
) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return min;
    }

    return Math.min(
        Math.max(number, min),
        max
    );
};


/* =========================================
   ARRAY UTILITIES
========================================= */

/**
 * Safely returns an array.
 */
export const ensureArray = (value) => {
    return Array.isArray(value) ? value : [];
};


/**
 * Removes duplicate primitive values.
 */
export const uniqueArray = (values = []) => {
    if (!Array.isArray(values)) {
        return [];
    }

    return [...new Set(values)];
};


/**
 * Groups array items by a property.
 */
export const groupBy = (
    items = [],
    property
) => {
    if (!Array.isArray(items)) {
        return {};
    }

    return items.reduce((groups, item) => {
        const key = toSafeString(
            item?.[property],
            "unknown"
        );

        if (!groups[key]) {
            groups[key] = [];
        }

        groups[key].push(item);

        return groups;
    }, {});
};


/* =========================================
   OBJECT UTILITIES
========================================= */

/**
 * Safely reads a nested object property.
 *
 * Example:
 * getNestedValue(user, "profile.email")
 */
export const getNestedValue = (
    object,
    path,
    fallback = undefined
) => {
    if (
        !object ||
        typeof object !== "object" ||
        typeof path !== "string"
    ) {
        return fallback;
    }

    const result = path
        .split(".")
        .reduce((current, key) => {
            if (
                current === null ||
                current === undefined
            ) {
                return undefined;
            }

            return current[key];
        }, object);

    return result === undefined
        ? fallback
        : result;
};


/**
 * Checks whether a value is a plain object.
 */
export const isPlainObject = (value) => {
    if (
        value === null ||
        typeof value !== "object"
    ) {
        return false;
    }

    const prototype = Object.getPrototypeOf(value);

    return (
        prototype === Object.prototype ||
        prototype === null
    );
};


/* =========================================
   ERROR UTILITIES
========================================= */

/**
 * Extracts a readable error message.
 */
export const getErrorMessage = (error) => {
    if (typeof error === "string") {
        return error;
    }

    if (!error) {
        return ERROR_MESSAGES.DEFAULT;
    }

    const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.data?.detail ||
        error?.data?.message ||
        error?.message;

    if (typeof message === "string" && message.trim()) {
        return message.trim();
    }

    return ERROR_MESSAGES.DEFAULT;
};


/**
 * Checks whether an error represents request cancellation.
 */
export const isRequestCancelled = (error) => {
    return (
        error?.name === "AbortError" ||
        error?.code === "REQUEST_CANCELLED" ||
        error?.code === "ERR_CANCELED"
    );
};


/**
 * Checks whether the error represents an authentication failure.
 */
export const isUnauthorizedError = (error) => {
    return (
        error?.status === 401 ||
        error?.statusCode === 401 ||
        error?.response?.status === 401
    );
};


/**
 * Checks whether the error represents a network failure.
 */
export const isNetworkError = (error) => {
    return (
        error?.code === "NETWORK_ERROR" ||
        error?.code === "ECONNREFUSED" ||
        error?.message === "Failed to fetch" ||
        error?.message === "Network Error"
    );
};


/* =========================================
   DEBOUNCE AND THROTTLE
========================================= */

/**
 * Delays function execution until calls stop.
 */
export const debounce = (
    callback,
    delay = 300
) => {
    let timeoutId;

    const debounced = (...args) => {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            callback(...args);
        }, delay);
    };

    debounced.cancel = () => {
        clearTimeout(timeoutId);
    };

    return debounced;
};


/**
 * Limits function execution frequency.
 */
export const throttle = (
    callback,
    delay = 300
) => {
    let lastExecution = 0;

    let timeoutId = null;

    const throttled = (...args) => {
        const now = Date.now();

        const remaining = delay - (
            now - lastExecution
        );

        if (remaining <= 0) {
            clearTimeout(timeoutId);

            timeoutId = null;

            lastExecution = now;

            callback(...args);

            return;
        }

        if (!timeoutId) {
            timeoutId = setTimeout(() => {
                lastExecution = Date.now();

                timeoutId = null;

                callback(...args);
            }, remaining);
        }
    };

    throttled.cancel = () => {
        clearTimeout(timeoutId);

        timeoutId = null;
    };

    return throttled;
};


/* =========================================
   CLIPBOARD UTILITIES
========================================= */

/**
 * Copies text to the clipboard.
 *
 * Requires a secure browser context for the
 * modern Clipboard API.
 */
export const copyToClipboard = async (value) => {
    const text = toSafeString(value);

    if (!text) {
        throw new Error("Nothing to copy.");
    }

    if (
        typeof navigator === "undefined" ||
        !navigator.clipboard?.writeText
    ) {
        throw new Error(
            "Clipboard access is not available in this browser."
        );
    }

    await navigator.clipboard.writeText(text);

    return true;
};


/* =========================================
   SECURITY UTILITIES
========================================= */

/**
 * Removes control characters from plain text.
 *
 * This is not an HTML sanitizer and should not
 * replace context-aware output encoding.
 */
export const sanitizePlainText = (value) => {
    return toSafeString(value)
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
};


/**
 * Checks whether a URL uses HTTP or HTTPS.
 */
export const isSafeHttpUrl = (value) => {
    try {
        const url = new URL(value);

        return (
            url.protocol === "http:" ||
            url.protocol === "https:"
        );
    } catch {
        return false;
    }
};


/* =========================================
   RANDOM ID UTILITIES
========================================= */

/**
 * Generates a random identifier for UI-only use.
 *
 * Do not use this as a security token,
 * authentication token, or database ID.
 */
export const generateUIId = (prefix = "item") => {
    const randomPart =
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    return `${prefix}-${randomPart}`;
};