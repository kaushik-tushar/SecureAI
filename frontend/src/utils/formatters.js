// frontend/src/utils/formatters.js

import {
    SEVERITY_LABELS,
    SEVERITY_COLORS,
    SCAN_STATUS,
    REMEDIATION_STATUS,
    VULNERABILITY_STATUS,
    PR_STATUS,
} from "./constants.js";

import {
    formatDate,
    formatRelativeTime,
    formatNumber,
} from "./helpers.js";

/* =========================================================
   INTERNAL HELPERS
========================================================= */

const isValidNumber = (value) => {
    return (
        typeof value === "number" &&
        Number.isFinite(value)
    );
};

const toNumber = (value, fallback = 0) => {
    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
};

const padZero = (value) => {
    return String(value).padStart(2, "0");
};

const capitalize = (value) => {
    if (typeof value !== "string" || !value.trim()) {
        return "";
    }

    return value
        .trim()
        .charAt(0)
        .toUpperCase() + value.trim().slice(1);
};

const normalizeStatus = (status) => {
    if (typeof status !== "string") {
        return "";
    }

    return status
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, "_");
};

/* =========================================================
   DATE FORMATTERS
========================================================= */

/**
 * Formats a date for dashboard and table displays.
 *
 * Example:
 * 2026-11-08 -> Nov 8, 2026
 */
export const formatDisplayDate = (
    value,
    options = {}
) => {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    const {
        includeTime = false,
        includeWeekday = false,
    } = options;

    const dateOptions = {
        day: "numeric",
        month: "short",
        year: "numeric",
    };

    if (includeWeekday) {
        dateOptions.weekday = "short";
    }

    if (includeTime) {
        dateOptions.hour = "2-digit";
        dateOptions.minute = "2-digit";
        dateOptions.hour12 = true;
    }

    return new Intl.DateTimeFormat(
        undefined,
        dateOptions
    ).format(date);
};

/**
 * Formats a date as a compact date.
 *
 * Example:
 * Nov 8
 */
export const formatShortDate = (value) => {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return new Intl.DateTimeFormat(undefined, {
        day: "numeric",
        month: "short",
    }).format(date);
};

/**
 * Formats a date for timestamps.
 *
 * Example:
 * Nov 8, 2026 at 08:30 PM
 */
export const formatTimestamp = (value) => {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return new Intl.DateTimeFormat(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    }).format(date);
};

/**
 * Returns a relative time label.
 *
 * Example:
 * 2 hours ago
 */
export const formatTimeAgo = (value) => {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return formatRelativeTime
        ? formatRelativeTime(value)
        : formatDisplayDate(value);
};

/* =========================================================
   NUMBER FORMATTERS
========================================================= */

/**
 * Formats large numbers using compact notation.
 *
 * Example:
 * 1200 -> 1.2K
 * 1500000 -> 1.5M
 */
export const formatCompactNumber = (
    value,
    maximumFractionDigits = 1
) => {
    const number = toNumber(value);

    return new Intl.NumberFormat(undefined, {
        notation: "compact",
        maximumFractionDigits,
    }).format(number);
};

/**
 * Formats a number with thousands separators.
 *
 * Example:
 * 100000 -> 100,000
 */
export const formatCount = (value) => {
    const number = toNumber(value);

    return formatNumber
        ? formatNumber(number)
        : new Intl.NumberFormat().format(number);
};

/**
 * Formats percentages.
 *
 * Example:
 * 0.85 -> 85%
 */
export const formatPercentage = (
    value,
    options = {}
) => {
    const {
        decimals = 0,
        multiplyBy100 = false,
        showSign = false,
    } = options;

    let number = toNumber(value);

    if (multiplyBy100) {
        number *= 100;
    }

    const formatted = `${number.toFixed(decimals)}%`;

    if (showSign && number > 0) {
        return `+${formatted}`;
    }

    return formatted;
};

/**
 * Formats percentage changes with trend indicators.
 *
 * Example:
 * +12.5%
 * -8.2%
 */
export const formatPercentageChange = (value) => {
    const number = toNumber(value);

    const formatted = `${Math.abs(number).toFixed(1)}%`;

    if (number > 0) {
        return `+${formatted}`;
    }

    if (number < 0) {
        return `-${formatted}`;
    }

    return "0%";
};

/* =========================================================
   SECURITY METRIC FORMATTERS
========================================================= */

/**
 * Formats CVSS scores.
 *
 * Example:
 * 9.8 -> 9.8 / 10
 */
export const formatCVSS = (value) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "Not scored";
    }

    const score = Number(value);

    if (!Number.isFinite(score) || score < 0 || score > 10) {
        return "Invalid score";
    }

    return `${score.toFixed(1)} / 10`;
};

/**
 * Returns the severity label.
 */
export const formatSeverity = (severity) => {
    const normalized = normalizeStatus(severity);

    if (!normalized) {
        return "Unknown";
    }

    return (
        SEVERITY_LABELS?.[normalized] ||
        capitalize(normalized)
    );
};

/**
 * Returns severity color.
 */
export const getSeverityColor = (severity) => {
    const normalized = normalizeStatus(severity);

    return (
        SEVERITY_COLORS?.[normalized] ||
        "var(--text-muted)"
    );
};

/**
 * Formats vulnerability counts.
 *
 * Example:
 * {
 *   critical: 2,
 *   high: 5,
 *   medium: 10,
 *   low: 3
 * }
 */
export const formatVulnerabilitySummary = (summary = {}) => {
    const critical = toNumber(summary.critical);
    const high = toNumber(summary.high);
    const medium = toNumber(summary.medium);
    const low = toNumber(summary.low);
    const info = toNumber(summary.info);

    return {
        critical,
        high,
        medium,
        low,
        info,
        total: critical + high + medium + low + info,
    };
};

/**
 * Formats security score.
 */
export const formatSecurityScore = (score) => {
    const number = toNumber(score, NaN);

    if (!Number.isFinite(number)) {
        return "—";
    }

    const normalized = Math.min(
        100,
        Math.max(0, number)
    );

    return `${Math.round(normalized)}/100`;
};

/**
 * Returns security score classification.
 */
export const getSecurityScoreLabel = (score) => {
    const number = toNumber(score, NaN);

    if (!Number.isFinite(number)) {
        return "Not available";
    }

    if (number >= 90) {
        return "Excellent";
    }

    if (number >= 75) {
        return "Good";
    }

    if (number >= 50) {
        return "Needs improvement";
    }

    return "Critical";
};

/* =========================================================
   STATUS FORMATTERS
========================================================= */

/**
 * Converts technical statuses into readable labels.
 */
export const formatStatus = (status) => {
    const normalized = normalizeStatus(status);

    if (!normalized) {
        return "Unknown";
    }

    const knownStatuses = {
        queued: "Queued",
        pending: "Pending",
        running: "Running",
        in_progress: "In Progress",
        completed: "Completed",
        success: "Successful",
        failed: "Failed",
        cancelled: "Cancelled",
        canceled: "Cancelled",
        approved: "Approved",
        rejected: "Rejected",
        validated: "Validated",
        open: "Open",
        closed: "Closed",
        merged: "Merged",
        draft: "Draft",
        resolved: "Resolved",
        false_positive: "False Positive",
        fixed: "Fixed",
        active: "Active",
        inactive: "Inactive",
        revoked: "Revoked",
        expired: "Expired",
    };

    return knownStatuses[normalized] || capitalize(
        normalized.replace(/_/g, " ")
    );
};

/**
 * Formats scan status.
 */
export const formatScanStatus = (status) => {
    return formatStatus(status);
};

/**
 * Formats remediation status.
 */
export const formatRemediationStatus = (status) => {
    return formatStatus(status);
};

/**
 * Formats pull request status.
 */
export const formatPRStatus = (status) => {
    return formatStatus(status);
};

/**
 * Checks whether a scan is still running.
 */
export const isScanActive = (status) => {
    const normalized = normalizeStatus(status);

    return [
        "queued",
        "pending",
        "running",
        "in_progress",
    ].includes(normalized);
};

/* =========================================================
   SCAN DURATION FORMATTERS
========================================================= */

/**
 * Converts seconds into a readable duration.
 *
 * Examples:
 * 45 -> 45 sec
 * 90 -> 1 min 30 sec
 * 3665 -> 1 hr 1 min 5 sec
 */
export const formatDuration = (seconds) => {
    const totalSeconds = Math.max(
        0,
        Math.floor(toNumber(seconds))
    );

    if (totalSeconds < 60) {
        return `${totalSeconds} sec`;
    }

    const hours = Math.floor(totalSeconds / 3600);

    const minutes = Math.floor(
        (totalSeconds % 3600) / 60
    );

    const remainingSeconds = totalSeconds % 60;

    const parts = [];

    if (hours > 0) {
        parts.push(`${hours} hr`);
    }

    if (minutes > 0) {
        parts.push(`${minutes} min`);
    }

    if (remainingSeconds > 0 && hours === 0) {
        parts.push(`${remainingSeconds} sec`);
    }

    return parts.join(" ");
};

/**
 * Formats milliseconds into readable duration.
 */
export const formatMilliseconds = (milliseconds) => {
    const value = Math.max(
        0,
        toNumber(milliseconds)
    );

    if (value < 1000) {
        return `${Math.round(value)} ms`;
    }

    return formatDuration(value / 1000);
};

/**
 * Calculates duration between two timestamps.
 */
export const calculateDuration = (
    startTime,
    endTime = new Date()
) => {
    if (!startTime || !endTime) {
        return null;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (
        Number.isNaN(start.getTime()) ||
        Number.isNaN(end.getTime())
    ) {
        return null;
    }

    const duration = Math.max(
        0,
        (end.getTime() - start.getTime()) / 1000
    );

    return formatDuration(duration);
};

/* =========================================================
   REPOSITORY FORMATTERS
========================================================= */

/**
 * Extracts owner and repository name from a GitHub URL.
 *
 * Example:
 * https://github.com/facebook/react
 *
 * Returns:
 * {
 *   owner: "facebook",
 *   name: "react",
 *   fullName: "facebook/react"
 * }
 */
export const parseRepositoryURL = (url) => {
    if (!url || typeof url !== "string") {
        return null;
    }

    try {
        const parsed = new URL(url);

        if (
            parsed.hostname !== "github.com" &&
            parsed.hostname !== "www.github.com"
        ) {
            return null;
        }

        const segments = parsed.pathname
            .split("/")
            .filter(Boolean);

        if (segments.length < 2) {
            return null;
        }

        const owner = decodeURIComponent(segments[0]);

        const name = decodeURIComponent(
            segments[1].replace(/\.git$/i, "")
        );

        if (!owner || !name) {
            return null;
        }

        return {
            owner,
            name,
            fullName: `${owner}/${name}`,
        };
    } catch {
        return null;
    }
};

/**
 * Returns a compact repository name.
 *
 * Example:
 * facebook/react -> react
 */
export const formatRepositoryName = (repository) => {
    if (!repository) {
        return "Unknown repository";
    }

    if (typeof repository === "string") {
        const parsed = parseRepositoryURL(repository);

        if (parsed) {
            return parsed.name;
        }

        const parts = repository.split("/");

        return parts[parts.length - 1] || repository;
    }

    return (
        repository.name ||
        repository.repository_name ||
        repository.full_name ||
        repository.fullName ||
        "Unknown repository"
    );
};

/**
 * Returns owner/repository.
 */
export const formatRepositoryFullName = (repository) => {
    if (!repository) {
        return "Unknown repository";
    }

    if (typeof repository === "string") {
        const parsed = parseRepositoryURL(repository);

        if (parsed) {
            return parsed.fullName;
        }

        return repository;
    }

    const owner =
        repository.owner?.login ||
        repository.owner?.name ||
        repository.owner ||
        repository.owner_name;

    const name =
        repository.name ||
        repository.repository_name;

    if (owner && name) {
        return `${owner}/${name}`;
    }

    return repository.full_name || "Unknown repository";
};

/* =========================================================
   CODE LOCATION FORMATTERS
========================================================= */

/**
 * Formats source code location.
 *
 * Example:
 * src/auth/login.py:42
 */
export const formatCodeLocation = ({
    filePath,
    line,
    column,
} = {}) => {
    if (!filePath) {
        return "Unknown location";
    }

    let location = String(filePath);

    if (line !== undefined && line !== null) {
        location += `:${line}`;

        if (column !== undefined && column !== null) {
            location += `:${column}`;
        }
    }

    return location;
};

/**
 * Extracts filename from a file path.
 */
export const formatFileName = (filePath) => {
    if (!filePath || typeof filePath !== "string") {
        return "Unknown file";
    }

    const normalized = filePath.replace(/\\/g, "/");

    return normalized.split("/").pop() || "Unknown file";
};

/**
 * Shortens long file paths for UI display.
 */
export const truncateFilePath = (
    filePath,
    maxLength = 45
) => {
    if (!filePath || typeof filePath !== "string") {
        return "Unknown path";
    }

    if (filePath.length <= maxLength) {
        return filePath;
    }

    const normalized = filePath.replace(/\\/g, "/");

    const parts = normalized.split("/");

    if (parts.length <= 2) {
        return `...${normalized.slice(-(maxLength - 3))}`;
    }

    const fileName = parts.pop();

    const remainingLength = maxLength - fileName.length - 4;

    if (remainingLength <= 0) {
        return `...${fileName.slice(-(maxLength - 3))}`;
    }

    return `.../${parts.slice(-1)[0]}/${fileName}`;
};

/* =========================================================
   FILE SIZE FORMATTERS
========================================================= */

/**
 * Formats file sizes.
 *
 * Examples:
 * 1024 -> 1 KB
 * 1048576 -> 1 MB
 */
export const formatFileSize = (
    bytes,
    decimals = 2
) => {
    const size = toNumber(bytes, NaN);

    if (!Number.isFinite(size) || size < 0) {
        return "—";
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
    ];

    const index = Math.min(
        Math.floor(Math.log(size) / Math.log(1024)),
        units.length - 1
    );

    const formatted = size / Math.pow(1024, index);

    return `${formatted.toFixed(decimals)} ${units[index]}`;
};

/* =========================================================
   AI METRIC FORMATTERS
========================================================= */

/**
 * Formats AI confidence values.
 */
export const formatAIConfidence = (confidence) => {
    if (
        confidence === null ||
        confidence === undefined ||
        confidence === ""
    ) {
        return "Not available";
    }

    let value = Number(confidence);

    if (!Number.isFinite(value)) {
        return "Not available";
    }

    if (value >= 0 && value <= 1) {
        value *= 100;
    }

    value = Math.min(100, Math.max(0, value));

    return `${Math.round(value)}% confidence`;
};

/**
 * Formats token usage.
 */
export const formatTokenUsage = (tokens) => {
    const value = Math.max(
        0,
        toNumber(tokens)
    );

    return `${formatCompactNumber(value)} tokens`;
};

/**
 * Formats AI processing time.
 */
export const formatAIProcessingTime = (milliseconds) => {
    return formatMilliseconds(milliseconds);
};

/* =========================================================
   DASHBOARD FORMATTERS
========================================================= */

/**
 * Formats dashboard statistics.
 */
export const formatDashboardStats = (stats = {}) => {
    const totalProjects = toNumber(
        stats.total_projects ?? stats.totalProjects
    );

    const totalScans = toNumber(
        stats.total_scans ?? stats.totalScans
    );

    const totalVulnerabilities = toNumber(
        stats.total_vulnerabilities ??
        stats.totalVulnerabilities
    );

    const criticalVulnerabilities = toNumber(
        stats.critical_vulnerabilities ??
        stats.criticalVulnerabilities
    );

    const fixedVulnerabilities = toNumber(
        stats.fixed_vulnerabilities ??
        stats.fixedVulnerabilities
    );

    const openVulnerabilities = toNumber(
        stats.open_vulnerabilities ??
        stats.openVulnerabilities
    );

    return {
        totalProjects: formatCount(totalProjects),
        totalScans: formatCount(totalScans),
        totalVulnerabilities: formatCount(
            totalVulnerabilities
        ),
        criticalVulnerabilities: formatCount(
            criticalVulnerabilities
        ),
        fixedVulnerabilities: formatCount(
            fixedVulnerabilities
        ),
        openVulnerabilities: formatCount(
            openVulnerabilities
        ),
        raw: {
            totalProjects,
            totalScans,
            totalVulnerabilities,
            criticalVulnerabilities,
            fixedVulnerabilities,
            openVulnerabilities,
        },
    };
};

/**
 * Calculates vulnerability resolution percentage.
 */
export const calculateResolutionRate = (
    fixed,
    total
) => {
    const fixedCount = toNumber(fixed);
    const totalCount = toNumber(total);

    if (totalCount <= 0) {
        return 0;
    }

    return Math.min(
        100,
        Math.round((fixedCount / totalCount) * 100)
    );
};

/**
 * Formats scan success rate.
 */
export const calculateScanSuccessRate = (
    successful,
    total
) => {
    const successCount = toNumber(successful);
    const totalCount = toNumber(total);

    if (totalCount <= 0) {
        return 0;
    }

    return Math.min(
        100,
        Math.round((successCount / totalCount) * 100)
    );
};

/* =========================================================
   IDENTIFIER FORMATTERS
========================================================= */

/**
 * Formats vulnerability identifiers.
 */
export const formatVulnerabilityId = (id) => {
    if (!id) {
        return "Unknown ID";
    }

    return String(id).toUpperCase();
};

/**
 * Formats CVE identifiers.
 */
export const formatCVE = (cve) => {
    if (!cve || typeof cve !== "string") {
        return "No CVE assigned";
    }

    return cve.trim().toUpperCase();
};

/**
 * Formats CWE identifiers.
 */
export const formatCWE = (cwe) => {
    if (!cwe) {
        return "No CWE assigned";
    }

    const normalized = String(cwe).toUpperCase();

    if (normalized.startsWith("CWE-")) {
        return normalized;
    }

    return `CWE-${normalized}`;
};

/**
 * Formats pull request numbers.
 */
export const formatPRNumber = (number) => {
    const value = toNumber(number, NaN);

    if (!Number.isFinite(value) || value <= 0) {
        return "PR #—";
    }

    return `PR #${Math.floor(value)}`;
};

/* =========================================================
   EXPORT DEFAULT
========================================================= */

const formatters = {
    formatDisplayDate,
    formatShortDate,
    formatTimestamp,
    formatTimeAgo,

    formatCompactNumber,
    formatCount,
    formatPercentage,
    formatPercentageChange,

    formatCVSS,
    formatSeverity,
    getSeverityColor,
    formatVulnerabilitySummary,
    formatSecurityScore,
    getSecurityScoreLabel,

    formatStatus,
    formatScanStatus,
    formatRemediationStatus,
    formatPRStatus,
    isScanActive,

    formatDuration,
    formatMilliseconds,
    calculateDuration,

    parseRepositoryURL,
    formatRepositoryName,
    formatRepositoryFullName,

    formatCodeLocation,
    formatFileName,
    truncateFilePath,

    formatFileSize,

    formatAIConfidence,
    formatTokenUsage,
    formatAIProcessingTime,

    formatDashboardStats,
    calculateResolutionRate,
    calculateScanSuccessRate,

    formatVulnerabilityId,
    formatCVE,
    formatCWE,
    formatPRNumber,
};

export default formatters;