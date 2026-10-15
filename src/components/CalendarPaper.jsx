import { useCallback, useState } from "react";
import { ArrowLeft2, ArrowRight2, Calendar as CalendarIcon } from "iconsax-react";
import { useApp } from "../context/AppContext";
import { useClickOutside } from "../hooks/useClickOutside";
import { filterLabel, todayDate } from "../utils/dateFilter";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const navButton =
    "rounded-full p-1 text-[#697689] hover:bg-slate-100 dark:hover:bg-slate-600 disabled:opacity-30 disabled:hover:bg-transparent";

const cellClass = (selected, current, disabled) =>
    `rounded-full text-xs transition-colors ${
        selected
            ? "bg-[#34CAA5] text-white font-semibold"
            : disabled
            ? "text-[#CBD5E1] dark:text-slate-500 cursor-not-allowed"
            : current
            ? "ring-1 ring-[#34CAA5] text-[#34CAA5]"
            : "hover:bg-slate-100 dark:hover:bg-slate-600"
    }`;

const CalendarPaper = () => {
    const { dateFilter, setDateFilter } = useApp();
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState(dateFilter.mode);
    const [view, setView] = useState(() => new Date(dateFilter.date.getFullYear(), dateFilter.date.getMonth(), 1));
    const close = useCallback(() => setOpen(false), []);
    const ref = useClickOutside(close, open);

    const today = todayDate();
    const selected = dateFilter.date;

    const toggle = () => {
        if (!open) {
            setMode(dateFilter.mode);
            setView(new Date(selected.getFullYear(), selected.getMonth(), 1));
        }
        setOpen((o) => !o);
    };

    const pick = (filter) => {
        setDateFilter(filter);
        setOpen(false);
    };

    // Day view pages by month; month view pages by year.
    const shift = (delta) =>
        setView((v) => (mode === "day" ? new Date(v.getFullYear(), v.getMonth() + delta, 1) : new Date(v.getFullYear() + delta, v.getMonth(), 1)));
    const canGoForward =
        mode === "day"
            ? new Date(view.getFullYear(), view.getMonth() + 1, 1) <= today
            : view.getFullYear() < today.getFullYear();

    const firstWeekday = view.getDay();
    const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    const cells = [
        ...Array(firstWeekday).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => new Date(view.getFullYear(), view.getMonth(), i + 1)),
    ];

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={toggle}
                aria-expanded={open}
                aria-label={`Showing ${filterLabel(dateFilter)}. Change date`}
                className="group flex items-center gap-2 rounded-full py-1 pr-2 text-sm font-medium text-[#26282C] dark:text-white"
                style={{ fontFamily: "Inter, sans-serif" }}
            >
                <span className="rounded-full p-2 text-[#697689] transition-colors group-hover:bg-[#34CAA5] group-hover:text-white">
                    <CalendarIcon size="20" color="currentColor" variant="Broken" />
                </span>
                <span className="hidden xl:inline">{filterLabel(dateFilter)}</span>
            </button>

            {open && (
                <div className="popover right-0 w-72 p-4">
                    <div role="radiogroup" aria-label="Show a" className="mb-3 grid grid-cols-2 rounded-full bg-slate-100 p-0.5 text-xs dark:bg-slate-600">
                        {["day", "month"].map((m) => (
                            <button
                                key={m}
                                type="button"
                                role="radio"
                                aria-checked={mode === m}
                                onClick={() => setMode(m)}
                                className={`rounded-full py-1 capitalize transition-colors ${
                                    mode === m ? "bg-white font-medium shadow-sm dark:bg-slate-800" : "text-[#737373] dark:text-slate-300"
                                }`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>

                    <div className="mb-3 flex items-center justify-between">
                        <button type="button" aria-label={mode === "day" ? "Previous month" : "Previous year"} onClick={() => shift(-1)} className={navButton}>
                            <ArrowLeft2 size="16" color="currentColor" />
                        </button>
                        <span className="text-sm font-semibold">
                            {mode === "day" ? view.toLocaleDateString("en-US", { month: "long", year: "numeric" }) : view.getFullYear()}
                        </span>
                        <button
                            type="button"
                            aria-label={mode === "day" ? "Next month" : "Next year"}
                            disabled={!canGoForward}
                            onClick={() => shift(1)}
                            className={navButton}
                        >
                            <ArrowRight2 size="16" color="currentColor" />
                        </button>
                    </div>

                    {mode === "day" ? (
                        <div className="grid grid-cols-7 gap-1 text-center text-[11px]">
                            {WEEKDAYS.map((d) => (
                                <span key={d} className="py-1 font-medium text-[#A3A3A3]">
                                    {d}
                                </span>
                            ))}
                            {cells.map((date, i) =>
                                date ? (
                                    <button
                                        type="button"
                                        key={i}
                                        disabled={date > today}
                                        onClick={() => pick({ mode: "day", date })}
                                        className={`h-8 ${cellClass(dateFilter.mode === "day" && sameDay(date, selected), sameDay(date, today), date > today)}`}
                                    >
                                        {date.getDate()}
                                    </button>
                                ) : (
                                    <span key={i} />
                                )
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-2">
                            {MONTHS.map((label, m) => {
                                const date = new Date(view.getFullYear(), m, 1);
                                const isSelected =
                                    dateFilter.mode === "month" && selected.getFullYear() === date.getFullYear() && selected.getMonth() === m;
                                const isCurrent = today.getFullYear() === date.getFullYear() && today.getMonth() === m;
                                return (
                                    <button
                                        key={label}
                                        type="button"
                                        disabled={date > today}
                                        onClick={() => pick({ mode: "month", date })}
                                        className={`h-10 ${cellClass(isSelected, isCurrent, date > today)}`}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    <div className="mt-3 flex justify-between border-t border-slate-100 pt-3 dark:border-slate-600">
                        <button type="button" onClick={() => pick({ mode: "day", date: todayDate() })} className="link-action text-xs">
                            Today
                        </button>
                        <button type="button" onClick={() => pick({ mode: "month", date: todayDate() })} className="link-action text-xs">
                            This month
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarPaper;
