import React, { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bug,
  CheckCircle2,
  Clock3,
  Code2,
  ExternalLink,
  FileSearch,
  GitBranch,
  GitPullRequest,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
  TrendingUp,
  Zap,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import Sidebar from "../components/sidebar.jsx";
import Navbar from "../components/navbar.jsx";
import Loader from "../components/loader.jsx";
import StatCard from "../components/stat-card.jsx";
import VulnerabilityCard from "../components/vulnerability-card.jsx";


const dashboardStyles = `
  .dashboard-layout {
    display: flex;
    min-height: 100vh;
    min-height: 100dvh;
    background: var(--background, #080d18);
    color: var(--text-primary, #f1f5f9);
  }

  .dashboard-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    margin-left: 260px;
    transition: margin-left 0.25s ease;
  }

  .dashboard-content {
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
    padding: 30px;
  }

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 28px;
  }

  .dashboard-heading {
    min-width: 0;
  }

  .dashboard-eyebrow {
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

  .dashboard-title {
    margin: 0;
    color: var(--text-primary, #f1f5f9);
    font-size: clamp(25px, 3vw, 32px);
    font-weight: 750;
    letter-spacing: -0.04em;
    line-height: 1.2;
  }

  .dashboard-subtitle {
    margin: 10px 0 0;
    color: var(--text-secondary, #94a3b8);
    font-size: 14px;
    line-height: 1.7;
  }

  .dashboard-header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .dashboard-action-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    min-height: 42px;
    padding: 0 15px;
    border: 1px solid var(--border, #263244);
    border-radius: 9px;
    background: var(--surface, #111827);
    color: var(--text-primary, #f1f5f9);
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
  }

  .dashboard-action-button:hover:not(:disabled) {
    background: var(--surface-hover, #1b2638);
    border-color: var(--primary, #3b82f6);
    transform: translateY(-1px);
  }

  .dashboard-action-button:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .dashboard-action-primary {
    border-color: transparent;
    background: linear-gradient(135deg, #2563eb, #0891b2);
    color: #ffffff;
  }

  .dashboard-action-primary:hover:not(:disabled) {
    background: linear-gradient(135deg, #1d4ed8, #0e7490);
    border-color: transparent;
  }

  .dashboard-stats-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }

  .dashboard-section-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.55fr) minmax(280px, 1fr);
    gap: 20px;
    margin-bottom: 22px;
  }

  .dashboard-panel {
    min-width: 0;
    overflow: hidden;
    border: 1px solid var(--border, #263244);
    border-radius: 14px;
    background: var(--surface, #111827);
  }

  .dashboard-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    padding: 19px 20px;
    border-bottom: 1px solid var(--border, #263244);
  }

  .dashboard-panel-heading {
    display: flex;
    align-items: center;
    gap: 11px;
    min-width: 0;
  }

  .dashboard-panel-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    border: 1px solid rgba(59, 130, 246, 0.18);
    border-radius: 9px;
    background: rgba(59, 130, 246, 0.10);
    color: #60a5fa;
  }

  .dashboard-panel-title {
    margin: 0;
    color: var(--text-primary, #f1f5f9);
    font-size: 14px;
    font-weight: 700;
  }

  .dashboard-panel-description {
    margin: 4px 0 0;
    color: var(--text-muted, #718096);
    font-size: 11px;
  }

  .dashboard-panel-link {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: var(--primary, #60a5fa);
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
    white-space: nowrap;
  }

  .dashboard-panel-link:hover {
    color: var(--accent, #22d3ee);
  }

  .dashboard-panel-body {
    padding: 20px;
  }

  .severity-list {
    display: flex;
    flex-direction: column;
    gap: 21px;
  }

  .severity-item {
    display: flex;
    flex-direction: column;
    gap: 9px;
  }

  .severity-item-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .severity-label {
    display: flex;
    align-items: center;
    gap: 9px;
    color: var(--text-secondary, #cbd5e1);
    font-size: 13px;
    font-weight: 600;
  }

  .severity-indicator {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .severity-count {
    color: var(--text-primary, #f1f5f9);
    font-size: 13px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  .severity-track {
    width: 100%;
    height: 7px;
    overflow: hidden;
    border-radius: 20px;
    background: rgba(148, 163, 184, 0.12);
  }

  .severity-progress {
    height: 100%;
    min-width: 0;
    border-radius: inherit;
    transition: width 0.5s ease;
  }

  .severity-critical {
    background: #ef4444;
  }

  .severity-high {
    background: #f97316;
  }

  .severity-medium {
    background: #eab308;
  }

  .severity-low {
    background: #22c55e;
  }

  .severity-info {
    background: #3b82f6;
  }

  .severity-summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 25px;
    padding: 13px 14px;
    border: 1px solid var(--border, #263244);
    border-radius: 9px;
    background: rgba(59, 130, 246, 0.05);
  }

  .severity-summary-label {
    color: var(--text-secondary, #94a3b8);
    font-size: 12px;
  }

  .severity-summary-value {
    color: var(--text-primary, #f1f5f9);
    font-size: 16px;
    font-weight: 750;
  }

  .scan-list {
    display: flex;
    flex-direction: column;
  }

  .scan-item {
    display: flex;
    align-items: center;
    gap: 13px;
    padding: 15px 0;
    border-bottom: 1px solid var(--border, #263244);
  }

  .scan-item:first-child {
    padding-top: 0;
  }

  .scan-item:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }

  .scan-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    flex-shrink: 0;
    border: 1px solid var(--border, #263244);
    border-radius: 10px;
    background: rgba(148, 163, 184, 0.06);
    color: var(--text-secondary, #94a3b8);
  }

  .scan-details {
    flex: 1;
    min-width: 0;
  }

  .scan-name {
    overflow: hidden;
    margin: 0;
    color: var(--text-primary, #f1f5f9);
    font-size: 13px;
    font-weight: 650;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .scan-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 7px;
    margin-top: 5px;
    color: var(--text-muted, #718096);
    font-size: 11px;
  }

  .scan-status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 8px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 700;
    text-transform: capitalize;
    white-space: nowrap;
  }

  .scan-status-completed {
    background: rgba(34, 197, 94, 0.10);
    color: #4ade80;
  }

  .scan-status-running {
    background: rgba(59, 130, 246, 0.10);
    color: #60a5fa;
  }

  .scan-status-failed {
    background: rgba(239, 68, 68, 0.10);
    color: #f87171;
  }

  .scan-status-pending {
    background: rgba(234, 179, 8, 0.10);
    color: #facc15;
  }

  .scan-status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }

  .dashboard-vulnerability-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .dashboard-vulnerability-list > * {
    min-width: 0;
  }

  .activity-list {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .activity-item {
    position: relative;
    display: flex;
    gap: 13px;
    padding-bottom: 22px;
  }

  .activity-item:last-child {
    padding-bottom: 0;
  }

  .activity-marker {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    flex-shrink: 0;
    border: 1px solid var(--border, #263244);
    border-radius: 50%;
    background: var(--surface, #111827);
    color: var(--primary, #60a5fa);
  }

  .activity-item:not(:last-child)::after {
    position: absolute;
    top: 30px;
    bottom: 0;
    left: 14px;
    width: 1px;
    background: var(--border, #263244);
    content: "";
  }

  .activity-content {
    flex: 1;
    min-width: 0;
    padding-top: 3px;
  }

  .activity-message {
    margin: 0;
    color: var(--text-secondary, #cbd5e1);
    font-size: 12px;
    line-height: 1.6;
    overflow-wrap: anywhere;
  }

  .activity-time {
    display: block;
    margin-top: 5px;
    color: var(--text-muted, #718096);
    font-size: 10px;
  }

  .dashboard-quick-actions {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  .quick-action {
    display: flex;
    align-items: center;
    gap: 13px;
    min-width: 0;
    padding: 16px;
    border: 1px solid var(--border, #263244);
    border-radius: 11px;
    background: var(--surface, #111827);
    color: inherit;
    text-align: left;
    text-decoration: none;
    cursor: pointer;
    transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
  }

  .quick-action:hover {
    transform: translateY(-2px);
    border-color: var(--primary, #3b82f6);
    background: rgba(59, 130, 246, 0.06);
  }

  .quick-action-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    border: 1px solid rgba(59, 130, 246, 0.18);
    border-radius: 10px;
    background: rgba(59, 130, 246, 0.10);
    color: #60a5fa;
  }

  .quick-action-content {
    flex: 1;
    min-width: 0;
  }

  .quick-action-title {
    margin: 0;
    color: var(--text-primary, #f1f5f9);
    font-size: 12px;
    font-weight: 700;
  }

  .quick-action-description {
    margin: 5px 0 0;
    color: var(--text-muted, #718096);
    font-size: 10px;
    line-height: 1.5;
  }

  .quick-action-arrow {
    flex-shrink: 0;
    color: var(--text-muted, #718096);
  }

  .dashboard-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 9px;
    min-height: 145px;
    padding: 22px;
    color: var(--text-muted, #718096);
    text-align: center;
  }

  .dashboard-empty-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: 1px solid var(--border, #263244);
    border-radius: 12px;
    background: rgba(148, 163, 184, 0.06);
    color: var(--text-secondary, #94a3b8);
  }

  .dashboard-empty-title {
    margin: 0;
    color: var(--text-primary, #cbd5e1);
    font-size: 13px;
    font-weight: 650;
  }

  .dashboard-empty-description {
    max-width: 280px;
    margin: 0;
    font-size: 11px;
    line-height: 1.6;
  }

  .dashboard-error {
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
    font-size: 13px;
  }

  .dashboard-error-content {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .dashboard-refresh-icon {
    animation: dashboard-spin 1s linear infinite;
  }

  .dashboard-footer {
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

  .dashboard-footer-brand {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  @keyframes dashboard-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 1200px) {
    .dashboard-stats-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .dashboard-section-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 900px) {
    .dashboard-main {
      margin-left: 0;
    }

    .dashboard-content {
      padding: 24px;
    }
  }

  @media (max-width: 640px) {
    .dashboard-content {
      padding: 18px 14px;
    }

    .dashboard-header {
      flex-direction: column;
      align-items: stretch;
    }

    .dashboard-header-actions {
      width: 100%;
    }

    .dashboard-header-actions > * {
      flex: 1;
    }

    .dashboard-stats-grid {
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .dashboard-quick-actions {
      grid-template-columns: 1fr;
    }

    .dashboard-panel-header {
      padding: 15px;
    }

    .dashboard-panel-body {
      padding: 15px;
    }

    .dashboard-footer {
      flex-direction: column;
      align-items: flex-start;
    }

    .dashboard-error {
      align-items: flex-start;
      flex-direction: column;
    }
  }

  @media (max-width: 380px) {
    .dashboard-stats-grid {
      grid-template-columns: 1fr;
    }

    .dashboard-action-button {
      padding: 0 10px;
      font-size: 12px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .dashboard-layout *,
    .dashboard-layout *::before,
    .dashboard-layout *::after {
      scroll-behavior: auto !important;
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`;


const severityConfiguration = [
  { key: "critical", label: "Critical", color: "#ef4444" },
  { key: "high", label: "High", color: "#f97316" },
  { key: "medium", label: "Medium", color: "#eab308" },
  { key: "low", label: "Low", color: "#22c55e" },
  { key: "info", label: "Informational", color: "#3b82f6" },
];


const activityIcons = {
  scan: FileSearch,
  vulnerability: Bug,
  remediation: ShieldCheck,
  pull_request: GitPullRequest,
  project: Code2,
  default: Activity,
};


function getValue(source, camelCaseKey, snakeCaseKey, fallback = null) {
  if (!source || typeof source !== "object") {
    return fallback;
  }

  return source[camelCaseKey] ?? source[snakeCaseKey] ?? fallback;
}


function formatNumber(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "—";
  }

  return new Intl.NumberFormat("en-IN").format(number);
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
  const seconds = Math.floor(Math.abs(difference) / 1000);

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(seconds / 60);

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

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}


function EmptyState({
  icon: Icon = Shield,
  title,
  description,
}) {
  return (
    <div className="dashboard-empty-state">
      <div className="dashboard-empty-icon">
        <Icon size={19} />
      </div>

      <h3 className="dashboard-empty-title">
        {title}
      </h3>

      <p className="dashboard-empty-description">
        {description}
      </p>
    </div>
  );
}


function SeverityDistribution({ data }) {
  const severityCounts = useMemo(() => {
    if (!data || typeof data !== "object") {
      return null;
    }

    return severityConfiguration.map((item) => ({
      ...item,
      count: Math.max(
        0,
        Number(
          data[item.key] ??
          data[`${item.key}_count`] ??
          0
        ) || 0
      ),
    }));
  }, [data]);

  const total = useMemo(() => {
    if (!severityCounts) {
      return 0;
    }

    return severityCounts.reduce(
      (sum, item) => sum + item.count,
      0
    );
  }, [severityCounts]);

  if (!severityCounts) {
    return (
      <EmptyState
        icon={ShieldAlert}
        title="No severity data"
        description="Severity distribution will appear after security scan results are available."
      />
    );
  }

  return (
    <div>
      <div className="severity-list">
        {severityCounts.map((item) => {
          const percentage = total > 0
            ? (item.count / total) * 100
            : 0;

          return (
            <div className="severity-item" key={item.key}>
              <div className="severity-item-header">
                <div className="severity-label">
                  <span
                    className={`severity-indicator severity-${item.key}`}
                  />

                  {item.label}
                </div>

                <span className="severity-count">
                  {formatNumber(item.count)}
                </span>
              </div>

              <div
                className="severity-track"
                role="progressbar"
                aria-label={`${item.label} vulnerabilities`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(percentage)}
              >
                <div
                  className={`severity-progress severity-${item.key}`}
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="severity-summary">
        <span className="severity-summary-label">
          Total detected vulnerabilities
        </span>

        <span className="severity-summary-value">
          {formatNumber(total)}
        </span>
      </div>
    </div>
  );
}


function RecentScans({ scans }) {
  if (!Array.isArray(scans) || scans.length === 0) {
    return (
      <EmptyState
        icon={FileSearch}
        title="No scans yet"
        description="Connect a repository and start your first security scan to see results here."
      />
    );
  }

  return (
    <div className="scan-list">
      {scans.slice(0, 5).map((scan, index) => {
        const scanId = scan.id ?? scan.scan_id ?? index;

        const status = String(
          scan.status ?? "pending"
        ).toLowerCase();

        const normalizedStatus = [
          "completed",
          "running",
          "failed",
          "pending",
        ].includes(status)
          ? status
          : "pending";

        const repository =
          scan.repository_name ??
          scan.repository ??
          scan.project_name ??
          "Repository scan";

        const branch = scan.branch ?? scan.target_branch;

        const startedAt =
          scan.created_at ??
          scan.started_at ??
          scan.updated_at;

        return (
          <div className="scan-item" key={scanId}>
            <div className="scan-icon">
              <Terminal size={17} />
            </div>

            <div className="scan-details">
              <h4 className="scan-name">
                {repository}
              </h4>

              <div className="scan-meta">
                {branch && (
                  <span>
                    <GitBranch
                      size={11}
                      style={{
                        display: "inline",
                        verticalAlign: "middle",
                      }}
                    />{" "}
                    {branch}
                  </span>
                )}

                <span>
                  <Clock3
                    size={11}
                    style={{
                      display: "inline",
                      verticalAlign: "middle",
                    }}
                  />{" "}
                  {formatRelativeTime(startedAt)}
                </span>
              </div>
            </div>

            <span
              className={`scan-status scan-status-${normalizedStatus}`}
            >
              <span className="scan-status-dot" />
              {normalizedStatus}
            </span>
          </div>
        );
      })}
    </div>
  );
}


function RecentActivity({ activities }) {
  if (!Array.isArray(activities) || activities.length === 0) {
    return (
      <EmptyState
        icon={Activity}
        title="No recent activity"
        description="Security events and project updates will appear here."
      />
    );
  }

  return (
    <div className="activity-list">
      {activities.slice(0, 6).map((activity, index) => {
        const activityType = String(
          activity.type ?? "default"
        ).toLowerCase();

        const Icon = activityIcons[activityType] ??
          activityIcons.default;

        return (
          <div
            className="activity-item"
            key={activity.id ?? index}
          >
            <div className="activity-marker">
              <Icon size={14} />
            </div>

            <div className="activity-content">
              <p className="activity-message">
                {activity.message ?? activity.description ?? "Security activity recorded."}
              </p>

              <span className="activity-time">
                {formatRelativeTime(
                  activity.created_at ?? activity.timestamp
                )}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}


function Dashboard({
  user,
  notifications = [],
  stats = null,
  severityData = null,
  recentScans = [],
  recentVulnerabilities = [],
  activities = [],
  loading = false,
  error = null,
  refreshing = false,
  onRefresh,
  onStartScan,
  onLogout,
  onSearch,
  onExplainVulnerability,
  onRemediateVulnerability,
  onViewVulnerability,
}) {
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  const totalScans = getValue(
    stats,
    "totalScans",
    "total_scans"
  );

  const openVulnerabilities = getValue(
    stats,
    "openVulnerabilities",
    "open_vulnerabilities"
  );

  const criticalVulnerabilities = getValue(
    stats,
    "criticalVulnerabilities",
    "critical_vulnerabilities"
  );

  const securityScore = getValue(
    stats,
    "securityScore",
    "security_score"
  );

  const statCards = [
    {
      title: "Total Scans",
      value: totalScans,
      description: "Security scans performed",
      icon: FileSearch,
      iconType: "scans",
    },
    {
      title: "Open Vulnerabilities",
      value: openVulnerabilities,
      description: "Issues requiring attention",
      icon: Bug,
      iconType: "vulnerabilities",
    },
    {
      title: "Critical Issues",
      value: criticalVulnerabilities,
      description: "Highest-priority findings",
      icon: ShieldAlert,
      iconType: "critical",
    },
    {
      title: "Security Score",
      value: securityScore,
      unit: securityScore !== null ? "/100" : "",
      description: "Overall security posture",
      icon: ShieldCheck,
      iconType: "security",
    },
  ];

  const handleRefresh = () => {
    if (typeof onRefresh === "function" && !refreshing) {
      onRefresh();
    }
  };

  const handleStartScan = () => {
    if (typeof onStartScan === "function") {
      onStartScan();
      return;
    }

    navigate("/projects");
  };

  return (
    <>
      <style>{dashboardStyles}</style>

      <div className="dashboard-layout">
        <Sidebar
          user={user}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        <main className="dashboard-main">
          <Navbar
            user={user}
            notifications={notifications}
            onMobileMenuClick={() => setMobileOpen(true)}
            onLogout={onLogout}
            onSearch={onSearch}
          />

          <div className="dashboard-content">
            <header className="dashboard-header">
              <div className="dashboard-heading">
                <div className="dashboard-eyebrow">
                  <Sparkles size={14} />

                  Security Command Center
                </div>

                <h1 className="dashboard-title">
                  Security Overview
                </h1>

                <p className="dashboard-subtitle">
                  Monitor your repositories, security findings,
                  and remediation progress from one place.
                </p>
              </div>

              <div className="dashboard-header-actions">
                <button
                  type="button"
                  className="dashboard-action-button"
                  onClick={handleRefresh}
                  disabled={!onRefresh || refreshing || loading}
                  aria-label="Refresh dashboard"
                >
                  <RefreshCw
                    size={15}
                    className={refreshing ? "dashboard-refresh-icon" : ""}
                  />

                  Refresh
                </button>

                <button
                  type="button"
                  className="dashboard-action-button dashboard-action-primary"
                  onClick={handleStartScan}
                  disabled={loading}
                >
                  <Zap size={15} />

                  New Scan
                </button>
              </div>
            </header>

            {error && (
              <div className="dashboard-error" role="alert">
                <div className="dashboard-error-content">
                  <ShieldAlert size={17} />

                  <span>
                    {typeof error === "string"
                      ? error
                      : "Unable to load dashboard data. Please try again."}
                  </span>
                </div>

                {onRefresh && (
                  <button
                    type="button"
                    className="dashboard-action-button"
                    onClick={handleRefresh}
                    disabled={refreshing}
                  >
                    Retry
                  </button>
                )}
              </div>
            )}

            {loading ? (
              <Loader
                size="large"
                text="Loading security overview..."
              />
            ) : (
              <>
                <section
                  className="dashboard-stats-grid"
                  aria-label="Security statistics"
                >
                  {statCards.map((card) => (
                    <StatCard
                      key={card.title}
                      title={card.title}
                      value={
                        card.value === null ||
                        card.value === undefined
                          ? "—"
                          : formatNumber(card.value)
                      }
                      unit={card.unit}
                      description={card.description}
                      icon={card.icon}
                      iconType={card.iconType}
                      loading={false}
                      empty={card.value === null || card.value === undefined}
                    />
                  ))}
                </section>

                <section className="dashboard-section-grid">
                  <div className="dashboard-panel">
                    <div className="dashboard-panel-header">
                      <div className="dashboard-panel-heading">
                        <div className="dashboard-panel-icon">
                          <ShieldAlert size={17} />
                        </div>

                        <div>
                          <h2 className="dashboard-panel-title">
                            Vulnerability Distribution
                          </h2>

                          <p className="dashboard-panel-description">
                            Findings grouped by severity
                          </p>
                        </div>
                      </div>

                      <Link
                        to="/vulnerabilities"
                        className="dashboard-panel-link"
                      >
                        View all

                        <ArrowRight size={13} />
                      </Link>
                    </div>

                    <div className="dashboard-panel-body">
                      <SeverityDistribution data={severityData} />
                    </div>
                  </div>

                  <div className="dashboard-panel">
                    <div className="dashboard-panel-header">
                      <div className="dashboard-panel-heading">
                        <div className="dashboard-panel-icon">
                          <Activity size={17} />
                        </div>

                        <div>
                          <h2 className="dashboard-panel-title">
                            Recent Scans
                          </h2>

                          <p className="dashboard-panel-description">
                            Latest repository scan activity
                          </p>
                        </div>
                      </div>

                      <Link
                        to="/scans"
                        className="dashboard-panel-link"
                      >
                        View all

                        <ArrowRight size={13} />
                      </Link>
                    </div>

                    <div className="dashboard-panel-body">
                      <RecentScans scans={recentScans} />
                    </div>
                  </div>
                </section>

                <section className="dashboard-section-grid">
                  <div className="dashboard-panel">
                    <div className="dashboard-panel-header">
                      <div className="dashboard-panel-heading">
                        <div className="dashboard-panel-icon">
                          <Bug size={17} />
                        </div>

                        <div>
                          <h2 className="dashboard-panel-title">
                            Recent Vulnerabilities
                          </h2>

                          <p className="dashboard-panel-description">
                            Latest detected security findings
                          </p>
                        </div>
                      </div>

                      <Link
                        to="/vulnerabilities"
                        className="dashboard-panel-link"
                      >
                        View all

                        <ArrowRight size={13} />
                      </Link>
                    </div>

                    <div className="dashboard-panel-body">
                      {Array.isArray(recentVulnerabilities) &&
                      recentVulnerabilities.length > 0 ? (
                        <div className="dashboard-vulnerability-list">
                          {recentVulnerabilities
                            .slice(0, 4)
                            .map((vulnerability, index) => (
                              <VulnerabilityCard
                                key={
                                  vulnerability.id ??
                                  vulnerability.vulnerability_id ??
                                  index
                                }
                                vulnerability={vulnerability}
                                onView={onViewVulnerability}
                                onExplain={onExplainVulnerability}
                                onRemediate={onRemediateVulnerability}
                              />
                            ))}
                        </div>
                      ) : (
                        <EmptyState
                          icon={CheckCircle2}
                          title="No vulnerabilities to display"
                          description="Detected security findings will appear here after your repository scans."
                        />
                      )}
                    </div>
                  </div>

                  <div className="dashboard-panel">
                    <div className="dashboard-panel-header">
                      <div className="dashboard-panel-heading">
                        <div className="dashboard-panel-icon">
                          <TrendingUp size={17} />
                        </div>

                        <div>
                          <h2 className="dashboard-panel-title">
                            Security Activity
                          </h2>

                          <p className="dashboard-panel-description">
                            Recent events across your workspace
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="dashboard-panel-body">
                      <RecentActivity activities={activities} />
                    </div>
                  </div>
                </section>

                <section className="dashboard-panel">
                  <div className="dashboard-panel-header">
                    <div className="dashboard-panel-heading">
                      <div className="dashboard-panel-icon">
                        <Zap size={17} />
                      </div>

                      <div>
                        <h2 className="dashboard-panel-title">
                          Quick Actions
                        </h2>

                        <p className="dashboard-panel-description">
                          Common security workflows
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="dashboard-panel-body">
                    <div className="dashboard-quick-actions">
                      <button
                        type="button"
                        className="quick-action"
                        onClick={handleStartScan}
                      >
                        <div className="quick-action-icon">
                          <FileSearch size={19} />
                        </div>

                        <div className="quick-action-content">
                          <h3 className="quick-action-title">
                            Start Security Scan
                          </h3>

                          <p className="quick-action-description">
                            Analyze a repository for security issues.
                          </p>
                        </div>

                        <ArrowRight
                          size={16}
                          className="quick-action-arrow"
                        />
                      </button>

                      <Link
                        to="/ai-review"
                        className="quick-action"
                      >
                        <div className="quick-action-icon">
                          <Sparkles size={19} />
                        </div>

                        <div className="quick-action-content">
                          <h3 className="quick-action-title">
                            AI Security Review
                          </h3>

                          <p className="quick-action-description">
                            Review findings and understand security risks.
                          </p>
                        </div>

                        <ArrowRight
                          size={16}
                          className="quick-action-arrow"
                        />
                      </Link>

                      <Link
                        to="/remediation"
                        className="quick-action"
                      >
                        <div className="quick-action-icon">
                          <ShieldCheck size={19} />
                        </div>

                        <div className="quick-action-content">
                          <h3 className="quick-action-title">
                            Review Remediation
                          </h3>

                          <p className="quick-action-description">
                            Inspect suggested fixes before applying patches.
                          </p>
                        </div>

                        <ArrowRight
                          size={16}
                          className="quick-action-arrow"
                        />
                      </Link>
                    </div>
                  </div>
                </section>
              </>
            )}

            <footer className="dashboard-footer">
              <div className="dashboard-footer-brand">
                <Shield size={14} />

                <span>
                  SecureAI Security Platform
                </span>
              </div>

              <span>
                AI-assisted security. Human-approved remediation.
              </span>
            </footer>
          </div>
        </main>
      </div>
    </>
  );
}


export default Dashboard;