import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { CloseCircle, HambergerMenu } from "iconsax-react";
import UserProfile from "./UserProfile";
import Notifications from "./Notifications";
import CalendarPaper from "./CalendarPaper";
import { sideData } from "./Data";
import { useApp } from "../context/AppContext";

const Header = ({ onOpenMenu }) => {
    const { searchQuery, setSearchQuery } = useApp();
    const { pathname } = useLocation();
    const [mobileSearch, setMobileSearch] = useState(false);
    const inputRef = useRef(null);

    // Billing isn't in the sidebar (it lives in the avatar menu), so name it here.
    const title = sideData.find((i) => i.link === pathname)?.name ?? { "/billing": "Billing" }[pathname] ?? "Dashboard";
    const searchLabel = {
        "/products": "Search products",
        "/users": "Search customers",
        "/messages": "Search messages",
        "/support": "Search help",
        "/tips": "Search tips",
    }[pathname] ?? "Search orders";

    // Each page has its own search, so start fresh when the page changes.
    useEffect(() => {
        setSearchQuery("");
        setMobileSearch(false);
    }, [pathname, setSearchQuery]);

    // "/" focuses search, like most dashboards.
    useEffect(() => {
        const handleKey = (e) => {
            const tag = document.activeElement?.tagName;
            if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
                e.preventDefault();
                setMobileSearch(true);
                requestAnimationFrame(() => inputRef.current?.focus());
            }
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, []);

    return (
        <header className="flex items-center gap-2 sm:gap-4 border-b border-[#EBECF2] dark:border-slate-600 bg-[#FAFAFA] dark:bg-slate-800 px-4 sm:px-5 py-3.5">
            <button
                type="button"
                aria-label="Open menu"
                onClick={onOpenMenu}
                className="lg:hidden -ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#697689] hover:text-[#34CAA5]"
            >
                <HambergerMenu size="24" color="currentColor" />
            </button>

            <h1 className={`flex-1 min-w-0 text-base sm:text-lg font-semibold truncate ${mobileSearch ? "hidden md:block" : ""}`}>
                {title}
            </h1>

            <div className={`relative ${mobileSearch ? "flex-1 md:flex-none" : ""}`}>
                <button
                    type="button"
                    aria-label="Search"
                    onClick={() => {
                        setMobileSearch(true);
                        requestAnimationFrame(() => inputRef.current?.focus());
                    }}
                    className={`md:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#DADDDD] dark:border-slate-600 text-[#697689] text-xl transition-colors hover:border-[#34CAA5] hover:text-[#34CAA5] ${mobileSearch ? "hidden" : ""}`}
                >
                    <CiSearch />
                </button>
                <div className={`${mobileSearch ? "block" : "hidden"} md:block relative`}>
                    <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-300 text-xl" />
                    <input
                        ref={inputRef}
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onBlur={() => !searchQuery && setMobileSearch(false)}
                        onKeyDown={(e) => {
                            if (e.key === "Escape") {
                                setSearchQuery("");
                                e.currentTarget.blur();
                            }
                        }}
                        placeholder={`${searchLabel}…`}
                        aria-label={searchLabel}
                        className="w-full md:w-56 lg:w-72 rounded-full border border-[#DADDDD] dark:border-slate-600 bg-white dark:bg-slate-700 py-2 pl-10 pr-9 text-sm outline-none transition focus:border-[#34CAA5] focus:ring-2 focus:ring-[#34CAA5]/20 placeholder:text-[#A3A3A3] dark:placeholder:text-slate-400 [&::-webkit-search-cancel-button]:hidden"
                    />
                    {searchQuery ? (
                        <button
                            type="button"
                            aria-label="Clear search"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3A3A3] hover:text-[#34CAA5]"
                        >
                            <CloseCircle size="16" color="currentColor" />
                        </button>
                    ) : (
                        <kbd className="hidden lg:block absolute right-3 top-1/2 -translate-y-1/2 rounded border border-slate-200 dark:border-slate-500 px-1.5 text-[10px] text-[#A3A3A3]">
                            /
                        </kbd>
                    )}
                </div>
            </div>

            <div className="hidden md:block">
                <CalendarPaper />
            </div>
            <Notifications />
            <UserProfile />
        </header>
    );
};

export default Header;
