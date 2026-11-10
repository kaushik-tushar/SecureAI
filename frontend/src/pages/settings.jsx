
import React, { useEffect, useMemo, useState } from "react";

import {
  User,
  Shield,
  Bell,
  Code2,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  Save,
  Plus,
  Trash2,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Clock3,
  Monitor,
  Smartphone,
  Globe,
  LogOut,
  Settings as SettingsIcon,
  ChevronRight,
  ExternalLink,
  Mail,
  CalendarDays,
  Activity,
  ShieldCheck,
  Link2,
  Unlink,
  Info,
} from "lucide-react";

import Sidebar from "../components/sidebar.jsx";
import Navbar from "../components/navbar.jsx";
import Loader from "../components/loader.jsx";


const settingsStyles = `
  .settings-layout {
    display: flex;
    min-height: 100vh;
    min-height: 100dvh;
    background: var(--background, #080d18);
    color: var(--text-primary, #f1f5f9);
  }

  .settings-main {
    flex: 1;
    min-width: 0;
    margin-left: 260px;
  }

  .settings-content {
    width: 100%;
    max-width: 1500px;
    margin: 0 auto;
    padding: 30px;
  }

  .settings-header {
    margin-bottom: 25px;
  }

  .settings-eyebrow {
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

  .settings-title {
    margin: 0;
    color: var(--text-primary, #f1f5f9);
    font-size: clamp(25px, 3vw, 32px);
    font-weight: 750;
    letter-spacing: -0.04em;
  }

  .settings-description {
    max-width: 680px;
    margin: 10px 0 0;
    color: var(--text-secondary, #94a3b8);
    font-size: 13px;
    line-height: 1.7;
  }

  .settings-notice {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 20px;
    padding: 13px;
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-radius: 9px;
    background: rgba(59, 130, 246, 0.06);
    color: #93c5fd;
    font-size: 10px;
    line-height: 1.7;
  }

  .settings-notice svg {
    flex-shrink: 0;
    margin-top: 1px;
  }

  .settings-global-error {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 18px;
    padding: 12px;
    border: 1px solid rgba(239, 68, 68, 0.25);
    border-radius: 8px;
    background: rgba(239, 68, 68, 0.07);
    color: #fca5a5;
    font-size: 10px;
  }

  .settings-global-success {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 18px;
    padding: 12px;
    border: 1px solid rgba(34, 197, 94, 0.2);
    border-radius: 8px;
    background: rgba(34, 197, 94, 0.07);
    color: #4ade80;
    font-size: 10px;
  }

  .settings-global-error-content {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .settings-global-error button {
    padding: 0;
    border: none;
    background: transparent;
    color: inherit;
    font-family: inherit;
    font-size: 10px;
    cursor: pointer;
  }

  .settings-grid {
    display: grid;
    grid-template-columns: 225px minmax(0, 1fr);
    align-items: start;
    gap: 20px;
  }

  .settings-navigation {
    position: sticky;
    top: 20px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 10px;
    border: 1px solid var(--border, #263244);
    border-radius: 11px;
    background: var(--surface, #111827);
  }

  .settings-navigation-heading {
    margin: 8px 9px 10px;
    color: var(--text-muted, #718096);
    font-size: 9px;
    font-weight: 750;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .settings-nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    min-height: 40px;
    padding: 0 10px;
    border: 1px solid transparent;
    border-radius: 7px;
    background: transparent;
    color: var(--text-secondary, #94a3b8);
    font-family: inherit;
    font-size: 10px;
    font-weight: 650;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .settings-nav-item:hover {
    background: rgba(255, 255, 255, 0.035);
    color: var(--text-primary, #f1f5f9);
  }

  .settings-nav-item.active {
    border-color: rgba(59, 130, 246, 0.2);
    background: rgba(59, 130, 246, 0.1);
    color: #60a5fa;
  }

  .settings-nav-item svg {
    flex-shrink: 0;
  }

  .settings-panel {
    min-width: 0;
    padding: 21px;
    border: 1px solid var(--border, #263244);
    border-radius: 11px;
    background: var(--surface, #111827);
  }

  .settings-panel-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 15px;
    margin-bottom: 22px;
    padding-bottom: 17px;
    border-bottom: 1px solid var(--border, #263244);
  }

  .settings-panel-title {
    margin: 0;
    color: var(--text-primary, #f1f5f9);
    font-size: 15px;
    font-weight: 750;
  }

  .settings-panel-description {
    margin: 6px 0 0;
    color: var(--text-muted, #718096);
    font-size: 10px;
    line-height: 1.7;
  }

  .settings-form {
    display: flex;
    flex-direction: column;
    gap: 17px;
  }

  .settings-form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 15px;
  }

  .settings-field {
    display: flex;
    flex-direction: column;
    gap: 7px;
    min-width: 0;
  }

  .settings-field-full {
    grid-column: 1 / -1;
  }

  .settings-label {
    color: var(--text-secondary, #cbd5e1);
    font-size: 10px;
    font-weight: 700;
  }

  .settings-input-wrapper {
    position: relative;
  }

  .settings-input-icon {
    position: absolute;
    top: 50%;
    left: 12px;
    color: var(--text-muted, #718096);
    transform: translateY(-50%);
    pointer-events: none;
  }

  .settings-input,
  .settings-textarea,
  .settings-select {
    width: 100%;
    min-height: 41px;
    padding: 0 12px;
    border: 1px solid var(--border, #263244);
    border-radius: 8px;
    outline: none;
    background: var(--background, #080d18);
    color: var(--text-primary, #f1f5f9);
    font-family: inherit;
    font-size: 10px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .settings-input-with-icon {
    padding-left: 36px;
  }

  .settings-input:focus,
  .settings-textarea:focus,
  .settings-select:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
  }

  .settings-input:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .settings-textarea {
    min-height: 90px;
    padding: 12px;
    resize: vertical;
    line-height: 1.7;
  }

  .settings-select {
    cursor: pointer;
  }

  .settings-select option {
    background: #111827;
    color: #f1f5f9;
  }

  .settings-field-hint {
    color: var(--text-muted, #718096);
    font-size: 9px;
    line-height: 1.6;
  }

  .settings-field-error {
    color: #f87171;
    font-size: 9px;
  }

  .settings-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 38px;
    padding: 0 13px;
    border: 1px solid var(--border, #263244);
    border-radius: 8px;
    background: var(--background, #080d18);
    color: var(--text-primary, #f1f5f9);
    font-family: inherit;
    font-size: 10px;
    font-weight: 700;
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .settings-button:hover:not(:disabled) {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.08);
  }

  .settings-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .settings-button-primary {
    border-color: transparent;
    background: linear-gradient(135deg, #2563eb, #0891b2);
    color: #ffffff;
  }

  .settings-button-primary:hover:not(:disabled) {
    border-color: transparent;
    background: linear-gradient(135deg, #1d4ed8, #0e7490);
  }

  .settings-button-danger {
    border-color: rgba(239, 68, 68, 0.25);
    background: rgba(239, 68, 68, 0.07);
    color: #f87171;
  }

  .settings-button-danger:hover:not(:disabled) {
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.14);
  }

  .settings-button-success {
    border-color: rgba(34, 197, 94, 0.25);
    background: rgba(34, 197, 94, 0.07);
    color: #4ade80;
  }

  .settings-form-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 9px;
    margin-top: 3px;
  }

  .settings-divider {
    height: 1px;
    margin: 22px 0;
    border: none;
    background: var(--border, #263244);
  }

  .settings-section-heading {
    margin: 0 0 6px;
    color: var(--text-primary, #f1f5f9);
    font-size: 12px;
    font-weight: 750;
  }

  .settings-section-description {
    margin: 0 0 16px;
    color: var(--text-muted, #718096);
    font-size: 10px;
    line-height: 1.7;
  }

  .settings-password-wrapper {
    position: relative;
  }

  .settings-password-toggle {
    position: absolute;
    top: 50%;
    right: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 5px;
    background: transparent;
    color: var(--text-muted, #718096);
    transform: translateY(-50%);
    cursor: pointer;
  }

  .settings-password-toggle:hover {
    color: var(--text-primary, #f1f5f9);
  }

  .settings-password-wrapper .settings-input {
    padding-right: 43px;
  }

  .settings-password-strength {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 8px;
  }

  .settings-password-strength-bar {
    height: 4px;
    flex: 1;
    border-radius: 10px;
    background: var(--border, #263244);
    transition: background 0.2s ease;
  }

  .settings-password-strength-label {
    margin-left: 5px;
    color: var(--text-muted, #718096);
    font-size: 9px;
  }

  .settings-integration-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    padding: 17px;
    border: 1px solid var(--border, #263244);
    border-radius: 9px;
    background: var(--background, #080d18);
  }

  .settings-integration-info {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .settings-integration-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    border: 1px solid var(--border, #263244);
    border-radius: 10px;
    background: var(--surface, #111827);
    color: var(--text-primary, #f1f5f9);
  }

  .settings-integration-name {
    margin: 0;
    color: var(--text-primary, #f1f5f9);
    font-size: 11px;
    font-weight: 750;
  }

  .settings-integration-description {
    margin: 5px 0 0;
    color: var(--text-muted, #718096);
    font-size: 9px;
    line-height: 1.6;
  }

  .settings-integration-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 7px;
    color: #facc15;
    font-size: 9px;
    font-weight: 650;
  }

  .settings-integration-status.connected {
    color: #4ade80;
  }

  .settings-toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    padding: 15px 0;
    border-bottom: 1px solid var(--border, #263244);
  }

  .settings-toggle-row:last-child {
    border-bottom: none;
  }

  .settings-toggle-info {
    min-width: 0;
  }

  .settings-toggle-title {
    margin: 0;
    color: var(--text-primary, #f1f5f9);
    font-size: 10px;
    font-weight: 700;
  }

  .settings-toggle-description {
    margin: 5px 0 0;
    color: var(--text-muted, #718096);
    font-size: 9px;
    line-height: 1.6;
  }

  .settings-switch {
    position: relative;
    width: 39px;
    height: 22px;
    flex-shrink: 0;
  }

  .settings-switch input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
  }

  .settings-switch-track {
    position: absolute;
    inset: 0;
    border: 1px solid var(--border, #334155);
    border-radius: 20px;
    background: #263244;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .settings-switch-track::before {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #cbd5e1;
    content: "";
    transition: transform 0.2s ease;
  }

  .settings-switch input:checked + .settings-switch-track {
    border-color: #2563eb;
    background: #2563eb;
  }

  .settings-switch input:checked + .settings-switch-track::before {
    background: #ffffff;
    transform: translateX(17px);
  }

  .settings-switch input:focus-visible + .settings-switch-track {
    outline: 2px solid #60a5fa;
    outline-offset: 3px;
  }

  .settings-api-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .settings-api-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    padding: 14px;
    border: 1px solid var(--border, #263244);
    border-radius: 9px;
    background: var(--background, #080d18);
  }

  .settings-api-info {
    min-width: 0;
    flex: 1;
  }

  .settings-api-name {
    margin: 0;
    color: var(--text-primary, #f1f5f9);
    font-size: 10px;
    font-weight: 750;
  }

  .settings-api-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 9px;
    margin-top: 7px;
    color: var(--text-muted, #718096);
    font-size: 9px;
  }

  .settings-api-prefix {
    display: inline-block;
    max-width: 230px;
    margin-top: 8px;
    overflow: hidden;
    color: #60a5fa;
    font-family: monospace;
    font-size: 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .settings-api-actions {
    display: flex;
    align-items: center;
    gap: 7px;
    flex-shrink: 0;
  }

  .settings-icon-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 33px;
    height: 33px;
    border: 1px solid var(--border, #263244);
    border-radius: 7px;
    background: var(--surface, #111827);
    color: var(--text-secondary, #cbd5e1);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .settings-icon-button:hover {
    border-color: #ef4444;
    color: #f87171;
  }

  .settings-new-key {
    margin-top: 14px;
    padding: 15px;
    border: 1px solid rgba(34, 197, 94, 0.2);
    border-radius: 9px;
    background: rgba(34, 197, 94, 0.05);
  }

  .settings-new-key-title {
    display: flex;
    align-items: center;
    gap: 7px;
    margin: 0 0 9px;
    color: #4ade80;
    font-size: 11px;
    font-weight: 750;
  }

  .settings-new-key-value {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px;
    border: 1px solid var(--border, #263244);
    border-radius: 7px;
    background: var(--background, #080d18);
  }

  .settings-new-key-value code {
    min-width: 0;
    flex: 1;
    overflow-wrap: anywhere;
    color: var(--text-primary, #f1f5f9);
    font-size: 10px;
  }

  .settings-new-key-warning {
    margin: 9px 0 0;
    color: var(--text-secondary, #94a3b8);
    font-size: 9px;
    line-height: 1.6;
  }

  .settings-session-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 0;
    border-bottom: 1px solid var(--border, #263244);
  }

  .settings-session-card:last-child {
    border-bottom: none;
  }

  .settings-session-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 37px;
    height: 37px;
    flex-shrink: 0;
    border: 1px solid var(--border, #263244);
    border-radius: 9px;
    background: var(--background, #080d18);
    color: #60a5fa;
  }

  .settings-session-info {
    min-width: 0;
    flex: 1;
  }

  .settings-session-name {
    margin: 0;
    color: var(--text-primary, #f1f5f9);
    font-size: 10px;
    font-weight: 700;
  }

  .settings-session-meta {
    margin-top: 5px;
    color: var(--text-muted, #718096);
    font-size: 9px;
  }

  .settings-current-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 7px;
    border: 1px solid rgba(34, 197, 94, 0.2);
    border-radius: 5px;
    background: rgba(34, 197, 94, 0.07);
    color: #4ade80;
    font-size: 9px;
    font-weight: 700;
  }

  .settings-danger-zone {
    padding: 16px;
    border: 1px solid rgba(239, 68, 68, 0.25);
    border-radius: 9px;
    background: rgba(239, 68, 68, 0.045);
  }

  .settings-danger-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    color: #f87171;
    font-size: 12px;
    font-weight: 750;
  }

  .settings-danger-description {
    margin: 8px 0 14px;
    color: var(--text-secondary, #94a3b8);
    font-size: 10px;
    line-height: 1.7;
  }

  .settings-empty {
    padding: 25px;
    border: 1px dashed var(--border, #334155);
    border-radius: 9px;
    color: var(--text-muted, #718096);
    font-size: 10px;
    text-align: center;
  }

  .settings-spin {
    animation: settings-rotate 1s linear infinite;
  }

  @keyframes settings-rotate {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 1050px) {
    .settings-grid {
      grid-template-columns: 190px minmax(0, 1fr);
    }
  }

  @media (max-width: 900px) {
    .settings-main {
      margin-left: 0;
    }

    .settings-content {
      padding: 24px;
    }
  }

  @media (max-width: 650px) {
    .settings-content {
      padding: 18px 14px;
    }

    .settings-grid {
      grid-template-columns: 1fr;
    }

    .settings-navigation {
      position: static;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .settings-navigation-heading {
      grid-column: 1 / -1;
    }

    .settings-nav-item {
      font-size: 9px;
    }

    .settings-panel {
      padding: 15px;
    }

    .settings-form-grid {
      grid-template-columns: 1fr;
    }

    .settings-field-full {
      grid-column: auto;
    }

    .settings-integration-card,
    .settings-api-card {
      align-items: flex-start;
      flex-direction: column;
    }

    .settings-api-actions {
      align-self: flex-end;
    }

    .settings-form-actions {
      flex-wrap: wrap;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .settings-layout *,
    .settings-layout *::before,
    .settings-layout *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`;


const SETTINGS_TABS = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
  },
  {
    id: "security",
    label: "Security",
    icon: Shield,
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: Code2,
  },
  {
    id: "api-keys",
    label: "API Keys",
    icon: KeyRound,
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    id: "sessions",
    label: "Sessions",
    icon: Monitor,
  },
];


function getPasswordStrength(password) {
  if (!password) {
    return {
      score: 0,
      label: "Not entered",
    };
  }

  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) {
    return {
      score: 1,
      label: "Weak",
    };
  }

  if (score <= 4) {
    return {
      score: 2,
      label: "Moderate",
    };
  }

  return {
    score: 3,
    label: "Strong",
  };
}


function ToggleRow({
  title,
  description,
  checked,
  onChange,
  disabled = false,
}) {
  return (
    <div className="settings-toggle-row">
      <div className="settings-toggle-info">
        <h4 className="settings-toggle-title">
          {title}
        </h4>

        <p className="settings-toggle-description">
          {description}
        </p>
      </div>

      <label className="settings-switch">
        <input
          type="checkbox"
          checked={Boolean(checked)}
          onChange={(event) => onChange(event.target.checked)}
          disabled={disabled}
          aria-label={title}
        />

        <span className="settings-switch-track" />
      </label>
    </div>
  );
}


function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
  error,
  autoComplete,
}) {
  return (
    <div className="settings-field">
      <label className="settings-label">
        {label}
      </label>

      <div className="settings-password-wrapper">
        <input
          type={show ? "text" : "password"}
          className="settings-input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          required
        />

        <button
          type="button"
          className="settings-password-toggle"
          onClick={onToggle}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? (
            <EyeOff size={15} />
          ) : (
            <Eye size={15} />
          )}
        </button>
      </div>

      {error && (
        <span className="settings-field-error">
          {error}
        </span>
      )}
    </div>
  );
}


function Settings({
  user = {},
  notifications = [],

  profile = null,
  githubIntegration = null,
  apiKeys = [],
  notificationPreferences = {},
  sessions = [],

  loading = false,
  saving = false,
  error = null,

  onUpdateProfile,
  onChangePassword,

  onConnectGithub,
  onDisconnectGithub,

  onCreateApiKey,
  onRevokeApiKey,

  onUpdateNotificationPreferences,

  onRevokeSession,
  onRevokeOtherSessions,

  onDeleteAccount,
  onLogout,
  onSearch,
}) {
  const [activeTab, setActiveTab] = useState("profile");
  const [mobileOpen, setMobileOpen] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
    company: "",
    bio: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  const [passwordErrors, setPasswordErrors] = useState({});

  const [apiKeyName, setApiKeyName] = useState("");
  const [newlyCreatedKey, setNewlyCreatedKey] = useState("");
  const [copied, setCopied] = useState(false);

  const [localPreferences, setLocalPreferences] = useState({
    emailSecurityAlerts: true,
    scanCompleted: true,
    vulnerabilityDetected: true,
    weeklyReports: false,
    productUpdates: false,
    ...notificationPreferences,
  });

  const [busyAction, setBusyAction] = useState("");

  const currentProfile = profile ?? user ?? {};

  const passwordStrength = useMemo(
    () => getPasswordStrength(passwordForm.newPassword),
    [passwordForm.newPassword]
  );

  useEffect(() => {
    setProfileForm({
      fullName:
        currentProfile.full_name ??
        currentProfile.fullName ??
        currentProfile.name ??
        "",

      email:
        currentProfile.email ?? "",

      company:
        currentProfile.company ?? "",

      bio:
        currentProfile.bio ?? "",
    });
  }, [
    currentProfile.full_name,
    currentProfile.fullName,
    currentProfile.name,
    currentProfile.email,
    currentProfile.company,
    currentProfile.bio,
  ]);

  useEffect(() => {
    setLocalPreferences({
      emailSecurityAlerts: true,
      scanCompleted: true,
      vulnerabilityDetected: true,
      weeklyReports: false,
      productUpdates: false,
      ...notificationPreferences,
    });
  }, [notificationPreferences]);

  const isGithubConnected = Boolean(
    githubIntegration?.connected ??
    githubIntegration?.is_connected ??
    false
  );

  const clearMessages = () => {
    setSuccessMessage("");
    setActionError("");
  };

  const executeAction = async (actionName, callback, ...args) => {
    if (typeof callback !== "function" || busyAction) {
      return false;
    }

    setBusyAction(actionName);
    clearMessages();

    try {
      await callback(...args);

      return true;
    } catch (err) {
      setActionError(
        err?.message || "The requested operation could not be completed."
      );

      return false;
    } finally {
      setBusyAction("");
    }
  };


  const handleProfileSave = async (event) => {
    event.preventDefault();

    if (!profileForm.fullName.trim()) {
      setActionError("Please enter your full name.");
      return;
    }

    if (
      !profileForm.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)
    ) {
      setActionError("Please enter a valid email address.");
      return;
    }

    const success = await executeAction(
      "profile",
      onUpdateProfile,
      {
        full_name: profileForm.fullName.trim(),
        email: profileForm.email.trim(),
        company: profileForm.company.trim(),
        bio: profileForm.bio.trim(),
      }
    );

    if (success) {
      setSuccessMessage("Profile updated successfully.");
    }
  };


  const handlePasswordChange = async (event) => {
    event.preventDefault();

    const errors = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Current password is required.";
    }

    if (passwordForm.newPassword.length < 12) {
      errors.newPassword = "Use at least 12 characters.";
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (
      passwordForm.currentPassword &&
      passwordForm.newPassword === passwordForm.currentPassword
    ) {
      errors.newPassword = "New password must be different.";
    }

    setPasswordErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const success = await executeAction(
      "password",
      onChangePassword,
      {
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword,
      }
    );

    if (success) {
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordErrors({});

      setSuccessMessage("Password change request completed.");
    }
  };


  const handleNotificationChange = async (key, value) => {
    const previous = localPreferences;

    const updated = {
      ...previous,
      [key]: value,
    };

    setLocalPreferences(updated);
    clearMessages();

    if (typeof onUpdateNotificationPreferences !== "function") {
      setActionError(
        "Notification preferences are not connected to the backend yet."
      );

      setLocalPreferences(previous);
      return;
    }

    const success = await executeAction(
      `notification-${key}`,
      onUpdateNotificationPreferences,
      updated
    );

    if (success) {
      setSuccessMessage("Notification preferences updated.");
    } else {
      setLocalPreferences(previous);
    }
  };


  const handleCreateApiKey = async (event) => {
    event.preventDefault();

    if (!apiKeyName.trim()) {
      setActionError("Please enter a name for the API key.");
      return;
    }

    if (typeof onCreateApiKey !== "function") {
      setActionError("API key creation is not connected to the backend.");
      return;
    }

    setBusyAction("create-key");
    clearMessages();

    try {
      const result = await onCreateApiKey({
        name: apiKeyName.trim(),
      });

      const secret =
        typeof result === "string"
          ? result
          : result?.key ??
            result?.api_key ??
            result?.secret ??
            "";

      if (!secret) {
        throw new Error(
          "The backend did not return a newly generated API key."
        );
      }

      setNewlyCreatedKey(secret);
      setApiKeyName("");

      setSuccessMessage(
        "API key created. Copy it now; it may not be shown again."
      );
    } catch (err) {
      setActionError(
        err?.message || "Unable to create API key."
      );
    } finally {
      setBusyAction("");
    }
  };


  const handleCopyKey = async () => {
    if (!newlyCreatedKey) {
      return;
    }

    try {
      await navigator.clipboard.writeText(newlyCreatedKey);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setActionError(
        "Clipboard access failed. Copy the key manually."
      );
    }
  };


  const handleRevokeKey = async (key) => {
    if (typeof onRevokeApiKey !== "function") {
      setActionError("API key revocation is not connected to the backend.");
      return;
    }

    const confirmed = window.confirm(
      `Revoke API key "${key.name ?? "Unnamed key"}"? Applications using it will lose access.`
    );

    if (!confirmed) {
      return;
    }

    const success = await executeAction(
      `revoke-key-${key.id}`,
      onRevokeApiKey,
      key.id
    );

    if (success) {
      setSuccessMessage("API key revocation request completed.");
    }
  };


  const handleGithubConnection = async () => {
    if (isGithubConnected) {
      const confirmed = window.confirm(
        "Disconnect your GitHub integration? Existing repository access may be affected."
      );

      if (!confirmed) {
        return;
      }

      const success = await executeAction(
        "github-disconnect",
        onDisconnectGithub
      );

      if (success) {
        setSuccessMessage("GitHub disconnection request completed.");
      }

      return;
    }

    const success = await executeAction(
      "github-connect",
      onConnectGithub
    );

    if (success) {
      setSuccessMessage(
        "GitHub connection flow initiated."
      );
    }
  };


  const handleRevokeSession = async (session) => {
    if (typeof onRevokeSession !== "function") {
      setActionError("Session management is not connected to the backend.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to revoke this session?"
    );

    if (!confirmed) {
      return;
    }

    const success = await executeAction(
      `session-${session.id}`,
      onRevokeSession,
      session.id
    );

    if (success) {
      setSuccessMessage("Session revocation request completed.");
    }
  };


  const handleRevokeOtherSessions = async () => {
    if (typeof onRevokeOtherSessions !== "function") {
      setActionError("Session management is not connected to the backend.");
      return;
    }

    const confirmed = window.confirm(
      "This will sign out all other active sessions. Continue?"
    );

    if (!confirmed) {
      return;
    }

    const success = await executeAction(
      "revoke-other-sessions",
      onRevokeOtherSessions
    );

    if (success) {
      setSuccessMessage("Other session revocation request completed.");
    }
  };


  const handleDeleteAccount = async () => {
    if (typeof onDeleteAccount !== "function") {
      setActionError("Account deletion is not connected to the backend.");
      return;
    }

    const confirmed = window.confirm(
      "This action may permanently delete your account and associated data. Are you absolutely sure?"
    );

    if (!confirmed) {
      return;
    }

    const secondConfirmation = window.prompt(
      "Type DELETE to confirm account deletion."
    );

    if (secondConfirmation !== "DELETE") {
      setActionError("Account deletion confirmation did not match.");
      return;
    }

    await executeAction(
      "delete-account",
      onDeleteAccount
    );
  };


  const renderProfile = () => (
    <section>
      <div className="settings-panel-header">
        <div>
          <h2 className="settings-panel-title">
            Profile Information
          </h2>

          <p className="settings-panel-description">
            Manage your personal information and account details.
          </p>
        </div>

        <User size={19} color="#60a5fa" />
      </div>

      <form
        className="settings-form"
        onSubmit={handleProfileSave}
      >
        <div className="settings-form-grid">
          <div className="settings-field">
            <label className="settings-label" htmlFor="settings-name">
              Full Name
            </label>

            <div className="settings-input-wrapper">
              <User
                className="settings-input-icon"
                size={14}
              />

              <input
                id="settings-name"
                type="text"
                className="settings-input settings-input-with-icon"
                value={profileForm.fullName}
                onChange={(event) => {
                  setProfileForm((previous) => ({
                    ...previous,
                    fullName: event.target.value,
                  }));
                }}
                placeholder="Your full name"
                autoComplete="name"
                required
              />
            </div>
          </div>

          <div className="settings-field">
            <label className="settings-label" htmlFor="settings-email">
              Email Address
            </label>

            <div className="settings-input-wrapper">
              <Mail
                className="settings-input-icon"
                size={14}
              />

              <input
                id="settings-email"
                type="email"
                className="settings-input settings-input-with-icon"
                value={profileForm.email}
                onChange={(event) => {
                  setProfileForm((previous) => ({
                    ...previous,
                    email: event.target.value,
                  }));
                }}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <span className="settings-field-hint">
              Changing your email may require verification.
            </span>
          </div>

          <div className="settings-field settings-field-full">
            <label className="settings-label" htmlFor="settings-company">
              Company / Organization
            </label>

            <input
              id="settings-company"
              type="text"
              className="settings-input"
              value={profileForm.company}
              onChange={(event) => {
                setProfileForm((previous) => ({
                  ...previous,
                  company: event.target.value,
                }));
              }}
              placeholder="Company or organization name"
            />
          </div>

          <div className="settings-field settings-field-full">
            <label className="settings-label" htmlFor="settings-bio">
              About
            </label>

            <textarea
              id="settings-bio"
              className="settings-textarea"
              value={profileForm.bio}
              onChange={(event) => {
                setProfileForm((previous) => ({
                  ...previous,
                  bio: event.target.value,
                }));
              }}
              placeholder="Write a short description..."
              maxLength={500}
            />

            <span className="settings-field-hint">
              {profileForm.bio.length}/500 characters
            </span>
          </div>
        </div>

        <div className="settings-form-actions">
          <button
            type="submit"
            className="settings-button settings-button-primary"
            disabled={!onUpdateProfile || saving || busyAction !== ""}
          >
            <Save size={13} />

            {busyAction === "profile"
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </form>

      <hr className="settings-divider" />

      <h3 className="settings-section-heading">
        Account Information
      </h3>

      <p className="settings-section-description">
        Basic account information associated with your SecureAI profile.
      </p>

      <div className="settings-form-grid">
        <div className="settings-field">
          <label className="settings-label">
            Account ID
          </label>

          <input
            className="settings-input"
            value={String(currentProfile.id ?? currentProfile.uid ?? "Unavailable")}
            readOnly
          />
        </div>

        <div className="settings-field">
          <label className="settings-label">
            Account Created
          </label>

          <input
            className="settings-input"
            value={
              currentProfile.created_at
                ? new Date(currentProfile.created_at).toLocaleDateString("en-IN")
                : "Unavailable"
            }
            readOnly
          />
        </div>
      </div>
    </section>
  );


  const renderSecurity = () => (
    <section>
      <div className="settings-panel-header">
        <div>
          <h2 className="settings-panel-title">
            Security Settings
          </h2>

          <p className="settings-panel-description">
            Protect your SecureAI account and credentials.
          </p>
        </div>

        <ShieldCheck size={19} color="#4ade80" />
      </div>

      <h3 className="settings-section-heading">
        Change Password
      </h3>

      <p className="settings-section-description">
        Choose a strong password that you do not reuse on other websites.
      </p>

      <form
        className="settings-form"
        onSubmit={handlePasswordChange}
      >
        <PasswordField
          label="Current Password"
          value={passwordForm.currentPassword}
          onChange={(value) => {
            setPasswordForm((previous) => ({
              ...previous,
              currentPassword: value,
            }));
          }}
          show={passwordVisibility.current}
          onToggle={() => {
            setPasswordVisibility((previous) => ({
              ...previous,
              current: !previous.current,
            }));
          }}
          error={passwordErrors.currentPassword}
          autoComplete="current-password"
        />

        <PasswordField
          label="New Password"
          value={passwordForm.newPassword}
          onChange={(value) => {
            setPasswordForm((previous) => ({
              ...previous,
              newPassword: value,
            }));
          }}
          show={passwordVisibility.next}
          onToggle={() => {
            setPasswordVisibility((previous) => ({
              ...previous,
              next: !previous.next,
            }));
          }}
          error={passwordErrors.newPassword}
          autoComplete="new-password"
        />

        {passwordForm.newPassword && (
          <div>
            <div className="settings-password-strength">
              {[1, 2, 3].map((level) => (
                <span
                  key={level}
                  className="settings-password-strength-bar"
                  style={{
                    background:
                      level <= passwordStrength.score
                        ? passwordStrength.score === 1
                          ? "#ef4444"
                          : passwordStrength.score === 2
                            ? "#eab308"
                            : "#22c55e"
                        : undefined,
                  }}
                />
              ))}

              <span className="settings-password-strength-label">
                {passwordStrength.label}
              </span>
            </div>
          </div>
        )}

        <PasswordField
          label="Confirm New Password"
          value={passwordForm.confirmPassword}
          onChange={(value) => {
            setPasswordForm((previous) => ({
              ...previous,
              confirmPassword: value,
            }));
          }}
          show={passwordVisibility.confirm}
          onToggle={() => {
            setPasswordVisibility((previous) => ({
              ...previous,
              confirm: !previous.confirm,
            }));
          }}
          error={passwordErrors.confirmPassword}
          autoComplete="new-password"
        />

        <div className="settings-form-actions">
          <button
            type="submit"
            className="settings-button settings-button-primary"
            disabled={!onChangePassword || saving || busyAction !== ""}
          >
            <Lock size={13} />

            {busyAction === "password"
              ? "Updating..."
              : "Update Password"}
          </button>
        </div>
      </form>

      <hr className="settings-divider" />

      <h3 className="settings-section-heading">
        Account Protection
      </h3>

      <p className="settings-section-description">
        Additional security controls for your account.
      </p>

      <div className="settings-toggle-row">
        <div className="settings-toggle-info">
          <h4 className="settings-toggle-title">
            Two-Factor Authentication
          </h4>

          <p className="settings-toggle-description">
            Add a second verification factor during sign-in.
            This control requires a dedicated MFA setup flow.
          </p>
        </div>

        <span className="settings-integration-status">
          Not configured
        </span>
      </div>

      <div className="settings-toggle-row">
        <div className="settings-toggle-info">
          <h4 className="settings-toggle-title">
            Email Verification
          </h4>

          <p className="settings-toggle-description">
            Account email verification status.
          </p>
        </div>

        <span
          className={`settings-integration-status ${
            currentProfile.email_verified ? "connected" : ""
          }`}
        >
          {currentProfile.email_verified
            ? "Verified"
            : "Unverified"}
        </span>
      </div>

      <hr className="settings-divider" />

      <div className="settings-danger-zone">
        <h3 className="settings-danger-title">
          <AlertTriangle size={16} />

          Danger Zone
        </h3>

        <p className="settings-danger-description">
          Deleting your account may permanently remove your profile,
          projects, scans and associated account data. This action
          should only proceed after server-side authorization and
          deletion safeguards.
        </p>

        <button
          type="button"
          className="settings-button settings-button-danger"
          onClick={handleDeleteAccount}
          disabled={!onDeleteAccount || busyAction !== ""}
        >
          <Trash2 size={13} />

          Delete Account
        </button>
      </div>
    </section>
  );


  const renderIntegrations = () => (
    <section>
      <div className="settings-panel-header">
        <div>
          <h2 className="settings-panel-title">
            Integrations
          </h2>

          <p className="settings-panel-description">
            Manage external services connected to SecureAI.
          </p>
        </div>

        <Code2 size={19} />
      </div>

      <div className="settings-integration-card">
        <div className="settings-integration-info">
          <div className="settings-integration-icon">
            <Code2 size={22} />
          </div>

          <div>
            <h3 className="settings-integration-name">
              GitHub
            </h3>

            <p className="settings-integration-description">
              Import repositories, analyze code and create
              security remediation pull requests.
            </p>

            <span
              className={`settings-integration-status ${
                isGithubConnected ? "connected" : ""
              }`}
            >
              {isGithubConnected ? (
                <>
                  <CheckCircle2 size={12} />

                  Connected
                </>
              ) : (
                <>
                  <Clock3 size={12} />

                  Not connected
                </>
              )}
            </span>

            {githubIntegration?.username && (
              <p className="settings-integration-description">
                Connected account: @{githubIntegration.username}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          className={
            isGithubConnected
              ? "settings-button settings-button-danger"
              : "settings-button settings-button-primary"
          }
          onClick={handleGithubConnection}
          disabled={
            busyAction !== "" ||
            (isGithubConnected
              ? !onDisconnectGithub
              : !onConnectGithub)
          }
        >
          {isGithubConnected ? (
            <>
              <Unlink size={13} />

              Disconnect
            </>
          ) : (
            <>
              <Code2 size={13} />

              Connect GitHub
            </>
          )}
        </button>
      </div>

      <div className="settings-notice" style={{ marginTop: 15 }}>
        <Info size={15} />

        <span>
          GitHub OAuth should use a secure server-side authorization
          flow. Store tokens encrypted on the backend and request only
          the permissions required for repository analysis and
          explicitly approved pull request creation.
        </span>
      </div>

      <hr className="settings-divider" />

      <h3 className="settings-section-heading">
        Integration Capabilities
      </h3>

      <p className="settings-section-description">
        Capabilities depend on the permissions granted to the GitHub App.
      </p>

      {[
        {
          icon: Code2,
          title: "Repository Access",
          description: "Read authorized repository source and metadata.",
        },
        {
          icon: ShieldCheck,
          title: "Security Analysis",
          description: "Run supported security scanners against repository contents.",
        },
        {
          icon: Code2,
          title: "Pull Request Creation",
          description: "Create remediation pull requests after explicit approval.",
        },
      ].map((item) => {
        const Icon = item.icon;

        return (
          <div className="settings-session-card" key={item.title}>
            <div className="settings-session-icon">
              <Icon size={16} />
            </div>

            <div className="settings-session-info">
              <h4 className="settings-session-name">
                {item.title}
              </h4>

              <p className="settings-session-meta">
                {item.description}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );


  const renderApiKeys = () => (
    <section>
      <div className="settings-panel-header">
        <div>
          <h2 className="settings-panel-title">
            API Keys
          </h2>

          <p className="settings-panel-description">
            Create and revoke API credentials for authorized applications.
          </p>
        </div>

        <KeyRound size={19} color="#60a5fa" />
      </div>

      <div className="settings-notice">
        <ShieldCheck size={15} />

        <span>
          API secrets should be generated using a cryptographically
          secure random generator, stored as hashes where possible,
          and displayed only once after creation. Never expose full
          secrets through the API key listing endpoint.
        </span>
      </div>

      <form
        className="settings-form"
        onSubmit={handleCreateApiKey}
      >
        <div className="settings-field">
          <label
            htmlFor="settings-api-key-name"
            className="settings-label"
          >
            API Key Name
          </label>

          <input
            id="settings-api-key-name"
            type="text"
            className="settings-input"
            value={apiKeyName}
            onChange={(event) => {
              setApiKeyName(event.target.value);
            }}
            placeholder="e.g. Production Integration"
            maxLength={80}
            required
          />

          <span className="settings-field-hint">
            Give the key a recognizable name so you can identify it later.
          </span>
        </div>

        <div className="settings-form-actions">
          <button
            type="submit"
            className="settings-button settings-button-primary"
            disabled={!onCreateApiKey || busyAction !== ""}
          >
            <Plus size={14} />

            {busyAction === "create-key"
              ? "Generating..."
              : "Generate API Key"}
          </button>
        </div>
      </form>

      {newlyCreatedKey && (
        <div className="settings-new-key">
          <h3 className="settings-new-key-title">
            <CheckCircle2 size={15} />

            Your New API Key
          </h3>

          <div className="settings-new-key-value">
            <code>{newlyCreatedKey}</code>

            <button
              type="button"
              className="settings-icon-button"
              onClick={handleCopyKey}
              aria-label="Copy API key"
              title="Copy API key"
            >
              {copied ? (
                <Check size={14} />
              ) : (
                <Copy size={14} />
              )}
            </button>
          </div>

          <p className="settings-new-key-warning">
            Copy this key now and store it securely. Once you leave
            this page or refresh, this secret will no longer be
            available here.
          </p>
        </div>
      )}

      <hr className="settings-divider" />

      <h3 className="settings-section-heading">
        Existing API Keys
      </h3>

      <p className="settings-section-description">
        Review your active credentials and revoke any key you no longer need.
      </p>

      {!Array.isArray(apiKeys) || apiKeys.length === 0 ? (
        <div className="settings-empty">
          No API keys have been created yet.
        </div>
      ) : (
        <div className="settings-api-list">
          {apiKeys.map((key) => (
            <div
              className="settings-api-card"
              key={key.id}
            >
              <div className="settings-api-info">
                <h4 className="settings-api-name">
                  {key.name || "Unnamed API Key"}
                </h4>

                <div className="settings-api-meta">
                  <span>
                    Created: {key.created_at
                      ? new Date(key.created_at).toLocaleDateString("en-IN")
                      : "Unknown"}
                  </span>

                  <span>
                    Last used: {key.last_used_at
                      ? new Date(key.last_used_at).toLocaleDateString("en-IN")
                      : "Never"}
                  </span>
                </div>

                <span className="settings-api-prefix">
                  {key.prefix ?? key.key_prefix ?? "SecureAI key"}
                  {key.last_four ? `••••${key.last_four}` : ""}
                </span>
              </div>

              <div className="settings-api-actions">
                <span className="settings-current-badge">
                  <CheckCircle2 size={11} />

                  {key.revoked_at ? "Revoked" : "Active"}
                </span>

                {!key.revoked_at && (
                  <button
                    type="button"
                    className="settings-icon-button"
                    onClick={() => handleRevokeKey(key)}
                    disabled={!onRevokeApiKey || busyAction !== ""}
                    aria-label={`Revoke ${key.name ?? "API key"}`}
                    title="Revoke API key"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );


  const renderNotifications = () => (
    <section>
      <div className="settings-panel-header">
        <div>
          <h2 className="settings-panel-title">
            Notification Preferences
          </h2>

          <p className="settings-panel-description">
            Choose which events should generate account notifications.
          </p>
        </div>

        <Bell size={19} color="#facc15" />
      </div>

      <h3 className="settings-section-heading">
        Security Notifications
      </h3>

      <ToggleRow
        title="Security Alerts"
        description="Receive notifications about important account security events."
        checked={localPreferences.emailSecurityAlerts}
        onChange={(value) => {
          handleNotificationChange("emailSecurityAlerts", value);
        }}
      />

      <ToggleRow
        title="New Vulnerabilities"
        description="Get notified when a security scan identifies vulnerabilities."
        checked={localPreferences.vulnerabilityDetected}
        onChange={(value) => {
          handleNotificationChange("vulnerabilityDetected", value);
        }}
      />

      <ToggleRow
        title="Scan Completed"
        description="Receive a notification when a repository scan finishes."
        checked={localPreferences.scanCompleted}
        onChange={(value) => {
          handleNotificationChange("scanCompleted", value);
        }}
      />

      <hr className="settings-divider" />

      <h3 className="settings-section-heading">
        Product Notifications
      </h3>

      <ToggleRow
        title="Weekly Security Reports"
        description="Receive a summary of repository security activity each week."
        checked={localPreferences.weeklyReports}
        onChange={(value) => {
          handleNotificationChange("weeklyReports", value);
        }}
      />

      <ToggleRow
        title="Product Updates"
        description="Receive announcements about new features and platform improvements."
        checked={localPreferences.productUpdates}
        onChange={(value) => {
          handleNotificationChange("productUpdates", value);
        }}
      />

      <div className="settings-notice" style={{ marginTop: 18 }}>
        <Info size={15} />

        <span>
          Notification preferences are saved through the backend.
          Email delivery also requires a configured notification
          service.
        </span>
      </div>
    </section>
  );


  const renderSessions = () => (
    <section>
      <div className="settings-panel-header">
        <div>
          <h2 className="settings-panel-title">
            Active Sessions
          </h2>

          <p className="settings-panel-description">
            Review devices and sessions associated with your account.
          </p>
        </div>

        <Monitor size={19} color="#60a5fa" />
      </div>

      <div className="settings-notice">
        <ShieldCheck size={15} />

        <span>
          If you notice an unfamiliar session, revoke it and change
          your password. Session revocation must invalidate the
          corresponding server-side session or refresh token.
        </span>
      </div>

      <div className="settings-form-actions" style={{ marginBottom: 15 }}>
        <button
          type="button"
          className="settings-button settings-button-danger"
          onClick={handleRevokeOtherSessions}
          disabled={!onRevokeOtherSessions || busyAction !== ""}
        >
          <LogOut size={13} />

          Sign Out Other Sessions
        </button>
      </div>

      {!Array.isArray(sessions) || sessions.length === 0 ? (
        <div className="settings-empty">
          No session information is currently available.
        </div>
      ) : (
        sessions.map((session) => {
          const isCurrent = Boolean(session.is_current);

          const DeviceIcon =
            session.device_type === "mobile"
              ? Smartphone
              : Monitor;

          return (
            <div
              className="settings-session-card"
              key={session.id}
            >
              <div className="settings-session-icon">
                <DeviceIcon size={17} />
              </div>

              <div className="settings-session-info">
                <h4 className="settings-session-name">
                  {session.device_name ??
                    session.user_agent ??
                    "Unknown device"}
                </h4>

                <p className="settings-session-meta">
                  {session.location ?? "Location unavailable"}
                  {" · "}
                  {session.ip_address ?? "IP unavailable"}
                </p>

                <p className="settings-session-meta">
                  Last active:{" "}
                  {session.last_active_at
                    ? new Date(session.last_active_at).toLocaleString("en-IN")
                    : "Unknown"}
                </p>
              </div>

              {isCurrent ? (
                <span className="settings-current-badge">
                  <CheckCircle2 size={11} />

                  Current
                </span>
              ) : (
                <button
                  type="button"
                  className="settings-icon-button"
                  onClick={() => handleRevokeSession(session)}
                  disabled={!onRevokeSession || busyAction !== ""}
                  aria-label="Revoke session"
                  title="Revoke session"
                >
                  <LogOut size={14} />
                </button>
              )}
            </div>
          );
        })
      )}
    </section>
  );


  const renderActiveTab = () => {
    switch (activeTab) {
      case "profile":
        return renderProfile();

      case "security":
        return renderSecurity();

      case "integrations":
        return renderIntegrations();

      case "api-keys":
        return renderApiKeys();

      case "notifications":
        return renderNotifications();

      case "sessions":
        return renderSessions();

      default:
        return renderProfile();
    }
  };


  return (
    <>
      <style>{settingsStyles}</style>

      <div className="settings-layout">
        <Sidebar
          user={user}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        <main className="settings-main">
          <Navbar
            user={user}
            notifications={notifications}
            onMobileMenuClick={() => setMobileOpen(true)}
            onLogout={onLogout}
            onSearch={onSearch}
          />

          <div className="settings-content">
            <header className="settings-header">
              <div className="settings-eyebrow">
                <SettingsIcon size={14} />

                Workspace Configuration
              </div>

              <h1 className="settings-title">
                Settings
              </h1>

              <p className="settings-description">
                Manage your account, security preferences, integrations
                and SecureAI application configuration.
              </p>
            </header>

            <div className="settings-notice">
              <Info size={15} />

              <span>
                Some settings require backend integration. An unavailable
                callback will not simulate a successful operation.
              </span>
            </div>

            {error && (
              <div className="settings-global-error" role="alert">
                <div className="settings-global-error-content">
                  <AlertCircle size={15} />

                  {typeof error === "string"
                    ? error
                    : "Unable to load settings."}
                </div>
              </div>
            )}

            {actionError && (
              <div className="settings-global-error" role="alert">
                <div className="settings-global-error-content">
                  <AlertCircle size={15} />

                  {actionError}
                </div>

                <button
                  type="button"
                  onClick={() => setActionError("")}
                >
                  Dismiss
                </button>
              </div>
            )}

            {successMessage && (
              <div className="settings-global-success" role="status">
                <CheckCircle2 size={14} />

                {successMessage}

                <button
                  type="button"
                  onClick={() => setSuccessMessage("")}
                  style={{
                    marginLeft: "auto",
                    border: "none",
                    background: "transparent",
                    color: "inherit",
                    cursor: "pointer",
                  }}
                  aria-label="Dismiss success message"
                >
                  ×
                </button>
              </div>
            )}

            <div className="settings-grid">
              <nav
                className="settings-navigation"
                aria-label="Settings navigation"
              >
                <h3 className="settings-navigation-heading">
                  Account Settings
                </h3>

                {SETTINGS_TABS.map((tab) => {
                  const Icon = tab.icon;

                  return (
                    <button
                      type="button"
                      key={tab.id}
                      className={
                        activeTab === tab.id
                          ? "settings-nav-item active"
                          : "settings-nav-item"
                      }
                      onClick={() => {
                        setActiveTab(tab.id);
                        clearMessages();
                      }}
                      aria-current={
                        activeTab === tab.id
                          ? "page"
                          : undefined
                      }
                    >
                      <Icon size={15} />

                      {tab.label}

                      {activeTab === tab.id && (
                        <ChevronRight
                          size={13}
                          style={{ marginLeft: "auto" }}
                        />
                      )}
                    </button>
                  );
                })}
              </nav>

              <div className="settings-panel">
                {loading ? (
                  <Loader
                    size="large"
                    text="Loading account settings..."
                  />
                ) : (
                  renderActiveTab()
                )}
              </div>
            </div>

            <footer className="dependencies-footer">
              <div className="settings-footer-brand">
                <Shield size={13} />

                SecureAI Account Center
              </div>

              <span>
                Keep your account credentials secure.
              </span>
            </footer>
          </div>
        </main>
      </div>
    </>
  );
}


export default Settings;
