const API_BASE_URL = (
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1"
).replace(/\/+$/, "");

const DEFAULT_TIMEOUT = 30000;
const AI_REVIEW_TIMEOUT = 60000;


/* =========================================
   AUTHENTICATION TOKEN MANAGEMENT
========================================= */

let accessToken = null;
let csrfToken = null;

export const setAccessToken = (token) => {
    accessToken = token || null;
};

export const clearAccessToken = () => {
    accessToken = null;
};

export const setCsrfToken = (token) => {
    csrfToken = token || null;
};


/* =========================================
   API ERROR CLASS
========================================= */

export class ApiError extends Error {
    constructor({
        message = "Something went wrong.",
        status = 0,
        code = null,
        details = null,
        endpoint = null,
    } = {}) {
        super(message);

        this.name = "ApiError";
        this.status = status;
        this.code = code;
        this.details = details;
        this.endpoint = endpoint;
    }
}


/* =========================================
   URL BUILDER
========================================= */

const buildUrl = (endpoint, params = {}) => {
    const normalizedEndpoint = endpoint.startsWith("/")
        ? endpoint
        : `/${endpoint}`;

    const url = new URL(
        `${API_BASE_URL}${normalizedEndpoint}`
    );

    Object.entries(params).forEach(([key, value]) => {
        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            if (Array.isArray(value)) {
                value.forEach((item) => {
                    url.searchParams.append(key, item);
                });
            } else {
                url.searchParams.set(key, String(value));
            }
        }
    });

    return url.toString();
};


/* =========================================
   RESPONSE PARSER
========================================= */

const parseResponse = async (response) => {
    if (response.status === 204) {
        return null;
    }

    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
        try {
            return await response.json();
        } catch {
            return null;
        }
    }

    return await response.text();
};


/* =========================================
   ERROR NORMALIZER
========================================= */

const normalizeError = (response, data, endpoint) => {
    const message =
        data?.detail ||
        data?.message ||
        data?.error ||
        response.statusText ||
        "Request failed.";

    const normalizedMessage = Array.isArray(message)
        ? message
            .map((item) => item.msg || String(item))
            .join(", ")
        : typeof message === "object"
            ? JSON.stringify(message)
            : String(message);

    return new ApiError({
        message: normalizedMessage,
        status: response.status,
        code: data?.code || data?.error_code || null,
        details: data?.details || data?.errors || null,
        endpoint,
    });
};


/* =========================================
   CENTRALIZED HTTP CLIENT
========================================= */

export const apiRequest = async (
    endpoint,
    options = {}
) => {
    const {
        method = "GET",
        params = {},
        body,
        headers = {},
        timeout = DEFAULT_TIMEOUT,
        signal,
        responseType = "json",
        credentials = "include",
    } = options;

    const url = buildUrl(endpoint, params);

    const requestHeaders = {
        Accept: "application/json",
        ...headers,
    };

    if (accessToken) {
        requestHeaders.Authorization = `Bearer ${accessToken}`;
    }

    if (
        csrfToken &&
        !["GET", "HEAD", "OPTIONS"].includes(method.toUpperCase())
    ) {
        requestHeaders["X-CSRF-Token"] = csrfToken;
    }

    let requestBody;

    if (body !== undefined && body !== null) {
        if (
            body instanceof FormData ||
            body instanceof Blob ||
            body instanceof ArrayBuffer
        ) {
            requestBody = body;
        } else {
            requestHeaders["Content-Type"] = "application/json";
            requestBody = JSON.stringify(body);
        }
    }

    const controller = new AbortController();

    let timeoutId;

    const abortRequest = () => {
        controller.abort(signal?.reason);
    };

    if (signal) {
        if (signal.aborted) {
            abortRequest();
        } else {
            signal.addEventListener("abort", abortRequest, {
                once: true,
            });
        }
    }

    if (timeout > 0) {
        timeoutId = setTimeout(() => {
            controller.abort(
                new DOMException(
                    "Request timed out.",
                    "TimeoutError"
                )
            );
        }, timeout);
    }

    try {
        const response = await fetch(url, {
            method: method.toUpperCase(),
            headers: requestHeaders,
            body: requestBody,
            credentials,
            signal: controller.signal,
        });

        const data = await parseResponse(response);

        if (!response.ok) {
            throw normalizeError(response, data, endpoint);
        }

        if (responseType === "blob") {
            return data instanceof Blob
                ? data
                : new Blob([data]);
        }

        if (responseType === "text") {
            return typeof data === "string"
                ? data
                : JSON.stringify(data);
        }

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        if (error.name === "AbortError") {
            throw new ApiError({
                message: signal?.aborted
                    ? "Request was cancelled."
                    : "Request timed out.",
                code: signal?.aborted
                    ? "REQUEST_CANCELLED"
                    : "REQUEST_TIMEOUT",
                endpoint,
            });
        }

        if (error.name === "TimeoutError") {
            throw new ApiError({
                message: "Request timed out.",
                code: "REQUEST_TIMEOUT",
                endpoint,
            });
        }

        throw new ApiError({
            message: error.message || "Unable to connect to the server.",
            code: "NETWORK_ERROR",
            endpoint,
        });
    } finally {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        if (signal) {
            signal.removeEventListener("abort", abortRequest);
        }
    }
};


/* =========================================
   HTTP METHOD HELPERS
========================================= */

export const http = {
    get: (endpoint, params, options = {}) =>
        apiRequest(endpoint, {
            ...options,
            method: "GET",
            params,
        }),

    post: (endpoint, body, options = {}) =>
        apiRequest(endpoint, {
            ...options,
            method: "POST",
            body,
        }),

    put: (endpoint, body, options = {}) =>
        apiRequest(endpoint, {
            ...options,
            method: "PUT",
            body,
        }),

    patch: (endpoint, body, options = {}) =>
        apiRequest(endpoint, {
            ...options,
            method: "PATCH",
            body,
        }),

    delete: (endpoint, options = {}) =>
        apiRequest(endpoint, {
            ...options,
            method: "DELETE",
        }),
};


/* =========================================
   AUTHENTICATION APIs
========================================= */

export const authAPI = {
    register: (payload) =>
        http.post("/auth/register", payload),

    login: (payload) =>
        http.post("/auth/login", payload),

    logout: () =>
        http.post("/auth/logout"),

    getCurrentUser: () =>
        http.get("/auth/me"),

    refreshToken: () =>
        http.post("/auth/refresh"),

    forgotPassword: (email) =>
        http.post("/auth/forgot-password", {
            email,
        }),

    resetPassword: (payload) =>
        http.post("/auth/reset-password", payload),

    verifyEmail: (token) =>
        http.post("/auth/verify-email", {
            token,
        }),

    resendVerification: (email) =>
        http.post("/auth/resend-verification", {
            email,
        }),

    googleLogin: () =>
        http.get("/auth/oauth/google"),

    githubLogin: () =>
        http.get("/auth/oauth/github"),
};


/* =========================================
   PROJECT APIs
========================================= */

export const projectsAPI = {
    getAll: (params = {}) =>
        http.get("/projects", params),

    getById: (projectId) =>
        http.get(`/projects/${encodeURIComponent(projectId)}`),

    create: (payload) =>
        http.post("/projects", payload),

    update: (projectId, payload) =>
        http.patch(
            `/projects/${encodeURIComponent(projectId)}`,
            payload
        ),

    delete: (projectId) =>
        http.delete(`/projects/${encodeURIComponent(projectId)}`),

    getRepositories: () =>
        http.get("/github/repositories"),

    connectRepository: (payload) =>
        http.post("/github/repositories/connect", payload),

    disconnectRepository: (repositoryId) =>
        http.delete(
            `/github/repositories/${encodeURIComponent(repositoryId)}`
        ),

    syncRepository: (repositoryId) =>
        http.post(
            `/github/repositories/${encodeURIComponent(repositoryId)}/sync`
        ),
};


/* =========================================
   SECURITY SCAN APIs
========================================= */

export const scansAPI = {
    getAll: (params = {}) =>
        http.get("/scans", params),

    getById: (scanId) =>
        http.get(`/scans/${encodeURIComponent(scanId)}`),

    create: (payload) =>
        http.post("/scans", payload),

    start: (scanId) =>
        http.post(
            `/scans/${encodeURIComponent(scanId)}/start`
        ),

    cancel: (scanId) =>
        http.post(
            `/scans/${encodeURIComponent(scanId)}/cancel`
        ),

    delete: (scanId) =>
        http.delete(`/scans/${encodeURIComponent(scanId)}`),

    getResults: (scanId, params = {}) =>
        http.get(
            `/scans/${encodeURIComponent(scanId)}/results`,
            params
        ),

    getStatistics: (params = {}) =>
        http.get("/scans/statistics", params),

    getProgress: (scanId) =>
        http.get(
            `/scans/${encodeURIComponent(scanId)}/progress`
        ),

    getReport: (scanId, format = "json") =>
        http.get(
            `/scans/${encodeURIComponent(scanId)}/report`,
            { format }
        ),

    downloadReport: (scanId, format = "pdf") =>
        apiRequest(
            `/scans/${encodeURIComponent(scanId)}/report/download`,
            {
                params: { format },
                responseType: "blob",
            }
        ),
};


/* =========================================
   VULNERABILITY APIs
========================================= */

export const vulnerabilitiesAPI = {
    getAll: (params = {}) =>
        http.get("/vulnerabilities", params),

    getById: (vulnerabilityId) =>
        http.get(
            `/vulnerabilities/${encodeURIComponent(vulnerabilityId)}`
        ),

    updateStatus: (vulnerabilityId, status) =>
        http.patch(
            `/vulnerabilities/${encodeURIComponent(vulnerabilityId)}/status`,
            { status }
        ),

    getStatistics: (params = {}) =>
        http.get("/vulnerabilities/statistics", params),

    getHistory: (vulnerabilityId) =>
        http.get(
            `/vulnerabilities/${encodeURIComponent(vulnerabilityId)}/history`
        ),

    assign: (vulnerabilityId, userId) =>
        http.patch(
            `/vulnerabilities/${encodeURIComponent(vulnerabilityId)}/assign`,
            { user_id: userId }
        ),

    bulkUpdateStatus: (payload) =>
        http.patch("/vulnerabilities/bulk-status", payload),
};


/* =========================================
   AI REVIEW APIs
========================================= */

export const aiReviewAPI = {

    /*
     * AI-powered source-code security review.
     *
     * Backend:
     * POST /api/v1/ai-review/code
     *
     * Expected payload:
     * {
     *     source_code: string,
     *     language: string
     * }
     */

    reviewCode: (payload, options = {}) => {
        if (
            !payload ||
            typeof payload.source_code !== "string" ||
            !payload.source_code.trim()
        ) {
            throw new ApiError({
                message: "Source code is required for AI review.",
                code: "INVALID_SOURCE_CODE",
            });
        }

        return http.post(
            "/ai-review/code",
            {
                source_code: payload.source_code,
                language: payload.language || "python",
            },
            {
                ...options,
                timeout: options.timeout ?? AI_REVIEW_TIMEOUT,
            }
        );
    },

    /*
     * Backward-compatible method name.
     * Uses the actual source-code review endpoint.
     */

    analyze: (payload, options = {}) =>
        aiReviewAPI.reviewCode(payload, options),

    /*
     * Generate AI analysis for an existing vulnerability.
     *
     * Backend:
     * POST /api/v1/ai-review/vulnerability/{id}
     */

    analyzeVulnerability: (vulnerabilityId) =>
        http.post(
            `/ai-review/vulnerability/${encodeURIComponent(vulnerabilityId)}`,
            {}
        ),

    /*
     * Retrieve previously generated vulnerability analysis.
     *
     * Backend:
     * GET /api/v1/ai-review/vulnerability/{id}
     */

    getVulnerabilityAnalysis: (vulnerabilityId) =>
        http.get(
            `/ai-review/vulnerability/${encodeURIComponent(vulnerabilityId)}`
        ),

};


/* =========================================
   REMEDIATION APIs
========================================= */

export const remediationsAPI = {
    getAll: (params = {}) =>
        http.get("/remediations", params),

    getById: (remediationId) =>
        http.get(
            `/remediations/${encodeURIComponent(remediationId)}`
        ),

    approve: (remediationId) =>
        http.post(
            `/remediations/${encodeURIComponent(remediationId)}/approve`
        ),

    reject: (remediationId, reason = "") =>
        http.post(
            `/remediations/${encodeURIComponent(remediationId)}/reject`,
            { reason }
        ),

    validate: (remediationId, options = {}) =>
        http.post(
            `/remediations/${encodeURIComponent(remediationId)}/validate`,
            {},
            options
        ),

    apply: (remediationId) =>
        http.post(
            `/remediations/${encodeURIComponent(remediationId)}/apply`
        ),

    getValidationResult: (remediationId) =>
        http.get(
            `/remediations/${encodeURIComponent(remediationId)}/validation`
        ),
};


/* =========================================
   GITHUB PULL REQUEST APIs
========================================= */

export const pullRequestsAPI = {
    getAll: (params = {}) =>
        http.get("/github/pull-requests", params),

    getById: (pullRequestId) =>
        http.get(
            `/github/pull-requests/${encodeURIComponent(pullRequestId)}`
        ),

    create: (payload) =>
        http.post("/github/pull-requests", payload),

    sync: (pullRequestId) =>
        http.post(
            `/github/pull-requests/${encodeURIComponent(pullRequestId)}/sync`
        ),

    close: (pullRequestId) =>
        http.post(
            `/github/pull-requests/${encodeURIComponent(pullRequestId)}/close`
        ),

    getStatistics: () =>
        http.get("/github/pull-requests/statistics"),
};


/* =========================================
   DEPENDENCY APIs
========================================= */

export const dependenciesAPI = {
    getAll: (params = {}) =>
        http.get("/dependencies", params),

    getById: (dependencyId) =>
        http.get(
            `/dependencies/${encodeURIComponent(dependencyId)}`
        ),

    getStatistics: (params = {}) =>
        http.get("/dependencies/statistics", params),

    getVulnerabilities: (dependencyId) =>
        http.get(
            `/dependencies/${encodeURIComponent(dependencyId)}/vulnerabilities`
        ),

    checkUpdates: (dependencyId) =>
        http.post(
            `/dependencies/${encodeURIComponent(dependencyId)}/check-updates`
        ),

    getOutdated: (params = {}) =>
        http.get("/dependencies/outdated", params),
};


/* =========================================
   USER PROFILE APIs
========================================= */

export const profileAPI = {
    get: () =>
        http.get("/users/me"),

    update: (payload) =>
        http.patch("/users/me", payload),

    updateAvatar: (file) => {
        const formData = new FormData();

        formData.append("avatar", file);

        return http.post("/users/me/avatar", formData);
    },

    changePassword: (payload) =>
        http.post("/users/me/change-password", payload),

    deleteAccount: (payload) =>
        http.delete("/users/me", {
            body: payload,
        }),
};


/* =========================================
   SETTINGS APIs
========================================= */

export const settingsAPI = {
    get: () =>
        http.get("/settings"),

    update: (payload) =>
        http.patch("/settings", payload),

    getNotifications: () =>
        http.get("/settings/notifications"),

    updateNotifications: (payload) =>
        http.patch("/settings/notifications", payload),

    getIntegrations: () =>
        http.get("/settings/integrations"),

    updateIntegration: (integrationId, payload) =>
        http.patch(
            `/settings/integrations/${encodeURIComponent(integrationId)}`,
            payload
        ),

    disconnectIntegration: (integrationId) =>
        http.delete(
            `/settings/integrations/${encodeURIComponent(integrationId)}`
        ),

    getSessions: () =>
        http.get("/settings/sessions"),

    revokeSession: (sessionId) =>
        http.delete(
            `/settings/sessions/${encodeURIComponent(sessionId)}`
        ),

    revokeAllSessions: () =>
        http.delete("/settings/sessions"),
};


/* =========================================
   API KEY MANAGEMENT
========================================= */

export const apiKeysAPI = {
    getAll: () =>
        http.get("/api-keys"),

    create: (payload) =>
        http.post("/api-keys", payload),

    revoke: (keyId) =>
        http.delete(`/api-keys/${encodeURIComponent(keyId)}`),

    regenerate: (keyId) =>
        http.post(
            `/api-keys/${encodeURIComponent(keyId)}/regenerate`
        ),
};


/* =========================================
   DASHBOARD APIs
========================================= */

export const dashboardAPI = {
    getOverview: (params = {}) =>
        http.get("/dashboard/overview", params),

    getActivity: (params = {}) =>
        http.get("/dashboard/activity", params),

    getSecurityTrends: (params = {}) =>
        http.get("/dashboard/security-trends", params),

    getRecentScans: (params = {}) =>
        http.get("/dashboard/recent-scans", params),

    getTopVulnerabilities: (params = {}) =>
        http.get("/dashboard/top-vulnerabilities", params),
};


/* =========================================
   HEALTH CHECK
========================================= */

export const healthAPI = {
    check: () =>
        apiRequest("/health", {
            method: "GET",
            timeout: 5000,
            credentials: "omit",
        }),
};


/* =========================================
   DEFAULT API EXPORT
========================================= */

const api = {
    request: apiRequest,
    auth: authAPI,
    projects: projectsAPI,
    scans: scansAPI,
    vulnerabilities: vulnerabilitiesAPI,
    aiReview: aiReviewAPI,
    remediations: remediationsAPI,
    pullRequests: pullRequestsAPI,
    dependencies: dependenciesAPI,
    profile: profileAPI,
    settings: settingsAPI,
    apiKeys: apiKeysAPI,
    dashboard: dashboardAPI,
    health: healthAPI,
};

export default api;