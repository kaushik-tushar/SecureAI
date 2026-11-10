import React, { useMemo, useRef, useState } from "react";

import {
    Activity,
    AlertCircle,
    ArrowRight,
    Check,
    Clock3,
    Code2,
    ExternalLink,
    FileCode2,
    FileSearch,
    FileText,
    Filter,
    GitBranch,
    GitFork,
    Lock,
    MoreHorizontal,
    Plus,
    RefreshCw,
    Search,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Star,
    Trash2,
    Unlock,
    Upload,
    X,
    Play,
    Loader2,
    CheckCircle2,
    AlertTriangle,
    Copy,
    ChevronDown,
} from "lucide-react";

import Sidebar from "../components/sidebar.jsx";
import Navbar from "../components/navbar.jsx";
import Loader from "../components/loader.jsx";


/* =========================================
   PROJECTS PAGE STYLES
========================================= */

const projectsStyles = `

    .projects-layout {
        display: flex;
        min-height: 100vh;
        min-height: 100dvh;
        background: var(--background, #080d18);
        color: var(--text-primary, #f1f5f9);
    }

    .projects-main {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        margin-left: 260px;
    }

    .projects-content {
        width: 100%;
        max-width: 1600px;
        margin: 0 auto;
        padding: 30px;
    }

    .projects-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 20px;
        margin-bottom: 26px;
    }

    .projects-heading {
        min-width: 0;
    }

    .projects-eyebrow {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
        color: #60a5fa;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
    }

    .projects-title {
        margin: 0;
        font-size: clamp(25px, 3vw, 32px);
        font-weight: 750;
        letter-spacing: -0.04em;
    }

    .projects-subtitle {
        margin: 10px 0 0;
        color: var(--text-secondary, #94a3b8);
        font-size: 14px;
        line-height: 1.7;
    }

    .projects-header-actions {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
    }

    .projects-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        min-height: 42px;
        padding: 0 15px;
        border: 1px solid var(--border, #263244);
        border-radius: 9px;
        background: var(--surface, #111827);
        color: var(--text-primary, #f1f5f9);
        font-family: inherit;
        font-size: 13px;
        font-weight: 600;
        text-decoration: none;
        white-space: nowrap;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .projects-button:hover:not(:disabled) {
        border-color: #3b82f6;
        background: var(--surface-hover, #1b2638);
        transform: translateY(-1px);
    }

    .projects-button:disabled {
        opacity: 0.55;
        cursor: not-allowed;
    }

    .projects-button-primary {
        border-color: transparent;
        background: linear-gradient(135deg, #2563eb, #0891b2);
        color: #ffffff;
    }

    .projects-button-primary:hover:not(:disabled) {
        background: linear-gradient(135deg, #1d4ed8, #0e7490);
    }

    .projects-button-danger {
        color: #f87171;
    }

    .projects-overview {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 15px;
        margin-bottom: 25px;
    }

    .projects-overview-card {
        display: flex;
        align-items: center;
        gap: 13px;
        min-width: 0;
        padding: 17px;
        border: 1px solid var(--border, #263244);
        border-radius: 12px;
        background: var(--surface, #111827);
    }

    .projects-overview-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 42px;
        height: 42px;
        flex-shrink: 0;
        border-radius: 11px;
        background: rgba(59, 130, 246, 0.10);
        color: #60a5fa;
    }

    .projects-overview-label {
        display: block;
        margin-bottom: 5px;
        color: var(--text-muted, #718096);
        font-size: 11px;
    }

    .projects-overview-value {
        display: block;
        font-size: 21px;
        font-weight: 750;
    }

    .projects-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        margin-bottom: 20px;
    }

    .projects-search-wrapper {
        position: relative;
        flex: 1;
        max-width: 430px;
    }

    .projects-search-icon {
        position: absolute;
        top: 50%;
        left: 13px;
        color: var(--text-muted, #718096);
        transform: translateY(-50%);
        pointer-events: none;
    }

    .projects-search {
        width: 100%;
        min-height: 43px;
        padding: 0 14px 0 40px;
        border: 1px solid var(--border, #263244);
        border-radius: 9px;
        outline: none;
        background: var(--surface, #111827);
        color: var(--text-primary, #f1f5f9);
        font-family: inherit;
        font-size: 13px;
    }

    .projects-search:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
    }

    .projects-filter-wrapper {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .projects-filter-select {
        min-height: 43px;
        padding: 0 34px 0 12px;
        border: 1px solid var(--border, #263244);
        border-radius: 9px;
        outline: none;
        background: var(--surface, #111827);
        color: var(--text-secondary, #cbd5e1);
        font-family: inherit;
        font-size: 12px;
        cursor: pointer;
    }

    .projects-filter-select option {
        background: #111827;
        color: #f1f5f9;
    }

    .projects-results-count {
        margin: 0 0 13px;
        color: var(--text-muted, #718096);
        font-size: 12px;
    }

    .projects-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 17px;
    }

    .project-card {
        min-width: 0;
        padding: 20px;
        border: 1px solid var(--border, #263244);
        border-radius: 13px;
        background: var(--surface, #111827);
        transition: all 0.2s ease;
    }

    .project-card:hover {
        transform: translateY(-2px);
        border-color: rgba(59, 130, 246, 0.55);
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
    }

    .project-card-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 17px;
    }

    .project-identity {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
    }

    .project-avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 43px;
        height: 43px;
        flex-shrink: 0;
        border-radius: 11px;
        background: rgba(59, 130, 246, 0.10);
        color: #60a5fa;
    }

    .project-identity-content {
        min-width: 0;
    }

    .project-name {
        overflow: hidden;
        margin: 0;
        font-size: 14px;
        font-weight: 700;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .project-owner {
        overflow: hidden;
        margin: 5px 0 0;
        color: var(--text-muted, #718096);
        font-size: 11px;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .project-menu-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border: none;
        border-radius: 8px;
        background: transparent;
        color: var(--text-muted, #718096);
        cursor: pointer;
    }

    .project-description {
        min-height: 38px;
        margin: 0 0 17px;
        color: var(--text-secondary, #94a3b8);
        font-size: 12px;
        line-height: 1.6;
        overflow-wrap: anywhere;
    }

    .project-meta {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 14px;
        padding: 13px 0;
        border-top: 1px solid var(--border, #263244);
        border-bottom: 1px solid var(--border, #263244);
    }

    .project-meta-item {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: var(--text-muted, #718096);
        font-size: 11px;
    }

    .project-visibility {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        margin-left: auto;
        color: var(--text-secondary, #94a3b8);
        font-size: 10px;
    }

    .project-scan-status {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding-top: 14px;
    }

    .project-scan-label {
        display: flex;
        align-items: center;
        gap: 7px;
        color: var(--text-muted, #718096);
        font-size: 11px;
    }

    .project-scan-value {
        color: var(--text-secondary, #cbd5e1);
        font-size: 11px;
    }

    .project-card-actions {
        display: flex;
        align-items: center;
        gap: 9px;
        margin-top: 17px;
    }

    .project-card-action {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        min-height: 35px;
        padding: 0 11px;
        border: 1px solid var(--border, #263244);
        border-radius: 8px;
        background: transparent;
        color: var(--text-secondary, #cbd5e1);
        font-family: inherit;
        font-size: 11px;
        font-weight: 650;
        text-decoration: none;
        cursor: pointer;
    }

    .project-card-action:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .project-card-action-primary {
        flex: 1;
        border-color: transparent;
        background: rgba(37, 99, 235, 0.16);
        color: #60a5fa;
    }

    .project-card-action-danger {
        color: #f87171;
    }

    .projects-empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 300px;
        padding: 35px 20px;
        border: 1px dashed var(--border, #263244);
        border-radius: 14px;
        text-align: center;
    }

    .projects-empty-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 58px;
        height: 58px;
        margin-bottom: 16px;
        border-radius: 16px;
        background: rgba(59, 130, 246, 0.10);
        color: #60a5fa;
    }

    .projects-empty-title {
        margin: 0;
        font-size: 16px;
    }

    .projects-empty-description {
        max-width: 400px;
        margin: 9px 0 19px;
        color: var(--text-muted, #718096);
        font-size: 12px;
        line-height: 1.7;
    }

    .projects-error {
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

    .projects-error-message {
        display: flex;
        align-items: center;
        gap: 9px;
    }

    /* MANUAL CODE ANALYSIS */

    .code-analysis-section {
        margin: 30px 0;
        padding: 22px;
        border: 1px solid var(--border, #263244);
        border-radius: 14px;
        background: var(--surface, #111827);
    }

    .code-analysis-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 15px;
        margin-bottom: 20px;
    }

    .code-analysis-heading {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .code-analysis-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 43px;
        height: 43px;
        border-radius: 11px;
        background: rgba(8, 145, 178, 0.12);
        color: #22d3ee;
    }

    .code-analysis-title {
        margin: 0;
        font-size: 16px;
        font-weight: 750;
    }

    .code-analysis-subtitle {
        margin: 5px 0 0;
        color: var(--text-muted, #718096);
        font-size: 12px;
        line-height: 1.6;
    }

    .code-analysis-badge {
        padding: 6px 10px;
        border: 1px solid rgba(34, 211, 238, 0.2);
        border-radius: 20px;
        background: rgba(34, 211, 238, 0.07);
        color: #67e8f9;
        font-size: 10px;
        font-weight: 700;
        white-space: nowrap;
    }

    .code-analysis-fields {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 180px;
        gap: 14px;
        margin-bottom: 15px;
    }

    .code-analysis-field {
        display: flex;
        flex-direction: column;
        gap: 7px;
    }

    .code-analysis-label {
        color: var(--text-secondary, #cbd5e1);
        font-size: 12px;
        font-weight: 650;
    }

    .code-analysis-input {
        width: 100%;
        min-height: 40px;
        padding: 10px 12px;
        border: 1px solid var(--border, #263244);
        border-radius: 8px;
        outline: none;
        background: var(--background, #080d18);
        color: var(--text-primary, #f1f5f9);
        font-family: inherit;
        font-size: 12px;
    }

    .code-analysis-input:focus {
        border-color: #3b82f6;
    }

    .code-analysis-editor {
        display: block;
        width: 100%;
        min-height: 260px;
        resize: vertical;
        padding: 16px;
        border: 1px solid var(--border, #263244);
        border-radius: 10px;
        outline: none;
        background: #080d18;
        color: #cbd5e1;
        font-family: Consolas, "Courier New", monospace;
        font-size: 12px;
        line-height: 1.8;
        tab-size: 4;
    }

    .code-analysis-editor:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.08);
    }

    .code-analysis-editor::placeholder {
        color: #64748b;
    }

    .code-analysis-upload {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        margin-top: 14px;
        padding: 14px;
        border: 1px dashed var(--border, #263244);
        border-radius: 10px;
        background: rgba(148, 163, 184, 0.025);
    }

    .code-analysis-upload-info {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
    }

    .code-analysis-upload-icon {
        color: #60a5fa;
        flex-shrink: 0;
    }

    .code-analysis-upload-text {
        min-width: 0;
    }

    .code-analysis-upload-title {
        margin: 0;
        font-size: 12px;
        font-weight: 650;
    }

    .code-analysis-upload-description {
        margin: 4px 0 0;
        color: var(--text-muted, #718096);
        font-size: 10px;
        line-height: 1.5;
    }

    .code-analysis-file-name {
        display: block;
        margin-top: 10px;
        color: #67e8f9;
        font-size: 11px;
        overflow-wrap: anywhere;
    }

    .code-analysis-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-top: 16px;
    }

    .code-analysis-hint {
        color: var(--text-muted, #718096);
        font-size: 10px;
        line-height: 1.6;
    }

    .code-analysis-results {
        margin-top: 20px;
        padding: 17px;
        border: 1px solid var(--border, #263244);
        border-radius: 10px;
        background: rgba(148, 163, 184, 0.025);
    }

    .code-analysis-results-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        margin-bottom: 15px;
    }

    .code-analysis-results-title {
        margin: 0;
        font-size: 14px;
        font-weight: 700;
    }

    .code-analysis-results-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
        margin-bottom: 15px;
    }

    .code-analysis-result-stat {
        padding: 12px;
        border: 1px solid var(--border, #263244);
        border-radius: 8px;
        background: var(--surface, #111827);
    }

    .code-analysis-result-stat span {
        display: block;
        margin-bottom: 6px;
        color: var(--text-muted, #718096);
        font-size: 10px;
    }

    .code-analysis-result-stat strong {
        font-size: 20px;
    }

    .code-analysis-findings {
        display: flex;
        flex-direction: column;
        gap: 9px;
    }

    .code-analysis-finding {
        padding: 12px;
        border: 1px solid var(--border, #263244);
        border-radius: 8px;
        background: var(--surface, #111827);
    }

    .code-analysis-finding-header {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 7px;
    }

    .code-analysis-finding-title {
        font-size: 12px;
        font-weight: 700;
    }

    .code-analysis-severity {
        padding: 3px 7px;
        border-radius: 5px;
        font-size: 9px;
        font-weight: 750;
        text-transform: uppercase;
    }

    .severity-critical {
        background: rgba(239, 68, 68, 0.15);
        color: #f87171;
    }

    .severity-high {
        background: rgba(249, 115, 22, 0.15);
        color: #fb923c;
    }

    .severity-medium {
        background: rgba(234, 179, 8, 0.15);
        color: #facc15;
    }

    .severity-low {
        background: rgba(34, 197, 94, 0.15);
        color: #4ade80;
    }

    .code-analysis-finding-description {
        margin: 0;
        color: var(--text-secondary, #94a3b8);
        font-size: 11px;
        line-height: 1.7;
        overflow-wrap: anywhere;
    }

    .code-analysis-finding-location {
        display: block;
        margin-top: 8px;
        color: var(--text-muted, #718096);
        font-family: monospace;
        font-size: 10px;
    }

    .code-analysis-empty {
        padding: 18px;
        border-radius: 8px;
        background: rgba(34, 197, 94, 0.06);
        color: #86efac;
        font-size: 12px;
        line-height: 1.6;
    }

    .projects-modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background: rgba(2, 6, 23, 0.78);
        backdrop-filter: blur(5px);
    }

    .projects-modal {
        width: 100%;
        max-width: 460px;
        padding: 24px;
        border: 1px solid var(--border, #263244);
        border-radius: 15px;
        background: var(--surface, #111827);
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
    }

    .projects-modal-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
    }

    .projects-modal-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 45px;
        height: 45px;
        border-radius: 12px;
        background: rgba(59, 130, 246, 0.10);
        color: #60a5fa;
    }

    .projects-modal-close {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border: none;
        border-radius: 8px;
        background: transparent;
        color: var(--text-muted, #718096);
        cursor: pointer;
    }

    .projects-modal-title {
        margin: 17px 0 8px;
        font-size: 19px;
        font-weight: 750;
    }

    .projects-modal-description {
        margin: 0;
        color: var(--text-secondary, #94a3b8);
        font-size: 12px;
        line-height: 1.7;
    }

    .projects-permissions {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin: 20px 0;
        padding: 15px;
        border: 1px solid var(--border, #263244);
        border-radius: 10px;
    }

    .projects-permission-item {
        display: flex;
        align-items: flex-start;
        gap: 9px;
        color: var(--text-secondary, #cbd5e1);
        font-size: 11px;
        line-height: 1.6;
    }

    .projects-permission-item svg {
        flex-shrink: 0;
        color: #4ade80;
    }

    .projects-modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 9px;
        margin-top: 20px;
    }

    .projects-modal-error {
        margin-top: 13px;
        color: #f87171;
        font-size: 12px;
        line-height: 1.5;
    }

    .projects-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        margin-top: 30px;
        padding-top: 18px;
        border-top: 1px solid var(--border, #263244);
        color: var(--text-muted, #718096);
        font-size: 11px;
    }

    @media (max-width: 1200px) {
        .projects-overview {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    @media (max-width: 900px) {
        .projects-main {
            margin-left: 0;
        }

        .projects-content {
            padding: 24px;
        }

        .projects-grid {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 640px) {
        .projects-content {
            padding: 18px 14px;
        }

        .projects-header {
            flex-direction: column;
            align-items: stretch;
        }

        .projects-header-actions {
            width: 100%;
        }

        .projects-header-actions > * {
            flex: 1;
        }

        .projects-toolbar {
            align-items: stretch;
            flex-direction: column;
        }

        .projects-search-wrapper {
            max-width: none;
        }

        .projects-filter-wrapper {
            width: 100%;
        }

        .projects-filter-select {
            flex: 1;
        }

        .code-analysis-fields {
            grid-template-columns: 1fr;
        }

        .code-analysis-header {
            flex-direction: column;
        }

        .code-analysis-upload {
            align-items: flex-start;
            flex-direction: column;
        }

        .code-analysis-actions {
            align-items: stretch;
            flex-direction: column;
        }

        .code-analysis-results-grid {
            grid-template-columns: 1fr;
        }

        .projects-footer {
            align-items: flex-start;
            flex-direction: column;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .projects-layout *,
        .projects-layout *::before,
        .projects-layout *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
        }
    }

`;


/* =========================================
   SUPPORTED CODE FILE TYPES
========================================= */

const SUPPORTED_EXTENSIONS = [
    ".py",
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".java",
    ".go",
    ".php",
    ".sql",
    ".html",
    ".css",
    ".json",
    ".yaml",
    ".yml",
    ".xml",
    ".sh",
    ".bash",
    ".ps1",
    ".rb",
    ".c",
    ".cpp",
    ".cs",
    ".env",
];

const MAX_FILE_SIZE = 1024 * 1024;


/* =========================================
   HELPER FUNCTIONS
========================================= */

function formatRelativeTime(value) {
    if (!value) {
        return "Not scanned yet";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Date unavailable";
    }

    const difference = Date.now() - date.getTime();

    if (difference < 0) {
        return date.toLocaleDateString("en-IN");
    }

    const minutes = Math.floor(difference / 60000);

    if (minutes < 1) {
        return "Just now";
    }

    if (minutes < 60) {
        return `${minutes} minutes ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours} hours ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 30) {
        return `${days} days ago`;
    }

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}


function normalizeProject(project = {}) {
    const visibility = String(
        project.visibility ??
        (project.private ? "private" : "public")
    ).toLowerCase();

    return {
        ...project,

        id:
            project.id ??
            project.project_id ??
            project.repository_id ??
            project.full_name ??
            project.name,

        name: String(
            project.name ??
            project.repository_name ??
            project.full_name ??
            "Unnamed repository"
        ),

        owner: String(
            project.owner ??
            project.owner_name ??
            project.organization ??
            ""
        ),

        description: String(
            project.description ??
            "No repository description provided."
        ),

        branch: String(
            project.default_branch ??
            project.branch ??
            "main"
        ),

        visibility,

        language: String(
            project.language ??
            "Not specified"
        ),

        stars: Number(
            project.stars ??
            project.stargazers_count ??
            0
        ),

        forks: Number(
            project.forks ??
            project.forks_count ??
            0
        ),

        lastScan:
            project.last_scan_at ??
            project.last_scanned_at ??
            null,

        scanStatus:
            project.last_scan_status ??
            project.scan_status ??
            "not_scanned",

        repositoryUrl:
            project.html_url ??
            project.repository_url ??
            project.url ??
            null,
    };
}


function getFileExtension(filename = "") {
    const index = filename.lastIndexOf(".");

    return index >= 0
        ? filename.substring(index).toLowerCase()
        : "";
}


function getSeverityClass(severity = "") {
    const normalized = String(severity).toLowerCase();

    if (normalized.includes("critical")) {
        return "severity-critical";
    }

    if (normalized.includes("high")) {
        return "severity-high";
    }

    if (normalized.includes("medium")) {
        return "severity-medium";
    }

    return "severity-low";
}


/* =========================================
   PROJECT CARD COMPONENT
========================================= */

function ProjectCard({
    project,
    onStartScan,
    onView,
    onDisconnect,
    scanLoading,
    disconnectLoading,
}) {
    const [menuOpen, setMenuOpen] = useState(false);

    const normalizedProject = normalizeProject(project);

    const {
        id,
        name,
        owner,
        description,
        branch,
        visibility,
        language,
        stars,
        forks,
        lastScan,
        scanStatus,
        repositoryUrl,
    } = normalizedProject;

    const scanInProgress = [
        "running",
        "queued",
        "pending",
    ].includes(String(scanStatus).toLowerCase());

    return (
        <article className="project-card">

            <div className="project-card-header">

                <div className="project-identity">

                    <div className="project-avatar">
                        <Code2 size={20} />
                    </div>

                    <div className="project-identity-content">

                        <h3 className="project-name" title={name}>
                            {name}
                        </h3>

                        <p className="project-owner" title={owner}>
                            {owner || "Repository owner unavailable"}
                        </p>

                    </div>

                </div>

                <div style={{ position: "relative" }}>

                    <button
                        type="button"
                        className="project-menu-button"
                        aria-label={`More options for ${name}`}
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen((current) => !current)}
                    >
                        <MoreHorizontal size={19} />
                    </button>

                    {menuOpen && (

                        <div
                            role="menu"
                            style={{
                                position: "absolute",
                                top: "36px",
                                right: 0,
                                zIndex: 20,
                                width: "165px",
                                padding: "6px",
                                border: "1px solid var(--border, #263244)",
                                borderRadius: "9px",
                                background: "var(--surface, #111827)",
                                boxShadow: "0 12px 30px rgba(0,0,0,0.3)",
                            }}
                        >

                            <button
                                type="button"
                                role="menuitem"
                                className="project-card-action"
                                style={{
                                    width: "100%",
                                    justifyContent: "flex-start",
                                    border: "none",
                                }}
                                onClick={() => {
                                    setMenuOpen(false);
                                    onView?.(project);
                                }}
                            >
                                <ExternalLink size={13} />
                                View details
                            </button>

                            {onDisconnect && (

                                <button
                                    type="button"
                                    role="menuitem"
                                    className="project-card-action project-card-action-danger"
                                    style={{
                                        width: "100%",
                                        justifyContent: "flex-start",
                                        border: "none",
                                    }}
                                    disabled={disconnectLoading}
                                    onClick={() => {
                                        setMenuOpen(false);
                                        onDisconnect(project);
                                    }}
                                >
                                    <Trash2 size={13} />
                                    Disconnect
                                </button>

                            )}

                        </div>

                    )}

                </div>

            </div>

            <p className="project-description">
                {description}
            </p>

            <div className="project-meta">

                <span className="project-meta-item">
                    <GitBranch size={13} />
                    {branch}
                </span>

                <span className="project-meta-item">
                    <Code2 size={13} />
                    {language}
                </span>

                <span className="project-meta-item">
                    <Star size={13} />
                    {stars}
                </span>

                <span className="project-meta-item">
                    <GitFork size={13} />
                    {forks}
                </span>

                <span className="project-visibility">

                    {visibility === "private" ? (
                        <Lock size={12} />
                    ) : (
                        <Unlock size={12} />
                    )}

                    {visibility}

                </span>

            </div>

            <div className="project-scan-status">

                <span className="project-scan-label">
                    <Activity size={13} />
                    Last security scan
                </span>

                <span className="project-scan-value">
                    {formatRelativeTime(lastScan)}
                </span>

            </div>

            <div className="project-card-actions">

                <button
                    type="button"
                    className="project-card-action project-card-action-primary"
                    onClick={() => onStartScan?.(project)}
                    disabled={
                        !onStartScan ||
                        scanLoading ||
                        scanInProgress
                    }
                >

                    <FileSearch size={14} />

                    {scanLoading
                        ? "Starting..."
                        : scanInProgress
                            ? "Scan in progress"
                            : "Start Scan"}

                </button>

                <button
                    type="button"
                    className="project-card-action"
                    onClick={() => onView?.(project)}
                    disabled={!onView}
                >
                    View
                    <ArrowRight size={13} />
                </button>

                {repositoryUrl && (

                    <a
                        href={repositoryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-card-action"
                        aria-label={`Open ${name} repository`}
                    >
                        <ExternalLink size={14} />
                    </a>

                )}

            </div>

        </article>
    );
}


/* =========================================
   MANUAL CODE ANALYSIS COMPONENT
========================================= */

function ManualCodeAnalysis({
    onAnalyzeCode,
    analyzing,
}) {
    const fileInputRef = useRef(null);

    const [filename, setFilename] = useState("manual-code.py");
    const [language, setLanguage] = useState("python");
    const [code, setCode] = useState("");
    const [fileName, setFileName] = useState("");
    const [localError, setLocalError] = useState("");
    const [analysisResult, setAnalysisResult] = useState(null);

    const handleFileUpload = async (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setLocalError("");
        setAnalysisResult(null);

        const extension = getFileExtension(file.name);

        if (!SUPPORTED_EXTENSIONS.includes(extension)) {
            setLocalError(
                `Unsupported file type: ${extension || "unknown"}. Please upload a supported source-code file.`
            );

            event.target.value = "";
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setLocalError(
                "File size exceeds 1 MB. Please upload a smaller file."
            );

            event.target.value = "";
            return;
        }

        try {
            const content = await file.text();

            setCode(content);
            setFilename(file.name);
            setFileName(file.name);

            const extensionLanguage = {
                ".py": "python",
                ".js": "javascript",
                ".jsx": "javascript",
                ".ts": "typescript",
                ".tsx": "typescript",
                ".java": "java",
                ".go": "go",
                ".php": "php",
                ".sql": "sql",
                ".html": "html",
                ".css": "css",
                ".json": "json",
                ".yaml": "yaml",
                ".yml": "yaml",
                ".xml": "xml",
                ".sh": "bash",
                ".bash": "bash",
                ".ps1": "powershell",
                ".rb": "ruby",
                ".c": "c",
                ".cpp": "cpp",
                ".cs": "csharp",
                ".env": "text",
            };

            setLanguage(extensionLanguage[extension] || "text");

        } catch {
            setLocalError("Unable to read the selected file.");
        }

        event.target.value = "";
    };


    const handleAnalyze = async () => {

        setLocalError("");
        setAnalysisResult(null);

        if (!code.trim()) {
            setLocalError(
                "Please paste your code or upload a source-code file first."
            );
            return;
        }

        if (typeof onAnalyzeCode !== "function") {
            setLocalError(
                "Code analysis API is not configured. Connect the backend callback before starting analysis."
            );
            return;
        }

        const payload = {
            filename: filename.trim() || "manual-code.txt",
            language,
            code,
            source: "manual",
        };

        try {

            const result = await onAnalyzeCode(payload);

            if (!result) {
                throw new Error(
                    "The analysis API returned an empty response."
                );
            }

            setAnalysisResult(
                result.data ?? result.result ?? result
            );

        } catch (error) {

            setLocalError(
                error?.response?.data?.detail ??
                error?.message ??
                "Code analysis failed. Please try again."
            );

        }
    };


    const findings = useMemo(() => {

        if (!analysisResult) {
            return [];
        }

        const possibleFindings =
            analysisResult.findings ??
            analysisResult.vulnerabilities ??
            analysisResult.issues ??
            [];

        return Array.isArray(possibleFindings)
            ? possibleFindings
            : [];

    }, [analysisResult]);


    const severityCounts = useMemo(() => {

        const counts = {
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
        };

        findings.forEach((finding) => {

            const severity = String(
                finding.severity ?? finding.risk ?? "low"
            ).toLowerCase();

            if (severity.includes("critical")) {
                counts.critical++;
            } else if (severity.includes("high")) {
                counts.high++;
            } else if (severity.includes("medium")) {
                counts.medium++;
            } else {
                counts.low++;
            }

        });

        return counts;

    }, [findings]);


    const handleClear = () => {
        setCode("");
        setFilename("manual-code.py");
        setFileName("");
        setAnalysisResult(null);
        setLocalError("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };


    return (
        <section className="code-analysis-section">

            <div className="code-analysis-header">

                <div className="code-analysis-heading">

                    <div className="code-analysis-icon">
                        <FileCode2 size={21} />
                    </div>

                    <div>

                        <h2 className="code-analysis-title">
                            Manual Code Analysis
                        </h2>

                        <p className="code-analysis-subtitle">
                            Paste your source code or upload a file to check for security vulnerabilities.
                        </p>

                    </div>

                </div>

                <span className="code-analysis-badge">
                    SOURCE CODE SCANNER
                </span>

            </div>


            <div className="code-analysis-fields">

                <div className="code-analysis-field">

                    <label
                        className="code-analysis-label"
                        htmlFor="analysis-filename"
                    >
                        File name
                    </label>

                    <input
                        id="analysis-filename"
                        className="code-analysis-input"
                        type="text"
                        value={filename}
                        onChange={(event) => setFilename(event.target.value)}
                        placeholder="example.py"
                    />

                </div>

                <div className="code-analysis-field">

                    <label
                        className="code-analysis-label"
                        htmlFor="analysis-language"
                    >
                        Programming language
                    </label>

                    <select
                        id="analysis-language"
                        className="code-analysis-input"
                        value={language}
                        onChange={(event) => setLanguage(event.target.value)}
                    >
                        <option value="python">Python</option>
                        <option value="javascript">JavaScript</option>
                        <option value="typescript">TypeScript</option>
                        <option value="java">Java</option>
                        <option value="go">Go</option>
                        <option value="php">PHP</option>
                        <option value="sql">SQL</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                        <option value="bash">Bash</option>
                        <option value="powershell">PowerShell</option>
                        <option value="c">C</option>
                        <option value="cpp">C++</option>
                        <option value="csharp">C#</option>
                        <option value="ruby">Ruby</option>
                        <option value="text">Other</option>
                    </select>

                </div>

            </div>


            <div className="code-analysis-field">

                <label
                    className="code-analysis-label"
                    htmlFor="manual-code-editor"
                >
                    Source code
                </label>

                <textarea
                    id="manual-code-editor"
                    className="code-analysis-editor"
                    value={code}
                    onChange={(event) => {
                        setCode(event.target.value);
                        setAnalysisResult(null);
                        setLocalError("");
                    }}
                    placeholder={`# Paste your code here

def get_user(username):
    query = "SELECT * FROM users WHERE username = '" + username + "'"
    return database.execute(query)

# Paste code to analyze security vulnerabilities...`}
                    spellCheck="false"
                    autoCapitalize="off"
                    autoComplete="off"
                />

            </div>


            <div className="code-analysis-upload">

                <div className="code-analysis-upload-info">

                    <div className="code-analysis-upload-icon">
                        <Upload size={21} />
                    </div>

                    <div className="code-analysis-upload-text">

                        <p className="code-analysis-upload-title">
                            Upload source-code file
                        </p>

                        <p className="code-analysis-upload-description">
                            Supported: Python, JavaScript, TypeScript, Java, Go, PHP, SQL and more. Maximum 1 MB.
                        </p>

                        {fileName && (
                            <span className="code-analysis-file-name">
                                <FileText
                                    size={12}
                                    style={{
                                        display: "inline",
                                        verticalAlign: "middle",
                                    }}
                                />
                                {" "}{fileName}
                            </span>
                        )}

                    </div>

                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept={SUPPORTED_EXTENSIONS.join(",")}
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                    aria-label="Upload source-code file"
                />

                <button
                    type="button"
                    className="projects-button"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Upload size={14} />
                    Choose File
                </button>

            </div>


            {localError && (

                <div
                    className="projects-error"
                    role="alert"
                    style={{ marginTop: "15px", marginBottom: 0 }}
                >
                    <div className="projects-error-message">
                        <AlertCircle size={16} />
                        {localError}
                    </div>
                </div>

            )}


            <div className="code-analysis-actions">

                <p className="code-analysis-hint">
                    Only analyze code you own or have permission to test.
                    Avoid uploading secrets, API keys or production credentials.
                </p>

                <div style={{
                    display: "flex",
                    gap: "9px",
                    flexShrink: 0,
                }}>

                    <button
                        type="button"
                        className="projects-button"
                        onClick={handleClear}
                        disabled={analyzing}
                    >
                        <X size={14} />
                        Clear
                    </button>

                    <button
                        type="button"
                        className="projects-button projects-button-primary"
                        onClick={handleAnalyze}
                        disabled={analyzing || !code.trim()}
                    >

                        {analyzing ? (
                            <Loader2
                                size={15}
                                className="analysis-spinner"
                            />
                        ) : (
                            <Play size={15} />
                        )}

                        {analyzing
                            ? "Analyzing..."
                            : "Analyze Code"}

                    </button>

                </div>

            </div>


            {analysisResult && (

                <div className="code-analysis-results">

                    <div className="code-analysis-results-header">

                        <h3 className="code-analysis-results-title">
                            <ShieldCheck
                                size={17}
                                style={{
                                    display: "inline",
                                    verticalAlign: "middle",
                                    marginRight: "7px",
                                    color: "#4ade80",
                                }}
                            />
                            Analysis Results
                        </h3>

                        <span style={{
                            color: "#4ade80",
                            fontSize: "10px",
                            fontWeight: 700,
                        }}>
                            ANALYSIS COMPLETED
                        </span>

                    </div>


                    <div className="code-analysis-results-grid">

                        <div className="code-analysis-result-stat">
                            <span>Total Findings</span>
                            <strong>{findings.length}</strong>
                        </div>

                        <div className="code-analysis-result-stat">
                            <span>Critical / High</span>
                            <strong>
                                {severityCounts.critical + severityCounts.high}
                            </strong>
                        </div>

                        <div className="code-analysis-result-stat">
                            <span>Medium / Low</span>
                            <strong>
                                {severityCounts.medium + severityCounts.low}
                            </strong>
                        </div>

                    </div>


                    {findings.length > 0 ? (

                        <div className="code-analysis-findings">

                            {findings.map((finding, index) => (

                                <div
                                    className="code-analysis-finding"
                                    key={finding.id ?? finding.rule_id ?? index}
                                >

                                    <div className="code-analysis-finding-header">

                                        <span className="code-analysis-finding-title">
                                            {finding.title ??
                                                finding.name ??
                                                finding.type ??
                                                `Finding ${index + 1}`}
                                        </span>

                                        <span className={`code-analysis-severity ${getSeverityClass(
                                            finding.severity ?? finding.risk
                                        )}`}>
                                            {finding.severity ??
                                                finding.risk ??
                                                "Low"}
                                        </span>

                                    </div>

                                    <p className="code-analysis-finding-description">
                                        {finding.description ??
                                            finding.message ??
                                            finding.details ??
                                            "No additional description provided."}
                                    </p>

                                    {(finding.file || finding.line || finding.location) && (

                                        <span className="code-analysis-finding-location">
                                            {finding.file ?? filename}
                                            {finding.line
                                                ? ` : Line ${finding.line}`
                                                : finding.location
                                                    ? ` : ${finding.location}`
                                                    : ""}
                                        </span>

                                    )}

                                    {finding.recommendation && (

                                        <p className="code-analysis-finding-description"
                                            style={{ marginTop: "8px" }}>
                                            <strong>Recommendation: </strong>
                                            {finding.recommendation}
                                        </p>

                                    )}

                                </div>

                            ))}

                        </div>

                    ) : (

                        <div className="code-analysis-empty">
                            <CheckCircle2
                                size={16}
                                style={{
                                    display: "inline",
                                    verticalAlign: "middle",
                                    marginRight: "7px",
                                }}
                            />
                            No findings were returned by the analysis engine.
                            This does not guarantee that the code is vulnerability-free.
                        </div>

                    )}

                </div>

            )}

        </section>
    );
}


/* =========================================
   MAIN PROJECTS COMPONENT
========================================= */

function Projects({
    user,
    notifications = [],
    projects = [],
    loading = false,
    refreshing = false,
    error = null,

    onRefresh,
    onConnectGithub,
    onStartScan,
    onViewProject,
    onDisconnectProject,
    onAnalyzeCode,

    onLogout,
    onSearch,
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [visibilityFilter, setVisibilityFilter] = useState("all");
    const [scanFilter, setScanFilter] = useState("all");
    const [mobileOpen, setMobileOpen] = useState(false);

    const [connectModalOpen, setConnectModalOpen] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [connectError, setConnectError] = useState("");

    const [activeScanId, setActiveScanId] = useState(null);
    const [disconnectingId, setDisconnectingId] = useState(null);
    const [analyzingCode, setAnalyzingCode] = useState(false);


    /* =====================================
       NORMALIZE REPOSITORIES
    ===================================== */

    const normalizedProjects = useMemo(() => {

        if (!Array.isArray(projects)) {
            return [];
        }

        return projects.map(normalizeProject);

    }, [projects]);


    /* =====================================
       SEARCH AND FILTER
    ===================================== */

    const filteredProjects = useMemo(() => {

        const query = searchQuery.trim().toLowerCase();

        return normalizedProjects.filter((project) => {

            const matchesSearch =
                !query ||
                project.name.toLowerCase().includes(query) ||
                project.owner.toLowerCase().includes(query) ||
                project.description.toLowerCase().includes(query) ||
                project.language.toLowerCase().includes(query);

            const matchesVisibility =
                visibilityFilter === "all" ||
                project.visibility === visibilityFilter;

            const normalizedStatus = String(
                project.scanStatus
            ).toLowerCase();

            const matchesScan =
                scanFilter === "all" ||
                (
                    scanFilter === "scanned" &&
                    Boolean(project.lastScan)
                ) ||
                (
                    scanFilter === "not_scanned" &&
                    !project.lastScan
                ) ||
                (
                    scanFilter === "running" &&
                    ["running", "queued", "pending"].includes(normalizedStatus)
                );

            return (
                matchesSearch &&
                matchesVisibility &&
                matchesScan
            );

        });

    }, [
        normalizedProjects,
        searchQuery,
        visibilityFilter,
        scanFilter,
    ]);


    /* =====================================
       REPOSITORY STATISTICS
    ===================================== */

    const overview = useMemo(() => {

        return {

            total: normalizedProjects.length,

            private: normalizedProjects.filter(
                (project) => project.visibility === "private"
            ).length,

            public: normalizedProjects.filter(
                (project) => project.visibility === "public"
            ).length,

            scanned: normalizedProjects.filter(
                (project) => Boolean(project.lastScan)
            ).length,

        };

    }, [normalizedProjects]);


    /* =====================================
       GITHUB CONNECTION
    ===================================== */

    const handleConnectGithub = async () => {

        if (
            typeof onConnectGithub !== "function" ||
            connecting
        ) {
            setConnectError(
                "GitHub connection is not configured. Please connect the frontend callback to the backend OAuth endpoint."
            );
            return;
        }

        setConnecting(true);
        setConnectError("");

        try {

            const result = await onConnectGithub();

            /*
             * If the backend returns an authorization URL
             * instead of redirecting directly, redirect here.
             */

            const authorizationUrl =
                result?.authorization_url ??
                result?.auth_url ??
                result?.url;

            if (authorizationUrl) {

                const parsedUrl = new URL(authorizationUrl);

                if (parsedUrl.protocol !== "https:" ||
                    parsedUrl.hostname !== "github.com") {
                    throw new Error(
                        "The backend returned an invalid GitHub authorization URL."
                    );
                }

                window.location.assign(parsedUrl.toString());
                return;
            }

            /*
             * Some OAuth callbacks redirect from the backend
             * directly. Do not close the modal until that action
             * has been initiated successfully.
             */

            if (result?.redirected) {
                return;
            }

            setConnectModalOpen(false);

        } catch (connectError) {

            setConnectError(
                connectError?.response?.data?.detail ??
                connectError?.message ??
                "Unable to initiate GitHub connection. Please try again."
            );

        } finally {

            setConnecting(false);

        }
    };


    /* =====================================
       START SECURITY SCAN
    ===================================== */

    const handleStartScan = async (project) => {

        if (
            typeof onStartScan !== "function" ||
            activeScanId !== null
        ) {
            return;
        }

        setActiveScanId(project.id);

        try {

            await onStartScan(project);

        } catch (scanError) {

            console.error("Repository scan failed:", scanError);

        } finally {

            setActiveScanId(null);

        }
    };


    /* =====================================
       DISCONNECT REPOSITORY
    ===================================== */

    const handleDisconnect = async (project) => {

        if (
            typeof onDisconnectProject !== "function" ||
            disconnectingId !== null
        ) {
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to disconnect "${project.name}"?`
        );

        if (!confirmed) {
            return;
        }

        setDisconnectingId(project.id);

        try {

            await onDisconnectProject(project);

        } catch (disconnectError) {

            console.error(
                "Repository disconnect failed:",
                disconnectError
            );

        } finally {

            setDisconnectingId(null);

        }
    };


    /* =====================================
       REFRESH REPOSITORIES
    ===================================== */

    const handleRefresh = () => {

        if (
            typeof onRefresh === "function" &&
            !refreshing
        ) {
            onRefresh();
        }

    };


    /* =====================================
       OPEN CONNECTION MODAL
    ===================================== */

    const openConnectModal = () => {

        setConnectError("");
        setConnectModalOpen(true);

    };


    /* =====================================
       MANUAL CODE ANALYSIS CALLBACK
    ===================================== */

    const handleAnalyzeCode = async (payload) => {

        if (
            typeof onAnalyzeCode !== "function" ||
            analyzingCode
        ) {
            throw new Error(
                "Manual code analysis is not connected to the backend."
            );
        }

        setAnalyzingCode(true);

        try {

            const result = await onAnalyzeCode(payload);

            return result;

        } finally {

            setAnalyzingCode(false);

        }
    };


    /* =====================================
       RENDER
    ===================================== */

    return (
        <>

            <style>
                {projectsStyles}

                {`
                    .analysis-spinner {
                        animation: analysis-spin 1s linear infinite;
                    }

                    @keyframes analysis-spin {
                        to {
                            transform: rotate(360deg);
                        }
                    }
                `}
            </style>

            <div className="projects-layout">

                <Sidebar
                    user={user}
                    mobileOpen={mobileOpen}
                    onMobileClose={() => setMobileOpen(false)}
                />

                <main className="projects-main">

                    <Navbar
                        user={user}
                        notifications={notifications}
                        onMobileMenuClick={() => setMobileOpen(true)}
                        onLogout={onLogout}
                        onSearch={onSearch}
                    />

                    <div className="projects-content">

                        {/* PAGE HEADER */}

                        <header className="projects-header">

                            <div className="projects-heading">

                                <div className="projects-eyebrow">
                                    <Code2 size={14} />
                                    Repository Management
                                </div>

                                <h1 className="projects-title">
                                    Projects & Repositories
                                </h1>

                                <p className="projects-subtitle">
                                    Connect source code repositories or manually upload code
                                    to identify potential security vulnerabilities.
                                </p>

                            </div>

                            <div className="projects-header-actions">

                                <button
                                    type="button"
                                    className="projects-button"
                                    onClick={handleRefresh}
                                    disabled={!onRefresh || refreshing || loading}
                                >

                                    <RefreshCw size={15} />

                                    {refreshing ? "Refreshing..." : "Refresh"}

                                </button>

                                <button
                                    type="button"
                                    className="projects-button projects-button-primary"
                                    onClick={openConnectModal}
                                >
                                    <Plus size={16} />
                                    Connect Repository
                                </button>

                            </div>

                        </header>


                        {/* ERROR MESSAGE */}

                        {error && (

                            <div
                                className="projects-error"
                                role="alert"
                            >

                                <div className="projects-error-message">
                                    <AlertCircle size={17} />

                                    <span>
                                        {typeof error === "string"
                                            ? error
                                            : "Unable to load repositories. Please try again."}
                                    </span>
                                </div>

                                {onRefresh && (

                                    <button
                                        type="button"
                                        className="projects-button"
                                        onClick={handleRefresh}
                                        disabled={refreshing}
                                    >
                                        Retry
                                    </button>

                                )}

                            </div>

                        )}


                        {/* OVERVIEW CARDS */}

                        <section
                            className="projects-overview"
                            aria-label="Repository overview"
                        >

                            <div className="projects-overview-card">

                                <div className="projects-overview-icon">
                                    <Code2 size={19} />
                                </div>

                                <div>
                                    <span className="projects-overview-label">
                                        Total Repositories
                                    </span>

                                    <strong className="projects-overview-value">
                                        {overview.total}
                                    </strong>
                                </div>

                            </div>

                            <div className="projects-overview-card">

                                <div className="projects-overview-icon">
                                    <Lock size={19} />
                                </div>

                                <div>
                                    <span className="projects-overview-label">
                                        Private Repositories
                                    </span>

                                    <strong className="projects-overview-value">
                                        {overview.private}
                                    </strong>
                                </div>

                            </div>

                            <div className="projects-overview-card">

                                <div className="projects-overview-icon">
                                    <Unlock size={19} />
                                </div>

                                <div>
                                    <span className="projects-overview-label">
                                        Public Repositories
                                    </span>

                                    <strong className="projects-overview-value">
                                        {overview.public}
                                    </strong>
                                </div>

                            </div>

                            <div className="projects-overview-card">

                                <div className="projects-overview-icon">
                                    <ShieldCheck size={19} />
                                </div>

                                <div>
                                    <span className="projects-overview-label">
                                        Repositories Scanned
                                    </span>

                                    <strong className="projects-overview-value">
                                        {overview.scanned}
                                    </strong>
                                </div>

                            </div>

                        </section>


                        {/* MANUAL CODE ANALYSIS */}

                        <ManualCodeAnalysis
                            onAnalyzeCode={handleAnalyzeCode}
                            analyzing={analyzingCode}
                        />


                        {/* SEARCH AND FILTERS */}

                        <section className="projects-toolbar">

                            <div className="projects-search-wrapper">

                                <Search
                                    size={16}
                                    className="projects-search-icon"
                                />

                                <input
                                    type="search"
                                    className="projects-search"
                                    placeholder="Search repositories, owners, languages..."
                                    value={searchQuery}
                                    onChange={(event) => {
                                        setSearchQuery(event.target.value);
                                    }}
                                    aria-label="Search repositories"
                                />

                            </div>

                            <div className="projects-filter-wrapper">

                                <select
                                    className="projects-filter-select"
                                    value={visibilityFilter}
                                    onChange={(event) => {
                                        setVisibilityFilter(event.target.value);
                                    }}
                                    aria-label="Filter by repository visibility"
                                >
                                    <option value="all">All visibility</option>
                                    <option value="private">Private</option>
                                    <option value="public">Public</option>
                                </select>

                                <select
                                    className="projects-filter-select"
                                    value={scanFilter}
                                    onChange={(event) => {
                                        setScanFilter(event.target.value);
                                    }}
                                    aria-label="Filter by scan status"
                                >
                                    <option value="all">All scan states</option>
                                    <option value="scanned">Scanned</option>
                                    <option value="not_scanned">Not scanned</option>
                                    <option value="running">Scan running</option>
                                </select>

                            </div>

                        </section>


                        <p className="projects-results-count">
                            Showing {filteredProjects.length} of{" "}
                            {normalizedProjects.length} repositories
                        </p>


                        {/* PROJECT LIST */}

                        {loading ? (

                            <Loader
                                size="large"
                                text="Loading repositories..."
                            />

                        ) : filteredProjects.length > 0 ? (

                            <section
                                className="projects-grid"
                                aria-label="Connected repositories"
                            >

                                {filteredProjects.map((project) => (

                                    <ProjectCard
                                        key={project.id}
                                        project={project}

                                        onStartScan={
                                            onStartScan
                                                ? handleStartScan
                                                : undefined
                                        }

                                        onView={onViewProject}

                                        onDisconnect={
                                            onDisconnectProject
                                                ? handleDisconnect
                                                : undefined
                                        }

                                        scanLoading={
                                            activeScanId === project.id
                                        }

                                        disconnectLoading={
                                            disconnectingId === project.id
                                        }
                                    />

                                ))}

                            </section>

                        ) : (

                            <div className="projects-empty-state">

                                <div className="projects-empty-icon">
                                    {normalizedProjects.length === 0
                                        ? <Code2 size={27} />
                                        : <Search size={25} />}
                                </div>

                                <h2 className="projects-empty-title">

                                    {normalizedProjects.length === 0
                                        ? "No repositories connected"
                                        : "No matching repositories"}

                                </h2>

                                <p className="projects-empty-description">

                                    {normalizedProjects.length === 0
                                        ? "Connect your GitHub account to import repositories and begin analyzing your code for security vulnerabilities."
                                        : "Try changing your search query or filters to find the repository you're looking for."}

                                </p>

                                {normalizedProjects.length === 0 ? (

                                    <button
                                        type="button"
                                        className="projects-button projects-button-primary"
                                        onClick={openConnectModal}
                                    >
                                        <Code2 size={16} />
                                        Connect GitHub
                                    </button>

                                ) : (

                                    <button
                                        type="button"
                                        className="projects-button"
                                        onClick={() => {
                                            setSearchQuery("");
                                            setVisibilityFilter("all");
                                            setScanFilter("all");
                                        }}
                                    >
                                        <X size={14} />
                                        Clear filters
                                    </button>

                                )}

                            </div>

                        )}


                        {/* FOOTER */}

                        <footer className="projects-footer">

                            <span>
                                <Shield
                                    size={13}
                                    style={{
                                        display: "inline",
                                        verticalAlign: "middle",
                                    }}
                                />

                                {" "}SecureAI Repository Management
                            </span>

                            <span>
                                Repository access should use least-privilege permissions.
                            </span>

                        </footer>

                    </div>

                </main>

            </div>


            {/* =====================================
                GITHUB CONNECTION MODAL
            ===================================== */}

            {connectModalOpen && (

                <div
                    className="projects-modal-backdrop"
                    onMouseDown={(event) => {

                        if (
                            event.target === event.currentTarget &&
                            !connecting
                        ) {
                            setConnectModalOpen(false);
                        }

                    }}
                >

                    <section
                        className="projects-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="connect-github-title"
                    >

                        <div className="projects-modal-header">

                            <div className="projects-modal-icon">
                                <Code2 size={23} />
                            </div>

                            <button
                                type="button"
                                className="projects-modal-close"
                                aria-label="Close dialog"
                                onClick={() => setConnectModalOpen(false)}
                                disabled={connecting}
                            >
                                <X size={18} />
                            </button>

                        </div>

                        <h2
                            id="connect-github-title"
                            className="projects-modal-title"
                        >
                            Connect GitHub
                        </h2>

                        <p className="projects-modal-description">
                            Authorize SecureAI to access the repositories you
                            choose to analyze. You will be redirected to GitHub
                            to complete authorization.
                        </p>

                        <div className="projects-permissions">

                            <div className="projects-permission-item">
                                <Check size={15} />
                                <span>
                                    Access selected repositories for security analysis.
                                </span>
                            </div>

                            <div className="projects-permission-item">
                                <Check size={15} />
                                <span>
                                    Read repository metadata and source code required for scanning.
                                </span>
                            </div>

                            <div className="projects-permission-item">
                                <Check size={15} />
                                <span>
                                    Request write permissions only when required for remediation.
                                </span>
                            </div>

                        </div>

                        <div className="projects-modal-actions">

                            <button
                                type="button"
                                className="projects-button"
                                onClick={() => setConnectModalOpen(false)}
                                disabled={connecting}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="projects-button projects-button-primary"
                                onClick={handleConnectGithub}
                                disabled={connecting}
                            >

                                {connecting ? (
                                    <Loader2 size={15} />
                                ) : (
                                    <Code2 size={15} />
                                )}

                                {connecting
                                    ? "Connecting..."
                                    : "Continue with GitHub"}

                            </button>

                        </div>

                        {connectError && (

                            <p
                                className="projects-modal-error"
                                role="alert"
                            >
                                {connectError}
                            </p>

                        )}

                    </section>

                </div>

            )}

        </>
    );
}


export default Projects;