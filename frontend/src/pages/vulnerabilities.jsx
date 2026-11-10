import React, { useMemo, useState } from "react";

import {
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Bug,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  Clock3,
  FileCode2,
  Filter,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  X,
  XCircle,
} from "lucide-react";

import { Link } from "react-router-dom";

import Sidebar from "../components/sidebar.jsx";
import Navbar from "../components/navbar.jsx";
import Loader from "../components/loader.jsx";
import VulnerabilityCard from "../components/vulnerability-card.jsx";


const vulnerabilitiesStyles = `
  .vuln-page-layout {
    display: flex;
    min-height: 100vh;
    min-height: 100dvh;
    background: var(--background, #080d18);
    color: var(--text-primary, #f1f5f9);
  }

  .vuln-page-main {
    flex: 1;
    min-width: 0;
    margin-left: 260px;
  }

  .vuln-page-content {
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
    padding: 30px;
  }

  .vuln-page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 26px;
  }

  .vuln-page-heading {
    min-width: 0;
  }

  .vuln-page-eyebrow {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    color: #60a5fa;
    font-size: 11px;
    font-weight: 750;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .vuln-page-title {
    margin: 0;
    color: var(--text-primary, #f1f5f9);
    font-size: clamp(25px, 3vw, 32px);
    font-weight: 750;
    letter-spacing: -0.04em;
    line-height: 1.2;
  }

  .vuln-page-description {
    max-width: 650px;
    margin: 10px 0 0;
    color: var(--text-secondary, #94a3b8);
    font-size: 13px;
    line-height: 1.7;
  }

  .vuln-header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .vuln-action-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 40px;
    padding: 0 14px;
    border: 1px solid var(--border, #263244);
    border-radius: 9px;
    background: var(--surface, #111827);
    color: var(--text-primary, #f1f5f9);
    font-family: inherit;
    font-size: 11px;
    font-weight: 650;
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .vuln-action-button:hover:not(:disabled) {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.08);
  }

  .vuln-action-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .vuln-action-primary {
    border-color: transparent;
    background: linear-gradient(135deg, #2563eb, #0891b2);
    color: #ffffff;
  }

  .vuln-action-primary:hover:not(:disabled) {
    border-color: transparent;
    background: linear-gradient(135deg, #1d4ed8, #0e7490);
  }

  .vuln-overview-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 13px;
    margin-bottom: 24px;
  }

  .vuln-overview-card {
    position: relative;
    min-width: 0;
    padding: 17px;
    overflow: hidden;
    border: 1px solid var(--border, #263244);
    border-radius: 12px;
    background: var(--surface, #111827);
    cursor: pointer;
    text-align: left;
    transition: border-color 0.2s ease, transform 0.2s ease;
  }

  .vuln-overview-card:hover {
    border-color: var(--card-accent, #3b82f6);
    transform: translateY(-2px);
  }

  .vuln-overview-card-active {
    border-color: var(--card-accent, #3b82f6);
    background: rgba(59, 130, 246, 0.055);
  }

  .vuln-overview-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 17px;
  }

  .vuln-overview-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: 1px solid var(--card-border);
    border-radius: 10px;
    background: var(--card-background);
    color: var(--card-accent);
  }

  .vuln-overview-indicator {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--card-accent);
  }

  .vuln-overview-label {
    display: block;
    margin-bottom: 7px;
    color: var(--text-muted, #718096);
    font-size: 10px;
    font-weight: 650;
  }

  .vuln-overview-value {
    display: block;
    color: var(--text-primary, #f1f5f9);
    font-size: 25px;
    font-weight: 750;
    font-variant-numeric: tabular-nums;
  }

  .vuln-overview-critical {
    --card-accent: #f87171;
    --card-border: rgba(239, 68, 68, 0.22);
    --card-background: rgba(239, 68, 68, 0.10);
  }

  .vuln-overview-high {
    --card-accent: #fb923c;
    --card-border: rgba(249, 115, 22, 0.22);
    --card-background: rgba(249, 115, 22, 0.10);
  }

  .vuln-overview-medium {
    --card-accent: #facc15;
    --card-border: rgba(234, 179, 8, 0.22);
    --card-background: rgba(234, 179, 8, 0.10);
  }

  .vuln-overview-low {
    --card-accent: #60a5fa;
    --card-border: rgba(59, 130, 246, 0.22);
    --card-background: rgba(59, 130, 246, 0.10);
  }

  .vuln-overview-info {
    --card-accent: #a78bfa;
    --card-border: rgba(139, 92, 246, 0.22);
    --card-background: rgba(139, 92, 246, 0.10);
  }

  .vuln-filter-panel {
    margin-bottom: 20px;
    padding: 17px;
    border: 1px solid var(--border, #263244);
    border-radius: 12px;
    background: var(--surface, #111827);
  }

  .vuln-filter-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 15px;
  }

  .vuln-filter-heading {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-primary, #f1f5f9);
    font-size: 12px;
    font-weight: 700;
  }

  .vuln-filter-clear {
    padding: 5px 8px;
    border: none;
    background: transparent;
    color: #60a5fa;
    font-family: inherit;
    font-size: 10px;
    font-weight: 650;
    cursor: pointer;
  }

  .vuln-filter-clear:hover {
    color: #93c5fd;
  }

  .vuln-filter-controls {
    display: grid;
    grid-template-columns: minmax(220px, 1.6fr) repeat(3, minmax(130px, 1fr));
    gap: 10px;
  }

  .vuln-search-wrapper {
    position: relative;
    min-width: 0;
  }

  .vuln-search-icon {
    position: absolute;
    top: 50%;
    left: 12px;
    color: var(--text-muted, #718096);
    pointer-events: none;
    transform: translateY(-50%);
  }

  .vuln-search-input {
    width: 100%;
    min-height: 41px;
    padding: 0 12px 0 37px;
    border: 1px solid var(--border, #263244);
    border-radius: 8px;
    outline: none;
    background: var(--background, #080d18);
    color: var(--text-primary, #f1f5f9);
    font-family: inherit;
    font-size: 11px;
  }

  .vuln-search-input::placeholder {
    color: var(--text-muted, #718096);
  }

  .vuln-search-input:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
  }

  .vuln-filter-select {
    width: 100%;
    min-height: 41px;
    padding: 0 10px;
    border: 1px solid var(--border, #263244);
    border-radius: 8px;
    outline: none;
    background: var(--background, #080d18);
    color: var(--text-secondary, #cbd5e1);
    font-family: inherit;
    font-size: 11px;
    cursor: pointer;
  }

  .vuln-filter-select:focus {
    border-color: #3b82f6;
  }

  .vuln-filter-select option {
    background: #111827;
    color: #f1f5f9;
  }

  .vuln-results-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    margin: 23px 0 15px;
  }

  .vuln-results-title {
    margin: 0;
    color: var(--text-primary, #f1f5f9);
    font-size: 15px;
    font-weight: 750;
  }

  .vuln-results-count {
    margin-top: 5px;
    color: var(--text-muted, #718096);
    font-size: 10px;
  }

  .vuln-sort-wrapper {
    display: flex;
    align-items: center;
    gap: 7px;
    color: var(--text-muted, #718096);
    font-size: 10px;
  }

  .vuln-sort-select {
    padding: 7px 9px;
    border: 1px solid var(--border, #263244);
    border-radius: 7px;
    outline: none;
    background: var(--surface, #111827);
    color: var(--text-secondary, #cbd5e1);
    font-family: inherit;
    font-size: 10px;
  }

  .vuln-list {
    display: flex;
    flex-direction: column;
    gap: 13px;
  }

  .vuln-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    padding: 35px 20px;
    border: 1px solid var(--border, #263244);
    border-radius: 12px;
    background: var(--surface, #111827);
    text-align: center;
  }

  .vuln-empty-icon {
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

  .vuln-empty-title {
    margin: 0;
    color: var(--text-primary, #f1f5f9);
    font-size: 15px;
    font-weight: 700;
  }

  .vuln-empty-description {
    max-width: 390px;
    margin: 9px 0 18px;
    color: var(--text-muted, #718096);
    font-size: 11px;
    line-height: 1.7;
  }

  .vuln-error {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 18px;
    padding: 13px 15px;
    border: 1px solid rgba(239, 68, 68, 0.25);
    border-radius: 9px;
    background: rgba(239, 68, 68, 0.07);
    color: #fca5a5;
    font-size: 11px;
  }

  .vuln-error-message {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .vuln-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 28px;
    padding-top: 18px;
    border-top: 1px solid var(--border, #263244);
    color: var(--text-muted, #718096);
    font-size: 10px;
  }

  .vuln-footer-brand {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .vuln-spin {
    animation: vuln-rotate 1s linear infinite;
  }

  @keyframes vuln-rotate {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 1250px) {
    .vuln-overview-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .vuln-filter-controls {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 900px) {
    .vuln-page-main {
      margin-left: 0;
    }

    .vuln-page-content {
      padding: 24px;
    }
  }

  @media (max-width: 640px) {
    .vuln-page-content {
      padding: 18px 14px;
    }

    .vuln-page-header {
      flex-direction: column;
      align-items: stretch;
    }

    .vuln-header-actions {
      width: 100%;
    }

    .vuln-header-actions > * {
      flex: 1;
    }

    .vuln-overview-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 9px;
    }

    .vuln-overview-card {
      padding: 13px;
    }

    .vuln-overview-value {
      font-size: 22px;
    }

    .vuln-filter-controls {
      grid-template-columns: 1fr;
    }

    .vuln-results-header {
      align-items: flex-start;
      flex-direction: column;
    }

    .vuln-error {
      align-items: flex-start;
      flex-direction: column;
    }

    .vuln-footer {
      align-items: flex-start;
      flex-direction: column;
    }
  }

  @media (max-width: 380px) {
    .vuln-overview-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .vuln-page-layout *,
    .vuln-page-layout *::before,
    .vuln-page-layout *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`;


const SEVERITIES = [
  {
    key: "critical",
    label: "Critical",
    icon: ShieldAlert,
  },
  {
    key: "high",
    label: "High",
    icon: AlertTriangle,
  },
  {
    key: "medium",
    label: "Medium",
    icon: AlertCircle,
  },
  {
    key: "low",
    label: "Low",
    icon: ShieldCheck,
  },
  {
    key: "info",
    label: "Informational",
    icon: CircleDot,
  },
];


const VALID_STATUSES = [
  "open",
  "in_progress",
  "fixed",
  "accepted",
  "false_positive",
];


function normalizeVulnerability(vulnerability) {
  const severity = String(
    vulnerability.severity ?? "unknown"
  ).toLowerCase();

  const rawStatus = String(
    vulnerability.status ?? "open"
  )
    .toLowerCase()
    .replaceAll("-", "_")
    .replaceAll(" ", "_");

  const status = VALID_STATUSES.includes(rawStatus)
    ? rawStatus
    : "open";

  const cvssValue = Number(
    vulnerability.cvss_score ??
    vulnerability.cvss ??
    0
  );

  return {
    ...vulnerability,

    id:
      vulnerability.id ??
      vulnerability.vulnerability_id,

    title:
      vulnerability.title ??
      vulnerability.name ??
      vulnerability.rule_name ??
      "Untitled vulnerability",

    severity,

    status,

    cvssScore: Number.isFinite(cvssValue)
      ? cvssValue
      : null,

    cve:
      vulnerability.cve ??
      vulnerability.cve_id ??
      null,

    cwe:
      vulnerability.cwe ??
      vulnerability.cwe_id ??
      null,

    repository:
      vulnerability.repository_name ??
      vulnerability.repository ??
      vulnerability.project_name ??
      "Unknown repository",

    filePath:
      vulnerability.file_path ??
      vulnerability.file ??
      vulnerability.location?.file ??
      null,

    scanner:
      vulnerability.scanner ??
      vulnerability.source ??
      vulnerability.tool ??
      "Unknown scanner",

    description:
      vulnerability.description ??
      vulnerability.message ??
      "",

    createdAt:
      vulnerability.created_at ??
      vulnerability.detected_at ??
      null,
  };
}


function normalizeSeverity(severity) {
  const value = String(severity ?? "")
    .toLowerCase()
    .trim();

  if (value === "informational" || value === "information") {
    return "info";
  }

  if (value === "moderate") {
    return "medium";
  }

  return value;
}


function formatDate(value) {
  if (!value) {
    return "Date unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}


function formatStatus(status) {
  const labels = {
    open: "Open",
    in_progress: "In Progress",
    fixed: "Fixed",
    accepted: "Accepted",
    false_positive: "False Positive",
  };

  return labels[status] ?? "Open";
}


function SeverityOverviewCard({
  severity,
  count,
  active,
  onClick,
}) {
  const Icon = severity.icon;

  return (
    <button
      type="button"
      className={[
        "vuln-overview-card",
        `vuln-overview-${severity.key}`,
        active ? "vuln-overview-card-active" : "",
      ].filter(Boolean).join(" ")}
      onClick={onClick}
      aria-pressed={active}
      aria-label={`Filter by ${severity.label} severity`}
    >
      <div className="vuln-overview-top">
        <div className="vuln-overview-icon">
          <Icon size={17} />
        </div>

        <span className="vuln-overview-indicator" />
      </div>

      <span className="vuln-overview-label">
        {severity.label}
      </span>

      <strong className="vuln-overview-value">
        {count}
      </strong>
    </button>
  );
}


function EmptyState({
  title,
  description,
  icon: Icon = Bug,
  action,
}) {
  return (
    <div className="vuln-empty-state">
      <div className="vuln-empty-icon">
        <Icon size={24} />
      </div>

      <h2 className="vuln-empty-title">
        {title}
      </h2>

      <p className="vuln-empty-description">
        {description}
      </p>

      {action}
    </div>
  );
}


function Vulnerabilities({
  user,
  notifications = [],
  vulnerabilities = [],
  loading = false,
  refreshing = false,
  error = null,
  onRefresh,
  onView,
  onExplain,
  onRemediate,
  onDismiss,
  onLogout,
  onSearch,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [scannerFilter, setScannerFilter] = useState("all");
  const [sortBy, setSortBy] = useState("severity");
  const [mobileOpen, setMobileOpen] = useState(false);

  const normalizedVulnerabilities = useMemo(() => {
    if (!Array.isArray(vulnerabilities)) {
      return [];
    }

    return vulnerabilities
      .map(normalizeVulnerability)
      .filter(
        (vulnerability) =>
          vulnerability.id !== null &&
          vulnerability.id !== undefined
      );
  }, [vulnerabilities]);

  const severityCounts = useMemo(() => {
    const counts = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
    };

    normalizedVulnerabilities.forEach((vulnerability) => {
      const severity = normalizeSeverity(
        vulnerability.severity
      );

      if (Object.hasOwn(counts, severity)) {
        counts[severity] += 1;
      }
    });

    return counts;
  }, [normalizedVulnerabilities]);

  const filteredVulnerabilities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = normalizedVulnerabilities.filter(
      (vulnerability) => {
        const searchableValues = [
          vulnerability.title,
          vulnerability.description,
          vulnerability.cve,
          vulnerability.cwe,
          vulnerability.repository,
          vulnerability.filePath,
          vulnerability.scanner,
          vulnerability.id,
        ];

        const matchesSearch =
          !query ||
          searchableValues.some((value) =>
            String(value ?? "")
              .toLowerCase()
              .includes(query)
          );

        const matchesSeverity =
          severityFilter === "all" ||
          normalizeSeverity(vulnerability.severity) === severityFilter;

        const matchesStatus =
          statusFilter === "all" ||
          vulnerability.status === statusFilter;

        const matchesScanner =
          scannerFilter === "all" ||
          String(vulnerability.scanner)
            .toLowerCase() === scannerFilter;

        return (
          matchesSearch &&
          matchesSeverity &&
          matchesStatus &&
          matchesScanner
        );
      }
    );

    const severityOrder = {
      critical: 5,
      high: 4,
      medium: 3,
      low: 2,
      info: 1,
    };

    return [...filtered].sort((first, second) => {
      if (sortBy === "severity") {
        return (
          (severityOrder[normalizeSeverity(second.severity)] ?? 0) -
          (severityOrder[normalizeSeverity(first.severity)] ?? 0)
        );
      }

      if (sortBy === "cvss") {
        return (
          (second.cvssScore ?? -1) -
          (first.cvssScore ?? -1)
        );
      }

      if (sortBy === "oldest") {
        return (
          new Date(first.createdAt ?? 0).getTime() -
          new Date(second.createdAt ?? 0).getTime()
        );
      }

      return (
        new Date(second.createdAt ?? 0).getTime() -
        new Date(first.createdAt ?? 0).getTime()
      );
    });
  }, [
    normalizedVulnerabilities,
    searchQuery,
    severityFilter,
    statusFilter,
    scannerFilter,
    sortBy,
  ]);

  const clearFilters = () => {
    setSearchQuery("");
    setSeverityFilter("all");
    setStatusFilter("all");
    setScannerFilter("all");
    setSortBy("severity");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    severityFilter !== "all" ||
    statusFilter !== "all" ||
    scannerFilter !== "all";

  const handleRefresh = () => {
    if (
      typeof onRefresh === "function" &&
      !refreshing
    ) {
      onRefresh();
    }
  };

  const handleDismiss = (vulnerability) => {
    if (typeof onDismiss === "function") {
      onDismiss(vulnerability);
    }
  };

  return (
    <>
      <style>{vulnerabilitiesStyles}</style>

      <div className="vuln-page-layout">
        <Sidebar
          user={user}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        <main className="vuln-page-main">
          <Navbar
            user={user}
            notifications={notifications}
            onMobileMenuClick={() => setMobileOpen(true)}
            onLogout={onLogout}
            onSearch={onSearch}
          />

          <div className="vuln-page-content">
            <header className="vuln-page-header">
              <div className="vuln-page-heading">
                <div className="vuln-page-eyebrow">
                  <ShieldAlert size={14} />

                  Application Security
                </div>

                <h1 className="vuln-page-title">
                  Vulnerability Management
                </h1>

                <p className="vuln-page-description">
                  Investigate security findings, prioritize risks and
                  manage remediation across your connected repositories.
                </p>
              </div>

              <div className="vuln-header-actions">
                <button
                  type="button"
                  className="vuln-action-button"
                  onClick={handleRefresh}
                  disabled={!onRefresh || refreshing || loading}
                >
                  <RefreshCw
                    size={14}
                    className={refreshing ? "vuln-spin" : ""}
                  />

                  Refresh
                </button>

                <Link
                  to="/scans"
                  className="vuln-action-button vuln-action-primary"
                >
                  <Bug size={14} />

                  View Scans
                </Link>
              </div>
            </header>

            {error && (
              <div className="vuln-error" role="alert">
                <div className="vuln-error-message">
                  <AlertCircle size={17} />

                  <span>
                    {typeof error === "string"
                      ? error
                      : "Unable to retrieve vulnerability data."}
                  </span>
                </div>

                {onRefresh && (
                  <button
                    type="button"
                    className="vuln-action-button"
                    onClick={handleRefresh}
                    disabled={refreshing}
                  >
                    Retry
                  </button>
                )}
              </div>
            )}

            <section
              className="vuln-overview-grid"
              aria-label="Vulnerability severity summary"
            >
              {SEVERITIES.map((severity) => (
                <SeverityOverviewCard
                  key={severity.key}
                  severity={severity}
                  count={severityCounts[severity.key]}
                  active={severityFilter === severity.key}
                  onClick={() => {
                    setSeverityFilter((current) =>
                      current === severity.key
                        ? "all"
                        : severity.key
                    );
                  }}
                />
              ))}
            </section>

            <section className="vuln-filter-panel">
              <div className="vuln-filter-top">
                <div className="vuln-filter-heading">
                  <Filter size={15} />

                  Filters
                </div>

                {hasActiveFilters && (
                  <button
                    type="button"
                    className="vuln-filter-clear"
                    onClick={clearFilters}
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              <div className="vuln-filter-controls">
                <div className="vuln-search-wrapper">
                  <Search
                    size={15}
                    className="vuln-search-icon"
                  />

                  <input
                    type="search"
                    className="vuln-search-input"
                    placeholder="Search title, CVE, CWE, repository..."
                    value={searchQuery}
                    onChange={(event) => {
                      setSearchQuery(event.target.value);
                    }}
                    aria-label="Search vulnerabilities"
                  />
                </div>

                <select
                  className="vuln-filter-select"
                  value={severityFilter}
                  onChange={(event) => {
                    setSeverityFilter(event.target.value);
                  }}
                  aria-label="Filter by severity"
                >
                  <option value="all">All severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                  <option value="info">Informational</option>
                </select>

                <select
                  className="vuln-filter-select"
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value);
                  }}
                  aria-label="Filter by status"
                >
                  <option value="all">All statuses</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="fixed">Fixed</option>
                  <option value="accepted">Accepted</option>
                  <option value="false_positive">False Positive</option>
                </select>

                <select
                  className="vuln-filter-select"
                  value={scannerFilter}
                  onChange={(event) => {
                    setScannerFilter(event.target.value);
                  }}
                  aria-label="Filter by scanner"
                >
                  <option value="all">All scanners</option>
                  <option value="semgrep">Semgrep</option>
                  <option value="trivy">Trivy</option>
                  <option value="gitleaks">Gitleaks</option>
                </select>
              </div>
            </section>

            <section>
              <div className="vuln-results-header">
                <div>
                  <h2 className="vuln-results-title">
                    Detected Vulnerabilities
                  </h2>

                  <p className="vuln-results-count">
                    Showing {filteredVulnerabilities.length} of{" "}
                    {normalizedVulnerabilities.length} findings
                  </p>
                </div>

                <label className="vuln-sort-wrapper">
                  Sort by

                  <select
                    className="vuln-sort-select"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    aria-label="Sort vulnerabilities"
                  >
                    <option value="severity">Severity</option>
                    <option value="cvss">CVSS score</option>
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                  </select>
                </label>
              </div>

              {loading ? (
                <Loader
                  size="large"
                  text="Loading vulnerabilities..."
                />
              ) : filteredVulnerabilities.length > 0 ? (
                <div className="vuln-list">
                  {filteredVulnerabilities.map((vulnerability) => (
                    <VulnerabilityCard
                      key={vulnerability.id}
                      vulnerability={vulnerability}
                      onView={
                        onView
                          ? () => onView(vulnerability)
                          : undefined
                      }
                      onExplain={
                        onExplain
                          ? () => onExplain(vulnerability)
                          : undefined
                      }
                      onRemediate={
                        onRemediate
                          ? () => onRemediate(vulnerability)
                          : undefined
                      }
                      onDismiss={
                        onDismiss
                          ? () => handleDismiss(vulnerability)
                          : undefined
                      }
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={
                    normalizedVulnerabilities.length === 0
                      ? ShieldCheck
                      : Search
                  }
                  title={
                    normalizedVulnerabilities.length === 0
                      ? "No vulnerabilities available"
                      : "No matching vulnerabilities"
                  }
                  description={
                    normalizedVulnerabilities.length === 0
                      ? "No vulnerability records have been returned. Connect a repository and run a security scan to populate this section."
                      : "No findings match your current filters. Try changing your search or resetting the filters."
                  }
                  action={
                    normalizedVulnerabilities.length === 0 ? (
                      <Link
                        to="/scans"
                        className="vuln-action-button vuln-action-primary"
                      >
                        <Bug size={14} />

                        Go to Security Scans
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="vuln-action-button"
                        onClick={clearFilters}
                      >
                        <X size={14} />

                        Clear filters
                      </button>
                    )
                  }
                />
              )}
            </section>

            <footer className="vuln-footer">
              <div className="vuln-footer-brand">
                <Shield size={13} />

                SecureAI Vulnerability Management
              </div>

              <span>
                Findings are based on scanner output.
              </span>
            </footer>
          </div>
        </main>
      </div>
    </>
  );
}


export default Vulnerabilities;