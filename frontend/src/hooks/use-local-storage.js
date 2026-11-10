import {
    useCallback,
    useEffect,
    useState,
} from "react";


/* =========================================
   STORAGE EVENT
========================================= */

const STORAGE_EVENT = "secureai:storage";


/* =========================================
   DEFAULT SERIALIZATION
========================================= */

const defaultSerializer = (value) => {
    return JSON.stringify(value);
};

const defaultDeserializer = (value) => {
    return JSON.parse(value);
};


/* =========================================
   READ STORAGE
========================================= */

const readStorage = (
    key,
    initialValue,
    deserializer
) => {
    if (typeof window === "undefined") {
        return initialValue;
    }

    try {
        const storedValue = window.localStorage.getItem(key);

        if (storedValue === null) {
            return initialValue;
        }

        return deserializer(storedValue);
    } catch (error) {
        console.error(
            `Unable to read localStorage key "${key}":`,
            error
        );

        return initialValue;
    }
};


/* =========================================
   WRITE STORAGE
========================================= */

const writeStorage = (
    key,
    value,
    serializer
) => {
    if (typeof window === "undefined") {
        return false;
    }

    try {
        const serializedValue = serializer(value);

        window.localStorage.setItem(
            key,
            serializedValue
        );

        // Notify other hook instances in the same tab.
        window.dispatchEvent(
            new CustomEvent(STORAGE_EVENT, {
                detail: {
                    key,
                    value: serializedValue,
                },
            })
        );

        return true;
    } catch (error) {
        console.error(
            `Unable to write localStorage key "${key}":`,
            error
        );

        return false;
    }
};


/* =========================================
   REMOVE STORAGE
========================================= */

const removeStorage = (key) => {
    if (typeof window === "undefined") {
        return false;
    }

    try {
        window.localStorage.removeItem(key);

        window.dispatchEvent(
            new CustomEvent(STORAGE_EVENT, {
                detail: {
                    key,
                    value: null,
                },
            })
        );

        return true;
    } catch (error) {
        console.error(
            `Unable to remove localStorage key "${key}":`,
            error
        );

        return false;
    }
};


/* =========================================
   USE LOCAL STORAGE HOOK
========================================= */

const useLocalStorage = (
    key,
    initialValue,
    options = {}
) => {
    const {
        serializer = defaultSerializer,
        deserializer = defaultDeserializer,
    } = options;


    /* =========================================
       INITIAL STATE
    ========================================= */

    const [state, setState] = useState(() => ({
        key,
        value: readStorage(
            key,
            initialValue,
            deserializer
        ),
    }));


    /*
       When the storage key changes, load the value
       associated with the new key.
    */

    const storedValue = state.key === key
        ? state.value
        : initialValue;


    /* =========================================
       HANDLE KEY CHANGES
    ========================================= */

    useEffect(() => {
        if (state.key !== key) {
            setState({
                key,
                value: readStorage(
                    key,
                    initialValue,
                    deserializer
                ),
            });
        }
    }, [
        key,
        initialValue,
        deserializer,
        state.key,
    ]);


    /* =========================================
       SET STORAGE VALUE
    ========================================= */

    const setValue = useCallback(
        (valueOrFunction) => {
            setState((previousState) => {
                const previousValue =
                    previousState.key === key
                        ? previousState.value
                        : readStorage(
                            key,
                            initialValue,
                            deserializer
                        );

                const newValue =
                    typeof valueOrFunction === "function"
                        ? valueOrFunction(previousValue)
                        : valueOrFunction;

                writeStorage(
                    key,
                    newValue,
                    serializer
                );

                return {
                    key,
                    value: newValue,
                };
            });
        },
        [
            key,
            initialValue,
            serializer,
            deserializer,
        ]
    );


    /* =========================================
       REMOVE STORAGE VALUE
    ========================================= */

    const removeValue = useCallback(() => {
        removeStorage(key);

        setState({
            key,
            value: initialValue,
        });
    }, [key, initialValue]);


    /* =========================================
       CROSS-TAB AND SAME-TAB SYNC
    ========================================= */

    useEffect(() => {
        if (typeof window === "undefined") {
            return undefined;
        }

        const handleStorageChange = (event) => {
            // Ignore events belonging to another key.
            if (event.key !== key) {
                return;
            }

            if (event.newValue === null) {
                setState({
                    key,
                    value: initialValue,
                });

                return;
            }

            try {
                const newValue = deserializer(
                    event.newValue
                );

                setState({
                    key,
                    value: newValue,
                });
            } catch (error) {
                console.error(
                    `Unable to synchronize localStorage key "${key}":`,
                    error
                );
            }
        };


        const handleCustomStorageChange = (event) => {
            if (event.detail?.key !== key) {
                return;
            }

            if (event.detail.value === null) {
                setState({
                    key,
                    value: initialValue,
                });

                return;
            }

            try {
                const newValue = deserializer(
                    event.detail.value
                );

                setState({
                    key,
                    value: newValue,
                });
            } catch (error) {
                console.error(
                    `Unable to synchronize localStorage key "${key}":`,
                    error
                );
            }
        };


        window.addEventListener(
            "storage",
            handleStorageChange
        );

        window.addEventListener(
            STORAGE_EVENT,
            handleCustomStorageChange
        );


        return () => {
            window.removeEventListener(
                "storage",
                handleStorageChange
            );

            window.removeEventListener(
                STORAGE_EVENT,
                handleCustomStorageChange
            );
        };

    }, [
        key,
        initialValue,
        deserializer,
    ]);


    /* =========================================
       RETURN HOOK VALUES
    ========================================= */

    return [
        storedValue,
        setValue,
        removeValue,
    ];
};


export default useLocalStorage;