import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ArrowLeft2, CloseCircle } from "iconsax-react";
import ImgLogo from "../assets/img/logo.png";
import { sideData } from "./Data";
import DarkModeToggle from "./DarkModeToggle";
import { useApp } from "../context/AppContext";

const itemBase =
    "group relative flex items-center gap-3 rounded-lg p-2.5 text-sm font-medium transition-colors duration-200";
const itemIdle = "text-[#697689] dark:text-slate-300 hover:bg-[#34CAA5]/10 hover:text-[#34CAA5]";
const itemActive = "bg-[#34CAA5] text-white shadow-sm shadow-[#34CAA5]/30";

const NavItem = ({ item, expanded, onLogout }) => {
    const Icon = item.icon;
    const content = (isActive) => (
        <>
            <Icon size="22" color="currentColor" variant={isActive ? "Bulk" : "Broken"} className="shrink-0" />
            <span className={`whitespace-nowrap transition-opacity ${expanded ? "opacity-100" : "lg:hidden"}`}>
                {item.name}
            </span>
            {!expanded && (
                <span className="pointer-events-none absolute left-full ml-3 hidden lg:group-hover:block whitespace-nowrap rounded-md bg-white dark:bg-slate-700 px-2 py-1 text-xs text-[#34CAA5] shadow-lg z-50">
                    {item.name}
                </span>
            )}
        </>
    );

    if (item.action === "logout") {
        return (
            <button type="button" onClick={onLogout} className={`${itemBase} w-full text-left ${itemIdle} hover:!text-[#ED544E] hover:!bg-[#ED544E]/10`}>
                {content(false)}
            </button>
        );
    }

    return (
        <NavLink to={item.link} end className={({ isActive }) => `${itemBase} ${isActive ? itemActive : itemIdle}`}>
            {({ isActive }) => content(isActive)}
        </NavLink>
    );
};

const Sidebar = ({ mobileOpen, onCloseMobile }) => {
    const { requestLogout } = useApp();
    const [collapsed, setCollapsed] = useState(false);
    // On mobile the drawer is always shown expanded.
    const expanded = mobileOpen || !collapsed;

    const top = sideData.filter((i) => i.section !== "bottom");
    const bottom = sideData.filter((i) => i.section === "bottom");

    return (
        <>
            {mobileOpen && (
                <div className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden animate-fade-in" onClick={onCloseMobile} />
            )}
            <aside
                className={`fixed lg:relative inset-y-0 left-0 z-40 flex flex-col h-screen h-[100dvh] shrink-0 border-r border-[#EBECF2] dark:border-slate-600 bg-[#F7F8FA] dark:bg-slate-800 p-4 transition-all duration-300
                ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
                ${expanded ? "w-60" : "w-60 lg:w-[76px]"}`}
            >
                {/* collapse handle (desktop) */}
                <button
                    type="button"
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    onClick={() => setCollapsed((c) => !c)}
                    className="hidden lg:flex absolute -right-3 top-[90px] h-6 w-6 items-center justify-center rounded-full border border-[#EBECF2] dark:border-slate-600 bg-white dark:bg-slate-700 text-[#697689] hover:text-[#34CAA5] shadow-sm"
                >
                    <ArrowLeft2 size="14" color="currentColor" className={`transition-transform ${collapsed ? "rotate-180" : ""}`} />
                </button>

                {/* close (mobile) */}
                <button
                    type="button"
                    aria-label="Close menu"
                    onClick={onCloseMobile}
                    className="lg:hidden absolute right-3 top-4 text-[#697689] hover:text-[#34CAA5]"
                >
                    <CloseCircle size="26" color="currentColor" variant="Broken" />
                </button>

                <div className="flex items-center gap-3 px-1 pt-2">
                    <img className="w-8 shrink-0" src={ImgLogo} alt="FASTA logo" />
                    {expanded && (
                        <h1 className="text-2xl font-bold">
                            FASTA
                        </h1>
                    )}
                </div>

                <nav className={`mt-10 flex flex-1 flex-col gap-1.5 ${expanded ? "overflow-y-auto scroll-thin" : ""}`}>
                    {top.map((item) => (
                        <NavItem key={item.name} item={item} expanded={expanded} />
                    ))}

                    <div className={`my-4 flex ${expanded ? "px-1" : "justify-center"}`}>
                        <DarkModeToggle vertical={!expanded} />
                    </div>

                    <div className="mt-auto flex flex-col gap-1.5">
                        {bottom.map((item) => (
                            <NavItem key={item.name} item={item} expanded={expanded} onLogout={requestLogout} />
                        ))}
                    </div>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
