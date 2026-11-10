import React, {
    lazy,
    Suspense,
} from "react";

import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
    Link,
} from "react-router-dom";


/* =========================================
   LAZY-LOADED PAGES
========================================= */

const Dashboard = lazy(() => import("./pages/dashboard.jsx"));

const Projects = lazy(() => import("./pages/projects.jsx"));

const Scans = lazy(() => import("./pages/scans.jsx"));

const Vulnerabilities = lazy(
    () => import("./pages/vulnerabilities.jsx")
);

const AIReview = lazy(
    () => import("./pages/ai-review.jsx")
);

const Remediation = lazy(
    () => import("./pages/remediation.jsx")
);

const PullRequests = lazy(
    () => import("./pages/pull-requests.jsx")
);

const Dependencies = lazy(
    () => import("./pages/dependencies.jsx")
);

const Settings = lazy(
    () => import("./pages/settings.jsx")
);


/* =========================================
   PAGE LOADER
========================================= */

const PageLoader = () => {
    return (
        <div className="app-loader">

            <div className="app-loader-content">

                <div
                    className="app-loader-spinner"
                    role="status"
                    aria-label="Loading"
                />

                <h2>SecureAI</h2>

                <p>
                    Preparing your security workspace...
                </p>

            </div>

            <style>{`
                .app-loader {
                    min-height: 100vh;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #080d18;
                    color: #f8fafc;
                    font-family: Inter, sans-serif;
                }

                .app-loader-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    gap: 14px;
                }

                .app-loader-spinner {
                    width: 42px;
                    height: 42px;
                    border: 3px solid rgba(148, 163, 184, 0.2);
                    border-top-color: #38bdf8;
                    border-radius: 50%;
                    animation: app-spin 0.8s linear infinite;
                }

                .app-loader-content h2 {
                    margin: 8px 0 0;
                    font-size: 20px;
                    font-weight: 700;
                    letter-spacing: -0.5px;
                }

                .app-loader-content p {
                    margin: 0;
                    color: #94a3b8;
                    font-size: 13px;
                }

                @keyframes app-spin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .app-loader-spinner {
                        animation-duration: 2s;
                    }
                }
            `}</style>

        </div>
    );
};


/* =========================================
   404 NOT FOUND PAGE
========================================= */

const NotFound = () => {
    return (
        <div className="not-found-page">

            <div className="not-found-content">

                <div className="not-found-code">
                    404
                </div>

                <div className="not-found-icon">

                    <svg
                        width="54"
                        height="54"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v4" />
                        <path d="M12 16h.01" />
                    </svg>

                </div>

                <h1>Page Not Found</h1>

                <p>
                    The page you are looking for doesn't exist,
                    has been moved, or is temporarily unavailable.
                </p>

                <div className="not-found-actions">

                    <Link
                        to="/dashboard"
                        className="not-found-button"
                    >

                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="m15 18-6-6 6-6" />
                        </svg>

                        Back to Dashboard

                    </Link>

                    <Link
                        to="/"
                        className="not-found-home"
                    >
                        Go to Home
                    </Link>

                </div>

            </div>

            <style>{`
                .not-found-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                    background: #080d18;
                    color: #f8fafc;
                    font-family: Inter, sans-serif;
                }

                .not-found-content {
                    width: 100%;
                    max-width: 480px;
                    text-align: center;
                }

                .not-found-code {
                    margin-bottom: 10px;
                    color: rgba(56, 189, 248, 0.12);
                    font-size: clamp(100px, 20vw, 160px);
                    font-weight: 800;
                    line-height: 1;
                    letter-spacing: -10px;
                }

                .not-found-icon {
                    display: flex;
                    justify-content: center;
                    margin: -18px 0 22px;
                    color: #38bdf8;
                }

                .not-found-content h1 {
                    margin: 0 0 12px;
                    font-size: 30px;
                    font-weight: 700;
                    letter-spacing: -1px;
                }

                .not-found-content p {
                    margin: 0 auto;
                    max-width: 380px;
                    color: #94a3b8;
                    font-size: 14px;
                    line-height: 1.7;
                }

                .not-found-actions {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    justify-content: center;
                    gap: 14px;
                    margin-top: 30px;
                }

                .not-found-button {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 9px;
                    min-height: 44px;
                    padding: 0 18px;
                    border: 1px solid #0284c7;
                    border-radius: 8px;
                    background: #0284c7;
                    color: #ffffff;
                    font-size: 13px;
                    font-weight: 600;
                    text-decoration: none;
                    transition: background 0.2s ease;
                }

                .not-found-button:hover {
                    background: #0369a1;
                }

                .not-found-home {
                    color: #cbd5e1;
                    font-size: 13px;
                    font-weight: 500;
                    text-decoration: none;
                }

                .not-found-home:hover {
                    color: #38bdf8;
                }

                @media (max-width: 480px) {
                    .not-found-content h1 {
                        font-size: 25px;
                    }

                    .not-found-actions {
                        flex-direction: column;
                    }

                    .not-found-button {
                        width: 100%;
                    }
                }
            `}</style>

        </div>
    );
};


/* =========================================
   APPLICATION ROUTES
========================================= */

const AppRoutes = () => {
    return (
        <Suspense fallback={<PageLoader />}>

            <Routes>

                {/* Default Route */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

                {/* Authentication Routes */}

                <Route
                    path="/login"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

                <Route
                    path="/register"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

                {/* Main Application Routes */}

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/projects"
                    element={<Projects />}
                />

                <Route
                    path="/scans"
                    element={<Scans />}
                />

                <Route
                    path="/vulnerabilities"
                    element={<Vulnerabilities />}
                />

                <Route
                    path="/ai-review"
                    element={<AIReview />}
                />

                <Route
                    path="/remediation"
                    element={<Remediation />}
                />

                <Route
                    path="/pull-requests"
                    element={<PullRequests />}
                />

                <Route
                    path="/dependencies"
                    element={<Dependencies />}
                />

                <Route
                    path="/settings"
                    element={<Settings />}
                />

                {/* 404 Route */}

                <Route
                    path="*"
                    element={<NotFound />}
                />

            </Routes>

        </Suspense>
    );
};


/* =========================================
   ROOT APPLICATION
========================================= */

const App = () => {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
};


export default App;