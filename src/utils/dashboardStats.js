import { platforms, toIsoDate } from "../data/dashboardData";
import { inRange, isMonthToDate, rangeOf, shiftFilter, todayDate } from "./dateFilter";

const TREND_POINTS = 10;

const metrics = (list) => {
    const paid = list.filter((o) => o.status === "Paid");
    const income = paid.reduce((t, o) => t + o.amount, 0);
    return {
        orders: list.length,
        refunds: list.length - paid.length,
        avg: paid.length ? income / paid.length : 0,
        income,
    };
};

// `capDay` limits a month to its first N days, for month-to-date comparisons.
const ordersIn = (orders, filter, capDay = null) => {
    const range = rangeOf(filter);
    if (capDay) {
        const capped = toIsoDate(new Date(filter.date.getFullYear(), filter.date.getMonth(), capDay));
        if (capped < range.end) range.end = capped;
    }
    return orders.filter((o) => inRange(o.date, range));
};

// null means "new": nothing to compare against, but something now.
const pctChange = (now, before) => {
    if (before) return ((now - before) / before) * 100;
    return now ? null : 0;
};

export const KPI_DEFS = [
    { id: "orders", label: "Total Orders", icon: "BoxTick" },
    // Fewer refunds is good, so the trend colour is flipped for this one.
    { id: "refunds", label: "Total Refunds", icon: "I3DRotate", lowerIsBetter: true },
    { id: "avg", label: "Average Sale", icon: "ShoppingCart", prefix: "$" },
    { id: "income", label: "Total Income", icon: "Coin1", prefix: "$" },
];

export const computeKpis = (orders, filter) => {
    const capDay = isMonthToDate(filter) ? todayDate().getDate() : null;
    const periods = Array.from({ length: TREND_POINTS }, (_, i) =>
        metrics(ordersIn(orders, shiftFilter(filter, i - TREND_POINTS + 1), capDay))
    );
    const now = periods[periods.length - 1];
    const before = periods[periods.length - 2];
    return KPI_DEFS.map((def) => ({
        ...def,
        value: Math.round(now[def.id]),
        change: pctChange(now[def.id], before[def.id]),
        trend: periods.map((p) => p[def.id]),
    }));
};

export const computePlatforms = (orders, filter) => {
    const paid = ordersIn(orders, filter).filter((o) => o.status === "Paid");
    const total = paid.reduce((t, o) => t + o.amount, 0);
    return platforms
        .map((p) => {
            const amount = paid.filter((o) => o.platform === p.name).reduce((t, o) => t + o.amount, 0);
            return { name: p.name, color: p.color, amount, share: total ? Math.round((amount / total) * 100) : 0 };
        })
        .sort((a, b) => b.amount - a.amount);
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Bars for the Sales Trends chart, anchored on the selected day or month.
// `highlight` marks the bars that overlap the selected period.
export const computeTrend = (orders, period, filter) => {
    const range = rangeOf(filter);
    const today = toIsoDate(todayDate());
    const anchorIso = range.end < today ? range.end : today;
    const anchor = new Date(`${anchorIso}T00:00:00`);
    const income = (start, end) =>
        orders.reduce((t, o) => (o.status === "Paid" && o.date >= start && o.date <= end ? t + o.amount : t), 0);

    let buckets;
    if (period === "weekly") {
        buckets = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(anchor);
            d.setDate(anchor.getDate() - 6 + i);
            const iso = toIsoDate(d);
            return { label: d.toLocaleDateString("en-US", { weekday: "short" }), start: iso, end: iso };
        });
    } else if (period === "yearly") {
        buckets = Array.from({ length: 3 }, (_, i) => {
            const y = anchor.getFullYear() - 2 + i;
            return { label: String(y), start: `${y}-01-01`, end: `${y}-12-31` };
        });
    } else {
        const y = anchor.getFullYear();
        buckets = MONTHS.map((label, m) => ({
            label,
            start: toIsoDate(new Date(y, m, 1)),
            end: toIsoDate(new Date(y, m + 1, 0)),
        }));
    }

    return buckets.map((b) => ({
        label: b.label,
        value: b.start > today ? 0 : income(b.start, b.end),
        highlight: b.start <= range.end && b.end >= range.start,
    }));
};
