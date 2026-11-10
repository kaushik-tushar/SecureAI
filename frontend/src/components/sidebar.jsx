import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const sidebarStyles = `
  .secure-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    width: 260px;
    height: 100vh;
    height: 100dvh;
    background: var(--sidebar-background, #0c1422);
    border-right: 1px solid var(--border, #29364a);
    transition: width 0.25s ease, transform 0.25s ease;
  }

  .secure-sidebar.collapsed {
    width: 76px;
  }

  /* Brand */

  .sidebar-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 76px;
    padding: 0 20px;
    border-bottom: 1px solid var(--border, #29364a);
    overflow: hidden;
  }

  .sidebar-brand-text {
    min-width: 0;
    overflow: hidden;
  }

  .sidebar-brand-name {
    display: block;
    color: var(--text-primary, #e5eaf3);
    font-size: 18px;
    font-weight: 750;
    letter-spacing: -0.5px;
    white-space: nowrap;
  }

  .sidebar-brand-subtitle {
    display: block;
    margin-top: 3px;
    color: var(--text-secondary, #a1acc0);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    white-space: nowrap;
  }

  /* Navigation */

  .sidebar-navigation {
    flex: 1;
    padding: 20px 12px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: #35445b transparent;
  }

  .sidebar-navigation::-webkit-scrollbar {
    width: 5px;
  }

  .sidebar-navigation::-webkit-scrollbar-thumb {
    background: #35445b;
    border-radius: 10px;
  }

  .sidebar-group {
    margin-bottom: 25px;
  }

  .sidebar-group-title {
    margin: 0 0 10px;
    padding: 0 12px;
    color: #718096;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .sidebar-link {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 43px;
    margin-bottom: 4px;
    padding: 0 12px;
    color: var(--text-secondary, #a1acc0);
    text-decoration: none;
    font-size: 13px;
    font-weight: 500;
    border: 1px solid transparent;
    border-radius: 8px;
    transition: all 0.2s ease;
    white-space: nowrap;
    overflow: hidden;
  }

  .sidebar-link:hover {
    color: var(--text-primary, #e5eaf3);
    background: rgba(148, 163, 184, 0.07);
  }

  .sidebar-link.active {
    color: #60a5fa;
    background: rgba(59, 130, 246, 0.12);
    border-color: rgba(59, 130, 246, 0.18);
  }

  .sidebar-link.active::before {
    content: "";
    position: absolute;
    top: 9px;
    bottom: 9px;
    left: -1px;
    width: 3px;
    background: #3b82f6;
    border-radius: 0 4px 4px 0;
  }

  .sidebar-link-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Collapsed Sidebar */

  .secure-sidebar.collapsed .sidebar-brand {
    justify-content: center;
    padding: 0;
  }

  .secure-sidebar.collapsed .sidebar-brand-text,
  .secure-sidebar.collapsed .sidebar-group-title,
  .secure-sidebar.collapsed .sidebar-link-label {
    display: none;
  }

  .secure-sidebar.collapsed .sidebar-navigation {
    padding-right: 10px;
    padding-left: 10px;
  }

  .secure-sidebar.collapsed .sidebar-link {
    justify-content: center;
    padding: 0;
  }

  /* Collapse Control */

  .sidebar-collapse-button {
    position: absolute;
    top: 88px;
    right: -13px;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    padding: 0;
    color: var(--text-secondary, #a1acc0);
    background: var(--surface, #151e2e);
    border: 1px solid var(--border, #29364a);
    border-radius: 50%;
    cursor: pointer;
    font-size: 11px;
    font-weight: 700;
    transition: all 0.2s ease;
  }

  .sidebar-collapse-button:hover {
    color: #ffffff;
    border-color: #3b82f6;
    background: #1e3a5f;
  }

  /* Sidebar Footer */

  .sidebar-footer {
    padding: 14px 12px;
    border-top: 1px solid var(--border, #29364a);
  }

  .sidebar-user {
    display: flex;
    align-items: center;
    gap: 11px;
    min-width: 0;
    padding: 9px;
    border-radius: 9px;
  }

  .sidebar-user-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 34px;
    height: 34px;
    color: #ffffff;
    background: linear-gradient(135deg, #2563eb, #0891b2);
    border-radius: 50%;
    font-size: 13px;
    font-weight: 700;
  }

  .sidebar-user-info {
    flex: 1;
    min-width: 0;
    overflow: hidden;
  }

  .sidebar-user-name {
    display: block;
    overflow: hidden;
    color: var(--text-primary, #e5eaf3);
    font-size: 12px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sidebar-user-role {
    display: block;
    margin-top: 3px;
    color: var(--text-secondary, #a1acc0);
    font-size: 10px;
    white-space: nowrap;
  }

  .secure-sidebar.collapsed .sidebar-footer {
    padding: 12px 8px;
  }

  .secure-sidebar.collapsed .sidebar-user {
    justify-content: center;
    padding: 5px 0;
  }

  .secure-sidebar.collapsed .sidebar-user-info {
    display: none;
  }

  /* Mobile Navigation */

  .sidebar-mobile-trigger {
    display: none;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 0 10px;
    color: var(--text-primary, #e5eaf3);
    background: var(--surface, #151e2e);
    border: 1px solid var(--border, #29364a);
    border-radius: 8px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
  }

  .sidebar-mobile-overlay {
    display: none;
  }

  @media (max-width: 900px) {
    .secure-sidebar {
      width: 260px;
      transform: translateX(-100%);
    }

    .secure-sidebar.mobile-open {
      transform: translateX(0);
    }

    .secure-sidebar.collapsed {
      width: 260px;
    }

    .secure-sidebar.collapsed .sidebar-brand {
      justify-content: flex-start;
      padding: 0 20px;
    }

    .secure-sidebar.collapsed .sidebar-brand-text,
    .secure-sidebar.collapsed .sidebar-group-title,
    .secure-sidebar.collapsed .sidebar-link-label,
    .secure-sidebar.collapsed .sidebar-user-info {
      display: block;
    }

    .secure-sidebar.collapsed .sidebar-navigation {
      padding: 20px 12px;
    }

    .secure-sidebar.collapsed .sidebar-link {
      justify-content: flex-start;
      padding: 0 12px;
    }

    .secure-sidebar.collapsed .sidebar-footer {
      padding: 14px 12px;
    }

    .secure-sidebar.collapsed .sidebar-user {
      justify-content: flex-start;
      padding: 9px;
    }

    .sidebar-collapse-button {
      display: none;
    }

    .sidebar-mobile-trigger {
      display: inline-flex;
    }

    .sidebar-mobile-overlay {
      position: fixed;
      inset: 0;
      z-index: 999;
      display: block;
      background: rgba(3, 7, 18, 0.65);
      backdrop-filter: blur(3px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .secure-sidebar,
    .sidebar-link,
    .sidebar-collapse-button {
      transition: none;
    }
  }
`;

const navigationGroups = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Projects", path: "/projects" },
    ],
  },
  {
    title: "Security Operations",
    items: [
      { label: "Security Scans", path: "/scans" },
      { label: "Vulnerabilities", path: "/vulnerabilities" },
      { label: "Dependencies", path: "/dependencies" },
    ],
  },
  {
    title: "AI Security",
    items: [
      { label: "AI Code Review", path: "/ai-review" },
      { label: "Remediation", path: "/remediation" },
      { label: "Pull Requests", path: "/pull-requests" },
    ],
  },
  {
    title: "Workspace",
    items: [
      { label: "Settings", path: "/settings" },
    ],
  },
];

function Sidebar({
  user = {
    name: "SecureAI User",
    role: "Security Engineer",
    initials: "SU",
  },
  collapsed: controlledCollapsed,
  onCollapse,
  mobileOpen = false,
  onMobileClose,
}) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  const location = useLocation();

  const isControlled = typeof controlledCollapsed === "boolean";

  const isCollapsed = isControlled
    ? controlledCollapsed
    : internalCollapsed;

  const handleCollapse = () => {
    const nextValue = !isCollapsed;

    if (onCollapse) {
      onCollapse(nextValue);
    }

    if (!isControlled) {
      setInternalCollapsed(nextValue);
    }
  };

  const handleNavigation = () => {
    onMobileClose?.();
  };

  return (
    <>
      <style>{sidebarStyles}</style>

      {mobileOpen && (
        <div
          className="sidebar-mobile-overlay"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={[
          "secure-sidebar",
          isCollapsed ? "collapsed" : "",
          mobileOpen ? "mobile-open" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-label="Main navigation"
      >
        {/* Brand */}

        <div className="sidebar-brand">
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">
              SecureAI
            </span>

            <span className="sidebar-brand-subtitle">
              Code Security Platform
            </span>
          </div>
        </div>

        {/* Desktop Collapse Button */}

        <button
          type="button"
          className="sidebar-collapse-button"
          onClick={handleCollapse}
          aria-label={
            isCollapsed ? "Expand sidebar" : "Collapse sidebar"
          }
          aria-expanded={!isCollapsed}
        >
          {isCollapsed ? ">" : "<"}
        </button>

        {/* Navigation */}

        <nav className="sidebar-navigation">
          {navigationGroups.map((group) => (
            <div
              className="sidebar-group"
              key={group.title}
            >
              <h3 className="sidebar-group-title">
                {group.title}
              </h3>

              {group.items.map((item) => {
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/dashboard"}
                    onClick={handleNavigation}
                    className={({ isActive }) =>
                      [
                        "sidebar-link",
                        isActive ? "active" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")
                    }
                    aria-current={
                      location.pathname === item.path
                        ? "page"
                        : undefined
                    }
                    title={isCollapsed ? item.label : undefined}
                  >
                    <span className="sidebar-link-label">
                      {item.label}
                    </span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {user.initials || "SU"}
            </div>

            <div className="sidebar-user-info">
              <span className="sidebar-user-name">
                {user.name}
              </span>

              <span className="sidebar-user-role">
                {user.role}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export function SidebarMobileTrigger({ onClick }) {
  return (
    <button
      type="button"
      className="sidebar-mobile-trigger"
      onClick={onClick}
      aria-label="Open navigation menu"
      aria-haspopup="true"
    >
      Menu
    </button>
  );
}

export default Sidebar;