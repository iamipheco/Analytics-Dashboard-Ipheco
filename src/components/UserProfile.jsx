import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowDown2, Logout, Moon, Profile, Setting2, Sun1, Wallet } from "iconsax-react";
import UserProfPic from "../assets/img/user-prof.jpg";
import { useApp } from "../context/AppContext";
import { useClickOutside } from "../hooks/useClickOutside";

const UserProfile = () => {
    const { isDarkMode, toggleDarkMode, requestLogout, profile } = useApp();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const close = useCallback(() => setOpen(false), []);
    const ref = useClickOutside(close, open);

    const run = (fn) => () => {
        setOpen(false);
        fn();
    };

    const items = [
        { label: "My profile", icon: Profile, onClick: run(() => navigate("/settings")) },
        { label: "Billing", icon: Wallet, onClick: run(() => navigate("/billing")) },
        { label: "Settings", icon: Setting2, onClick: run(() => navigate("/settings")) },
        { label: isDarkMode ? "Light mode" : "Dark mode", icon: isDarkMode ? Sun1 : Moon, onClick: toggleDarkMode },
    ];

    const itemClass =
        "flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-600";

    return (
        <div ref={ref} className="relative shrink-0">
            <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
                className="flex h-10 items-center gap-3 rounded-full border border-[#DADDDD] dark:border-slate-600 p-0.5 sm:p-1 sm:pr-3 lg:h-auto transition-colors hover:border-[#34CAA5]"
                style={{ fontFamily: "Inter, sans-serif" }}
            >
                <img src={profile.avatar || UserProfPic} alt={profile.name} className="h-[34px] w-[34px] sm:h-[30px] sm:w-[30px] lg:h-9 lg:w-9 rounded-full object-cover" />
                <span className="hidden lg:block text-right leading-tight">
                    <span className="block text-sm text-[#26282C] dark:text-white">{profile.name}</span>
                    <span className="block text-xs font-light text-[#787486] dark:text-slate-400">{profile.email}</span>
                </span>
                <ArrowDown2
                    size="16"
                    color="#697689"
                    className={`hidden sm:block transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div role="menu" className="popover right-0 w-56 py-2">
                    <div className="px-4 pb-2 mb-1 border-b border-slate-100 dark:border-slate-600 lg:hidden">
                        <p className="text-sm font-medium">{profile.name}</p>
                        <p className="text-xs text-[#787486] dark:text-slate-400">{profile.email}</p>
                    </div>
                    {items.map(({ label, icon: Icon, onClick }) => (
                        <button key={label} type="button" role="menuitem" onClick={onClick} className={itemClass}>
                            <Icon size="18" color="#697689" variant="Broken" />
                            {label}
                        </button>
                    ))}
                    <div className="my-1 border-t border-slate-100 dark:border-slate-600" />
                    <button type="button" role="menuitem" onClick={run(requestLogout)} className={`${itemClass} text-[#ED544E]`}>
                        <Logout size="18" color="currentColor" variant="Broken" />
                        Sign out
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
