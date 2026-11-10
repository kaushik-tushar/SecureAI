import React from "react";

import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

const statCardStyles = `
  .secure-stat-card {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    padding: 20px;
    background: var(--surface, #151e2e);
    border: 1px solid var(--border, #29364a);
    border-radius: 12px;
    transition:
      transform 0.2s ease,
      border-color 0.2s ease,
      box-shadow 0.2s ease;
  }

  .secure-stat-card:hover {
    transform: translateY(-2px);
    border-color: var(--border-hover, #3d4b62);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  /* Header */

  .stat-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .stat-card-title {
    margin: 0;
    color: var(--text-secondary, #a1acc0);
    font-size: 13px;
    font-weight: 500;
    line-height: 1.5;
  }

  .stat-card-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }

  .stat-card-icon svg {
    width: 20px;
    height: 20px;
  }

  .stat-card-icon-blue {
    color: #60a5fa;
    background: rgba(59, 130, 246, 0.13);
  }

  .stat-card-icon-cyan {
    color: #22d3ee;
    background: rgba(6, 182, 212, 0.13);
  }

  .stat-card-icon-red {
    color: #f87171;
    background: rgba(239, 68, 68, 0.13);
  }

  .stat-card-icon-green {
    color: #4ade80;
    background: rgba(34, 197, 94, 0.13);
  }

  .stat-card-icon-purple {
    color: #c084fc;
    background: rgba(168, 85, 247, 0.13);
  }

  /* Value */

  .stat-card-value {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-top: 22px;
    color: var(--text-primary, #e5eaf3);
    font-size: clamp(25px, 3vw, 32px);
    font-weight: 750;
    line-height: 1.2;
    letter-spacing: -1px;
    overflow-wrap: anywhere;
  }

  .stat-card-unit {
    color: var(--text-secondary, #a1acc0);
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0;
  }

  /* Footer */

  .stat-card-footer {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 7px;
    margin-top: 15px;
  }

  .stat-card-trend {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 11px;
    font-weight: 650;
  }

  .stat-card-trend svg {
    width: 14px;
    height: 14px;
  }

  .stat-card-trend-positive {
    color: #4ade80;
  }

  .stat-card-trend-negative {
    color: #f87171;
  }

  .stat-card-trend-neutral {
    color: #94a3b8;
  }

  .stat-card-description {
    color: var(--text-secondary, #a1acc0);
    font-size: 11px;
    line-height: 1.5;
  }

  /* Loading State */

  .stat-card-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 145px;
  }

  .stat-card-skeleton {
    width: 100%;
  }

  .stat-card-skeleton-line {
    height: 12px;
    margin-bottom: 14px;
    background: linear-gradient(
      90deg,
      rgba(148, 163, 184, 0.07) 25%,
      rgba(148, 163, 184, 0.15) 50%,
      rgba(148, 163, 184, 0.07) 75%
    );
    background-size: 200% 100%;
    border-radius: 6px;
    animation: stat-card-shimmer 1.5s infinite;
  }

  .stat-card-skeleton-line.short {
    width: 45%;
  }

  .stat-card-skeleton-line.medium {
    width: 70%;
    height: 27px;
  }

  @keyframes stat-card-shimmer {
    to {
      background-position: -200% 0;
    }
  }

  /* Empty State */

  .stat-card-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 145px;
    color: var(--text-secondary, #a1acc0);
    font-size: 12px;
  }

  /* Responsive */

  @media (max-width: 600px) {
    .secure-stat-card {
      padding: 16px;
    }

    .stat-card-icon {
      width: 36px;
      height: 36px;
    }

    .stat-card-value {
      margin-top: 17px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .secure-stat-card {
      transition: none;
    }

    .stat-card-skeleton-line {
      animation: none;
    }
  }
`;

const defaultIcons = {
  scans: Activity,
  vulnerabilities: AlertTriangle,
  critical: ShieldAlert,
  security: ShieldCheck,
  resolved: CheckCircle2,
};

function StatCard({
  title,
  value,
  unit,
  change,
  trend = "neutral",
  description,
  icon,
  iconType = "blue",
  loading = false,
  empty = false,
  className = "",
}) {
  const normalizedTrend = [
    "positive",
    "negative",
    "neutral",
  ].includes(trend)
    ? trend
    : "neutral";

  const Icon =
    icon ||
    defaultIcons[
      title?.toLowerCase().includes("vulnerabil")
        ? "vulnerabilities"
        : title?.toLowerCase().includes("critical")
          ? "critical"
          : title?.toLowerCase().includes("security")
            ? "security"
            : "scans"
    ];

  const TrendIcon =
    normalizedTrend === "positive"
      ? ArrowUpRight
      : normalizedTrend === "negative"
        ? ArrowDownRight
        : null;

  const validIconTypes = [
    "blue",
    "cyan",
    "red",
    "green",
    "purple",
  ];

  const normalizedIconType = validIconTypes.includes(iconType)
    ? iconType
    : "blue";

  return (
    <>
      <style>{statCardStyles}</style>

      <article
        className={[
          "secure-stat-card",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {loading ? (
          <div
            className="stat-card-loading"
            role="status"
            aria-label={`Loading ${title || "statistics"}`}
          >
            <div className="stat-card-skeleton">
              <div className="stat-card-skeleton-line short" />
              <div className="stat-card-skeleton-line medium" />
              <div className="stat-card-skeleton-line" />
            </div>
          </div>
        ) : empty ? (
          <div className="stat-card-empty">
            No data available
          </div>
        ) : (
          <>
            <div className="stat-card-header">
              <h3 className="stat-card-title">
                {title}
              </h3>

              <div
                className={`stat-card-icon stat-card-icon-${normalizedIconType}`}
                aria-hidden="true"
              >
                <Icon />
              </div>
            </div>

            <div className="stat-card-value">
              {value ?? "—"}

              {unit && (
                <span className="stat-card-unit">
                  {unit}
                </span>
              )}
            </div>

            {(change !== undefined || description) && (
              <div className="stat-card-footer">
                {change !== undefined && (
                  <span
                    className={[
                      "stat-card-trend",
                      `stat-card-trend-${normalizedTrend}`,
                    ].join(" ")}
                  >
                    {TrendIcon && <TrendIcon />}

                    {change}
                  </span>
                )}

                {description && (
                  <span className="stat-card-description">
                    {description}
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </article>
    </>
  );
}

export default StatCard;