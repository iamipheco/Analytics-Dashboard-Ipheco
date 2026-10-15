import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import { useApp } from "../context/AppContext";
import { filterLabel, isFutureFilter, shiftFilter, todayDate } from "../utils/dateFilter";

const stepButton =
    "flex h-8 w-8 items-center justify-center rounded-full text-[#697689] hover:bg-slate-100 hover:text-[#34CAA5] disabled:opacity-30 disabled:hover:bg-transparent dark:hover:bg-slate-600";

// Dashboard toolbar showing the selected day or month, with quick stepping. Stays in sync with the header calendar.
const DateBar = () => {
    const { dateFilter, setDateFilter } = useApp();
    const next = shiftFilter(dateFilter, 1);

    const setMode = (mode) =>
        setDateFilter((f) => ({ mode, date: mode === "month" ? new Date(f.date.getFullYear(), f.date.getMonth(), 1) : clampToToday(f.date) }));

    return (
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1">
                <button type="button" aria-label={`Previous ${dateFilter.mode}`} onClick={() => setDateFilter(shiftFilter(dateFilter, -1))} className={stepButton}>
                    <ArrowLeft2 size="16" color="currentColor" />
                </button>
                <p className="min-w-[9.5rem] text-center text-sm font-semibold" aria-live="polite">
                    {filterLabel(dateFilter)}
                </p>
                <button
                    type="button"
                    aria-label={`Next ${dateFilter.mode}`}
                    disabled={isFutureFilter(next)}
                    onClick={() => setDateFilter(next)}
                    className={stepButton}
                >
                    <ArrowRight2 size="16" color="currentColor" />
                </button>
            </div>
            <div role="radiogroup" aria-label="Show a" className="flex rounded-full bg-slate-100 p-0.5 text-xs dark:bg-slate-600">
                {["day", "month"].map((m) => (
                    <button
                        key={m}
                        type="button"
                        role="radio"
                        aria-checked={dateFilter.mode === m}
                        onClick={() => setMode(m)}
                        className={`rounded-full px-3 py-1.5 capitalize transition-colors md:py-1 ${
                            dateFilter.mode === m
                                ? "bg-white font-medium text-[#26282C] shadow-sm dark:bg-slate-800 dark:text-white"
                                : "text-[#737373] dark:text-slate-300"
                        }`}
                    >
                        {m}
                    </button>
                ))}
            </div>
        </div>
    );
};

// Switching from a past month to day mode picks the last day of that month, or today if it's the current month.
const clampToToday = (date) => {
    const today = todayDate();
    if (date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth()) return today;
    return date.getDate() === 1 ? new Date(date.getFullYear(), date.getMonth() + 1, 0) : date;
};

export default DateBar;
