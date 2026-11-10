// frontend/src/hooks/use-auth.js

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    authAPI,
    profileAPI,
    setAccessToken,
    clearAccessToken,
} from "../services/api";


/* =========================================
   AUTHENTICATION CONTEXT
========================================= */

const AuthContext = createContext(null);


/* =========================================
   AUTHENTICATION PROVIDER
========================================= */

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [error, setError] = useState(null);

    const mountedRef = useRef(false);

    const requestIdRef = useRef(0);

    const logoutInProgressRef = useRef(false);


    /* =========================================
       NORMALIZE USER RESPONSE
    ========================================= */

    const normalizeUser = useCallback((response) => {
        if (!response) {
            return null;
        }

        return (
            response.user ||
            response.data?.user ||
            response.data ||
            response
        );
    }, []);


    /* =========================================
       UPDATE AUTHENTICATION STATE
    ========================================= */

    const updateAuthState = useCallback(
        (response) => {
            const authenticatedUser = normalizeUser(response);

            if (!authenticatedUser) {
                setUser(null);
                setIsAuthenticated(false);

                return null;
            }

            // Keep an optional access token in memory only.
            const token =
                response?.access_token ||
                response?.data?.access_token;

            if (token) {
                setAccessToken(token);
            }

            setUser(authenticatedUser);

            setIsAuthenticated(true);

            setError(null);

            return authenticatedUser;
        },
        [normalizeUser]
    );


    /* =========================================
       CLEAR AUTHENTICATION STATE
    ========================================= */

    const clearAuthState = useCallback(() => {
        clearAccessToken();

        setUser(null);

        setIsAuthenticated(false);

        setError(null);
    }, []);


    /* =========================================
       RESTORE EXISTING SESSION
    ========================================= */

    const restoreSession = useCallback(async () => {
        const requestId = ++requestIdRef.current;

        setLoading(true);

        try {
            const response = await authAPI.getCurrentUser();

            if (
                !mountedRef.current ||
                requestId !== requestIdRef.current
            ) {
                return null;
            }

            const authenticatedUser = normalizeUser(response);

            if (!authenticatedUser) {
                clearAuthState();

                return null;
            }

            setUser(authenticatedUser);

            setIsAuthenticated(true);

            setError(null);

            return authenticatedUser;
        } catch (requestError) {
            if (
                !mountedRef.current ||
                requestId !== requestIdRef.current
            ) {
                return null;
            }

            clearAuthState();

            // A missing or expired session is not an application error.
            if (requestError.status !== 401) {
                setError(requestError);
            }

            return null;
        } finally {
            if (
                mountedRef.current &&
                requestId === requestIdRef.current
            ) {
                setLoading(false);
            }
        }
    }, [clearAuthState, normalizeUser]);


    /* =========================================
       LOGIN
    ========================================= */

    const login = useCallback(
        async (credentials) => {
            setError(null);

            setLoading(true);

            const requestId = ++requestIdRef.current;

            try {
                const response = await authAPI.login(credentials);

                if (
                    !mountedRef.current ||
                    requestId !== requestIdRef.current
                ) {
                    return null;
                }

                let authenticatedUser = normalizeUser(response);

                // Some backends return only tokens after login.
                // In that case, fetch the authenticated user separately.
                if (
                    !authenticatedUser ||
                    !authenticatedUser.id
                ) {
                    const currentUserResponse =
                        await authAPI.getCurrentUser();

                    if (
                        !mountedRef.current ||
                        requestId !== requestIdRef.current
                    ) {
                        return null;
                    }

                    authenticatedUser =
                        normalizeUser(currentUserResponse);
                }

                if (!authenticatedUser) {
                    throw new Error(
                        "Login succeeded, but user information could not be retrieved."
                    );
                }

                updateAuthState({
                    ...response,
                    user: authenticatedUser,
                });

                return authenticatedUser;
            } catch (requestError) {
                if (
                    mountedRef.current &&
                    requestId === requestIdRef.current
                ) {
                    setError(requestError);
                }

                throw requestError;
            } finally {
                if (
                    mountedRef.current &&
                    requestId === requestIdRef.current
                ) {
                    setLoading(false);
                }
            }
        },
        [normalizeUser, updateAuthState]
    );


    /* =========================================
       REGISTER
    ========================================= */

    const register = useCallback(
        async (registrationData) => {
            setError(null);

            setLoading(true);

            const requestId = ++requestIdRef.current;

            try {
                const response = await authAPI.register(
                    registrationData
                );

                if (
                    !mountedRef.current ||
                    requestId !== requestIdRef.current
                ) {
                    return null;
                }

                const authenticatedUser = normalizeUser(response);

                // Only establish a session if the backend explicitly
                // returns an authenticated user or access token.
                const hasAuthentication =
                    Boolean(response?.access_token) ||
                    Boolean(response?.data?.access_token) ||
                    Boolean(
                        authenticatedUser?.id &&
                        (
                            response?.authenticated === true ||
                            response?.data?.authenticated === true
                        )
                    );

                if (hasAuthentication) {
                    updateAuthState(response);
                }

                return response;
            } catch (requestError) {
                if (
                    mountedRef.current &&
                    requestId === requestIdRef.current
                ) {
                    setError(requestError);
                }

                throw requestError;
            } finally {
                if (
                    mountedRef.current &&
                    requestId === requestIdRef.current
                ) {
                    setLoading(false);
                }
            }
        },
        [normalizeUser, updateAuthState]
    );


    /* =========================================
       LOGOUT
    ========================================= */

    const logout = useCallback(async () => {
        if (logoutInProgressRef.current) {
            return;
        }

        logoutInProgressRef.current = true;

        ++requestIdRef.current;

        // Clear local state immediately.
        clearAuthState();

        setLoading(false);

        try {
            await authAPI.logout();
        } catch (requestError) {
            // Local authentication is already cleared.
            // The server session may expire independently.
            console.error(
                "Server logout request failed:",
                requestError.message
            );
        } finally {
            logoutInProgressRef.current = false;
        }
    }, [clearAuthState]);


    /* =========================================
       REFRESH USER PROFILE
    ========================================= */

    const refreshUser = useCallback(async () => {
        const requestId = ++requestIdRef.current;

        try {
            const response = await profileAPI.get();

            if (
                !mountedRef.current ||
                requestId !== requestIdRef.current
            ) {
                return null;
            }

            const updatedUser = normalizeUser(response);

            if (!updatedUser) {
                return null;
            }

            setUser(updatedUser);

            setIsAuthenticated(true);

            return updatedUser;
        } catch (requestError) {
            if (
                mountedRef.current &&
                requestId === requestIdRef.current
            ) {
                setError(requestError);
            }

            throw requestError;
        }
    }, [normalizeUser]);


    /* =========================================
       UPDATE USER PROFILE LOCALLY
    ========================================= */

    const updateUser = useCallback((updates) => {
        setUser((previousUser) => {
            if (!previousUser) {
                return previousUser;
            }

            return {
                ...previousUser,
                ...updates,
            };
        });
    }, []);


    /* =========================================
       CLEAR AUTHENTICATION ERROR
    ========================================= */

    const clearError = useCallback(() => {
        setError(null);
    }, []);


    /* =========================================
       INITIAL SESSION CHECK
    ========================================= */

    useEffect(() => {
        mountedRef.current = true;

        restoreSession();

        return () => {
            mountedRef.current = false;

            ++requestIdRef.current;
        };
    }, [restoreSession]);


    /* =========================================
       CONTEXT VALUE
    ========================================= */

    const value = useMemo(
        () => ({
            user,

            loading,

            error,

            isAuthenticated,

            isAdmin: user?.role === "admin",

            login,

            register,

            logout,

            refreshUser,

            updateUser,

            clearError,

            restoreSession,
        }),
        [
            user,
            loading,
            error,
            isAuthenticated,
            login,
            register,
            logout,
            refreshUser,
            updateUser,
            clearError,
            restoreSession,
        ]
    );


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};


/* =========================================
   USE AUTH HOOK
========================================= */

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside an AuthProvider."
        );
    }

    return context;
};


export default useAuth;