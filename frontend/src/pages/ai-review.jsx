import React, { useMemo, useState } from "react";

import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Code2,
  FileCode2,
  Lightbulb,
  Lock,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  WandSparkles,
  XCircle,
  Zap,
} from "lucide-react";

import { Link } from "react-router-dom";

import Sidebar from "../components/sidebar.jsx";
import Navbar from "../components/navbar.jsx";
import Loader from "../components/loader.jsx";
import CodeEditor from "../components/code-editor.jsx";


const aiReviewStyles = `
  .ai-review-layout {
    display: flex;
    min-height: 100vh;
    min-height: 100dvh;
    background: var(--background, #080d18);
    color: var(--text-primary, #f1f5f9);
  }

  .ai-review-main {
    flex: 1;
    min-width: 0;
    margin-left: 260px;
  }

  .ai-review-content {
    width: 100%;
    max-width: 1550px;
    margin: 0 auto;
    padding: 30px;
  }

  .ai-review-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 25px;
  }

  .ai-review-heading {
    min-width: 0;
  }

  .ai-review-eyebrow {
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

  .ai-review-title {
    margin: 0;
    color: var(--text-primary, #f1f5f9);
    font-size: clamp(25px, 3vw, 32px);
    font-weight: 750;
    letter-spacing: -0.04em;
    line-height: 1.2;
  }

  .ai-review-description {
    max-width: 680px;
    margin: 10px 0 0;
    color: var(--text-secondary, #94a3b8);
    font-size: 13px;
    line-height: 1.7;
  }

  .ai-review-header-action {
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
    transition: all 0.2s ease;
  }

  .ai-review-header-action:hover {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.08);
  }

  .ai-review-hero {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 25px;
    margin-bottom: 23px;
    padding: 25px;
    overflow: hidden;
    border: 1px solid rgba(59, 130, 246, 0.25);
    border-radius: 14px;
    background:
      radial-gradient(
        circle at 85% 20%,
        rgba(34, 211, 238, 0.12),
        transparent 32%
      ),
      linear-gradient(
        115deg,
        rgba(30, 64, 175, 0.18),
        rgba(8, 145, 178, 0.06)
      ),
      var(--surface, #111827);
  }

  .ai-review-hero-content {
    position: relative;
    z-index: 1;
    max-width: 650px;
  }

  .ai-review-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 13px;
    padding: 6px 9px;
    border: 1px solid rgba(96, 165, 250, 0.25);
    border-radius: 20px;
    background: rgba(59, 130, 246, 0.10);
    color: #93c5fd;
    font-size: 9px;
    font-weight: 750;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .ai-review-hero-title {
    margin: 0;
    color: #f8fafc;
    font-size: 21px;
    font-weight: 750;
    letter-spacing: -0.025em;
  }

  .ai-review-hero-text {
    margin: 9px 0 0;
    color: #a5b4c8;
    font-size: 11px;
    line-height: 1.8;
  }

  .ai-review-hero-visual {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 100px;
    height: 100px;
    border: 1px solid rgba(96, 165, 250, 0.25);
    border-radius: 25px;
    background: rgba(59, 130, 246, 0.09);
    color: #60a5fa;
  }

  .ai-review-hero-visual::before {
    position: absolute;
    width: 125px;
    height: 125px;
    border: 1px dashed rgba(96, 165, 250, 0.2);
    border-radius: 50%;
    content: "";
  }

  .ai-review-workspace {
    display: grid;
    grid-template-columns: minmax(280px, 0.85fr) minmax(0, 1.7fr);
    gap: 18px;
    align-items: start;
  }

  .ai-review-panel {
    min-width: 0;
    padding: 20px;
    border: 1px solid var(--border, #263244);
    border-radius: 12px;
    background: var(--surface, #111827);
  }

  .ai-review-panel-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 18px;
  }

  .ai-review-panel-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-radius: 9px;
    background: rgba(59, 130, 246, 0.10);
    color: #60a5fa;
  }

  .ai-review-panel-title {
    margin: 0;
    color: var(--text-primary, #f1f5f9);
    font-size: 13px;
    font-weight: 750;
  }

  .ai-review-panel-subtitle {
    margin: 4px 0 0;
    color: var(--text-muted, #718096);
    font-size: 10px;
  }

  .ai-review-form-group {
    margin-bottom: 17px;
  }

  .ai-review-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 8px;
    color: var(--text-secondary, #cbd5e1);
    font-size: 10px;
    font-weight: 650;
  }

  .ai-review-label-hint {
    color: var(--text-muted, #718096);
    font-size: 9px;
    font-weight: 450;
  }

  .ai-review-select,
  .ai-review-textarea,
  .ai-review-input {
    width: 100%;
    border: 1px solid var(--border, #263244);
    border-radius: 8px;
    outline: none;
    background: var(--background, #080d18);
    color: var(--text-primary, #f1f5f9);
    font-family: inherit;
    font-size: 11px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .ai-review-select {
    min-height: 42px;
    padding: 0 11px;
    cursor: pointer;
  }

  .ai-review-select option {
    background: #111827;
    color: #f1f5f9;
  }

  .ai-review-textarea {
    min-height: 105px;
    padding: 11px;
    resize: vertical;
    line-height: 1.6;
  }

  .ai-review-input {
    min-height: 40px;
    padding: 0 11px;
  }

  .ai-review-select:focus,
  .ai-review-textarea:focus,
  .ai-review-input:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
  }

  .ai-review-select:disabled,
  .ai-review-textarea:disabled,
  .ai-review-input:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .ai-review-textarea::placeholder,
  .ai-review-input::placeholder {
    color: var(--text-muted, #718096);
  }

  .ai-review-selected-card {
    margin-bottom: 17px;
    padding: 13px;
    border: 1px solid var(--border, #263244);
    border-radius: 9px;
    background: rgba(8, 13, 24, 0.55);
  }

  .ai-review-selected-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 10px;
  }

  .ai-review-selected-label {
    color: var(--text-muted, #718096);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .ai-review-severity {
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

  .ai-review-severity-critical {
    border-color: rgba(239, 68, 68, 0.25);
    background: rgba(239, 68, 68, 0.10);
    color: #f87171;
  }

  .ai-review-severity-high {
    border-color: rgba(249, 115, 22, 0.25);
    background: rgba(249, 115, 22, 0.10);
    color: #fb923c;
  }

  .ai-review-severity-medium {
    border-color: rgba(234, 179, 8, 0.25);
    background: rgba(234, 179, 8, 0.10);
    color: #facc15;
  }

  .ai-review-severity-low {
    border-color: rgba(59, 130, 246, 0.25);
    background: rgba(59, 130, 246, 0.10);
    color: #60a5fa;
  }

  .ai-review-severity-info {
    border-color: rgba(139, 92, 246, 0.25);
    background: rgba(139, 92, 246, 0.10);
    color: #a78bfa;
  }

  .ai-review-selected-title {
    margin: 0;
    color: var(--text-primary, #f1f5f9);
    font-size: 12px;
    font-weight: 700;
    line-height: 1.5;
  }

  .ai-review-selected-meta {
    display: flex;
    flex-direction: column;
    gap: 7px;
    margin-top: 11px;
  }

  .ai-review-meta-row {
    display: flex;
    align-items: center;
    gap: 7px;
    min-width: 0;
    color: var(--text-muted, #718096);
    font-size: 9px;
  }

  .ai-review-meta-row span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ai-review-run-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    width: 100%;
    min-height: 43px;
    padding: 0 14px;
    border: none;
    border-radius: 8px;
    background: linear-gradient(135deg, #2563eb, #0891b2);
    color: #ffffff;
    font-family: inherit;
    font-size: 11px;
    font-weight: 750;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .ai-review-run-button:hover:not(:disabled) {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  .ai-review-run-button:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
  }

  .ai-review-notice {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-top: 14px;
    padding: 10px;
    border: 1px solid rgba(96, 165, 250, 0.16);
    border-radius: 8px;
    background: rgba(59, 130, 246, 0.05);
    color: var(--text-muted, #94a3b8);
    font-size: 9px;
    line-height: 1.7;
  }

  .ai-review-notice svg {
    flex-shrink: 0;
    margin-top: 1px;
    color: #60a5fa;
  }

  .ai-review-results {
    min-width: 0;
  }

  .ai-review-results-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 15px;
  }

  .ai-review-results-title {
    margin: 0;
    color: var(--text-primary, #f1f5f9);
    font-size: 15px;
    font-weight: 750;
  }

  .ai-review-results-description {
    margin: 5px 0 0;
    color: var(--text-muted, #718096);
    font-size: 10px;
  }

  .ai-review-results-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 9px;
    border: 1px solid rgba(34, 197, 94, 0.2);
    border-radius: 20px;
    background: rgba(34, 197, 94, 0.07);
    color: #86efac;
    font-size: 9px;
    font-weight: 700;
    white-space: nowrap;
  }

  .ai-review-error {
    display: flex;
    align-items: center;
    gap: 9px;
    margin-bottom: 15px;
    padding: 12px;
    border: 1px solid rgba(239, 68, 68, 0.25);
    border-radius: 8px;
    background: rgba(239, 68, 68, 0.07);
    color: #fca5a5;
    font-size: 10px;
  }

  .ai-review-error svg {
    flex-shrink: 0;
  }

  .ai-review-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 390px;
    padding: 30px;
    border: 1px dashed var(--border, #334155);
    border-radius: 12px;
    background: var(--surface, #111827);
    text-align: center;
  }

  .ai-review-empty-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 65px;
    height: 65px;
    margin-bottom: 17px;
    border: 1px solid rgba(59, 130, 246, 0.22);
    border-radius: 20px;
    background: rgba(59, 130, 246, 0.09);
    color: #60a5fa;
  }

  .ai-review-empty-title {
    margin: 0;
    color: var(--text-primary, #f1f5f9);
    font-size: 15px;
    font-weight: 750;
  }

  .ai-review-empty-text {
    max-width: 370px;
    margin: 9px 0 18px;
    color: var(--text-muted, #718096);
    font-size: 10px;
    line-height: 1.8;
  }

  .ai-review-empty-link {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 9px 12px;
    border: 1px solid var(--border, #263244);
    border-radius: 8px;
    color: #60a5fa;
    font-size: 10px;
    font-weight: 700;
    text-decoration: none;
  }

  .ai-review-empty-link:hover {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.08);
  }

  .ai-review-section {
    margin-bottom: 15px;
    padding: 18px;
    border: 1px solid var(--border, #263244);
    border-radius: 11px;
    background: var(--surface, #111827);
  }

  .ai-review-section-heading {
    display: flex;
    align-items: center;
    gap: 9px;
    margin-bottom: 13px;
  }

  .ai-review-section-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: rgba(59, 130, 246, 0.10);
    color: #60a5fa;
  }

  .ai-review-section-heading h3 {
    margin: 0;
    color: var(--text-primary, #f1f5f9);
    font-size: 12px;
    font-weight: 750;
  }

  .ai-review-section-body {
    color: var(--text-secondary, #cbd5e1);
    font-size: 11px;
    line-height: 1.8;
    overflow-wrap: anywhere;
  }

  .ai-review-section-body p {
    margin: 0 0 9px;
  }

  .ai-review-section-body p:last-child {
    margin-bottom: 0;
  }

  .ai-review-list {
    display: flex;
    flex-direction: column;
    gap: 9px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .ai-review-list-item {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    color: var(--text-secondary, #cbd5e1);
    font-size: 10px;
    line-height: 1.7;
  }

  .ai-review-list-item svg {
    flex-shrink: 0;
    margin-top: 2px;
    color: #60a5fa;
  }

  .ai-review-metric-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    margin-bottom: 15px;
  }

  .ai-review-metric {
    min-width: 0;
    padding: 13px;
    border: 1px solid var(--border, #263244);
    border-radius: 9px;
    background: var(--surface, #111827);
  }

  .ai-review-metric-label {
    display: block;
    margin-bottom: 8px;
    color: var(--text-muted, #718096);
    font-size: 9px;
    font-weight: 650;
  }

  .ai-review-metric-value {
    color: var(--text-primary, #f1f5f9);
    font-size: 17px;
    font-weight: 750;
  }

  .ai-review-metric-note {
    display: block;
    margin-top: 5px;
    color: var(--text-muted, #718096);
    font-size: 9px;
  }

  .ai-review-code-section {
    margin-bottom: 15px;
    overflow: hidden;
    border: 1px solid var(--border, #263244);
    border-radius: 11px;
    background: var(--surface, #111827);
  }

  .ai-review-code-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 15px 17px;
    border-bottom: 1px solid var(--border, #263244);
  }

  .ai-review-code-heading {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .ai-review-code-heading svg {
    color: #60a5fa;
  }

  .ai-review-code-heading h3 {
    margin: 0;
    color: var(--text-primary, #f1f5f9);
    font-size: 12px;
    font-weight: 750;
  }

  .ai-review-code-note {
    color: var(--text-muted, #718096);
    font-size: 9px;
  }

  .ai-review-code-content {
    padding: 14px;
  }

  .ai-review-warning {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    margin-top: 15px;
    padding: 12px;
    border: 1px solid rgba(234, 179, 8, 0.20);
    border-radius: 8px;
    background: rgba(234, 179, 8, 0.06);
    color: #fde68a;
    font-size: 9px;
    line-height: 1.7;
  }

  .ai-review-warning svg {
    flex-shrink: 0;
    margin-top: 1px;
  }

  .ai-review-footer {
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

  .ai-review-footer-brand {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .ai-review-spin {
    animation: ai-review-rotate 1s linear infinite;
  }

  @keyframes ai-review-rotate {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 1150px) {
    .ai-review-workspace {
      grid-template-columns: minmax(240px, 0.75fr) minmax(0, 1.5fr);
    }
  }

  @media (max-width: 900px) {
    .ai-review-main {
      margin-left: 0;
    }

    .ai-review-content {
      padding: 24px;
    }

    .ai-review-workspace {
      grid-template-columns: 1fr;
    }

    .ai-review-empty {
      min-height: 280px;
    }
  }

  @media (max-width: 600px) {
    .ai-review-content {
      padding: 18px 14px;
    }

    .ai-review-header {
      flex-direction: column;
    }

    .ai-review-hero {
      padding: 18px;
    }

    .ai-review-hero-title {
      font-size: 18px;
    }

    .ai-review-hero-visual {
      width: 65px;
      height: 65px;
      border-radius: 17px;
    }

    .ai-review-hero-visual::before {
      width: 85px;
      height: 85px;
    }

    .ai-review-hero-visual svg {
      width: 28px;
      height: 28px;
    }

    .ai-review-metric-grid {
      grid-template-columns: 1fr;
    }

    .ai-review-results-header {
      align-items: flex-start;
      flex-direction: column;
    }

    .ai-review-code-header {
      align-items: flex-start;
      flex-direction: column;
    }

    .ai-review-footer {
      align-items: flex-start;
      flex-direction: column;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .ai-review-layout *,
    .ai-review-layout *::before,
    .ai-review-layout *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`;


function normalizeVulnerability(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  return {
    ...item,

    id:
      item.id ??
      item.vulnerability_id,

    title:
      item.title ??
      item.name ??
      item.rule_name ??
      "Untitled vulnerability",

    severity: String(
      item.severity ?? "unknown"
    ).toLowerCase(),

    repository:
      item.repository_name ??
      item.repository ??
      item.project_name ??
      "Unknown repository",

    filePath:
      item.file_path ??
      item.file ??
      item.location?.file ??
      "",

    scanner:
      item.scanner ??
      item.source ??
      item.tool ??
      "Unknown scanner",

    cve:
      item.cve ??
      item.cve_id ??
      "",

    cwe:
      item.cwe ??
      item.cwe_id ??
      "",

    description:
      item.description ??
      item.message ??
      "",
  };
}


function normalizeAnalysis(response) {
  if (!response || typeof response !== "object") {
    return null;
  }

  return {
    ...response,

    rootCause:
      response.root_cause ??
      response.rootCause ??
      "",

    attackScenario:
      response.attack_scenario ??
      response.attackScenario ??
      "",

    impact:
      response.impact ??
      response.security_impact ??
      "",

    exploitability:
      response.exploitability ??
      response.exploitability_assessment ??
      "",

    recommendations:
      response.recommendations ??
      response.remediation_steps ??
      [],

    originalCode:
      response.original_code ??
      response.originalCode ??
      "",

    suggestedCode:
      response.suggested_code ??
      response.suggestedCode ??
      "",

    confidence:
      response.confidence_score ??
      response.confidence ??
      null,

    limitations:
      response.limitations ??
      response.caveats ??
      "",
  };
}


function formatSeverity(severity) {
  const value = String(severity ?? "unknown").toLowerCase();

  if (value === "informational" || value === "information") {
    return "info";
  }

  if (value === "moderate") {
    return "medium";
  }

  return value;
}


function SeverityBadge({ severity }) {
  const normalized = formatSeverity(severity);

  const validSeverities = [
    "critical",
    "high",
    "medium",
    "low",
    "info",
  ];

  const safeSeverity = validSeverities.includes(normalized)
    ? normalized
    : "info";

  return (
    <span className={`ai-review-severity ai-review-severity-${safeSeverity}`}>
      <AlertCircle size={11} />

      {safeSeverity}
    </span>
  );
}


function AnalysisSection({
  title,
  icon: Icon,
  children,
}) {
  if (!children) {
    return null;
  }

  return (
    <section className="ai-review-section">
      <div className="ai-review-section-heading">
        <div className="ai-review-section-icon">
          <Icon size={15} />
        </div>

        <h3>{title}</h3>
      </div>

      <div className="ai-review-section-body">
        {Array.isArray(children) ? (
          <ul className="ai-review-list">
            {children.map((item, index) => (
              <li
                key={`${index}-${String(item)}`}
                className="ai-review-list-item"
              >
                <CheckCircle2 size={13} />

                <span>{String(item)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>{String(children)}</p>
        )}
      </div>
    </section>
  );
}


function AnalysisMetric({
  label,
  value,
  note,
}) {
  return (
    <div className="ai-review-metric">
      <span className="ai-review-metric-label">
        {label}
      </span>

      <strong className="ai-review-metric-value">
        {value}
      </strong>

      {note && (
        <span className="ai-review-metric-note">
          {note}
        </span>
      )}
    </div>
  );
}


function EmptyAnalysis() {
  return (
    <div className="ai-review-empty">
      <div className="ai-review-empty-icon">
        <BrainCircuit size={30} />
      </div>

      <h2 className="ai-review-empty-title">
        Ready for AI Security Analysis
      </h2>

      <p className="ai-review-empty-text">
        Select a detected vulnerability from the left panel and
        start an analysis. SecureAI will display the explanation,
        attack context and available remediation suggestions returned
        by your configured AI service.
      </p>

      <Link
        to="/vulnerabilities"
        className="ai-review-empty-link"
      >
        Browse vulnerabilities

        <ArrowRight size={13} />
      </Link>
    </div>
  );
}


function AIReview({
  user,
  notifications = [],
  vulnerabilities = [],
  loading = false,
  analyzing = false,
  error = null,
  analysis: externalAnalysis = null,
  onAnalyze,
  onApplyPatch,
  onRefresh,
  onLogout,
  onSearch,
}) {
  const [selectedId, setSelectedId] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");
  const [analysisError, setAnalysisError] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const normalizedVulnerabilities = useMemo(() => {
    if (!Array.isArray(vulnerabilities)) {
      return [];
    }

    return vulnerabilities
      .map(normalizeVulnerability)
      .filter(
        (item) =>
          item &&
          item.id !== null &&
          item.id !== undefined
      );
  }, [vulnerabilities]);

  const selectedVulnerability = useMemo(() => {
    return normalizedVulnerabilities.find(
      (item) => String(item.id) === String(selectedId)
    ) ?? null;
  }, [normalizedVulnerabilities, selectedId]);

  const normalizedAnalysis = useMemo(() => {
    return normalizeAnalysis(externalAnalysis);
  }, [externalAnalysis]);

  const hasAnalysis = Boolean(normalizedAnalysis);

  const confidence = useMemo(() => {
    const rawValue = normalizedAnalysis?.confidence;

    if (rawValue === null || rawValue === undefined || rawValue === "") {
      return null;
    }

    const parsed = Number(rawValue);

    if (!Number.isFinite(parsed)) {
      return null;
    }

    const percentage = parsed <= 1
      ? parsed * 100
      : parsed;

    return Math.min(100, Math.max(0, Math.round(percentage)));
  }, [normalizedAnalysis]);

  const handleAnalyze = async (event) => {
    event.preventDefault();

    setAnalysisError("");

    if (!selectedVulnerability) {
      setAnalysisError("Select a vulnerability before starting the analysis.");
      return;
    }

    if (typeof onAnalyze !== "function") {
      setAnalysisError(
        "AI analysis is not connected yet. Configure the analysis API first."
      );
      return;
    }

    try {
      await onAnalyze({
        vulnerabilityId: selectedVulnerability.id,
        vulnerability: selectedVulnerability,
        additionalContext: additionalContext.trim(),
      });
    } catch (err) {
      setAnalysisError(
        err?.message || "The AI analysis request failed. Please try again."
      );
    }
  };

  const handleSelectionChange = (event) => {
    setSelectedId(event.target.value);
    setAnalysisError("");
  };

  const handlePatch = (patchData) => {
    if (typeof onApplyPatch === "function") {
      onApplyPatch({
        ...patchData,
        vulnerability: selectedVulnerability,
      });
    }
  };

  const handleRefresh = () => {
    if (typeof onRefresh === "function") {
      onRefresh();
    }
  };

  const recommendations = Array.isArray(
    normalizedAnalysis?.recommendations
  )
    ? normalizedAnalysis.recommendations
    : typeof normalizedAnalysis?.recommendations === "string"
      ? [normalizedAnalysis.recommendations]
      : [];

  const limitations = Array.isArray(normalizedAnalysis?.limitations)
    ? normalizedAnalysis.limitations.join(" ")
    : normalizedAnalysis?.limitations;

  return (
    <>
      <style>{aiReviewStyles}</style>

      <div className="ai-review-layout">
        <Sidebar
          user={user}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        <main className="ai-review-main">
          <Navbar
            user={user}
            notifications={notifications}
            onMobileMenuClick={() => setMobileOpen(true)}
            onLogout={onLogout}
            onSearch={onSearch}
          />

          <div className="ai-review-content">
            <header className="ai-review-header">
              <div className="ai-review-heading">
                <div className="ai-review-eyebrow">
                  <BrainCircuit size={14} />

                  Intelligent Security Analysis
                </div>

                <h1 className="ai-review-title">
                  AI Security Review
                </h1>

                <p className="ai-review-description">
                  Understand vulnerabilities beyond scanner output.
                  Analyze root causes, explore potential attack scenarios
                  and review AI-assisted remediation suggestions.
                </p>
              </div>

              <Link
                to="/vulnerabilities"
                className="ai-review-header-action"
              >
                <ShieldAlert size={14} />

                Vulnerabilities
              </Link>
            </header>

            <section className="ai-review-hero">
              <div className="ai-review-hero-content">
                <div className="ai-review-hero-badge">
                  <Sparkles size={12} />

                  AI-Powered Analysis
                </div>

                <h2 className="ai-review-hero-title">
                  From vulnerability detection to security understanding.
                </h2>

                <p className="ai-review-hero-text">
                  Combine static analysis findings with AI-assisted
                  explanations to understand security weaknesses and
                  evaluate possible fixes before applying changes.
                </p>
              </div>

              <div className="ai-review-hero-visual">
                <BrainCircuit size={43} />
              </div>
            </section>

            {error && (
              <div className="ai-review-error" role="alert">
                <AlertCircle size={16} />

                {typeof error === "string"
                  ? error
                  : "Unable to load vulnerability information."}

                {onRefresh && (
                  <button
                    type="button"
                    className="ai-review-header-action"
                    onClick={handleRefresh}
                  >
                    <RefreshCw size={12} />

                    Retry
                  </button>
                )}
              </div>
            )}

            <div className="ai-review-workspace">
              <aside className="ai-review-panel">
                <div className="ai-review-panel-header">
                  <div className="ai-review-panel-icon">
                    <Target size={17} />
                  </div>

                  <div>
                    <h2 className="ai-review-panel-title">
                      Analysis Configuration
                    </h2>

                    <p className="ai-review-panel-subtitle">
                      Choose a finding to investigate.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleAnalyze}>
                  <div className="ai-review-form-group">
                    <label
                      htmlFor="ai-review-vulnerability"
                      className="ai-review-label"
                    >
                      Select Vulnerability

                      <span className="ai-review-label-hint">
                        Required
                      </span>
                    </label>

                    <select
                      id="ai-review-vulnerability"
                      className="ai-review-select"
                      value={selectedId}
                      onChange={handleSelectionChange}
                      disabled={loading || analyzing}
                      required
                    >
                      <option value="">
                        Choose a vulnerability
                      </option>

                      {normalizedVulnerabilities.map((item) => (
                        <option
                          key={item.id}
                          value={String(item.id)}
                        >
                          [{item.severity.toUpperCase()}] {item.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedVulnerability && (
                    <div className="ai-review-selected-card">
                      <div className="ai-review-selected-top">
                        <span className="ai-review-selected-label">
                          Selected Finding
                        </span>

                        <SeverityBadge
                          severity={selectedVulnerability.severity}
                        />
                      </div>

                      <h3 className="ai-review-selected-title">
                        {selectedVulnerability.title}
                      </h3>

                      <div className="ai-review-selected-meta">
                        <div className="ai-review-meta-row">
                          <FileCode2 size={12} />

                          <span>
                            {selectedVulnerability.filePath || "File unavailable"}
                          </span>
                        </div>

                        <div className="ai-review-meta-row">
                          <Code2 size={12} />

                          <span>
                            {selectedVulnerability.repository}
                          </span>
                        </div>

                        <div className="ai-review-meta-row">
                          <Shield size={12} />

                          <span>
                            Scanner: {selectedVulnerability.scanner}
                          </span>
                        </div>

                        {(selectedVulnerability.cve || selectedVulnerability.cwe) && (
                          <div className="ai-review-meta-row">
                            <AlertTriangle size={12} />

                            <span>
                              {[
                                selectedVulnerability.cve,
                                selectedVulnerability.cwe,
                              ].filter(Boolean).join(" · ")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="ai-review-form-group">
                    <label
                      htmlFor="ai-review-context"
                      className="ai-review-label"
                    >
                      Additional Context

                      <span className="ai-review-label-hint">
                        Optional
                      </span>
                    </label>

                    <textarea
                      id="ai-review-context"
                      className="ai-review-textarea"
                      value={additionalContext}
                      onChange={(event) => {
                        setAdditionalContext(event.target.value);
                      }}
                      placeholder="Add relevant application context, framework details or security requirements..."
                      maxLength={3000}
                      disabled={analyzing}
                    />

                    <div className="ai-review-label-hint">
                      {additionalContext.length}/3000 characters
                    </div>
                  </div>

                  {analysisError && (
                    <div className="ai-review-error" role="alert">
                      <AlertCircle size={14} />

                      {analysisError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="ai-review-run-button"
                    disabled={
                      loading ||
                      analyzing ||
                      !selectedVulnerability ||
                      !onAnalyze
                    }
                  >
                    {analyzing ? (
                      <>
                        <RefreshCw
                          size={15}
                          className="ai-review-spin"
                        />

                        Analyzing vulnerability...
                      </>
                    ) : (
                      <>
                        <WandSparkles size={15} />

                        Run AI Analysis

                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </form>

                <div className="ai-review-notice">
                  <Lock size={13} />

                  <span>
                    Repository code and vulnerability metadata should be
                    sanitized before being sent to an external AI provider.
                    Treat repository content as untrusted input.
                  </span>
                </div>
              </aside>

              <section className="ai-review-results">
                <div className="ai-review-results-header">
                  <div>
                    <h2 className="ai-review-results-title">
                      Analysis Results
                    </h2>

                    <p className="ai-review-results-description">
                      AI-generated insights for the selected security finding.
                    </p>
                  </div>

                  {hasAnalysis && (
                    <span className="ai-review-results-badge">
                      <CheckCircle2 size={12} />

                      Analysis received
                    </span>
                  )}
                </div>

                {loading || analyzing ? (
                  <div className="ai-review-panel">
                    <Loader
                      size="large"
                      text={
                        analyzing
                          ? "AI is analyzing the vulnerability..."
                          : "Loading analysis..."
                      }
                    />
                  </div>
                ) : !hasAnalysis ? (
                  <EmptyAnalysis />
                ) : (
                  <>
                    <div className="ai-review-metric-grid">
                      <AnalysisMetric
                        label="Vulnerability"
                        value={
                          selectedVulnerability
                            ? formatSeverity(selectedVulnerability.severity).toUpperCase()
                            : "Reviewed"
                        }
                        note="Finding severity"
                      />

                      <AnalysisMetric
                        label="CVSS Score"
                        value={
                          selectedVulnerability?.cvss_score ??
                          selectedVulnerability?.cvss ??
                          "N/A"
                        }
                        note="Original scanner metadata"
                      />

                      <AnalysisMetric
                        label="AI Confidence"
                        value={
                          confidence === null
                            ? "N/A"
                            : `${confidence}%`
                        }
                        note="Model-reported confidence"
                      />
                    </div>

                    <AnalysisSection
                      title="Root Cause Analysis"
                      icon={Search}
                    >
                      {normalizedAnalysis.rootCause}
                    </AnalysisSection>

                    <AnalysisSection
                      title="Attack Scenario"
                      icon={Target}
                    >
                      {normalizedAnalysis.attackScenario}
                    </AnalysisSection>

                    <AnalysisSection
                      title="Potential Security Impact"
                      icon={ShieldAlert}
                    >
                      {normalizedAnalysis.impact}
                    </AnalysisSection>

                    <AnalysisSection
                      title="Exploitability Assessment"
                      icon={Zap}
                    >
                      {normalizedAnalysis.exploitability}
                    </AnalysisSection>

                    <AnalysisSection
                      title="Recommended Security Improvements"
                      icon={Lightbulb}
                    >
                      {recommendations}
                    </AnalysisSection>

                    {(normalizedAnalysis.originalCode ||
                      normalizedAnalysis.suggestedCode) && (
                      <section className="ai-review-code-section">
                        <div className="ai-review-code-header">
                          <div className="ai-review-code-heading">
                            <Code2 size={16} />

                            <h3>
                              Suggested Code Remediation
                            </h3>
                          </div>

                          <span className="ai-review-code-note">
                            Review before applying
                          </span>
                        </div>

                        <div className="ai-review-code-content">
                          <CodeEditor
                            code={normalizedAnalysis.originalCode}
                            suggestedCode={normalizedAnalysis.suggestedCode}
                            language={
                              normalizedAnalysis.language ??
                              selectedVulnerability?.language ??
                              "javascript"
                            }
                            filePath={
                              selectedVulnerability?.filePath ??
                              normalizedAnalysis.file_path ??
                              ""
                            }
                            onApplyPatch={
                              onApplyPatch
                                ? handlePatch
                                : undefined
                            }
                          />
                        </div>
                      </section>
                    )}

                    {limitations && (
                      <div className="ai-review-warning">
                        <AlertTriangle size={15} />

                        <span>
                          <strong>Analysis limitations: </strong>

                          {String(limitations)}
                        </span>
                      </div>
                    )}

                    <div className="ai-review-warning">
                      <AlertTriangle size={15} />

                      <span>
                        AI-generated explanations and code suggestions
                        may be inaccurate or incomplete. Validate findings,
                        test proposed changes in an isolated environment,
                        and review the patch before merging it.
                      </span>
                    </div>
                  </>
                )}
              </section>
            </div>

            <footer className="ai-review-footer">
              <div className="ai-review-footer-brand">
                <Shield size={13} />

                SecureAI AI Review Engine
              </div>

              <span>
                AI output is advisory and requires human verification.
              </span>
            </footer>
          </div>
        </main>
      </div>
    </>
  );
}


export default AIReview;