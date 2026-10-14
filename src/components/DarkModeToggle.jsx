import { Moon, Sun1 } from "iconsax-react";
import { useApp } from "../context/AppContext";

// Pill toggle; `vertical` stacks the icons for the collapsed sidebar.
const DarkModeToggle = ({ vertical = false }) => {
    const { isDarkMode, toggleDarkMode } = useApp();

    return (
        <button
            type="button"
            role="switch"
            aria-checked={isDarkMode}
            aria-label="Toggle dark mode"
            onClick={toggleDarkMode}
            className={`relative flex ${vertical ? "flex-col h-[76px] w-10" : "w-[84px] h-10"} items-center justify-between rounded-full bg-slate-200 dark:bg-slate-600 p-1`}
        >
            <span
                className={`absolute h-8 w-8 rounded-full bg-[#34CAA5] dark:bg-slate-800 shadow transition-transform duration-300 ${
                    vertical
                        ? `top-1 ${isDarkMode ? "translate-y-9" : ""}`
                        : `left-1 ${isDarkMode ? "translate-x-11" : ""}`
                }`}
            />
            <span className="relative z-10 flex h-8 w-8 items-center justify-center">
                <Sun1 size="20" color={isDarkMode ? "#94A3B8" : "#FFFFFF"} variant="Bold" />
            </span>
            <span className="relative z-10 flex h-8 w-8 items-center justify-center">
                <Moon size="20" color={isDarkMode ? "#34CAA5" : "#94A3B8"} variant="Bold" />
            </span>
        </button>
    );
};

export default DarkModeToggle;
