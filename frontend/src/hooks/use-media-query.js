import {
    useEffect,
    useState,
} from "react";


/* =========================================
   MEDIA QUERY HOOK
========================================= */

const useMediaQuery = (
    query,
    initialValue = false
) => {
    const [matches, setMatches] = useState(() => {
        if (typeof window === "undefined") {
            return initialValue;
        }

        return window.matchMedia(query).matches;
    });


    /* =========================================
       LISTEN TO MEDIA QUERY CHANGES
    ========================================= */

    useEffect(() => {
        if (
            typeof window === "undefined" ||
            typeof window.matchMedia !== "function"
        ) {
            return undefined;
        }

        const mediaQuery = window.matchMedia(query);


        /* =========================================
           UPDATE MATCH STATE
        ========================================= */

        const handleChange = (event) => {
            setMatches(event.matches);
        };


        // Synchronize with the current browser state.
        setMatches(mediaQuery.matches);


        /* =========================================
           REGISTER EVENT LISTENER
        ========================================= */

        mediaQuery.addEventListener(
            "change",
            handleChange
        );


        /* =========================================
           CLEANUP
        ========================================= */

        return () => {
            mediaQuery.removeEventListener(
                "change",
                handleChange
            );
        };

    }, [query]);


    return matches;
};


/* =========================================
   PREDEFINED BREAKPOINT HOOKS
========================================= */

export const useIsMobile = () => {
    return useMediaQuery("(max-width: 767px)");
};


export const useIsTablet = () => {
    return useMediaQuery(
        "(min-width: 768px) and (max-width: 1023px)"
    );
};


export const useIsDesktop = () => {
    return useMediaQuery("(min-width: 1024px)");
};


/* =========================================
   REDUCED MOTION PREFERENCE
========================================= */

export const usePrefersReducedMotion = () => {
    return useMediaQuery(
        "(prefers-reduced-motion: reduce)"
    );
};


/* =========================================
   DARK MODE PREFERENCE
========================================= */

export const usePrefersDarkMode = () => {
    return useMediaQuery(
        "(prefers-color-scheme: dark)"
    );
};


export default useMediaQuery;