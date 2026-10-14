import { platforms } from "./dashboardData";

export const RANGES = [
    { id: "7d", label: "7D", days: 7, bucket: "day" },
    { id: "30d", label: "30D", days: 30, bucket: "day" },
    { id: "90d", label: "90D", days: 90, bucket: "week" },
    { id: "12m", label: "12M", days: 365, bucket: "month" },
];

// Seeded RNG so the mock data is stable between reloads.
const mulberry32 = (seed) => () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const HISTORY_DAYS = 730; // two years, so every range has a previous period to compare against

// Oldest first; the last entry is today.
const daily = (() => {
    const rand = mulberry32(42);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from({ length: HISTORY_DAYS }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (HISTORY_DAYS - 1 - i));
        const growth = 1 + i / HISTORY_DAYS; // steady upward trend
        const weekend = [0, 6].includes(date.getDay()) ? 1.25 : 1;
        const season = 1 + 0.15 * Math.sin((date.getMonth() / 12) * Math.PI * 2);
        const visitors = Math.round(1800 * growth * weekend * season * (0.85 + rand() * 0.3));
        const conversion = 0.024 + rand() * 0.012;
        const orders = Math.round(visitors * conversion);
        const revenue = Math.round(orders * (105 + rand() * 40));
        return { date, visitors, orders, revenue };
    });
})();

const sum = (rows, key) => rows.reduce((total, r) => total + r[key], 0);

const totals = (rows) => {
    const revenue = sum(rows, "revenue");
    const orders = sum(rows, "orders");
    const visitors = sum(rows, "visitors");
    return {
        revenue,
        orders,
        visitors,
        aov: orders ? revenue / orders : 0,
        conversion: visitors ? (orders / visitors) * 100 : 0,
    };
};

const bucketKey = (date, bucket) => {
    if (bucket === "day") return date.toDateString();
    if (bucket === "month") return `${date.getFullYear()}-${date.getMonth()}`;
    const monday = new Date(date);
    monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
    return monday.toDateString();
};

const bucketLabel = (date, bucket) => {
    if (bucket === "month") return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    if (bucket === "week") return `Wk of ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const groupRevenue = (rows, bucket) => {
    const groups = new Map();
    rows.forEach((r) => {
        const key = bucketKey(r.date, bucket);
        if (!groups.has(key)) groups.set(key, { label: bucketLabel(r.date, bucket), value: 0 });
        groups.get(key).value += r.revenue;
    });
    return [...groups.values()];
};

const pctChange = (now, before) => (before ? ((now - before) / before) * 100 : 0);

const PLATFORM_TOTAL = platforms.reduce((t, p) => t + p.amount, 0);

export const getAnalytics = (rangeId) => {
    const range = RANGES.find((r) => r.id === rangeId);
    const current = daily.slice(-range.days);
    const previous = daily.slice(-range.days * 2, -range.days);
    const now = totals(current);
    const before = totals(previous);

    const currentSeries = groupRevenue(current, range.bucket);
    // Align the previous period to the current buckets by position.
    const previousSeries = groupRevenue(previous, range.bucket).slice(-currentSeries.length);

    return {
        kpis: [
            { id: "revenue", label: "Revenue", value: now.revenue, format: "currency", change: pctChange(now.revenue, before.revenue) },
            { id: "orders", label: "Orders", value: now.orders, format: "number", change: pctChange(now.orders, before.orders) },
            { id: "aov", label: "Avg. order value", value: now.aov, format: "currency", change: pctChange(now.aov, before.aov) },
            { id: "conversion", label: "Conversion rate", value: now.conversion, format: "percent", change: now.conversion - before.conversion, unit: "pts" },
        ],
        revenue: {
            labels: currentSeries.map((b) => b.label),
            current: currentSeries.map((b) => b.value),
            previous: previousSeries.map((b) => b.value),
        },
        platforms: platforms
            .map((p) => ({ name: p.name, value: Math.round((p.amount / PLATFORM_TOTAL) * now.revenue) }))
            .sort((a, b) => b.value - a.value),
        funnel: [
            { label: "Visitors", value: now.visitors },
            { label: "Viewed a product", value: Math.round(now.visitors * 0.58) },
            { label: "Added to cart", value: Math.round(now.visitors * 0.17) },
            { label: "Reached checkout", value: Math.round(now.visitors * 0.07) },
            { label: "Purchased", value: now.orders },
        ],
    };
};
