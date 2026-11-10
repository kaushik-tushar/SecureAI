import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";


/* =========================================
   API HOOK
========================================= */

const useApi = (
    apiFunction,
    {
        immediate = false,
        initialArgs = [],
        initialData = null,
        onSuccess,
        onError,
        resetOnExecute = false,
    } = {}
) => {
    const [data, setData] = useState(initialData);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null);

    const [refreshing, setRefreshing] = useState(false);

    const mountedRef = useRef(false);

    const requestIdRef = useRef(0);

    const controllerRef = useRef(null);

    const initialRequestRef = useRef(false);

    const apiFunctionRef = useRef(apiFunction);

    const callbacksRef = useRef({
        onSuccess,
        onError,
    });


    /* =========================================
       KEEP LATEST REFERENCES
    ========================================= */

    useEffect(() => {
        apiFunctionRef.current = apiFunction;

        callbacksRef.current = {
            onSuccess,
            onError,
        };
    }, [apiFunction, onSuccess, onError]);


    /* =========================================
       COMPONENT MOUNT / UNMOUNT
    ========================================= */

    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;

            requestIdRef.current += 1;

            controllerRef.current?.abort();

            controllerRef.current = null;
        };
    }, []);


    /* =========================================
       CANCEL CURRENT REQUEST
    ========================================= */

    const cancel = useCallback(() => {
        requestIdRef.current += 1;

        controllerRef.current?.abort();

        controllerRef.current = null;

        if (mountedRef.current) {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);


    /* =========================================
       EXECUTE API REQUEST
    ========================================= */

    const execute = useCallback(
        async (...args) => {
            if (!mountedRef.current) {
                return null;
            }

            // Cancel any previous request.
            controllerRef.current?.abort();

            const controller = new AbortController();

            controllerRef.current = controller;

            const currentRequestId = ++requestIdRef.current;

            const isRefreshing = data !== null;

            setLoading(true);

            setRefreshing(isRefreshing);

            setError(null);

            if (resetOnExecute) {
                setData(initialData);
            }

            try {
                const response = await apiFunctionRef.current(
                    {
                        signal: controller.signal,
                    },
                    ...args
                );

                // Ignore stale or cancelled responses.
                if (
                    !mountedRef.current ||
                    currentRequestId !== requestIdRef.current
                ) {
                    return null;
                }

                setData(response);

                setError(null);

                callbacksRef.current.onSuccess?.(response);

                return response;
            } catch (requestError) {
                if (
                    !mountedRef.current ||
                    currentRequestId !== requestIdRef.current
                ) {
                    return null;
                }

                // Cancelled requests should not be displayed as errors.
                if (
                    requestError?.code === "REQUEST_CANCELLED" ||
                    requestError?.name === "AbortError"
                ) {
                    return null;
                }

                setError(requestError);

                callbacksRef.current.onError?.(requestError);

                return null;
            } finally {
                if (
                    mountedRef.current &&
                    currentRequestId === requestIdRef.current
                ) {
                    setLoading(false);

                    setRefreshing(false);

                    controllerRef.current = null;
                }
            }
        },
        [data, initialData, resetOnExecute]
    );


    /* =========================================
       AUTOMATIC INITIAL EXECUTION
    ========================================= */

    useEffect(() => {
        if (!immediate || initialRequestRef.current) {
            return;
        }

        initialRequestRef.current = true;

        execute(...initialArgs);

        return () => {
            cancel();
        };

    }, [immediate, execute, cancel]);


    /* =========================================
       RESET API STATE
    ========================================= */

    const reset = useCallback(() => {
        cancel();

        setData(initialData);

        setError(null);

        setLoading(false);

        setRefreshing(false);
    }, [cancel, initialData]);


    /* =========================================
       RETURN HOOK STATE
    ========================================= */

    return {
        data,

        loading,

        refreshing,

        error,

        execute,

        cancel,

        reset,

        isSuccess: !loading && !error && data !== null,

        isError: Boolean(error),

        isIdle: !loading && data === null && !error,
    };
};


export default useApi;