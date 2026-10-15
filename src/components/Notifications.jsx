import { useCallback, useState } from "react";
import { Notification1, TickCircle } from "iconsax-react";
import { initialNotifications } from "../data/dashboardData";
import { useClickOutside } from "../hooks/useClickOutside";

const Notifications = () => {
    const [items, setItems] = useState(initialNotifications);
    const [open, setOpen] = useState(false);
    const close = useCallback(() => setOpen(false), []);
    const ref = useClickOutside(close, open);

    const unread = items.filter((n) => !n.read).length;

    const markRead = (id) => setItems((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));
    const markAllRead = () => setItems((list) => list.map((n) => ({ ...n, read: true })));
    const dismiss = (id) => setItems((list) => list.filter((n) => n.id !== id));

    return (
        <div ref={ref} className="relative shrink-0">
            <button
                type="button"
                aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
                className={`relative flex h-10 w-10 items-center justify-center rounded-full border border-[#DADDDD] dark:border-slate-600 transition-colors hover:bg-[#34CAA5] hover:border-[#34CAA5] hover:text-white ${
                    open ? "bg-[#34CAA5] border-[#34CAA5] text-white" : "text-[#697689]"
                }`}
            >
                <Notification1 size="20" color="currentColor" variant="Broken" />
                {unread > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ED544E] px-1 text-[9px] font-semibold text-white ring-2 ring-[#FAFAFA] dark:ring-slate-800">
                        {unread}
                    </span>
                )}
            </button>

            {open && (
                <div className="popover -right-14 sm:right-0 w-[calc(100vw-2rem)] max-w-sm">
                    <div className="flex items-center justify-between px-4 pt-4 pb-2">
                        <h3 className="text-sm font-semibold">Notifications</h3>
                        <button
                            type="button"
                            onClick={markAllRead}
                            disabled={!unread}
                            className="text-xs font-medium text-[#34CAA5] hover:underline disabled:text-[#A3A3A3] disabled:no-underline"
                        >
                            Mark all as read
                        </button>
                    </div>
                    <ul className="max-h-80 overflow-y-auto scroll-thin pb-2">
                        {items.length === 0 && (
                            <li className="px-4 py-8 text-center text-xs text-[#A3A3A3]">You&apos;re all caught up 🎉</li>
                        )}
                        {items.map((n) => (
                            <li
                                key={n.id}
                                className={`group flex gap-3 px-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-600 ${
                                    n.read ? "" : "bg-[#34CAA5]/5"
                                }`}
                            >
                                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-transparent" : "bg-[#34CAA5]"}`} />
                                <button type="button" onClick={() => markRead(n.id)} className="flex-1 text-left">
                                    <p className={`text-xs ${n.read ? "font-medium" : "font-semibold"}`}>{n.title}</p>
                                    <p className="mt-0.5 text-xs text-[#737373] dark:text-slate-300">{n.body}</p>
                                    <p className="mt-1 text-[10px] text-[#A3A3A3]">{n.time}</p>
                                </button>
                                <button
                                    type="button"
                                    aria-label="Dismiss notification"
                                    onClick={() => dismiss(n.id)}
                                    className="self-start text-[#A3A3A3] opacity-0 transition-opacity hover:text-[#34CAA5] group-hover:opacity-100 focus:opacity-100"
                                >
                                    <TickCircle size="16" color="currentColor" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Notifications;
