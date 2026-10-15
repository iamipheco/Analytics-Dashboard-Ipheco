import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_PREFERENCES, DEFAULT_PROFILE } from "../data/settingsData";
import { orders as initialOrders } from "../data/dashboardData";
import { SESSION_KEY, accounts } from "../data/accounts";
import { todayDate } from "../utils/dateFilter";

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

// "Remember me" keeps the session in localStorage; otherwise it ends when the browser tab closes.
const readSession = () => {
    for (const store of ["localStorage", "sessionStorage"]) {
        try {
            const stored = JSON.parse(window[store].getItem(SESSION_KEY));
            if (stored?.email) return stored;
        } catch {
            // storage unavailable or corrupt
        }
    }
    return null;
};

const clearSession = () => {
    for (const store of ["localStorage", "sessionStorage"]) {
        try {
            window[store].removeItem(SESSION_KEY);
        } catch {
            // ignore
        }
    }
};

const SIGN_IN_DELAY = 600; // feels like a network round trip

export const AppProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);
    const [searchQuery, setSearchQuery] = useState("");
    // The day or month the dashboard is showing; picked from the header calendar or the dashboard toolbar.
    const [dateFilter, setDateFilter] = useState(() => ({ mode: "month", date: todayDate() }));
    // Orders live here so the KPI cards, charts and tables all react to status changes together.
    const [orders, setOrders] = useState(initialOrders);
    const [logoutRequested, setLogoutRequested] = useState(false);
    const [profile, setProfile] = useState(() => readStored("profile", DEFAULT_PROFILE));
    const [preferences, setPreferences] = useState(() => readStored("preferences", DEFAULT_PREFERENCES));

    const [session, setSession] = useState(readSession);

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

    const signIn = useCallback(
        (email, password, remember) =>
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    const account = accounts.find((a) => a.email === email.trim().toLowerCase() && a.password === password);
                    if (!account) {
                        reject(new Error("That email and password don't match an account."));
                        return;
                    }
                    const next = { email: account.email, name: account.name, role: account.role };
                    clearSession();
                    try {
                        (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, JSON.stringify(next));
                    } catch {
                        // storage unavailable: stay signed in for this visit only
                    }
                    // Switching accounts starts from that account's own name and email.
                    setProfile((p) => (p.email === account.email ? p : { name: account.name, email: account.email, avatar: null }));
                    setSession(next);
                    resolve(next);
                }, SIGN_IN_DELAY);
            }),
        []
    );

    const signOut = useCallback(() => {
        clearSession();
        setSession(null);
        setLogoutRequested(false);
        setSearchQuery("");
    }, []);

    const value = useMemo(
        () => ({
            isDarkMode,
            setIsDarkMode,
            toggleDarkMode,
            searchQuery,
            setSearchQuery,
            dateFilter,
            setDateFilter,
            orders,
            setOrders,
            logoutRequested,
            requestLogout,
            cancelLogout,
            profile,
            setProfile,
            session,
            signIn,
            signOut,
            preferences,
            setPreferences,
        }),
        [isDarkMode, toggleDarkMode, searchQuery, dateFilter, orders, logoutRequested, requestLogout, cancelLogout, profile, preferences, session, signIn, signOut]
    );

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
    return ctx;
};
