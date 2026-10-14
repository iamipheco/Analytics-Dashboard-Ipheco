import { useCallback, useState } from "react";
import { ArrowLeft2, ArrowRight2, Calendar as CalendarIcon } from "iconsax-react";
import { useApp } from "../context/AppContext";
import { useClickOutside } from "../hooks/useClickOutside";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const CalendarPaper = () => {
    const { selectedDate, setSelectedDate } = useApp();
    const [open, setOpen] = useState(false);
    const [viewMonth, setViewMonth] = useState(
        () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
    );
    const close = useCallback(() => setOpen(false), []);
    const ref = useClickOutside(close, open);

    const today = new Date();
    const firstWeekday = viewMonth.getDay();
    const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
    const cells = [
        ...Array(firstWeekday).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => new Date(viewMonth.getFullYear(), viewMonth.getMonth(), i + 1)),
    ];

    const shiftMonth = (delta) =>
        setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));

    const pick = (date) => {
        setSelectedDate(date);
        setOpen(false);
    };

    const toggle = () => {
        if (!open) setViewMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
        setOpen((o) => !o);
    };

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={toggle}
                aria-expanded={open}
                className="group flex items-center gap-2 rounded-full py-1 pr-2 text-sm font-medium text-[#26282C] dark:text-white"
                style={{ fontFamily: "Inter, sans-serif" }}
            >
                <span className="rounded-full p-2 text-[#697689] transition-colors group-hover:bg-[#34CAA5] group-hover:text-white">
                    <CalendarIcon size="20" color="currentColor" variant="Broken" />
                </span>
                <span className="hidden xl:inline">
                    {selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
            </button>

            {open && (
                <div className="popover right-0 w-72 p-4">
                    <div className="mb-3 flex items-center justify-between">
                        <button type="button" aria-label="Previous month" onClick={() => shiftMonth(-1)} className="rounded-full p-1 text-[#697689] hover:bg-slate-100 dark:hover:bg-slate-600">
                            <ArrowLeft2 size="16" color="currentColor" />
                        </button>
                        <span className="text-sm font-semibold">
                            {viewMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                        </span>
                        <button type="button" aria-label="Next month" onClick={() => shiftMonth(1)} className="rounded-full p-1 text-[#697689] hover:bg-slate-100 dark:hover:bg-slate-600">
                            <ArrowRight2 size="16" color="currentColor" />
                        </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-[11px]">
                        {WEEKDAYS.map((d) => (
                            <span key={d} className="py-1 font-medium text-[#A3A3A3]">{d}</span>
                        ))}
                        {cells.map((date, i) =>
                            date ? (
                                <button
                                    type="button"
                                    key={i}
                                    onClick={() => pick(date)}
                                    className={`h-8 rounded-full text-xs transition-colors ${
                                        sameDay(date, selectedDate)
                                            ? "bg-[#34CAA5] text-white font-semibold"
                                            : sameDay(date, today)
                                            ? "ring-1 ring-[#34CAA5] text-[#34CAA5]"
                                            : "hover:bg-slate-100 dark:hover:bg-slate-600"
                                    }`}
                                >
                                    {date.getDate()}
                                </button>
                            ) : (
                                <span key={i} />
                            )
                        )}
                    </div>
                    <div className="mt-3 flex justify-end border-t border-slate-100 dark:border-slate-600 pt-3">
                        <button type="button" onClick={() => pick(new Date())} className="link-action text-xs">
                            Today
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarPaper;
