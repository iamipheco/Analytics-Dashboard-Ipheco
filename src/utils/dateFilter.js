import { toIsoDate } from "../data/dashboardData";

// A date filter is { mode: "day" | "month", date: Date }.

export const todayDate = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
};

export const rangeOf = ({ mode, date }) => {
    if (mode === "day") {
        const iso = toIsoDate(date);
        return { start: iso, end: iso };
    }
    return {
        start: toIsoDate(new Date(date.getFullYear(), date.getMonth(), 1)),
        end: toIsoDate(new Date(date.getFullYear(), date.getMonth() + 1, 0)),
    };
};

export const inRange = (iso, { start, end }) => iso >= start && iso <= end;

export const shiftFilter = ({ mode, date }, delta) => {
    if (mode === "day") {
        const d = new Date(date);
        d.setDate(d.getDate() + delta);
        return { mode, date: d };
    }
    return { mode, date: new Date(date.getFullYear(), date.getMonth() + delta, 1) };
};

// You can't step past today: there's no data in the future.
export const isFutureFilter = (filter) => rangeOf(filter).start > toIsoDate(todayDate());

export const filterLabel = ({ mode, date }, style = "long") =>
    mode === "day"
        ? date.toLocaleDateString("en-US", { month: style === "long" ? "long" : "short", day: "numeric", year: "numeric" })
        : date.toLocaleDateString("en-US", { month: style === "long" ? "long" : "short", year: "numeric" });

// The current month isn't over yet, so it's compared like-for-like on the days so far.
export const isMonthToDate = (filter) => {
    if (filter.mode !== "month") return false;
    const today = toIsoDate(todayDate());
    return inRange(today, rangeOf(filter));
};

export const comparisonLabel = (filter) => {
    if (filter.mode === "day") return "vs. previous day";
    return isMonthToDate(filter) ? "vs. same days last month" : "vs. previous month";
};
