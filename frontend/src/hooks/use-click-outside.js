import {
    useEffect,
    useRef,
} from "react";


/* =========================================
   USE CLICK OUTSIDE HOOK
========================================= */

const useClickOutside = (
    callback,
    options = {}
) => {
    const {
        enabled = true,
        excludedRefs = [],
        closeOnEscape = true,
        eventType = "pointerdown",
    } = options;


    /* =========================================
       REFS
    ========================================= */

    const elementRef = useRef(null);

    const callbackRef = useRef(callback);

    const excludedRefsRef = useRef(excludedRefs);


    /* =========================================
       UPDATE CALLBACK REFERENCES
    ========================================= */

    useEffect(() => {
        callbackRef.current = callback;

        excludedRefsRef.current = excludedRefs;

    }, [callback, excludedRefs]);


    /* =========================================
       EVENT LISTENER
    ========================================= */

    useEffect(() => {
        if (!enabled || typeof document === "undefined") {
            return undefined;
        }


        /* =========================================
           CHECK WHETHER CLICK IS INSIDE
        ========================================= */

        const isInsideElement = (target, element) => {
            if (!element) {
                return false;
            }

            return (
                element === target ||
                element.contains(target)
            );
        };


        /* =========================================
           HANDLE OUTSIDE CLICK
        ========================================= */

        const handlePointerDown = (event) => {
            const target = event.target;

            if (!(target instanceof Node)) {
                return;
            }

            // Ignore clicks inside the main element.
            if (
                isInsideElement(
                    target,
                    elementRef.current
                )
            ) {
                return;
            }

            // Ignore clicks inside excluded elements.
            const isExcluded = excludedRefsRef.current.some(
                (ref) =>
                    isInsideElement(
                        target,
                        ref?.current
                    )
            );

            if (isExcluded) {
                return;
            }

            callbackRef.current?.(event);
        };


        /* =========================================
           HANDLE ESCAPE KEY
        ========================================= */

        const handleKeyDown = (event) => {
            if (
                closeOnEscape &&
                event.key === "Escape"
            ) {
                callbackRef.current?.(event);
            }
        };


        /* =========================================
           REGISTER EVENT LISTENERS
        ========================================= */

        document.addEventListener(
            eventType,
            handlePointerDown,
            true
        );

        if (closeOnEscape) {
            document.addEventListener(
                "keydown",
                handleKeyDown
            );
        }


        /* =========================================
           CLEANUP
        ========================================= */

        return () => {
            document.removeEventListener(
                eventType,
                handlePointerDown,
                true
            );

            if (closeOnEscape) {
                document.removeEventListener(
                    "keydown",
                    handleKeyDown
                );
            }
        };

    }, [
        enabled,
        eventType,
        closeOnEscape,
    ]);


    return elementRef;
};


export default useClickOutside;