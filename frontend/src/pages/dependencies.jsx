import React, { useMemo, useState } from "react";

import {
  Package,
  Search,
  Filter,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ExternalLink,
  ArrowUpRight,
  ArrowUpDown,
  GitBranch,
  Boxes,
  Code2,
  Info,
  AlertCircle,
  ChevronDown,
  Database,
  Activity,
  Shield,
} from "lucide-react";

import { Link } from "react-router-dom";

import Sidebar from "../components/sidebar.jsx";
import Navbar from "../components/navbar.jsx";
import Loader from "../components/loader.jsx";


const dependenciesStyles = `
  .dependencies-layout {
    display: flex;
    min-height: 100vh;
    min-height: 100dvh;
    background: var(--background, #080d18);
    color: var(--text-primary, #f1f5f9);
  }

  .dependencies-main {
    flex: 1;
    min-width: 0;
    margin-left: 260px;
  }

  .dependencies-content {
    width: 100%;
    max-width: 1550px;
    margin: 0 auto;
    padding: 30px;
  }

  .dependencies-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 25px;
  }

  .dependencies-eyebrow {
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

  .dependencies-title {
    margin: 0;
    color: var(--text-primary, #f1f5f9);
    font-size: clamp(25px, 3vw, 32px);
    font-weight: 750;
    letter-spacing: -0.04em;
  }

  .dependencies-description {
    max-width: 680px;
    margin: 10px 0 0;
    color: var(--text-secondary, #94a3b8);
    font-size: 13px;
    line-height: 1.7;
  }

  .dependencies-header-actions {
    display: flex;
    align-items: center;
    gap: 9px;
    flex-shrink: 0;
  }

  .dependencies-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 39px;
    padding: 0 13px;
    border: 1px solid var(--border, #263244);
    border-radius: 8px;
    background: var(--surface, #111827);
    color: var(--text-primary, #f1f5f9);
    font-family: inherit;
    font-size: 10px;
    font-weight: 700;
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .dependencies-button:hover:not(:disabled) {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.08);
  }

  .dependencies-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .dependencies-button-primary {
    border-color: transparent;
    background: linear-gradient(135deg, #2563eb, #0891b2);
    color: #ffffff;
  }

  .dependencies-button-primary:hover:not(:disabled) {
    border-color: transparent;
    background: linear-gradient(135deg, #1d4ed8, #0e7490);
  }

  .dependencies-overview {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 13px;
    margin-bottom: 22px;
  }

  .dependencies-stat {
    display: flex;
    align-items: center;
    gap: 13px;
    min-width: 0;
    padding: 17px;
    border: 1px solid var(--border, #263244);
    border-radius: 11px;
    background: var(--surface, #111827);
  }

  .dependencies-stat-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 39px;
    height: 39px;
    flex-shrink: 0;
    border: 1px solid var(--stat-border);
    border-radius: 10px;
    background: var(--stat-background);
    color: var(--stat-color);
  }

  .dependencies-stat-label {
    display: block;
    margin-bottom: 5px;
    color: var(--text-muted, #718096);
    font-size: 9px;
    font-weight: 650;
  }

  .dependencies-stat-value {
    display: block;
    color: var(--text-primary, #f1f5f9);
    font-size: 23px;
    font-weight: 750;
    font-variant-numeric: tabular-nums;
  }

  .dependencies-stat-total {
    --stat-color: #60a5fa;
    --stat-border: rgba(59, 130, 246, 0.2);
    --stat-background: rgba(59, 130, 246, 0.08);
  }

  .dependencies-stat-vulnerable {
    --stat-color: #f87171;
    --stat-border: rgba(239, 68, 68, 0.2);
    --stat-background: rgba(239, 68, 68, 0.08);
  }

  .dependencies-stat-outdated {
    --stat-color: #facc15;
    --stat-border: rgba(234, 179, 8, 0.2);
    --stat-background: rgba(234, 179, 8, 0.08);
  }

  .dependencies-stat-safe {
    --stat-color: #4ade80;
    --stat-border: rgba(34, 197, 94, 0.2);
    --stat-background: rgba(34, 197, 94, 0.08);
  }

  .dependencies-insight {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 21px;
    padding: 15px;
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-radius: 10px;
    background: rgba(59, 130, 246, 0.06);
  }

  .dependencies-insight-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    border-radius: 8px;
    background: rgba(59, 130, 246, 0.12);
    color: #60a5fa;
  }

  .dependencies-insight-title {
    margin: 0;
    color: var(--text-primary, #f1f5f9);
    font-size: 11px;
    font-weight: 750;
  }

  .dependencies-insight-text {
    margin: 5px 0 0;
    color: var(--text-secondary, #94a3b8);
    font-size: 10px;
    line-height: 1.7;
  }

  .dependencies-filter-panel {
    margin-bottom: 20px;
    padding: 17px;
    border: 1px solid var(--border, #263244);
    border-radius: 11px;
    background: var(--surface, #111827);
  }

  .dependencies-filter-heading {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
    color: var(--text-primary, #f1f5f9);
    font-size: 12px;
    font-weight: 700;
  }

  .dependencies-filter-grid {
    display: grid;
    grid-template-columns: minmax(220px, 1.5fr) repeat(3, minmax(130px, 1fr));
    gap: 10px;
  }

  .dependencies-search {
    position: relative;
    min-width: 0;
  }

  .dependencies-search svg {
    position: absolute;
    top: 50%;
    left: 12px;
    color: var(--text-muted, #718096);
    transform: translateY(-50%);
    pointer-events: none;
  }

  .dependencies-input,
  .dependencies-select {
    width: 100%;
    min-height: 41px;
    padding: 0 11px;
    border: 1px solid var(--border, #263244);
    border-radius: 8px;
    outline: none;
    background: var(--background, #080d18);
    color: var(--text-primary, #f1f5f9);
    font-family: inherit;
    font-size: 10px;
  }

  .dependencies-search .dependencies-input {
    padding-left: 37px;
  }

  .dependencies-input:focus,
  .dependencies-select:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
  }

  .dependencies-select {
    cursor: pointer;
  }

  .dependencies-select option {
    background: #111827;
    color: #f1f5f9;
  }

  .dependencies-filter-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 12px;
  }

  .dependencies-checkbox-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--text-secondary, #94a3b8);
    font-size: 10px;
    cursor: pointer;
  }

  .dependencies-checkbox-label input {
    width: 14px;
    height: 14px;
    accent-color: #3b82f6;
    cursor: pointer;
  }

  .dependencies-clear {
    padding: 0;
    border: none;
    background: transparent;
    color: #60a5fa;
    font-family: inherit;
    font-size: 10px;
    font-weight: 650;
    cursor: pointer;
  }

  .dependencies-clear:hover {
    color: #93c5fd;
  }

  .dependencies-results-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin: 23px 0 15px;
  }

  .dependencies-results-title {
    margin: 0;
    color: var(--text-primary, #f1f5f9);
    font-size: 15px;
    font-weight: 750;
  }

  .dependencies-results-count {
    margin-top: 5px;
    color: var(--text-muted, #718096);
    font-size: 10px;
  }

  .dependencies-table-wrapper {
    overflow-x: auto;
    border: 1px solid var(--border, #263244);
    border-radius: 11px;
    background: var(--surface, #111827);
  }

  .dependencies-table {
    width: 100%;
    min-width: 930px;
    border-collapse: collapse;
    text-align: left;
  }

  .dependencies-table th {
    padding: 13px 14px;
    border-bottom: 1px solid var(--border, #263244);
    background: rgba(255, 255, 255, 0.015);
    color: var(--text-muted, #718096);
    font-size: 9px;
    font-weight: 750;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .dependencies-table td {
    padding: 14px;
    border-bottom: 1px solid var(--border, #263244);
    color: var(--text-secondary, #cbd5e1);
    font-size: 10px;
    vertical-align: middle;
  }

  .dependencies-table tbody tr:last-child td {
    border-bottom: none;
  }

  .dependencies-table tbody tr {
    transition: background 0.15s ease;
  }

  .dependencies-table tbody tr:hover {
    background: rgba(59, 130, 246, 0.035);
  }

  .dependencies-package {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 180px;
  }

  .dependencies-package-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 33px;
    height: 33px;
    flex-shrink: 0;
    border: 1px solid var(--border, #263244);
    border-radius: 8px;
    background: var(--background, #080d18);
    color: #60a5fa;
  }

  .dependencies-package-name {
    display: block;
    max-width: 220px;
    overflow: hidden;
    color: var(--text-primary, #f1f5f9);
    font-size: 10px;
    font-weight: 750;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dependencies-package-description {
    display: block;
    max-width: 220px;
    margin-top: 4px;
    overflow: hidden;
    color: var(--text-muted, #718096);
    font-size: 9px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dependencies-version {
    color: var(--text-primary, #e2e8f0);
    font-family: monospace;
    font-size: 10px;
  }

  .dependencies-version-outdated {
    color: #facc15;
  }

  .dependencies-ecosystem {
    display: inline-flex;
    align-items: center;
    padding: 5px 7px;
    border: 1px solid var(--border, #263244);
    border-radius: 5px;
    background: var(--background, #080d18);
    color: var(--text-secondary, #cbd5e1);
    font-size: 9px;
    font-weight: 650;
  }

  .dependencies-type {
    color: var(--text-secondary, #cbd5e1);
    font-size: 9px;
  }

  .dependencies-severity {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 7px;
    border: 1px solid transparent;
    border-radius: 5px;
    font-size: 9px;
    font-weight: 750;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .dependencies-severity-critical {
    border-color: rgba(239, 68, 68, 0.25);
    background: rgba(239, 68, 68, 0.09);
    color: #f87171;
  }

  .dependencies-severity-high {
    border-color: rgba(249, 115, 22, 0.25);
    background: rgba(249, 115, 22, 0.09);
    color: #fb923c;
  }

  .dependencies-severity-medium {
    border-color: rgba(234, 179, 8, 0.25);
    background: rgba(234, 179, 8, 0.09);
    color: #facc15;
  }

  .dependencies-severity-low {
    border-color: rgba(59, 130, 246, 0.25);
    background: rgba(59, 130, 246, 0.09);
    color: #60a5fa;
  }

  .dependencies-severity-none {
    border-color: rgba(34, 197, 94, 0.2);
    background: rgba(34, 197, 94, 0.08);
    color: #4ade80;
  }

  .dependencies-cve {
    display: block;
    max-width: 150px;
    overflow: hidden;
    color: #60a5fa;
    font-family: monospace;
    font-size: 9px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dependencies-cve-empty {
    color: var(--text-muted, #718096);
  }

  .dependencies-license {
    display: inline-block;
    max-width: 120px;
    overflow: hidden;
    color: var(--text-secondary, #cbd5e1);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dependencies-upgrade {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: #4ade80;
    font-family: monospace;
    font-size: 9px;
    white-space: nowrap;
  }

  .dependencies-safe-text {
    color: #4ade80;
    font-size: 9px;
    font-weight: 650;
  }

  .dependencies-table-empty {
    padding: 35px 20px !important;
    color: var(--text-muted, #718096) !important;
    text-align: center;
  }

  .dependencies-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 280px;
    padding: 30px 20px;
    border: 1px dashed var(--border, #334155);
    border-radius: 11px;
    background: var(--surface, #111827);
    text-align: center;
  }

  .dependencies-empty-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 55px;
    height: 55px;
    margin-bottom: 15px;
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-radius: 16px;
    background: rgba(59, 130, 246, 0.09);
    color: #60a5fa;
  }

  .dependencies-empty-title {
    margin: 0;
    color: var(--text-primary, #f1f5f9);
    font-size: 14px;
    font-weight: 750;
  }

  .dependencies-empty-text {
    max-width: 390px;
    margin: 8px 0 16px;
    color: var(--text-muted, #718096);
    font-size: 10px;
    line-height: 1.8;
  }

  .dependencies-error {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 16px;
    padding: 12px;
    border: 1px solid rgba(239, 68, 68, 0.25);
    border-radius: 8px;
    background: rgba(239, 68, 68, 0.07);
    color: #fca5a5;
    font-size: 10px;
  }

  .dependencies-error-message {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .dependencies-footer {
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

  .dependencies-footer-brand {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .dependencies-spin {
    animation: dependencies-rotate 1s linear infinite;
  }

  @keyframes dependencies-rotate {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 1200px) {
    .dependencies-filter-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 1100px) {
    .dependencies-overview {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 900px) {
    .dependencies-main {
      margin-left: 0;
    }

    .dependencies-content {
      padding: 24px;
    }
  }

  @media (max-width: 600px) {
    .dependencies-content {
      padding: 18px 14px;
    }

    .dependencies-header {
      flex-direction: column;
    }

    .dependencies-header-actions {
      width: 100%;
    }

    .dependencies-header-actions > * {
      flex: 1;
    }

    .dependencies-overview {
      gap: 9px;
    }

    .dependencies-stat {
      padding: 12px;
    }

    .dependencies-filter-grid {
      grid-template-columns: 1fr;
    }

    .dependencies-filter-bottom {
      align-items: flex-start;
      flex-direction: column;
    }

    .dependencies-footer {
      align-items: flex-start;
      flex-direction: column;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .dependencies-layout *,
    .dependencies-layout *::before,
    .dependencies-layout *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`;


const SEVERITY_LEVELS = [
  "critical",
  "high",
  "medium",
  "low",
];


function normalizeDependency(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  const rawSeverity = String(
    item.severity ??
    item.vulnerability_severity ??
    "none"
  ).toLowerCase();

  const severity = SEVERITY_LEVELS.includes(rawSeverity)
    ? rawSeverity
    : "none";

  const vulnerabilities = Array.isArray(item.vulnerabilities)
    ? item.vulnerabilities
    : [];

  const primaryVulnerability = vulnerabilities[0] ?? {};

  const cve =
    item.cve ??
    item.cve_id ??
    primaryVulnerability.cve ??
    primaryVulnerability.id ??
    null;

  const version =
    item.installed_version ??
    item.current_version ??
    item.version ??
    "Unknown";

  const latestVersion =
    item.latest_version ??
    item.fixed_version ??
    item.recommended_version ??
    null;

  const dependencyType = String(
    item.dependency_type ??
    item.type ??
    "direct"
  ).toLowerCase();

  const isOutdated =
    item.is_outdated === true ||
    item.outdated === true ||
    Boolean(latestVersion && latestVersion !== version);

  const vulnerabilityCount = Math.max(
    vulnerabilities.length,
    Number(item.vulnerability_count ?? item.vulnerabilities_count ?? 0) || 0
  );

  return {
    ...item,

    id:
      item.id ??
      item.dependency_id ??
      item.purl ??
      `${item.name ?? "package"}-${version}`,

    name:
      item.name ??
      item.package_name ??
      "Unknown package",

    description:
      item.description ?? "",

    version,

    latestVersion,

    ecosystem: String(
      item.ecosystem ??
      item.package_manager ??
      item.package_type ??
      "Unknown"
    ).toLowerCase(),

    dependencyType:
      dependencyType === "transitive"
        ? "transitive"
        : "direct",

    severity,

    cve,

    cvss: Number(
      item.cvss_score ??
      item.cvss ??
      primaryVulnerability.cvss ??
      0
    ) || 0,

    vulnerabilityCount,

    isOutdated,

    license:
      item.license ??
      item.licenses?.[0]?.name ??
      "Unknown",

    repository:
      item.repository_name ??
      item.repository ??
      "Unknown repository",

    advisoryUrl:
      item.advisory_url ??
      primaryVulnerability.url ??
      null,
  };
}


function OverviewStat({
  label,
  value,
  icon: Icon,
  variant,
}) {
  return (
    <div className="dependencies-stat">
      <div className={`dependencies-stat-icon dependencies-stat-${variant}`}>
        <Icon size={18} />
      </div>

      <div>
        <span className="dependencies-stat-label">
          {label}
        </span>

        <strong className="dependencies-stat-value">
          {value}
        </strong>
      </div>
    </div>
  );
}


function SeverityBadge({ severity }) {
  const label = severity === "none"
    ? "No known issues"
    : severity;

  const Icon = severity === "none"
    ? CheckCircle2
    : AlertTriangle;

  return (
    <span
      className={`dependencies-severity dependencies-severity-${severity}`}
    >
      <Icon size={11} />

      {label}
    </span>
  );
}


function DependencyRow({ dependency }) {
  return (
    <tr>
      <td>
        <div className="dependencies-package">
          <div className="dependencies-package-icon">
            <Package size={16} />
          </div>

          <div>
            <span className="dependencies-package-name">
              {dependency.name}
            </span>

            {dependency.description && (
              <span className="dependencies-package-description">
                {dependency.description}
              </span>
            )}
          </div>
        </div>
      </td>

      <td>
        <span
          className={
            dependency.isOutdated
              ? "dependencies-version dependencies-version-outdated"
              : "dependencies-version"
          }
        >
          {dependency.version}
        </span>
      </td>

      <td>
        <span className="dependencies-ecosystem">
          {dependency.ecosystem}
        </span>
      </td>

      <td>
        <span className="dependencies-type">
          {dependency.dependencyType}
        </span>
      </td>

      <td>
        <SeverityBadge severity={dependency.severity} />
      </td>

      <td>
        {dependency.cve ? (
          dependency.advisoryUrl ? (
            <a
              href={dependency.advisoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="dependencies-cve"
              title={`View advisory ${dependency.cve}`}
            >
              {dependency.cve}
              <ExternalLink
                size={10}
                style={{ marginLeft: 4, verticalAlign: "middle" }}
              />
            </a>
          ) : (
            <span className="dependencies-cve">
              {dependency.cve}
            </span>
          )
        ) : (
          <span className="dependencies-cve dependencies-cve-empty">
            —
          </span>
        )}

        {dependency.cvss > 0 && (
          <span className="dependencies-package-description">
            CVSS {dependency.cvss.toFixed(1)}
          </span>
        )}
      </td>

      <td>
        {dependency.isOutdated ? (
          dependency.latestVersion ? (
            <span className="dependencies-upgrade">
              <ArrowUpRight size={11} />

              {dependency.latestVersion}
            </span>
          ) : (
            <span className="dependencies-version-outdated">
              Update available
            </span>
          )
        ) : (
          <span className="dependencies-safe-text">
            Up to date
          </span>
        )}
      </td>

      <td>
        <span
          className="dependencies-license"
          title={dependency.license}
        >
          {dependency.license}
        </span>
      </td>
    </tr>
  );
}


function EmptyState({ filtered }) {
  return (
    <div className="dependencies-empty">
      <div className="dependencies-empty-icon">
        <Package size={25} />
      </div>

      <h2 className="dependencies-empty-title">
        {filtered
          ? "No matching dependencies"
          : "No dependencies found"}
      </h2>

      <p className="dependencies-empty-text">
        {filtered
          ? "Try changing your search query or filters to see more packages."
          : "Dependency information will appear here after a repository has been scanned using a supported SCA scanner."}
      </p>

      <Link
        to="/projects"
        className="dependencies-button dependencies-button-primary"
      >
        <Code2 size={13} />

        View Projects
      </Link>
    </div>
  );
}


function Dependencies({
  user,
  notifications = [],
  dependencies = [],
  loading = false,
  refreshing = false,
  error = null,
  onRefresh,
  onLogout,
  onSearch,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [ecosystemFilter, setEcosystemFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [outdatedOnly, setOutdatedOnly] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const normalizedDependencies = useMemo(() => {
    if (!Array.isArray(dependencies)) {
      return [];
    }

    return dependencies
      .map(normalizeDependency)
      .filter(
        (item) =>
          item &&
          item.id !== null &&
          item.id !== undefined
      );
  }, [dependencies]);

  const ecosystems = useMemo(() => {
    return [
      ...new Set(
        normalizedDependencies
          .map((item) => item.ecosystem)
          .filter(
            (ecosystem) =>
              ecosystem &&
              ecosystem !== "unknown"
          )
      ),
    ].sort();
  }, [normalizedDependencies]);

  const counts = useMemo(() => {
    const vulnerable = normalizedDependencies.filter(
      (item) => item.vulnerabilityCount > 0 || item.severity !== "none"
    );

    const outdated = normalizedDependencies.filter(
      (item) => item.isOutdated
    );

    return {
      total: normalizedDependencies.length,
      vulnerable: vulnerable.length,
      outdated: outdated.length,
      safe: normalizedDependencies.length - vulnerable.length,
    };
  }, [normalizedDependencies]);

  const filteredDependencies = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return normalizedDependencies.filter((item) => {
      const searchableValues = [
        item.name,
        item.description,
        item.repository,
        item.ecosystem,
        item.version,
        item.latestVersion,
        item.cve,
        item.license,
      ];

      const matchesSearch =
        !query ||
        searchableValues.some((value) =>
          String(value ?? "").toLowerCase().includes(query)
        );

      const matchesSeverity =
        severityFilter === "all" ||
        item.severity === severityFilter;

      const matchesEcosystem =
        ecosystemFilter === "all" ||
        item.ecosystem === ecosystemFilter;

      const matchesType =
        typeFilter === "all" ||
        item.dependencyType === typeFilter;

      const matchesOutdated =
        !outdatedOnly || item.isOutdated;

      return (
        matchesSearch &&
        matchesSeverity &&
        matchesEcosystem &&
        matchesType &&
        matchesOutdated
      );
    });
  }, [
    normalizedDependencies,
    searchQuery,
    severityFilter,
    ecosystemFilter,
    typeFilter,
    outdatedOnly,
  ]);

  const hasFilters =
    searchQuery.trim() !== "" ||
    severityFilter !== "all" ||
    ecosystemFilter !== "all" ||
    typeFilter !== "all" ||
    outdatedOnly;

  const clearFilters = () => {
    setSearchQuery("");
    setSeverityFilter("all");
    setEcosystemFilter("all");
    setTypeFilter("all");
    setOutdatedOnly(false);
  };

  const handleRefresh = () => {
    if (typeof onRefresh === "function" && !refreshing) {
      onRefresh();
    }
  };

  return (
    <>
      <style>{dependenciesStyles}</style>

      <div className="dependencies-layout">
        <Sidebar
          user={user}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        <main className="dependencies-main">
          <Navbar
            user={user}
            notifications={notifications}
            onMobileMenuClick={() => setMobileOpen(true)}
            onLogout={onLogout}
            onSearch={onSearch}
          />

          <div className="dependencies-content">
            <header className="dependencies-header">
              <div>
                <div className="dependencies-eyebrow">
                  <Boxes size={14} />

                  Software Composition Analysis
                </div>

                <h1 className="dependencies-title">
                  Dependencies
                </h1>

                <p className="dependencies-description">
                  Monitor third-party packages, identify vulnerable
                  dependencies and track available security updates
                  across your repositories.
                </p>
              </div>

              <div className="dependencies-header-actions">
                <button
                  type="button"
                  className="dependencies-button"
                  onClick={handleRefresh}
                  disabled={!onRefresh || refreshing || loading}
                >
                  <RefreshCw
                    size={13}
                    className={
                      refreshing
                        ? "dependencies-spin"
                        : ""
                    }
                  />

                  Refresh
                </button>

                <Link
                  to="/scans"
                  className="dependencies-button dependencies-button-primary"
                >
                  <ShieldCheck size={13} />

                  View Scans
                </Link>
              </div>
            </header>

            {error && (
              <div
                className="dependencies-error"
                role="alert"
              >
                <div className="dependencies-error-message">
                  <AlertCircle size={15} />

                  {typeof error === "string"
                    ? error
                    : "Unable to retrieve dependency information."}
                </div>

                {onRefresh && (
                  <button
                    type="button"
                    className="dependencies-button"
                    onClick={handleRefresh}
                    disabled={refreshing}
                  >
                    Retry
                  </button>
                )}
              </div>
            )}

            <section className="dependencies-overview">
              <OverviewStat
                label="Total Dependencies"
                value={counts.total}
                icon={Package}
                variant="total"
              />

              <OverviewStat
                label="Vulnerable Packages"
                value={counts.vulnerable}
                icon={ShieldAlert}
                variant="vulnerable"
              />

              <OverviewStat
                label="Outdated Packages"
                value={counts.outdated}
                icon={Clock3}
                variant="outdated"
              />

              <OverviewStat
                label="Packages Without Known Findings"
                value={counts.safe}
                icon={ShieldCheck}
                variant="safe"
              />
            </section>

            <section className="dependencies-insight">
              <div className="dependencies-insight-icon">
                <Info size={17} />
              </div>

              <div>
                <h3 className="dependencies-insight-title">
                  Dependency Security
                </h3>

                <p className="dependencies-insight-text">
                  Dependency findings should be evaluated using their
                  advisory, affected version range and available fix.
                  An outdated package is not necessarily vulnerable,
                  and an upgrade recommendation should be tested
                  for compatibility before deployment.
                </p>
              </div>
            </section>

            <section className="dependencies-filter-panel">
              <div className="dependencies-filter-heading">
                <Filter size={14} />

                Filter Dependencies
              </div>

              <div className="dependencies-filter-grid">
                <div className="dependencies-search">
                  <Search size={14} />

                  <input
                    type="search"
                    className="dependencies-input"
                    placeholder="Search package, repository, CVE..."
                    value={searchQuery}
                    onChange={(event) => {
                      setSearchQuery(event.target.value);
                    }}
                    aria-label="Search dependencies"
                  />
                </div>

                <select
                  className="dependencies-select"
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
                  <option value="none">No known issues</option>
                </select>

                <select
                  className="dependencies-select"
                  value={ecosystemFilter}
                  onChange={(event) => {
                    setEcosystemFilter(event.target.value);
                  }}
                  aria-label="Filter by ecosystem"
                >
                  <option value="all">All ecosystems</option>

                  {ecosystems.map((ecosystem) => (
                    <option
                      key={ecosystem}
                      value={ecosystem}
                    >
                      {ecosystem}
                    </option>
                  ))}
                </select>

                <select
                  className="dependencies-select"
                  value={typeFilter}
                  onChange={(event) => {
                    setTypeFilter(event.target.value);
                  }}
                  aria-label="Filter by dependency type"
                >
                  <option value="all">All dependency types</option>
                  <option value="direct">Direct</option>
                  <option value="transitive">Transitive</option>
                </select>
              </div>

              <div className="dependencies-filter-bottom">
                <label className="dependencies-checkbox-label">
                  <input
                    type="checkbox"
                    checked={outdatedOnly}
                    onChange={(event) => {
                      setOutdatedOnly(event.target.checked);
                    }}
                  />

                  Show outdated packages only
                </label>

                {hasFilters && (
                  <button
                    type="button"
                    className="dependencies-clear"
                    onClick={clearFilters}
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </section>

            <section>
              <div className="dependencies-results-header">
                <div>
                  <h2 className="dependencies-results-title">
                    Package Inventory
                  </h2>

                  <p className="dependencies-results-count">
                    Showing {filteredDependencies.length} of{" "}
                    {normalizedDependencies.length} dependencies
                  </p>
                </div>
              </div>

              {loading ? (
                <Loader
                  size="large"
                  text="Loading dependencies..."
                />
              ) : filteredDependencies.length > 0 ? (
                <div className="dependencies-table-wrapper">
                  <table className="dependencies-table">
                    <thead>
                      <tr>
                        <th>Package</th>
                        <th>Installed</th>
                        <th>Ecosystem</th>
                        <th>Type</th>
                        <th>Severity</th>
                        <th>Advisory</th>
                        <th>Recommended</th>
                        <th>License</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredDependencies.map((dependency) => (
                        <DependencyRow
                          key={dependency.id}
                          dependency={dependency}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState filtered={hasFilters} />
              )}
            </section>

            <footer className="dependencies-footer">
              <div className="dependencies-footer-brand">
                <Shield size={13} />

                SecureAI Dependency Intelligence
              </div>

              <span>
                Findings depend on the scanner database and scan timestamp.
              </span>
            </footer>
          </div>
        </main>
      </div>
    </>
  );
}


export default Dependencies;