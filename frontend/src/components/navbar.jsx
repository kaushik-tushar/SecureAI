import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

const navbarStyles = `
  .secure-navbar {
    position: sticky;
    top: 0;
    z-index: 900;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    min-height: 72px;
    padding: 0 28px;
    background: var(--navbar-background, #0c1422);
    border-bottom: 1px solid var(--border, #29364a);
  }

  .navbar-left {
    display: flex;
    align-items: center;
    gap: 18px;
    min-width: 0;
  }

  .navbar-mobile-menu {
    display: none;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    padding: 0;
    color: var(--text-primary, #e5eaf3);
    background: var(--surface, #151e2e);
    border: 1px solid var(--border, #29364a);
    border-radius: 8px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
  }

  /* Breadcrumb */

  .navbar-breadcrumb {
    display: flex;
    align-items: center;
    gap: 9px;
    min-width: 0;
    color: var(--text-secondary, #a1acc0);
    font-size: 13px;
  }

  .navbar-breadcrumb-root {
    color: var(--text-secondary, #a1acc0);
    font-weight: 500;
  }

  .navbar-breadcrumb-separator {
    color: #64748b;
  }

  .navbar-breadcrumb-current {
    overflow: hidden;
    color: var(--text-primary, #e5eaf3);
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Navbar Actions */

  .navbar-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  /* Search */

  .navbar-search {
    position: relative;
    display: flex;
    align-items: center;
    width: 240px;
    height: 38px;
  }

  .navbar-search-input {
    width: 100%;
    height: 100%;
    padding: 0 58px 0 12px;
    color: var(--text-primary, #e5eaf3);
    background: var(--surface, #151e2e);
    border: 1px solid var(--border, #29364a);
    border-radius: 8px;
    outline: none;
    font-family: inherit;
    font-size: 12px;
    transition: border-color 0.2s ease;
  }

  .navbar-search-input::placeholder {
    color: #718096;
  }

  .navbar-search-input:focus {
    border-color: var(--primary, #3b82f6);
  }

  .navbar-search-shortcut {
    position: absolute;
    right: 9px;
    display: flex;
    align-items: center;
    gap: 3px;
    padding: 3px 5px;
    color: var(--text-secondary, #a1acc0);
    background: var(--background, #080d18);
    border: 1px solid var(--border, #29364a);
    border-radius: 4px;
    font-size: 10px;
    pointer-events: none;
  }

  /* Icon Buttons */

  .navbar-icon-button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 38px;
    padding: 0 12px;
    color: var(--text-secondary, #a1acc0);
    background: transparent;
    border: 1px solid transparent;
    border-radius: 8px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .navbar-icon-button:hover,
  .navbar-icon-button.active {
    color: var(--text-primary, #e5eaf3);
    background: var(--surface-hover, #1d293b);
    border-color: var(--border, #29364a);
  }

  .navbar-notification-indicator {
    position: absolute;
    top: 9px;
    right: 9px;
    width: 7px;
    height: 7px;
    background: #ef4444;
    border: 1px solid var(--navbar-background, #0c1422);
    border-radius: 50%;
  }

  /* Dropdown */

  .navbar-dropdown-wrapper {
    position: relative;
  }

  .navbar-dropdown {
    position: absolute;
    top: calc(100% + 12px);
    right: 0;
    z-index: 1100;
    width: 280px;
    padding: 8px;
    background: var(--surface, #151e2e);
    border: 1px solid var(--border, #29364a);
    border-radius: 11px;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
    animation: navbar-dropdown-enter 0.15s ease;
  }

  @keyframes navbar-dropdown-enter {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .navbar-dropdown-header {
    padding: 12px;
    border-bottom: 1px solid var(--border, #29364a);
  }

  .navbar-dropdown-title {
    display: block;
    color: var(--text-primary, #e5eaf3);
    font-size: 13px;
    font-weight: 650;
  }

  .navbar-dropdown-subtitle {
    display: block;
    margin-top: 4px;
    color: var(--text-secondary, #a1acc0);
    font-size: 11px;
  }

  .navbar-dropdown-item {
    display: flex;
    align-items: center;
    gap: 11px;
    width: 100%;
    min-height: 40px;
    padding: 9px 11px;
    color: var(--text-secondary, #a1acc0);
    background: transparent;
    border: none;
    border-radius: 7px;
    text-decoration: none;
    text-align: left;
    font-family: inherit;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .navbar-dropdown-item:hover {
    color: var(--text-primary, #e5eaf3);
    background: var(--surface-hover, #1d293b);
  }

  .navbar-dropdown-divider {
    height: 1px;
    margin: 7px 4px;
    background: var(--border, #29364a);
  }

  .navbar-dropdown-item.danger {
    color: #f87171;
  }

  .navbar-dropdown-item.danger:hover {
    background: rgba(239, 68, 68, 0.1);
  }

  /* Notifications */

  .navbar-notification-empty {
    padding: 24px 12px;
    color: var(--text-secondary, #a1acc0);
    font-size: 12px;
    text-align: center;
  }

  /* User Profile */

  .navbar-profile-button {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 4px 8px;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 9px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .navbar-profile-button:hover,
  .navbar-profile-button.active {
    background: var(--surface-hover, #1d293b);
    border-color: var(--border, #29364a);
  }

  .navbar-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 34px;
    height: 34px;
    color: #ffffff;
    background: linear-gradient(135deg, #2563eb, #0891b2);
    border-radius: 50%;
    font-size: 12px;
    font-weight: 700;
  }

  .navbar-profile-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
  }

  .navbar-profile-name {
    color: var(--text-primary, #e5eaf3);
    font-size: 12px;
    font-weight: 600;
  }

  .navbar-profile-role {
    color: var(--text-secondary, #a1acc0);
    font-size: 10px;
  }

  /* Responsive */

  @media (max-width: 900px) {
    .navbar-mobile-menu {
      display: flex;
    }

    .secure-navbar {
      padding: 0 18px;
    }

    .navbar-search {
      width: 190px;
    }
  }

  @media (max-width: 600px) {
    .secure-navbar {
      min-height: 64px;
      padding: 0 12px;
      gap: 10px;
    }

    .navbar-left {
      gap: 10px;
    }

    .navbar-actions {
      gap: 5px;
    }

    .navbar-search {
      width: 38px;
    }

    .navbar-search-input {
      padding: 0;
      opacity: 0;
      pointer-events: none;
    }

    .navbar-search:focus-within {
      position: absolute;
      top: 12px;
      right: 100px;
      left: 60px;
      z-index: 1200;
      width: auto;
    }

    .navbar-search:focus-within .navbar-search-input {
      padding: 0 12px;
      opacity: 1;
      pointer-events: auto;
      background: var(--surface, #151e2e);
    }

    .navbar-search-shortcut {
      display: none;
    }

    .navbar-profile-info {
      display: none;
    }

    .navbar-profile-button {
      padding: 2px;
    }

    .navbar-breadcrumb {
      font-size: 11px;
    }

    .navbar-dropdown {
      position: fixed;
      top: 68px;
      right: 10px;
      width: min(280px, calc(100vw - 20px));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .navbar-icon-button,
    .navbar-dropdown-item,
    .navbar-profile-button {
      transition: none;
    }

    .navbar-dropdown {
      animation: none;
    }
  }
`;

const routeLabels = {
  "/dashboard": "Dashboard",
  "/projects": "Projects",
  "/scans": "Security Scans",
  "/vulnerabilities": "Vulnerabilities",
  "/dependencies": "Dependencies",
  "/ai-review": "AI Code Review",
  "/remediation": "Remediation",
  "/pull-requests": "Pull Requests",
  "/settings": "Settings",
};

function Navbar({
  user = {
    name: "SecureAI User",
    email: "user@secureai.dev",
    role: "Security Engineer",
    initials: "SU",
  },
  notifications = [],
  onMobileMenuClick,
  onLogout,
  onSearch,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const currentPath = location.pathname;

  const currentPage =
    routeLabels[currentPath] ||
    currentPath
      .split("/")
      .filter(Boolean)
      .pop()
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (character) => character.toUpperCase()) ||
    "Dashboard";

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  useEffect(() => {
    const handleKeyboardShortcut = (event) => {
      const isShortcut =
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k";

      if (isShortcut) {
        event.preventDefault();
        searchRef.current?.focus();
      }

      if (event.key === "Escape") {
        setActiveDropdown(null);
        searchRef.current?.blur();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyboardShortcut
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyboardShortcut
      );
    };
  }, []);

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown((current) =>
      current === dropdownName ? null : dropdownName
    );
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const query = searchValue.trim();

    if (!query) {
      return;
    }

    onSearch?.(query);
  };

  const handleLogout = () => {
    setActiveDropdown(null);
    onLogout?.();
  };

  return (
    <>
      <style>{navbarStyles}</style>

      <header className="secure-navbar">
        {/* Left Section */}

        <div className="navbar-left">
          <button
            type="button"
            className="navbar-mobile-menu"
            onClick={onMobileMenuClick}
            aria-label="Open sidebar navigation"
          >
            Menu
          </button>

          <div
            className="navbar-breadcrumb"
            aria-label="Breadcrumb"
          >
            <span className="navbar-breadcrumb-root">
              SecureAI
            </span>

            <span
              className="navbar-breadcrumb-separator"
              aria-hidden="true"
            >
              /
            </span>

            <span
              className="navbar-breadcrumb-current"
              aria-current="page"
            >
              {currentPage}
            </span>
          </div>
        </div>

        {/* Right Section */}

        <div className="navbar-actions">
          {/* Search */}

          <form
            className="navbar-search"
            onSubmit={handleSearchSubmit}
            role="search"
          >
            <input
              ref={searchRef}
              type="search"
              className="navbar-search-input"
              placeholder="Search..."
              aria-label="Search SecureAI"
              value={searchValue}
              onChange={(event) =>
                setSearchValue(event.target.value)
              }
            />

            <span className="navbar-search-shortcut">
              Ctrl K
            </span>
          </form>

          {/* Notifications */}

          <div
            className="navbar-dropdown-wrapper"
            ref={dropdownRef}
          >
            <button
              type="button"
              className={[
                "navbar-icon-button",
                activeDropdown === "notifications"
                  ? "active"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() =>
                toggleDropdown("notifications")
              }
              aria-label="Notifications"
              aria-expanded={
                activeDropdown === "notifications"
              }
            >
              Notifications

              {notifications.length > 0 && (
                <span
                  className="navbar-notification-indicator"
                  aria-hidden="true"
                />
              )}
            </button>

            {activeDropdown === "notifications" && (
              <div className="navbar-dropdown">
                <div className="navbar-dropdown-header">
                  <span className="navbar-dropdown-title">
                    Notifications
                  </span>

                  <span className="navbar-dropdown-subtitle">
                    Your latest security updates
                  </span>
                </div>

                {notifications.length === 0 ? (
                  <div className="navbar-notification-empty">
                    You're all caught up.
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      className="navbar-dropdown-item"
                      key={notification.id}
                    >
                      <span>
                        {notification.message}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* User Profile */}

          <div className="navbar-dropdown-wrapper">
            <button
              type="button"
              className={[
                "navbar-profile-button",
                activeDropdown === "profile"
                  ? "active"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => toggleDropdown("profile")}
              aria-label="Open user profile menu"
              aria-expanded={activeDropdown === "profile"}
            >
              <span className="navbar-avatar">
                {user.initials || "SU"}
              </span>

              <span className="navbar-profile-info">
                <span className="navbar-profile-name">
                  {user.name}
                </span>

                <span className="navbar-profile-role">
                  {user.role}
                </span>
              </span>
            </button>

            {activeDropdown === "profile" && (
              <div className="navbar-dropdown">
                <div className="navbar-dropdown-header">
                  <span className="navbar-dropdown-title">
                    {user.name}
                  </span>

                  <span className="navbar-dropdown-subtitle">
                    {user.email}
                  </span>
                </div>

                <button
                  type="button"
                  className="navbar-dropdown-item"
                  onClick={() => {
                    setActiveDropdown(null);
                    navigate("/settings");
                  }}
                >
                  Account Settings
                </button>

                <button
                  type="button"
                  className="navbar-dropdown-item"
                  onClick={() => {
                    setActiveDropdown(null);
                    navigate("/settings");
                  }}
                >
                  Preferences
                </button>

                <div className="navbar-dropdown-divider" />

                <button
                  type="button"
                  className="navbar-dropdown-item danger"
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;