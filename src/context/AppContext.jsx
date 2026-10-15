import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_PREFERENCES, DEFAULT_PROFILE } from "../data/settingsData";

const AppContext = createContext(null);

const readStored = (key, fallback) => {
    try {
        const stored = JSON.parse(localStorage.getItem(key));
        if (stored && typeof stored === "object") return { ...fallback, ...stored };
    } catch {
        // storage unavailable or corrupt
    }
    return fallback;
};

const writeStored = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // storage full or unavailable: keep the in-memory value
    }
};

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
    const [profile, setProfile] = useState(() => readStored("profile", DEFAULT_PROFILE));
    const [preferences, setPreferences] = useState(() => readStored("preferences", DEFAULT_PREFERENCES));

    useEffect(() => writeStored("profile", profile), [profile]);
    useEffect(() => writeStored("preferences", preferences), [preferences]);

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
            setIsDarkMode,
            toggleDarkMode,
            searchQuery,
            setSearchQuery,
            selectedDate,
            setSelectedDate,
            logoutRequested,
            requestLogout,
            cancelLogout,
            profile,
            setProfile,
            preferences,
            setPreferences,
        }),
        [isDarkMode, toggleDarkMode, searchQuery, selectedDate, logoutRequested, requestLogout, cancelLogout, profile, preferences]
    );

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
    return ctx;
};
