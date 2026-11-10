// frontend/src/hooks/use-debounce.js

import {
    useEffect,
    useState,
} from "react";


/* =========================================
   DEBOUNCE HOOK
========================================= */

const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);


    /* =========================================
       UPDATE DEBOUNCED VALUE
    ========================================= */

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedValue(value);
        }, Math.max(0, delay));


        /* =========================================
           CLEANUP PREVIOUS TIMEOUT
        ========================================= */

        return () => {
            clearTimeout(timeout);
        };

    }, [value, delay]);


    return debouncedValue;
};


export default useDebounce;