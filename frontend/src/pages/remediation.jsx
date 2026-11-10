import React, { useMemo, useState } from "react";

import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Code2,
  ExternalLink,
  FileCode2,
  Filter,
  GitPullRequest,
  GitBranch,
  LoaderCircle,
  Lock,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  X,
  XCircle,
} from "lucide-react";

import { Link } from "react-router-dom";

import Sidebar from "../components/sidebar.jsx";
import Navbar from "../components/navbar.jsx";
import Loader from "../components/loader.jsx";
import CodeEditor from "../components/code-editor.jsx";


const remediationStyles = `
  .remediation-layout {
    display: flex;
    min-height: 100vh;
    min-height: 100dvh;
    background: var(--background, #080d18);
    color: var(--text-primary, #f1f5f9);
  }

  .remediation-main {
    flex: 1;
    min-width: 0;
    margin-left: 260px;
  }

  .remediation-content {
    width: 100%;
    max-width: 1550px;
    margin: 0 auto;
    padding: 30px;
  }

  .remediation-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 25px;
  }

  .remediation-eyebrow {
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

  .remediation-title {
    margin: 0;
    color: var(--text-primary, #f1f5f9);
    font-size: clamp(25px, 3vw, 32px);
    font-weight: 750;
    letter-spacing: -0.04em;
  }

  .remediation-description {
    max-width: 680px;
    margin: 10px 0 0;
    color: var(--text-secondary, #94a3b8);
    font-size: 13px;
    line-height: 1.7;
  }

  .remediation-header-actions {
    display: flex;
    gap: 9px;
    flex-shrink: 0;
  }

  .remediation-button {
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

  .remediation-button:hover:not(:disabled) {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.08);
  }

  .remediation-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .remediation-button-primary {
    border-color: transparent;
    background: linear-gradient(135deg, #2563eb, #0891b2);
    color: #ffffff;
  }

  .remediation-button-primary:hover:not(:disabled) {
    border-color: transparent;
    background: linear-gradient(135deg, #1d4ed8, #0e7490);
  }

  .remediation-button-success {
    border-color: rgba(34, 197, 94, 0.25);
    background: rgba(34, 197, 94, 0.08);
    color: #86efac;
  }

  .remediation-button-success:hover:not(:disabled) {
    border-color: rgba(34, 197, 94, 0.5);
    background: rgba(34, 197, 94, 0.14);
  }

  .remediation-button-danger {
    border-color: rgba(239, 68, 68, 0.25);
    background: rgba(239, 68, 68, 0.07);
    color: #fca5a5;
  }

  .remediation-button-danger:hover:not(:disabled) {
    border-color: rgba(239, 68, 68, 0.5);
    background: rgba(239, 68, 68, 0.13);
  }

  .remediation-overview {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 13px;
    margin-bottom: 23px;
  }

  .remediation-stat {
    display: flex;
    align-items: center;
    gap: 13px;
    min-width: 0;
    padding: 17px;
    border: 1px solid var(--border, #263244);
    border-radius: 11px;
    background: var(--surface, #111827);
  }

  .remediation-stat-icon {
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

  .remediation-stat-label {
    display: block;
    margin-bottom: 5px;
    color: var(--text-muted, #718096);
    font-size: 9px;
    font-weight: 650;
  }

  .remediation-stat-value {
    display: block;
    color: var(--text-primary, #f1f5f9);
    font-size: 23px;
    font-weight: 750;
    font-variant-numeric: tabular-nums;
  }

  .remediation-stat-pending {
    --stat-color: #facc15;
    --stat-border: rgba(234, 179, 8, 0.2);
    --stat-background: rgba(234, 179, 8, 0.08);
  }

  .remediation-stat-approved {
    --stat-color: #60a5fa;
    --stat-border: rgba(59, 130, 246, 0.2);
    --stat-background: rgba(59, 130, 246, 0.08);
  }

  .remediation-stat-validated {
    --stat-color: #34d399;
    --stat-border: rgba(16, 185, 129, 0.2);
    --stat-background: rgba(16, 185, 129, 0.08);
  }

  .remediation-stat-rejected {
    --stat-color: #f87171;
    --stat-border: rgba(239, 68, 68, 0.2);
    --stat-background: rgba(239, 68, 68, 0.08);
  }

  .remediation-filter-panel {
    margin-bottom: 20px;
    padding: 17px;
    border: 1px solid var(--border, #263244);
    border-radius: 11px;
    background: var(--surface, #111827);
  }

  .remediation-filter-heading {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
    color: var(--text-primary, #f1f5f9);
    font-size: 12px;
    font-weight: 700;
  }

  .remediation-filter-grid {
    display: grid;
    grid-template-columns: minmax(220px, 1.5fr) repeat(2, minmax(150px, 1fr));
    gap: 10px;
  }

  .remediation-search {
    position: relative;
    min-width: 0;
  }

  .remediation-search svg {
    position: absolute;
    top: 50%;
    left: 12px;
    color: var(--text-muted, #718096);
    transform: translateY(-50%);
    pointer-events: none;
  }

  .remediation-input,
  .remediation-select {
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

  .remediation-search .remediation-input {
    padding-left: 37px;
  }

  .remediation-input:focus,
  .remediation-select:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
  }

  .remediation-select {
    cursor: pointer;
  }

  .remediation-select option {
    background: #111827;
    color: #f1f5f9;
  }

  .remediation-clear {
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

  .remediation-clear:hover {
    color: #93c5fd;
  }

  .remediation-results-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin: 23px 0 15px;
  }

  .remediation-results-title {
    margin: 0;
    color: var(--text-primary, #f1f5f9);
    font-size: 15px;
    font-weight: 750;
  }

  .remediation-results-count {
    margin-top: 5px;
    color: var(--text-muted, #718096);
    font-size: 10px;
  }

  .remediation-list {
    display: flex;
    flex-direction: column;
    gap: 13px;
  }

  .remediation-card {
    overflow: hidden;
    border: 1px solid var(--border, #263244);
    border-radius: 11px;
    background: var(--surface, #111827);
    transition: border-color 0.2s ease;
  }

  .remediation-card-expanded {
    border-color: rgba(59, 130, 246, 0.45);
  }

  .remediation-card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 15px;
    padding: 17px;
  }

  .remediation-card-main {
    min-width: 0;
    flex: 1;
  }

  .remediation-card-topline {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 10px;
  }

  .remediation-severity {
    padding: 4px 7px;
    border: 1px solid transparent;
    border-radius: 5px;
    font-size: 9px;
    font-weight: 750;
    text-transform: uppercase;
  }

  .remediation-severity-critical {
    border-color: rgba(239, 68, 68, 0.25);
    background: rgba(239, 68, 68, 0.09);
    color: #f87171;
  }

  .remediation-severity-high {
    border-color: rgba(249, 115, 22, 0.25);
    background: rgba(249, 115, 22, 0.09);
    color: #fb923c;
  }

  .remediation-severity-medium {
    border-color: rgba(234, 179, 8, 0.25);
    background: rgba(234, 179, 8, 0.09);
    color: #facc15;
  }

  .remediation-severity-low {
    border-color: rgba(59, 130, 246, 0.25);
    background: rgba(59, 130, 246, 0.09);
    color: #60a5fa;
  }

  .remediation-severity-info {
    border-color: rgba(139, 92, 246, 0.25);
    background: rgba(139, 92, 246, 0.09);
    color: #a78bfa;
  }

  .remediation-status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 7px;
    border: 1px solid var(--border, #263244);
    border-radius: 5px;
    color: var(--text-secondary, #cbd5e1);
    font-size: 9px;
    font-weight: 650;
  }

  .remediation-status-pending {
    border-color: rgba(234, 179, 8, 0.2);
    background: rgba(234, 179, 8, 0.06);
    color: #facc15;
  }

  .remediation-status-approved {
    border-color: rgba(59, 130, 246, 0.2);
    background: rgba(59, 130, 246, 0.06);
    color: #60a5fa;
  }

  .remediation-status-validated {
    border-color: rgba(16, 185, 129, 0.2);
    background: rgba(16, 185, 129, 0.06);
    color: #34d399;
  }

  .remediation-status-rejected {
    border-color: rgba(239, 68, 68, 0.2);
    background: rgba(239, 68, 68, 0.06);
    color: #f87171;
  }

  .remediation-card-title {
    margin: 0;
    color: var(--text-primary, #f1f5f9);
    font-size: 13px;
    font-weight: 750;
    line-height: 1.5;
  }

  .remediation-card-description {
    margin: 7px 0 0;
    color: var(--text-secondary, #94a3b8);
    font-size: 10px;
    line-height: 1.7;
  }

  .remediation-metadata {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 13px;
    margin-top: 13px;
  }

  .remediation-meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    color: var(--text-muted, #718096);
    font-size: 9px;
  }

  .remediation-meta-item span {
    max-width: 230px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .remediation-card-actions {
    display: flex;
    align-items: center;
    gap: 7px;
    flex-shrink: 0;
  }

  .remediation-icon-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border: 1px solid var(--border, #263244);
    border-radius: 8px;
    background: var(--background, #080d18);
    color: var(--text-secondary, #cbd5e1);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .remediation-icon-button:hover {
    border-color: #3b82f6;
    color: #60a5fa;
  }

  .remediation-expanded-content {
    padding: 17px;
    border-top: 1px solid var(--border, #263244);
    background: rgba(8, 13, 24, 0.28);
  }

  .remediation-expanded-heading {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 14px;
    color: var(--text-primary, #f1f5f9);
    font-size: 12px;
    font-weight: 750;
  }

  .remediation-code-container {
    margin-bottom: 15px;
    padding: 13px;
    border: 1px solid var(--border, #263244);
    border-radius: 9px;
    background: var(--surface, #111827);
  }

  .remediation-code-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 12px;
    color: var(--text-secondary, #cbd5e1);
    font-size: 10px;
    font-weight: 700;
  }

  .remediation-validation {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    margin-top: 13px;
    padding: 11px;
    border: 1px solid var(--validation-border);
    border-radius: 8px;
    background: var(--validation-background);
    color: var(--validation-color);
    font-size: 10px;
    line-height: 1.7;
  }

  .remediation-validation svg {
    flex-shrink: 0;
    margin-top: 1px;
  }

  .remediation-validation-success {
    --validation-border: rgba(16, 185, 129, 0.22);
    --validation-background: rgba(16, 185, 129, 0.07);
    --validation-color: #6ee7b7;
  }

  .remediation-validation-failed {
    --validation-border: rgba(239, 68, 68, 0.22);
    --validation-background: rgba(239, 68, 68, 0.07);
    --validation-color: #fca5a5;
  }

  .remediation-validation-pending {
    --validation-border: rgba(234, 179, 8, 0.22);
    --validation-background: rgba(234, 179, 8, 0.07);
    --validation-color: #fde68a;
  }

  .remediation-expanded-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 9px;
    margin-top: 15px;
  }

  .remediation-empty {
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

  .remediation-empty-icon {
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

  .remediation-empty-title {
    margin: 0;
    color: var(--text-primary, #f1f5f9);
    font-size: 14px;
    font-weight: 750;
  }

  .remediation-empty-text {
    max-width: 380px;
    margin: 8px 0 16px;
    color: var(--text-muted, #718096);
    font-size: 10px;
    line-height: 1.8;
  }

  .remediation-error {
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

  .remediation-error-message {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .remediation-footer {
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

  .remediation-footer-brand {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .remediation-spin {
    animation: remediation-rotate 1s linear infinite;
  }

  @keyframes remediation-rotate {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 1100px) {
    .remediation-overview {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .remediation-filter-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 900px) {
    .remediation-main {
      margin-left: 0;
    }

    .remediation-content {
      padding: 24px;
    }
  }

  @media (max-width: 600px) {
    .remediation-content {
      padding: 18px 14px;
    }

    .remediation-header {
      flex-direction: column;
    }

    .remediation-header-actions {
      width: 100%;
    }

    .remediation-header-actions > * {
      flex: 1;
    }

    .remediation-overview {
      gap: 9px;
    }

    .remediation-stat {
      padding: 12px;
    }

    .remediation-filter-grid {
      grid-template-columns: 1fr;
    }

    .remediation-card-header {
      flex-direction: column;
    }

    .remediation-card-actions {
      width: 100%;
    }

    .remediation-card-actions .remediation-button {
      flex: 1;
    }

    .remediation-metadata {
      gap: 9px;
    }

    .remediation-results-header {
      align-items: flex-start;
      flex-direction: column;
    }

    .remediation-footer {
      align-items: flex-start;
      flex-direction: column;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .remediation-layout *,
    .remediation-layout *::before,
    .remediation-layout *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`;


const VALID_STATUSES = [
  "pending",
  "approved",
  "validated",
  "rejected",
];


function normalizeRemediation(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  const rawStatus = String(
    item.status ?? "pending"
  )
    .toLowerCase()
    .replaceAll("-", "_")
    .replaceAll(" ", "_");

  const status = VALID_STATUSES.includes(rawStatus)
    ? rawStatus
    : "pending";

  const severity = String(
    item.severity ??
    item.vulnerability?.severity ??
    "unknown"
  ).toLowerCase();

  return {
    ...item,

    id:
      item.id ??
      item.remediation_id,

    title:
      item.title ??
      item.vulnerability?.title ??
      item.vulnerability_name ??
      "Untitled remediation",

    description:
      item.description ??
      item.summary ??
      item.vulnerability?.description ??
      "",

    severity,

    status,

    repository:
      item.repository_name ??
      item.repository ??
      item.vulnerability?.repository ??
      "Unknown repository",

    filePath:
      item.file_path ??
      item.file ??
      item.vulnerability?.file_path ??
      item.vulnerability?.file ??
      "",

    scanner:
      item.scanner ??
      item.vulnerability?.scanner ??
      "Unknown scanner",

    language:
      item.language ??
      item.vulnerability?.language ??
      "javascript",

    originalCode:
      item.original_code ??
      item.originalCode ??
      "",

    suggestedCode:
      item.suggested_code ??
      item.suggestedCode ??
      "",

    validationResult:
      item.validation_result ??
      item.validationResult ??
      null,

    pullRequestUrl:
      item.pull_request_url ??
      item.pullRequestUrl ??
      null,

    createdAt:
      item.created_at ??
      item.createdAt ??
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
    pending: "Pending Review",
    approved: "Approved",
    validated: "Validated",
    rejected: "Rejected",
  };

  return labels[status] ?? "Pending Review";
}


function OverviewStat({
  label,
  value,
  icon: Icon,
  variant,
}) {
  return (
    <div className="remediation-stat">
      <div className={`remediation-stat-icon remediation-stat-${variant}`}>
        <Icon size={18} />
      </div>

      <div>
        <span className="remediation-stat-label">
          {label}
        </span>

        <strong className="remediation-stat-value">
          {value}
        </strong>
      </div>
    </div>
  );
}


function StatusBadge({ status }) {
  const icons = {
    pending: Clock3,
    approved: CheckCircle2,
    validated: ShieldCheck,
    rejected: XCircle,
  };

  const Icon = icons[status] ?? Clock3;

  return (
    <span className={`remediation-status remediation-status-${status}`}>
      <Icon size={11} />

      {formatStatus(status)}
    </span>
  );
}


function SeverityBadge({ severity }) {
  const normalized =
    severity === "informational" || severity === "information"
      ? "info"
      : severity === "moderate"
        ? "medium"
        : severity;

  const valid = [
    "critical",
    "high",
    "medium",
    "low",
    "info",
  ];

  const safeSeverity = valid.includes(normalized)
    ? normalized
    : "info";

  return (
    <span
      className={`remediation-severity remediation-severity-${safeSeverity}`}
    >
      {safeSeverity}
    </span>
  );
}


function RemediationCard({
  remediation,
  expanded,
  onToggle,
  onApprove,
  onReject,
  onValidate,
  onCreatePR,
  busy,
}) {
  const validation = remediation.validationResult;

  const validationStatus = validation?.status ??
    (validation?.passed === true
      ? "success"
      : validation?.passed === false
        ? "failed"
        : null);

  const isValidated = remediation.status === "validated";

  return (
    <article
      className={[
        "remediation-card",
        expanded ? "remediation-card-expanded" : "",
      ].filter(Boolean).join(" ")}
    >
      <div className="remediation-card-header">
        <div className="remediation-card-main">
          <div className="remediation-card-topline">
            <SeverityBadge severity={remediation.severity} />

            <StatusBadge status={remediation.status} />
          </div>

          <h3 className="remediation-card-title">
            {remediation.title}
          </h3>

          {remediation.description && (
            <p className="remediation-card-description">
              {remediation.description}
            </p>
          )}

          <div className="remediation-metadata">
            <div className="remediation-meta-item">
              <GitBranch size={12} />

              <span>{remediation.repository}</span>
            </div>

            <div className="remediation-meta-item">
              <FileCode2 size={12} />

              <span>{remediation.filePath || "File unavailable"}</span>
            </div>

            <div className="remediation-meta-item">
              <Clock3 size={12} />

              <span>{formatDate(remediation.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="remediation-card-actions">
          {remediation.status === "pending" && onApprove && (
            <button
              type="button"
              className="remediation-button remediation-button-success"
              onClick={() => onApprove(remediation)}
              disabled={busy}
            >
              <Check size={13} />

              Approve
            </button>
          )}

          <button
            type="button"
            className="remediation-icon-button"
            onClick={onToggle}
            aria-expanded={expanded}
            aria-label={
              expanded
                ? "Collapse remediation details"
                : "Expand remediation details"
            }
          >
            <ChevronDown
              size={16}
              style={{
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="remediation-expanded-content">
          <h4 className="remediation-expanded-heading">
            <Code2 size={15} />

            Patch Review
          </h4>

          {(remediation.originalCode || remediation.suggestedCode) ? (
            <div className="remediation-code-container">
              <div className="remediation-code-label">
                <span>Original vs. Suggested Code</span>

                <span>{remediation.language}</span>
              </div>

              <CodeEditor
                code={remediation.originalCode}
                suggestedCode={remediation.suggestedCode}
                language={remediation.language}
                filePath={remediation.filePath}
              />
            </div>
          ) : (
            <div className="remediation-validation remediation-validation-pending">
              <AlertCircle size={14} />

              Code comparison is not available for this remediation record.
            </div>
          )}

          {validationStatus && (
            <div
              className={[
                "remediation-validation",
                validationStatus === "success" || validationStatus === "passed"
                  ? "remediation-validation-success"
                  : validationStatus === "failed" || validationStatus === "error"
                    ? "remediation-validation-failed"
                    : "remediation-validation-pending",
              ].join(" ")}
            >
              {validationStatus === "success" || validationStatus === "passed" ? (
                <CheckCircle2 size={14} />
              ) : validationStatus === "failed" || validationStatus === "error" ? (
                <XCircle size={14} />
              ) : (
                <Clock3 size={14} />
              )}

              <span>
                <strong>Validation result: </strong>

                {validation?.message ??
                  validation?.summary ??
                  String(validationStatus)}
              </span>
            </div>
          )}

          <div className="remediation-expanded-actions">
            {remediation.status === "pending" && onApprove && (
              <button
                type="button"
                className="remediation-button remediation-button-success"
                onClick={() => onApprove(remediation)}
                disabled={busy}
              >
                <Check size={13} />

                Approve Patch
              </button>
            )}

            {(remediation.status === "pending" ||
              remediation.status === "approved") &&
              onValidate && (
                <button
                  type="button"
                  className="remediation-button"
                  onClick={() => onValidate(remediation)}
                  disabled={busy}
                >
                  {busy ? (
                    <LoaderCircle
                      size={13}
                      className="remediation-spin"
                    />
                  ) : (
                    <ShieldCheck size={13} />
                  )}

                  Validate Patch
                </button>
              )}

            {remediation.status === "pending" && onReject && (
              <button
                type="button"
                className="remediation-button remediation-button-danger"
                onClick={() => onReject(remediation)}
                disabled={busy}
              >
                <X size={13} />

                Reject
              </button>
            )}

            {isValidated && onCreatePR && (
              <button
                type="button"
                className="remediation-button remediation-button-primary"
                onClick={() => onCreatePR(remediation)}
                disabled={busy}
              >
                <GitPullRequest size={13} />

                Create Pull Request
              </button>
            )}

            {remediation.pullRequestUrl && (
              <a
                href={remediation.pullRequestUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="remediation-button"
              >
                <ExternalLink size={13} />

                View Pull Request
              </a>
            )}
          </div>

          {isValidated && !remediation.pullRequestUrl && (
            <div className="remediation-validation remediation-validation-success">
              <ShieldCheck size={14} />

              Patch validation has been marked successful. Review the
              validation details before creating a pull request.
            </div>
          )}
        </div>
      )}
    </article>
  );
}


function EmptyState({ filtered }) {
  return (
    <div className="remediation-empty">
      <div className="remediation-empty-icon">
        <ShieldCheck size={25} />
      </div>

      <h2 className="remediation-empty-title">
        {filtered
          ? "No matching remediations"
          : "No remediation records yet"}
      </h2>

      <p className="remediation-empty-text">
        {filtered
          ? "Try changing your search query or filters to find remediation records."
          : "AI-generated remediation records will appear here when they are created for detected vulnerabilities."}
      </p>

      {filtered ? (
        <Link
          to="/vulnerabilities"
          className="remediation-button"
        >
          Browse Vulnerabilities

          <ArrowRight size={13} />
        </Link>
      ) : (
        <Link
          to="/ai-review"
          className="remediation-button remediation-button-primary"
        >
          <Sparkles size={13} />

          Open AI Review
        </Link>
      )}
    </div>
  );
}


function Remediation({
  user,
  notifications = [],
  remediations = [],
  loading = false,
  refreshing = false,
  error = null,
  busyId = null,
  onRefresh,
  onApprove,
  onReject,
  onValidate,
  onCreatePR,
  onLogout,
  onSearch,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const normalizedRemediations = useMemo(() => {
    if (!Array.isArray(remediations)) {
      return [];
    }

    return remediations
      .map(normalizeRemediation)
      .filter(
        (item) =>
          item &&
          item.id !== null &&
          item.id !== undefined
      );
  }, [remediations]);

  const counts = useMemo(() => {
    return {
      pending: normalizedRemediations.filter(
        (item) => item.status === "pending"
      ).length,

      approved: normalizedRemediations.filter(
        (item) => item.status === "approved"
      ).length,

      validated: normalizedRemediations.filter(
        (item) => item.status === "validated"
      ).length,

      rejected: normalizedRemediations.filter(
        (item) => item.status === "rejected"
      ).length,
    };
  }, [normalizedRemediations]);

  const filteredRemediations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return normalizedRemediations.filter((item) => {
      const searchableValues = [
        item.title,
        item.description,
        item.repository,
        item.filePath,
        item.scanner,
        item.id,
      ];

      const matchesSearch =
        !query ||
        searchableValues.some((value) =>
          String(value ?? "").toLowerCase().includes(query)
        );

      const matchesStatus =
        statusFilter === "all" ||
        item.status === statusFilter;

      const severity = item.severity === "informational"
        ? "info"
        : item.severity === "moderate"
          ? "medium"
          : item.severity;

      const matchesSeverity =
        severityFilter === "all" ||
        severity === severityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesSeverity
      );
    });
  }, [
    normalizedRemediations,
    searchQuery,
    statusFilter,
    severityFilter,
  ]);

  const hasFilters =
    searchQuery.trim() !== "" ||
    statusFilter !== "all" ||
    severityFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSeverityFilter("all");
  };

  const handleRefresh = () => {
    if (typeof onRefresh === "function" && !refreshing) {
      onRefresh();
    }
  };

  const isBusy = (remediation) => {
    return (
      busyId !== null &&
      String(busyId) === String(remediation.id)
    );
  };

  return (
    <>
      <style>{remediationStyles}</style>

      <div className="remediation-layout">
        <Sidebar
          user={user}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        <main className="remediation-main">
          <Navbar
            user={user}
            notifications={notifications}
            onMobileMenuClick={() => setMobileOpen(true)}
            onLogout={onLogout}
            onSearch={onSearch}
          />

          <div className="remediation-content">
            <header className="remediation-header">
              <div>
                <div className="remediation-eyebrow">
                  <ShieldCheck size={14} />

                  Security Remediation
                </div>

                <h1 className="remediation-title">
                  Remediation Center
                </h1>

                <p className="remediation-description">
                  Review AI-generated patches, validate proposed fixes
                  and prepare approved changes for GitHub pull requests.
                </p>
              </div>

              <div className="remediation-header-actions">
                <button
                  type="button"
                  className="remediation-button"
                  onClick={handleRefresh}
                  disabled={!onRefresh || refreshing || loading}
                >
                  <RefreshCw
                    size={13}
                    className={refreshing ? "remediation-spin" : ""}
                  />

                  Refresh
                </button>

                <Link
                  to="/pull-requests"
                  className="remediation-button remediation-button-primary"
                >
                  <GitPullRequest size={13} />

                  Pull Requests
                </Link>
              </div>
            </header>

            {error && (
              <div className="remediation-error" role="alert">
                <div className="remediation-error-message">
                  <AlertCircle size={15} />

                  {typeof error === "string"
                    ? error
                    : "Unable to retrieve remediation records."}
                </div>

                {onRefresh && (
                  <button
                    type="button"
                    className="remediation-button"
                    onClick={handleRefresh}
                    disabled={refreshing}
                  >
                    Retry
                  </button>
                )}
              </div>
            )}

            <section className="remediation-overview">
              <OverviewStat
                label="Pending Review"
                value={counts.pending}
                icon={Clock3}
                variant="pending"
              />

              <OverviewStat
                label="Approved"
                value={counts.approved}
                icon={CheckCircle2}
                variant="approved"
              />

              <OverviewStat
                label="Validated"
                value={counts.validated}
                icon={ShieldCheck}
                variant="validated"
              />

              <OverviewStat
                label="Rejected"
                value={counts.rejected}
                icon={XCircle}
                variant="rejected"
              />
            </section>

            <section className="remediation-filter-panel">
              <div className="remediation-filter-heading">
                <Filter size={14} />

                Filter Remediations
              </div>

              <div className="remediation-filter-grid">
                <div className="remediation-search">
                  <Search size={14} />

                  <input
                    type="search"
                    className="remediation-input"
                    placeholder="Search vulnerability, repository or file..."
                    value={searchQuery}
                    onChange={(event) => {
                      setSearchQuery(event.target.value);
                    }}
                    aria-label="Search remediations"
                  />
                </div>

                <select
                  className="remediation-select"
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value);
                  }}
                  aria-label="Filter by remediation status"
                >
                  <option value="all">All statuses</option>
                  <option value="pending">Pending Review</option>
                  <option value="approved">Approved</option>
                  <option value="validated">Validated</option>
                  <option value="rejected">Rejected</option>
                </select>

                <select
                  className="remediation-select"
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
              </div>

              {hasFilters && (
                <button
                  type="button"
                  className="remediation-clear"
                  onClick={clearFilters}
                >
                  Clear all filters
                </button>
              )}
            </section>

            <section>
              <div className="remediation-results-header">
                <div>
                  <h2 className="remediation-results-title">
                    Remediation Tasks
                  </h2>

                  <p className="remediation-results-count">
                    Showing {filteredRemediations.length} of{" "}
                    {normalizedRemediations.length} records
                  </p>
                </div>
              </div>

              {loading ? (
                <Loader
                  size="large"
                  text="Loading remediation records..."
                />
              ) : filteredRemediations.length > 0 ? (
                <div className="remediation-list">
                  {filteredRemediations.map((remediation) => (
                    <RemediationCard
                      key={remediation.id}
                      remediation={remediation}
                      expanded={
                        String(expandedId) === String(remediation.id)
                      }
                      onToggle={() => {
                        setExpandedId((current) =>
                          String(current) === String(remediation.id)
                            ? null
                            : remediation.id
                        );
                      }}
                      onApprove={onApprove}
                      onReject={onReject}
                      onValidate={onValidate}
                      onCreatePR={onCreatePR}
                      busy={isBusy(remediation)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState filtered={hasFilters} />
              )}
            </section>

            <footer className="remediation-footer">
              <div className="remediation-footer-brand">
                <Shield size={13} />

                SecureAI Remediation Engine
              </div>

              <span>
                Review and validate every patch before merging.
              </span>
            </footer>
          </div>
        </main>
      </div>
    </>
  );
}


export default Remediation;