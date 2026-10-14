import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const AppContext = createContext(null);

const getInitialTheme = () => {
    try {
        const stored = localStorage.getItem("theme");
        if (stored) return stored === "dark";
    } catch {
        // storage unavailable: fall back to the OS preference
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

export const AppProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [logoutRequested, setLogoutRequested] = useState(false);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDarkMode);
        try {
            localStorage.setItem("theme", isDarkMode ? "dark" : "light");
        } catch {
            // ignore
        }
    }, [isDarkMode]);

    const toggleDarkMode = useCallback(() => setIsDarkMode((prev) => !prev), []);
    const requestLogout = useCallback(() => setLogoutRequested(true), []);
    const cancelLogout = useCallback(() => setLogoutRequested(false), []);

    const value = useMemo(
        () => ({
            isDarkMode,
            toggleDarkMode,
            searchQuery,
            setSearchQuery,
            selectedDate,
            setSelectedDate,
            logoutRequested,
            requestLogout,
            cancelLogout,
        }),
        [isDarkMode, toggleDarkMode, searchQuery, selectedDate, logoutRequested, requestLogout, cancelLogout]
    );

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
    return ctx;
};
