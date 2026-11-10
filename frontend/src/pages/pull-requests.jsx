import React, { useMemo, useState } from "react";

import {
  GitPullRequest,
  GitMerge,
  GitBranch,
  GitCommit,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  Clock3,
  CheckCircle2,
  XCircle,
  FileCode2,
  ShieldCheck,
  AlertCircle,
  ChevronDown,
  ArrowUpRight,
  Code2,
  Shield,
  CircleDot,
  GitPullRequestClosed,
} from "lucide-react";

import { Link } from "react-router-dom";

import Sidebar from "../components/sidebar.jsx";
import Navbar from "../components/navbar.jsx";
import Loader from "../components/loader.jsx";


const pullRequestsStyles = `
  .pull-requests-layout {
    display: flex;
    min-height: 100vh;
    min-height: 100dvh;
    background: var(--background, #080d18);
    color: var(--text-primary, #f1f5f9);
  }

  .pull-requests-main {
    flex: 1;
    min-width: 0;
    margin-left: 260px;
  }

  .pull-requests-content {
    width: 100%;
    max-width: 1550px;
    margin: 0 auto;
    padding: 30px;
  }

  .pull-requests-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 25px;
  }

  .pull-requests-eyebrow {
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

  .pull-requests-title {
    margin: 0;
    color: var(--text-primary, #f1f5f9);
    font-size: clamp(25px, 3vw, 32px);
    font-weight: 750;
    letter-spacing: -0.04em;
  }

  .pull-requests-description {
    max-width: 680px;
    margin: 10px 0 0;
    color: var(--text-secondary, #94a3b8);
    font-size: 13px;
    line-height: 1.7;
  }

  .pull-requests-header-actions {
    display: flex;
    align-items: center;
    gap: 9px;
    flex-shrink: 0;
  }

  .pull-requests-button {
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

  .pull-requests-button:hover:not(:disabled) {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.08);
  }

  .pull-requests-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .pull-requests-button-primary {
    border-color: transparent;
    background: linear-gradient(135deg, #2563eb, #0891b2);
    color: #ffffff;
  }

  .pull-requests-button-primary:hover:not(:disabled) {
    border-color: transparent;
    background: linear-gradient(135deg, #1d4ed8, #0e7490);
  }

  .pull-requests-overview {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 13px;
    margin-bottom: 23px;
  }

  .pull-requests-stat {
    display: flex;
    align-items: center;
    gap: 13px;
    min-width: 0;
    padding: 17px;
    border: 1px solid var(--border, #263244);
    border-radius: 11px;
    background: var(--surface, #111827);
  }

  .pull-requests-stat-icon {
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

  .pull-requests-stat-label {
    display: block;
    margin-bottom: 5px;
    color: var(--text-muted, #718096);
    font-size: 9px;
    font-weight: 650;
  }

  .pull-requests-stat-value {
    display: block;
    color: var(--text-primary, #f1f5f9);
    font-size: 23px;
    font-weight: 750;
    font-variant-numeric: tabular-nums;
  }

  .pull-requests-stat-open {
    --stat-color: #60a5fa;
    --stat-border: rgba(59, 130, 246, 0.2);
    --stat-background: rgba(59, 130, 246, 0.08);
  }

  .pull-requests-stat-merged {
    --stat-color: #a78bfa;
    --stat-border: rgba(139, 92, 246, 0.2);
    --stat-background: rgba(139, 92, 246, 0.08);
  }

  .pull-requests-stat-closed {
    --stat-color: #f87171;
    --stat-border: rgba(239, 68, 68, 0.2);
    --stat-background: rgba(239, 68, 68, 0.08);
  }

  .pull-requests-stat-draft {
    --stat-color: #facc15;
    --stat-border: rgba(234, 179, 8, 0.2);
    --stat-background: rgba(234, 179, 8, 0.08);
  }

  .pull-requests-filter-panel {
    margin-bottom: 20px;
    padding: 17px;
    border: 1px solid var(--border, #263244);
    border-radius: 11px;
    background: var(--surface, #111827);
  }

  .pull-requests-filter-heading {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
    color: var(--text-primary, #f1f5f9);
    font-size: 12px;
    font-weight: 700;
  }

  .pull-requests-filter-grid {
    display: grid;
    grid-template-columns: minmax(220px, 1.5fr) minmax(160px, 1fr);
    gap: 10px;
  }

  .pull-requests-search {
    position: relative;
    min-width: 0;
  }

  .pull-requests-search svg {
    position: absolute;
    top: 50%;
    left: 12px;
    color: var(--text-muted, #718096);
    transform: translateY(-50%);
    pointer-events: none;
  }

  .pull-requests-input,
  .pull-requests-select {
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

  .pull-requests-search .pull-requests-input {
    padding-left: 37px;
  }

  .pull-requests-input:focus,
  .pull-requests-select:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
  }

  .pull-requests-select {
    cursor: pointer;
  }

  .pull-requests-select option {
    background: #111827;
    color: #f1f5f9;
  }

  .pull-requests-clear {
    display: block;
    margin-top: 11px;
    padding: 0;
    border: none;
    background: transparent;
    color: #60a5fa;
    font-family: inherit;
    font-size: 10px;
    font-weight: 650;
    cursor: pointer;
  }

  .pull-requests-clear:hover {
    color: #93c5fd;
  }

  .pull-requests-results-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin: 23px 0 15px;
  }

  .pull-requests-results-title {
    margin: 0;
    color: var(--text-primary, #f1f5f9);
    font-size: 15px;
    font-weight: 750;
  }

  .pull-requests-results-count {
    margin-top: 5px;
    color: var(--text-muted, #718096);
    font-size: 10px;
  }

  .pull-requests-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .pull-request-card {
    overflow: hidden;
    border: 1px solid var(--border, #263244);
    border-radius: 11px;
    background: var(--surface, #111827);
    transition: border-color 0.2s ease;
  }

  .pull-request-card:hover {
    border-color: rgba(59, 130, 246, 0.4);
  }

  .pull-request-card-main {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 15px;
    padding: 17px;
  }

  .pull-request-info {
    min-width: 0;
    flex: 1;
  }

  .pull-request-topline {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 10px;
  }

  .pull-request-status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 7px;
    border: 1px solid transparent;
    border-radius: 5px;
    font-size: 9px;
    font-weight: 750;
    text-transform: uppercase;
  }

  .pull-request-status-open {
    border-color: rgba(34, 197, 94, 0.22);
    background: rgba(34, 197, 94, 0.08);
    color: #4ade80;
  }

  .pull-request-status-merged {
    border-color: rgba(139, 92, 246, 0.22);
    background: rgba(139, 92, 246, 0.08);
    color: #a78bfa;
  }

  .pull-request-status-closed {
    border-color: rgba(239, 68, 68, 0.22);
    background: rgba(239, 68, 68, 0.08);
    color: #f87171;
  }

  .pull-request-status-draft {
    border-color: rgba(234, 179, 8, 0.22);
    background: rgba(234, 179, 8, 0.08);
    color: #facc15;
  }

  .pull-request-number {
    color: var(--text-muted, #718096);
    font-size: 10px;
    font-weight: 650;
  }

  .pull-request-title {
    margin: 0;
    color: var(--text-primary, #f1f5f9);
    font-size: 13px;
    font-weight: 750;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }

  .pull-request-description {
    margin: 7px 0 0;
    color: var(--text-secondary, #94a3b8);
    font-size: 10px;
    line-height: 1.7;
  }

  .pull-request-metadata {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 13px;
    margin-top: 13px;
  }

  .pull-request-meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    color: var(--text-muted, #718096);
    font-size: 9px;
  }

  .pull-request-meta-item span {
    max-width: 230px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .pull-request-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .pull-request-vulnerability-count {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 9px;
    border: 1px solid var(--border, #263244);
    border-radius: 7px;
    background: var(--background, #080d18);
    color: var(--text-secondary, #cbd5e1);
    font-size: 9px;
    font-weight: 650;
    white-space: nowrap;
  }

  .pull-request-external {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border: 1px solid var(--border, #263244);
    border-radius: 8px;
    background: var(--background, #080d18);
    color: var(--text-secondary, #cbd5e1);
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .pull-request-external:hover {
    border-color: #3b82f6;
    color: #60a5fa;
  }

  .pull-request-branches {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 7px;
    margin-top: 12px;
    color: var(--text-muted, #718096);
    font-size: 9px;
  }

  .pull-request-branch {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    max-width: 220px;
    padding: 5px 7px;
    border: 1px solid var(--border, #263244);
    border-radius: 5px;
    background: var(--background, #080d18);
    color: var(--text-secondary, #cbd5e1);
  }

  .pull-request-branch span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .pull-request-changes {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 13px;
    color: var(--text-muted, #718096);
    font-size: 9px;
  }

  .pull-request-additions {
    color: #4ade80;
  }

  .pull-request-deletions {
    color: #f87171;
  }

  .pull-request-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 290px;
    padding: 30px 20px;
    border: 1px dashed var(--border, #334155);
    border-radius: 11px;
    background: var(--surface, #111827);
    text-align: center;
  }

  .pull-request-empty-icon {
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

  .pull-request-empty-title {
    margin: 0;
    color: var(--text-primary, #f1f5f9);
    font-size: 14px;
    font-weight: 750;
  }

  .pull-request-empty-text {
    max-width: 380px;
    margin: 8px 0 16px;
    color: var(--text-muted, #718096);
    font-size: 10px;
    line-height: 1.8;
  }

  .pull-requests-error {
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

  .pull-requests-error-message {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .pull-requests-footer {
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

  .pull-requests-footer-brand {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .pull-requests-spin {
    animation: pull-requests-rotate 1s linear infinite;
  }

  @keyframes pull-requests-rotate {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 1100px) {
    .pull-requests-overview {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 900px) {
    .pull-requests-main {
      margin-left: 0;
    }

    .pull-requests-content {
      padding: 24px;
    }
  }

  @media (max-width: 600px) {
    .pull-requests-content {
      padding: 18px 14px;
    }

    .pull-requests-header {
      flex-direction: column;
    }

    .pull-requests-header-actions {
      width: 100%;
    }

    .pull-requests-header-actions > * {
      flex: 1;
    }

    .pull-requests-overview {
      gap: 9px;
    }

    .pull-requests-stat {
      padding: 12px;
    }

    .pull-requests-filter-grid {
      grid-template-columns: 1fr;
    }

    .pull-request-card-main {
      flex-direction: column;
    }

    .pull-request-actions {
      width: 100%;
      justify-content: flex-start;
    }

    .pull-request-metadata {
      gap: 9px;
    }

    .pull-requests-footer {
      align-items: flex-start;
      flex-direction: column;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .pull-requests-layout *,
    .pull-requests-layout *::before,
    .pull-requests-layout *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`;


function normalizePullRequest(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  const rawStatus = String(
    item.status ??
    item.state ??
    (item.draft ? "draft" : "open")
  ).toLowerCase();

  let status = "open";

  if (item.merged === true || rawStatus === "merged") {
    status = "merged";
  } else if (rawStatus === "closed") {
    status = "closed";
  } else if (item.draft === true || rawStatus === "draft") {
    status = "draft";
  }

  const additions = Number(item.additions ?? 0);
  const deletions = Number(item.deletions ?? 0);

  return {
    ...item,

    id:
      item.id ??
      item.pull_request_id ??
      item.number,

    number:
      item.number ??
      item.pr_number ??
      null,

    title:
      item.title ??
      "Untitled pull request",

    description:
      item.description ??
      item.body ??
      "",

    status,

    repository:
      item.repository_name ??
      item.repository ??
      item.base?.repo?.full_name ??
      "Unknown repository",

    sourceBranch:
      item.source_branch ??
      item.head?.ref ??
      "",

    targetBranch:
      item.target_branch ??
      item.base?.ref ??
      "",

    url:
      item.html_url ??
      item.url ??
      item.pull_request_url ??
      "",

    vulnerabilityCount: Array.isArray(item.vulnerabilities)
      ? item.vulnerabilities.length
      : Number(
          item.vulnerability_count ??
          item.vulnerabilities_fixed ??
          0
        ),

    additions: Number.isFinite(additions) ? additions : 0,

    deletions: Number.isFinite(deletions) ? deletions : 0,

    createdAt:
      item.created_at ??
      item.createdAt ??
      null,

    updatedAt:
      item.updated_at ??
      item.updatedAt ??
      null,

    author:
      item.author?.login ??
      item.author ??
      item.user?.login ??
      null,
  };
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
    merged: "Merged",
    closed: "Closed",
    draft: "Draft",
  };

  return labels[status] ?? "Open";
}


function OverviewStat({
  label,
  value,
  icon: Icon,
  variant,
}) {
  return (
    <div className="pull-requests-stat">
      <div className={`pull-requests-stat-icon pull-requests-stat-${variant}`}>
        <Icon size={18} />
      </div>

      <div>
        <span className="pull-requests-stat-label">
          {label}
        </span>

        <strong className="pull-requests-stat-value">
          {value}
        </strong>
      </div>
    </div>
  );
}


function PullRequestStatus({ status }) {
  const icons = {
    open: CircleDot,
    merged: GitMerge,
    closed: GitPullRequestClosed,
    draft: Clock3,
  };

  const Icon = icons[status] ?? CircleDot;

  return (
    <span className={`pull-request-status pull-request-status-${status}`}>
      <Icon size={11} />

      {formatStatus(status)}
    </span>
  );
}


function PullRequestCard({ pullRequest }) {
  return (
    <article className="pull-request-card">
      <div className="pull-request-card-main">
        <div className="pull-request-info">
          <div className="pull-request-topline">
            <PullRequestStatus status={pullRequest.status} />

            {pullRequest.number !== null && (
              <span className="pull-request-number">
                #{pullRequest.number}
              </span>
            )}
          </div>

          <h3 className="pull-request-title">
            {pullRequest.title}
          </h3>

          {pullRequest.description && (
            <p className="pull-request-description">
              {pullRequest.description}
            </p>
          )}

          <div className="pull-request-metadata">
            <div className="pull-request-meta-item">
              <GitBranch size={12} />

              <span>{pullRequest.repository}</span>
            </div>

            <div className="pull-request-meta-item">
              <Clock3 size={12} />

              <span>
                Created {formatDate(pullRequest.createdAt)}
              </span>
            </div>

            {pullRequest.author && (
              <div className="pull-request-meta-item">
                <CircleDot size={12} />

                <span>{pullRequest.author}</span>
              </div>
            )}
          </div>

          {(pullRequest.sourceBranch || pullRequest.targetBranch) && (
            <div className="pull-request-branches">
              <span>Branches:</span>

              {pullRequest.sourceBranch && (
                <span className="pull-request-branch">
                  <GitBranch size={11} />

                  <span>{pullRequest.sourceBranch}</span>
                </span>
              )}

              <ArrowUpRight size={12} />

              {pullRequest.targetBranch && (
                <span className="pull-request-branch">
                  <GitBranch size={11} />

                  <span>{pullRequest.targetBranch}</span>
                </span>
              )}
            </div>
          )}

          {(pullRequest.additions > 0 || pullRequest.deletions > 0) && (
            <div className="pull-request-changes">
              <GitCommit size={12} />

              <span className="pull-request-additions">
                +{pullRequest.additions}
              </span>

              <span className="pull-request-deletions">
                -{pullRequest.deletions}
              </span>

              <span>Code changes</span>
            </div>
          )}
        </div>

        <div className="pull-request-actions">
          <div className="pull-request-vulnerability-count">
            <ShieldCheck size={13} />

            {pullRequest.vulnerabilityCount}{" "}
            {pullRequest.vulnerabilityCount === 1
              ? "finding"
              : "findings"}
          </div>

          {pullRequest.url && (
            <a
              href={pullRequest.url}
              target="_blank"
              rel="noopener noreferrer"
              className="pull-request-external"
              aria-label={`Open pull request ${pullRequest.number ?? ""} on GitHub`}
              title="View on GitHub"
            >
              <ExternalLink size={15} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}


function EmptyState({ filtered }) {
  return (
    <div className="pull-request-empty">
      <div className="pull-request-empty-icon">
        <GitPullRequest size={25} />
      </div>

      <h2 className="pull-request-empty-title">
        {filtered
          ? "No matching pull requests"
          : "No pull requests yet"}
      </h2>

      <p className="pull-request-empty-text">
        {filtered
          ? "Try adjusting your search query or status filter."
          : "Security pull requests created through the SecureAI remediation workflow will appear here."}
      </p>

      {filtered ? (
        <Link
          to="/remediation"
          className="pull-requests-button"
        >
          Back to Remediation
        </Link>
      ) : (
        <Link
          to="/remediation"
          className="pull-requests-button pull-requests-button-primary"
        >
          <ShieldCheck size={13} />

          Open Remediation Center
        </Link>
      )}
    </div>
  );
}


function PullRequests({
  user,
  notifications = [],
  pullRequests = [],
  loading = false,
  refreshing = false,
  error = null,
  onRefresh,
  onLogout,
  onSearch,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [mobileOpen, setMobileOpen] = useState(false);

  const normalizedPullRequests = useMemo(() => {
    if (!Array.isArray(pullRequests)) {
      return [];
    }

    return pullRequests
      .map(normalizePullRequest)
      .filter(
        (item) =>
          item &&
          item.id !== null &&
          item.id !== undefined
      );
  }, [pullRequests]);

  const counts = useMemo(() => {
    return {
      open: normalizedPullRequests.filter(
        (item) => item.status === "open"
      ).length,

      merged: normalizedPullRequests.filter(
        (item) => item.status === "merged"
      ).length,

      closed: normalizedPullRequests.filter(
        (item) => item.status === "closed"
      ).length,

      draft: normalizedPullRequests.filter(
        (item) => item.status === "draft"
      ).length,
    };
  }, [normalizedPullRequests]);

  const filteredPullRequests = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return normalizedPullRequests.filter((item) => {
      const searchableValues = [
        item.title,
        item.description,
        item.repository,
        item.sourceBranch,
        item.targetBranch,
        item.number,
        item.author,
      ];

      const matchesSearch =
        !query ||
        searchableValues.some((value) =>
          String(value ?? "").toLowerCase().includes(query)
        );

      const matchesStatus =
        statusFilter === "all" ||
        item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [
    normalizedPullRequests,
    searchQuery,
    statusFilter,
  ]);

  const hasFilters =
    searchQuery.trim() !== "" ||
    statusFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  const handleRefresh = () => {
    if (typeof onRefresh === "function" && !refreshing) {
      onRefresh();
    }
  };

  return (
    <>
      <style>{pullRequestsStyles}</style>

      <div className="pull-requests-layout">
        <Sidebar
          user={user}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        <main className="pull-requests-main">
          <Navbar
            user={user}
            notifications={notifications}
            onMobileMenuClick={() => setMobileOpen(true)}
            onLogout={onLogout}
            onSearch={onSearch}
          />

          <div className="pull-requests-content">
            <header className="pull-requests-header">
              <div>
                <div className="pull-requests-eyebrow">
                  <GitPullRequest size={14} />

                  GitHub Integration
                </div>

                <h1 className="pull-requests-title">
                  Pull Requests
                </h1>

                <p className="pull-requests-description">
                  Track security remediation pull requests, review their
                  status and access the corresponding GitHub changes.
                </p>
              </div>

              <div className="pull-requests-header-actions">
                <button
                  type="button"
                  className="pull-requests-button"
                  onClick={handleRefresh}
                  disabled={!onRefresh || refreshing || loading}
                >
                  <RefreshCw
                    size={13}
                    className={
                      refreshing
                        ? "pull-requests-spin"
                        : ""
                    }
                  />

                  Refresh
                </button>

                <Link
                  to="/remediation"
                  className="pull-requests-button pull-requests-button-primary"
                >
                  <ShieldCheck size={13} />

                  Remediation Center
                </Link>
              </div>
            </header>

            {error && (
              <div className="pull-requests-error" role="alert">
                <div className="pull-requests-error-message">
                  <AlertCircle size={15} />

                  {typeof error === "string"
                    ? error
                    : "Unable to retrieve pull requests."}
                </div>

                {onRefresh && (
                  <button
                    type="button"
                    className="pull-requests-button"
                    onClick={handleRefresh}
                    disabled={refreshing}
                  >
                    Retry
                  </button>
                )}
              </div>
            )}

            <section className="pull-requests-overview">
              <OverviewStat
                label="Open Pull Requests"
                value={counts.open}
                icon={GitPullRequest}
                variant="open"
              />

              <OverviewStat
                label="Merged"
                value={counts.merged}
                icon={GitMerge}
                variant="merged"
              />

              <OverviewStat
                label="Closed"
                value={counts.closed}
                icon={GitPullRequestClosed}
                variant="closed"
              />

              <OverviewStat
                label="Draft"
                value={counts.draft}
                icon={Clock3}
                variant="draft"
              />
            </section>

            <section className="pull-requests-filter-panel">
              <div className="pull-requests-filter-heading">
                <Filter size={14} />

                Filter Pull Requests
              </div>

              <div className="pull-requests-filter-grid">
                <div className="pull-requests-search">
                  <Search size={14} />

                  <input
                    type="search"
                    className="pull-requests-input"
                    placeholder="Search title, repository, branch or author..."
                    value={searchQuery}
                    onChange={(event) => {
                      setSearchQuery(event.target.value);
                    }}
                    aria-label="Search pull requests"
                  />
                </div>

                <select
                  className="pull-requests-select"
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value);
                  }}
                  aria-label="Filter pull requests by status"
                >
                  <option value="all">All statuses</option>
                  <option value="open">Open</option>
                  <option value="merged">Merged</option>
                  <option value="closed">Closed</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              {hasFilters && (
                <button
                  type="button"
                  className="pull-requests-clear"
                  onClick={clearFilters}
                >
                  Clear all filters
                </button>
              )}
            </section>

            <section>
              <div className="pull-requests-results-header">
                <div>
                  <h2 className="pull-requests-results-title">
                    Security Pull Requests
                  </h2>

                  <p className="pull-requests-results-count">
                    Showing {filteredPullRequests.length} of{" "}
                    {normalizedPullRequests.length} pull requests
                  </p>
                </div>
              </div>

              {loading ? (
                <Loader
                  size="large"
                  text="Loading pull requests..."
                />
              ) : filteredPullRequests.length > 0 ? (
                <div className="pull-requests-list">
                  {filteredPullRequests.map((pullRequest) => (
                    <PullRequestCard
                      key={pullRequest.id}
                      pullRequest={pullRequest}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState filtered={hasFilters} />
              )}
            </section>

            <footer className="pull-requests-footer">
              <div className="pull-requests-footer-brand">
                <Shield size={13} />

                SecureAI GitHub Integration
              </div>

              <span>
                Pull request status is sourced from backend data.
              </span>
            </footer>
          </div>
        </main>
      </div>
    </>
  );
}


export default PullRequests;