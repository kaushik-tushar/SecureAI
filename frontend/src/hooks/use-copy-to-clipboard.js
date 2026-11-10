import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";


/* =========================================
   LEGACY CLIPBOARD FALLBACK
========================================= */

const fallbackCopy = (text) => {
    const textArea = document.createElement("textarea");

    textArea.value = text;

    textArea.setAttribute("readonly", "");

    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    textArea.style.opacity = "0";

    document.body.appendChild(textArea);

    textArea.select();

    textArea.setSelectionRange(
        0,
        textArea.value.length
    );

    let successful = false;

    try {
        successful = document.execCommand("copy");
    } finally {
        document.body.removeChild(textArea);
    }

    if (!successful) {
        throw new Error("Clipboard copy operation failed.");
    }
};


/* =========================================
   USE COPY TO CLIPBOARD HOOK
========================================= */

const useCopyToClipboard = ({
    resetAfter = 2000,
} = {}) => {
    const [copied, setCopied] = useState(false);

    const [error, setError] = useState(null);

    const [copying, setCopying] = useState(false);

    const timeoutRef = useRef(null);

    const mountedRef = useRef(false);

    const operationIdRef = useRef(0);


    /* =========================================
       MOUNT / UNMOUNT
    ========================================= */

    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;

            operationIdRef.current += 1;

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);


    /* =========================================
       COPY TEXT
    ========================================= */

    const copy = useCallback(async (value) => {
        const operationId = ++operationIdRef.current;

        if (typeof value !== "string" && typeof value !== "number") {
            const validationError = new Error(
                "Clipboard value must be a string or number."
            );

            setError(validationError);

            setCopied(false);

            return false;
        }

        const text = String(value);

        if (!text.length) {
            const validationError = new Error(
                "Cannot copy an empty value."
            );

            setError(validationError);

            setCopied(false);

            return false;
        }

        setCopying(true);

        setCopied(false);

        setError(null);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);

            timeoutRef.current = null;
        }

        try {
            if (
                typeof navigator !== "undefined" &&
                navigator.clipboard?.writeText &&
                window.isSecureContext
            ) {
                await navigator.clipboard.writeText(text);
            } else if (typeof document !== "undefined") {
                fallbackCopy(text);
            } else {
                throw new Error(
                    "Clipboard API is not available."
                );
            }

            if (
                !mountedRef.current ||
                operationId !== operationIdRef.current
            ) {
                return false;
            }

            setCopied(true);

            if (resetAfter > 0) {
                timeoutRef.current = setTimeout(() => {
                    if (
                        mountedRef.current &&
                        operationId === operationIdRef.current
                    ) {
                        setCopied(false);
                    }
                }, resetAfter);
            }

            return true;

        } catch (copyError) {
            if (
                mountedRef.current &&
                operationId === operationIdRef.current
            ) {
                setCopied(false);

                setError(copyError);
            }

            return false;

        } finally {
            if (
                mountedRef.current &&
                operationId === operationIdRef.current
            ) {
                setCopying(false);
            }
        }
    }, [resetAfter]);


    /* =========================================
       RESET COPY STATE
    ========================================= */

    const reset = useCallback(() => {
        operationIdRef.current += 1;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);

            timeoutRef.current = null;
        }

        setCopied(false);

        setError(null);

        setCopying(false);
    }, []);


    /* =========================================
       RETURN
    ========================================= */

    return {
        copy,
        copied,
        copying,
        error,
        reset,
    };
};


export default useCopyToClipboard;