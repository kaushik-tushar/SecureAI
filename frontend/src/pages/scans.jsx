import React, { useMemo, useState } from "react";

import {
  Activity,
  AlertCircle,
  ArrowRight,
  Ban,
  Bug,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Code2,
  FileSearch,
  Filter,
  GitBranch,
  LoaderCircle,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  XCircle,
} from "lucide-react";

import { Link } from "react-router-dom";

import Sidebar from "../components/sidebar.jsx";
import Navbar from "../components/navbar.jsx";
import Loader from "../components/loader.jsx";


const scansStyles = `
  .scans-layout {
    display: flex;
    min-height: 100vh;
    min-height: 100dvh;
    background: var(--background, #080d18);
    color: var(--text-primary, #f1f5f9);
  }

  .scans-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    margin-left: 260px;
    transition: margin-left 0.25s ease;
  }

  .scans-content {
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
    padding: 30px;
  }

  .scans-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 26px;
  }

  .scans-heading {
    min-width: 0;
  }

  .scans-eyebrow {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    color: var(--primary, #60a5fa);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .scans-title {
    margin: 0;
    color: var(--text-primary, #f1f5f9);
    font-size: clamp(25px, 3vw, 32px);
    font-weight: 750;
    letter-spacing: -0.04em;
    line-height: 1.2;
  }

  .scans-subtitle {
    margin: 10px 0 0;
    color: var(--text-secondary, #94a3b8);
    font-size: 14px;
    line-height: 1.7;
  }

  .scans-header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .scans-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 41px;
    padding: 0 14px;
    border: 1px solid var(--border, #263244);
    border-radius: 9px;
    background: var(--surface, #111827);
    color: var(--text-primary, #f1f5f9);
    font-family: inherit;
    font-size: 12px;
    font-weight: 650;
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
    transition: background 0.2s ease, border-color 0.2s ease;
  }

  .scans-button:hover:not(:disabled) {
    border-color: var(--primary, #3b82f6);
    background: var(--surface-hover, #1b2638);
  }

  .scans-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .scans-button-primary {
    border-color: transparent;
    background: linear-gradient(135deg, #2563eb, #0891b2);
    color: #ffffff;
  }

  .scans-button-primary:hover:not(:disabled) {
    border-color: transparent;
    background: linear-gradient(135deg, #1d4ed8, #0e7490);
  }

  .scans-overview {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 13px;
    margin-bottom: 24px;
  }

  .scans-overview-card {
    display: flex;
    align-items: center;
    gap: 11px;
    min-width: 0;
    padding: 15px;
    border: 1px solid var(--border, #263244);
    border-radius: 11px;
    background: var(--surface, #111827);
  }

  .scans-overview-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    flex-shrink: 0;
    border: 1px solid rgba(59, 130, 246, 0.18);
    border-radius: 10px;
    background: rgba(59, 130, 246, 0.10);
    color: #60a5fa;
  }

  .scans-overview-icon-running {
    color: #60a5fa;
    background: rgba(59, 130, 246, 0.10);
  }

  .scans-overview-icon-completed {
    color: #4ade80;
    background: rgba(34, 197, 94, 0.10);
  }

  .scans-overview-icon-failed {
    color: #f87171;
    background: rgba(239, 68, 68, 0.10);
  }

  .scans-overview-icon-queued {
    color: #facc15;
    background: rgba(234, 179, 8, 0.10);
  }

  .scans-overview-info {
    min-width: 0;
  }

  .scans-overview-label {
    display: block;
    margin-bottom: 5px;
    color: var(--text-muted, #718096);
    font-size: 10px;
    font-weight: 600;
  }

  .scans-overview-value {
    display: block;
    color: var(--text-primary, #f1f5f9);
    font-size: 20px;
    font-weight: 750;
    font-variant-numeric: tabular-nums;
  }

  .scans-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    margin-bottom: 17px;
  }

  .scans-search-wrapper {
    position: relative;
    flex: 1;
    max-width: 430px;
  }

  .scans-search-icon {
    position: absolute;
    top: 50%;
    left: 13px;
    color: var(--text-muted, #718096);
    pointer-events: none;
    transform: translateY(-50%);
  }

  .scans-search {
    width: 100%;
    min-height: 42px;
    padding: 0 14px 0 40px;
    border: 1px solid var(--border, #263244);
    border-radius: 9px;
    outline: none;
    background: var(--surface, #111827);
    color: var(--text-primary, #f1f5f9);
    font-family: inherit;
    font-size: 12px;
  }

  .scans-search::placeholder {
    color: var(--text-muted, #718096);
  }

  .scans-search:focus {
    border-color: var(--primary, #3b82f6);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
  }

  .scans-filters {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .scans-filter-select {
    min-height: 42px;
    padding: 0 30px 0 11px;
    border: 1px solid var(--border, #263244);
    border-radius: 9px;
    outline: none;
    background: var(--surface, #111827);
    color: var(--text-secondary, #cbd5e1);
    font-family: inherit;
    font-size: 11px;
    cursor: pointer;
  }

  .scans-filter-select:focus {
    border-color: var(--primary, #3b82f6);
  }

  .scans-filter-select option {
    background: #111827;
    color: #f1f5f9;
  }

  .scans-table-container {
    overflow-x: auto;
    border: 1px solid var(--border, #263244);
    border-radius: 13px;
    background: var(--surface, #111827);
  }

  .scans-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    white-space: nowrap;
  }

  .scans-table thead {
    background: rgba(148, 163, 184, 0.035);
  }

  .scans-table th {
    padding: 15px 17px;
    border-bottom: 1px solid var(--border, #263244);
    color: var(--text-muted, #718096);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .scans-table td {
    padding: 15px 17px;
    border-bottom: 1px solid var(--border, #263244);
    color: var(--text-secondary, #cbd5e1);
    font-size: 11px;
    vertical-align: middle;
  }

  .scans-table tbody tr:last-child td {
    border-bottom: none;
  }

  .scans-table tbody tr {
    transition: background 0.15s ease;
  }

  .scans-table tbody tr:hover {
    background: rgba(59, 130, 246, 0.035);
  }

  .scan-repository {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 190px;
  }

  .scan-repository-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    flex-shrink: 0;
    border: 1px solid var(--border, #263244);
    border-radius: 9px;
    background: rgba(148, 163, 184, 0.06);
    color: var(--text-secondary, #94a3b8);
  }

  .scan-repository-name {
    display: block;
    max-width: 210px;
    overflow: hidden;
    color: var(--text-primary, #f1f5f9);
    font-size: 12px;
    font-weight: 650;
    text-overflow: ellipsis;
  }

  .scan-repository-branch {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 5px;
    color: var(--text-muted, #718096);
    font-size: 10px;
  }

  .scan-type-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 5px;
  }

  .scan-type-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 7px;
    border: 1px solid var(--border, #263244);
    border-radius: 6px;
    background: rgba(148, 163, 184, 0.04);
    color: var(--text-secondary, #cbd5e1);
    font-size: 9px;
    font-weight: 650;
  }

  .scan-type-badge-semgrep {
    color: #c4b5fd;
  }

  .scan-type-badge-trivy {
    color: #67e8f9;
  }

  .scan-type-badge-gitleaks {
    color: #fca5a5;
  }

  .scan-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 9px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 700;
    text-transform: capitalize;
  }

  .scan-status-badge-running {
    background: rgba(59, 130, 246, 0.11);
    color: #60a5fa;
  }

  .scan-status-badge-completed {
    background: rgba(34, 197, 94, 0.10);
    color: #4ade80;
  }

  .scan-status-badge-failed {
    background: rgba(239, 68, 68, 0.10);
    color: #f87171;
  }

  .scan-status-badge-queued {
    background: rgba(234, 179, 8, 0.10);
    color: #facc15;
  }

  .scan-status-badge-cancelled {
    background: rgba(148, 163, 184, 0.10);
    color: #94a3b8;
  }

  .scan-status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }

  .scan-progress-wrapper {
    width: 110px;
  }

  .scan-progress-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 7px;
    color: var(--text-muted, #718096);
    font-size: 10px;
  }

  .scan-progress-track {
    width: 100%;
    height: 5px;
    overflow: hidden;
    border-radius: 10px;
    background: rgba(148, 163, 184, 0.13);
  }

  .scan-progress-bar {
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #2563eb, #22d3ee);
    transition: width 0.3s ease;
  }

  .scan-progress-bar-completed {
    background: #22c55e;
  }

  .scan-progress-bar-failed {
    background: #ef4444;
  }

  .scan-progress-bar-cancelled {
    background: #64748b;
  }

  .scan-findings {
    color: var(--text-primary, #f1f5f9);
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  .scan-findings-empty {
    color: var(--text-muted, #718096);
  }

  .scan-date {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .scan-date-primary {
    color: var(--text-secondary, #cbd5e1);
    font-size: 11px;
  }

  .scan-date-secondary {
    color: var(--text-muted, #718096);
    font-size: 10px;
  }

  .scan-row-actions {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .scan-icon-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 31px;
    height: 31px;
    border: 1px solid var(--border, #263244);
    border-radius: 7px;
    background: transparent;
    color: var(--text-secondary, #94a3b8);
    cursor: pointer;
    transition: background 0.2s ease, border-color 0.2s ease;
  }

  .scan-icon-button:hover:not(:disabled) {
    border-color: var(--primary, #3b82f6);
    background: rgba(59, 130, 246, 0.08);
    color: #60a5fa;
  }

  .scan-icon-button-danger:hover:not(:disabled) {
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.08);
    color: #f87171;
  }

  .scan-icon-button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .scans-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 290px;
    padding: 35px 20px;
    text-align: center;
  }

  .scans-empty-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 55px;
    height: 55px;
    margin-bottom: 15px;
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-radius: 15px;
    background: rgba(59, 130, 246, 0.10);
    color: #60a5fa;
  }

  .scans-empty-title {
    margin: 0;
    color: var(--text-primary, #f1f5f9);
    font-size: 15px;
    font-weight: 700;
  }

  .scans-empty-description {
    max-width: 370px;
    margin: 9px 0 18px;
    color: var(--text-muted, #718096);
    font-size: 11px;
    line-height: 1.7;
  }

  .scans-results-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-top: 15px;
    color: var(--text-muted, #718096);
    font-size: 11px;
  }

  .scans-error {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    margin-bottom: 20px;
    padding: 14px 16px;
    border: 1px solid rgba(239, 68, 68, 0.25);
    border-radius: 10px;
    background: rgba(239, 68, 68, 0.07);
    color: #fca5a5;
    font-size: 12px;
  }

  .scans-error-message {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .scans-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-top: 28px;
    padding-top: 18px;
    border-top: 1px solid var(--border, #263244);
    color: var(--text-muted, #718096);
    font-size: 11px;
  }

  .scans-footer-brand {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .scans-spin {
    animation: scans-rotate 1s linear infinite;
  }

  @keyframes scans-rotate {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 1250px) {
    .scans-overview {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (max-width: 900px) {
    .scans-main {
      margin-left: 0;
    }

    .scans-content {
      padding: 24px;
    }

    .scans-table-container {
      overflow-x: auto;
    }

    .scans-table {
      min-width: 1050px;
    }
  }

  @media (max-width: 640px) {
    .scans-content {
      padding: 18px 14px;
    }

    .scans-header {
      flex-direction: column;
      align-items: stretch;
    }

    .scans-header-actions {
      width: 100%;
    }

    .scans-header-actions > * {
      flex: 1;
    }

    .scans-overview {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 9px;
    }

    .scans-overview-card {
      padding: 12px;
    }

    .scans-overview-icon {
      width: 33px;
      height: 33px;
    }

    .scans-overview-value {
      font-size: 18px;
    }

    .scans-toolbar {
      align-items: stretch;
      flex-direction: column;
    }

    .scans-search-wrapper {
      max-width: none;
    }

    .scans-filters {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    .scans-filter-select {
      width: 100%;
    }

    .scans-results-footer {
      align-items: flex-start;
      flex-direction: column;
    }

    .scans-footer {
      align-items: flex-start;
      flex-direction: column;
    }

    .scans-error {
      align-items: flex-start;
      flex-direction: column;
    }
  }

  @media (max-width: 380px) {
    .scans-overview {
      grid-template-columns: 1fr;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .scans-layout *,
    .scans-layout *::before,
    .scans-layout *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`;


const VALID_STATUSES = [
  "queued",
  "running",
  "completed",
  "failed",
  "cancelled",
];


function normalizeScan(scan) {
  const rawStatus = String(
    scan.status ?? "queued"
  ).toLowerCase();

  const status = VALID_STATUSES.includes(rawStatus)
    ? rawStatus
    : "queued";

  const progressValue = Number(
    scan.progress ?? scan.progress_percentage ?? 0
  );

  const progress = Number.isFinite(progressValue)
    ? Math.min(100, Math.max(0, progressValue))
    : 0;

  return {
    ...scan,

    id: scan.id ?? scan.scan_id,

    repository:
      scan.repository_name ??
      scan.repository ??
      scan.project_name ??
      "Unknown repository",

    owner:
      scan.repository_owner ??
      scan.owner ??
      "",

    branch:
      scan.branch ??
      scan.target_branch ??
      "main",

    status,

    progress:
      status === "completed"
        ? 100
        : progress,

    scanners:
      Array.isArray(scan.scanners)
        ? scan.scanners
        : scan.scanner
          ? [scan.scanner]
          : [],

    findingsCount: Number(
      scan.findings_count ??
      scan.vulnerabilities_count ??
      scan.total_findings ??
      0
    ),

    startedAt:
      scan.started_at ??
      scan.created_at ??
      null,

    completedAt:
      scan.completed_at ??
      null,

    duration:
      scan.duration_seconds ??
      scan.duration ??
      null,
  };
}


function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}


function formatDuration(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  const seconds = Number(value);

  if (!Number.isFinite(seconds) || seconds < 0) {
    return "—";
  }

  if (seconds < 60) {
    return `${Math.round(seconds)} sec`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);

  if (minutes < 60) {
    return `${minutes}m ${remainingSeconds}s`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}h ${remainingMinutes}m`;
}


function formatRelativeTime(value) {
  if (!value) {
    return "Time unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Time unavailable";
  }

  const difference = Date.now() - date.getTime();

  if (difference < 0) {
    return formatDate(value);
  }

  const minutes = Math.floor(difference / 60000);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 30) {
    return `${days}d ago`;
  }

  return formatDate(value);
}


function ScanStatus({ status }) {
  const configuration = {
    queued: {
      label: "Queued",
      icon: Clock3,
    },

    running: {
      label: "Running",
      icon: LoaderCircle,
    },

    completed: {
      label: "Completed",
      icon: CheckCircle2,
    },

    failed: {
      label: "Failed",
      icon: XCircle,
    },

    cancelled: {
      label: "Cancelled",
      icon: Ban,
    },
  };

  const current = configuration[status] ??
    configuration.queued;

  const Icon = current.icon;

  return (
    <span className={`scan-status-badge scan-status-badge-${status}`}>
      <Icon
        size={12}
        className={status === "running" ? "scans-spin" : ""}
      />

      {current.label}
    </span>
  );
}


function ScanProgress({ scan }) {
  const progress = scan.progress;
  const status = scan.status;

  return (
    <div className="scan-progress-wrapper">
      <div className="scan-progress-label">
        <span>
          {status === "completed"
            ? "Complete"
            : status === "failed"
              ? "Failed"
              : status === "cancelled"
                ? "Cancelled"
                : `${progress}%`}
        </span>

        {status === "running" && (
          <Activity size={11} />
        )}
      </div>

      <div
        className="scan-progress-track"
        role="progressbar"
        aria-label="Scan progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div
          className={`scan-progress-bar ${
            status === "completed"
              ? "scan-progress-bar-completed"
              : status === "failed"
                ? "scan-progress-bar-failed"
                : status === "cancelled"
                  ? "scan-progress-bar-cancelled"
                  : ""
          }`}
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}


function ScannerBadges({ scanners }) {
  if (!Array.isArray(scanners) || scanners.length === 0) {
    return (
      <span className="scan-type-badge">
        Not specified
      </span>
    );
  }

  return (
    <div className="scan-type-list">
      {scanners.map((scanner, index) => {
        const name = String(
          typeof scanner === "string"
            ? scanner
            : scanner.name ?? scanner.type ?? "Unknown"
        );

        const normalized = name.toLowerCase();

        let badgeClass = "";

        if (normalized.includes("semgrep")) {
          badgeClass = "scan-type-badge-semgrep";
        } else if (normalized.includes("trivy")) {
          badgeClass = "scan-type-badge-trivy";
        } else if (normalized.includes("gitleaks")) {
          badgeClass = "scan-type-badge-gitleaks";
        }

        return (
          <span
            className={`scan-type-badge ${badgeClass}`}
            key={`${name}-${index}`}
          >
            <Terminal size={10} />

            {name}
          </span>
        );
      })}
    </div>
  );
}


function ScanOverviewCard({
  label,
  value,
  icon: Icon,
  variant = "",
}) {
  return (
    <div className="scans-overview-card">
      <div className={`scans-overview-icon scans-overview-icon-${variant}`}>
        <Icon size={18} />
      </div>

      <div className="scans-overview-info">
        <span className="scans-overview-label">
          {label}
        </span>

        <strong className="scans-overview-value">
          {value}
        </strong>
      </div>
    </div>
  );
}


function EmptyState({
  title,
  description,
  icon: Icon = FileSearch,
  action,
}) {
  return (
    <div className="scans-empty-state">
      <div className="scans-empty-icon">
        <Icon size={24} />
      </div>

      <h2 className="scans-empty-title">
        {title}
      </h2>

      <p className="scans-empty-description">
        {description}
      </p>

      {action}
    </div>
  );
}


function Scans({
  user,
  notifications = [],
  scans = [],
  loading = false,
  refreshing = false,
  error = null,
  onRefresh,
  onViewScan,
  onCancelScan,
  onLogout,
  onSearch,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [scannerFilter, setScannerFilter] = useState("all");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  const normalizedScans = useMemo(() => {
    if (!Array.isArray(scans)) {
      return [];
    }

    return scans
      .map(normalizeScan)
      .filter((scan) => scan.id !== null && scan.id !== undefined);
  }, [scans]);

  const overview = useMemo(() => {
    return {
      total: normalizedScans.length,

      running: normalizedScans.filter(
        (scan) => scan.status === "running"
      ).length,

      queued: normalizedScans.filter(
        (scan) => scan.status === "queued"
      ).length,

      completed: normalizedScans.filter(
        (scan) => scan.status === "completed"
      ).length,

      failed: normalizedScans.filter(
        (scan) => scan.status === "failed"
      ).length,
    };
  }, [normalizedScans]);

  const filteredScans = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return normalizedScans.filter((scan) => {
      const matchesSearch =
        !query ||
        scan.repository.toLowerCase().includes(query) ||
        scan.owner.toLowerCase().includes(query) ||
        scan.branch.toLowerCase().includes(query) ||
        String(scan.id).toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        scan.status === statusFilter;

      const matchesScanner =
        scannerFilter === "all" ||
        scan.scanners.some((scanner) => {
          const name = typeof scanner === "string"
            ? scanner
            : scanner.name ?? scanner.type ?? "";

          return String(name).toLowerCase() === scannerFilter;
        });

      return (
        matchesSearch &&
        matchesStatus &&
        matchesScanner
      );
    });
  }, [
    normalizedScans,
    searchQuery,
    statusFilter,
    scannerFilter,
  ]);

  const handleRefresh = () => {
    if (
      typeof onRefresh === "function" &&
      !refreshing
    ) {
      onRefresh();
    }
  };

  const handleCancelScan = async (scan) => {
    if (
      typeof onCancelScan !== "function" ||
      cancellingId !== null
    ) {
      return;
    }

    const confirmed = window.confirm(
      `Cancel scan ${scan.id} for ${scan.repository}?`
    );

    if (!confirmed) {
      return;
    }

    setCancellingId(scan.id);

    try {
      await onCancelScan(scan);
    } finally {
      setCancellingId(null);
    }
  };

  const handleViewScan = (scan) => {
    if (typeof onViewScan === "function") {
      onViewScan(scan);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setScannerFilter("all");
  };

  return (
    <>
      <style>{scansStyles}</style>

      <div className="scans-layout">
        <Sidebar
          user={user}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        <main className="scans-main">
          <Navbar
            user={user}
            notifications={notifications}
            onMobileMenuClick={() => setMobileOpen(true)}
            onLogout={onLogout}
            onSearch={onSearch}
          />

          <div className="scans-content">
            <header className="scans-header">
              <div className="scans-heading">
                <div className="scans-eyebrow">
                  <ShieldCheck size={14} />

                  Security Operations
                </div>

                <h1 className="scans-title">
                  Security Scans
                </h1>

                <p className="scans-subtitle">
                  Track repository security scans, monitor execution
                  progress and investigate scan results.
                </p>
              </div>

              <div className="scans-header-actions">
                <button
                  type="button"
                  className="scans-button"
                  onClick={handleRefresh}
                  disabled={!onRefresh || refreshing || loading}
                >
                  <RefreshCw
                    size={14}
                    className={refreshing ? "scans-spin" : ""}
                  />

                  Refresh
                </button>

                <Link
                  to="/projects"
                  className="scans-button scans-button-primary"
                >
                  <FileSearch size={15} />

                  New Scan
                </Link>
              </div>
            </header>

            {error && (
              <div className="scans-error" role="alert">
                <div className="scans-error-message">
                  <AlertCircle size={17} />

                  <span>
                    {typeof error === "string"
                      ? error
                      : "Unable to retrieve security scans."}
                  </span>
                </div>

                {onRefresh && (
                  <button
                    type="button"
                    className="scans-button"
                    onClick={handleRefresh}
                    disabled={refreshing}
                  >
                    Retry
                  </button>
                )}
              </div>
            )}

            <section
              className="scans-overview"
              aria-label="Scan statistics"
            >
              <ScanOverviewCard
                label="Total Scans"
                value={overview.total}
                icon={FileSearch}
              />

              <ScanOverviewCard
                label="Running"
                value={overview.running}
                icon={LoaderCircle}
                variant="running"
              />

              <ScanOverviewCard
                label="Queued"
                value={overview.queued}
                icon={Clock3}
                variant="queued"
              />

              <ScanOverviewCard
                label="Completed"
                value={overview.completed}
                icon={CheckCircle2}
                variant="completed"
              />

              <ScanOverviewCard
                label="Failed"
                value={overview.failed}
                icon={XCircle}
                variant="failed"
              />
            </section>

            <section className="scans-toolbar">
              <div className="scans-search-wrapper">
                <Search
                  size={16}
                  className="scans-search-icon"
                />

                <input
                  type="search"
                  className="scans-search"
                  placeholder="Search repository, branch or scan ID..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  aria-label="Search security scans"
                />
              </div>

              <div className="scans-filters">
                <select
                  className="scans-filter-select"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  aria-label="Filter scans by status"
                >
                  <option value="all">All statuses</option>
                  <option value="queued">Queued</option>
                  <option value="running">Running</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <select
                  className="scans-filter-select"
                  value={scannerFilter}
                  onChange={(event) => setScannerFilter(event.target.value)}
                  aria-label="Filter scans by scanner"
                >
                  <option value="all">All scanners</option>
                  <option value="semgrep">Semgrep</option>
                  <option value="trivy">Trivy</option>
                  <option value="gitleaks">Gitleaks</option>
                </select>
              </div>
            </section>

            {loading ? (
              <Loader
                size="large"
                text="Loading security scans..."
              />
            ) : filteredScans.length > 0 ? (
              <>
                <div className="scans-table-container">
                  <table className="scans-table">
                    <thead>
                      <tr>
                        <th>Repository</th>
                        <th>Scan ID</th>
                        <th>Scanners</th>
                        <th>Status</th>
                        <th>Progress</th>
                        <th>Findings</th>
                        <th>Started</th>
                        <th>Duration</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredScans.map((scan) => {
                        const canCancel = [
                          "queued",
                          "running",
                        ].includes(scan.status);

                        return (
                          <tr key={scan.id}>
                            <td>
                              <div className="scan-repository">
                                <div className="scan-repository-icon">
                                  <Code2 size={16} />
                                </div>

                                <div>
                                  <span
                                    className="scan-repository-name"
                                    title={scan.repository}
                                  >
                                    {scan.repository}
                                  </span>

                                  <span className="scan-repository-branch">
                                    <GitBranch size={11} />

                                    {scan.branch}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td>
                              <span title={String(scan.id)}>
                                #{String(scan.id).slice(0, 10)}
                              </span>
                            </td>

                            <td>
                              <ScannerBadges
                                scanners={scan.scanners}
                              />
                            </td>

                            <td>
                              <ScanStatus status={scan.status} />
                            </td>

                            <td>
                              <ScanProgress scan={scan} />
                            </td>

                            <td>
                              <span
                                className={
                                  scan.findingsCount > 0
                                    ? "scan-findings"
                                    : "scan-findings-empty"
                                }
                              >
                                {scan.findingsCount}
                              </span>
                            </td>

                            <td>
                              <div className="scan-date">
                                <span className="scan-date-primary">
                                  {formatDate(scan.startedAt)}
                                </span>

                                <span className="scan-date-secondary">
                                  {formatRelativeTime(scan.startedAt)}
                                </span>
                              </div>
                            </td>

                            <td>
                              {formatDuration(scan.duration)}
                            </td>

                            <td>
                              <div className="scan-row-actions">
                                <button
                                  type="button"
                                  className="scan-icon-button"
                                  title="View scan details"
                                  aria-label={`View scan ${scan.id}`}
                                  disabled={!onViewScan}
                                  onClick={() => handleViewScan(scan)}
                                >
                                  <ArrowRight size={14} />
                                </button>

                                {canCancel && (
                                  <button
                                    type="button"
                                    className="scan-icon-button scan-icon-button-danger"
                                    title="Cancel scan"
                                    aria-label={`Cancel scan ${scan.id}`}
                                    disabled={
                                      !onCancelScan ||
                                      cancellingId === scan.id
                                    }
                                    onClick={() => handleCancelScan(scan)}
                                  >
                                    {cancellingId === scan.id ? (
                                      <LoaderCircle
                                        size={14}
                                        className="scans-spin"
                                      />
                                    ) : (
                                      <Ban size={14} />
                                    )}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="scans-results-footer">
                  <span>
                    Showing {filteredScans.length} of {normalizedScans.length} scans
                  </span>

                  <span>
                    Scan progress is provided by the backend.
                  </span>
                </div>
              </>
            ) : (
              <div className="scans-table-container">
                <EmptyState
                  icon={
                    normalizedScans.length === 0
                      ? FileSearch
                      : Search
                  }
                  title={
                    normalizedScans.length === 0
                      ? "No security scans found"
                      : "No matching scans"
                  }
                  description={
                    normalizedScans.length === 0
                      ? "Connect a repository and initiate your first security scan to start monitoring vulnerabilities."
                      : "Try adjusting your search query or filters to find the scan you are looking for."
                  }
                  action={
                    normalizedScans.length === 0 ? (
                      <Link
                        to="/projects"
                        className="scans-button scans-button-primary"
                      >
                        <FileSearch size={14} />

                        Go to Projects
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="scans-button"
                        onClick={clearFilters}
                      >
                        <XCircle size={14} />

                        Clear filters
                      </button>
                    )
                  }
                />
              </div>
            )}

            <footer className="scans-footer">
              <div className="scans-footer-brand">
                <Shield size={13} />

                <span>
                  SecureAI Scan Management
                </span>
              </div>

              <span>
                Semgrep · Trivy · Gitleaks
              </span>
            </footer>
          </div>
        </main>
      </div>
    </>
  );
}


export default Scans;