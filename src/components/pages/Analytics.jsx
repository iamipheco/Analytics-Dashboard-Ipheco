import { useMemo, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Filler,
    Tooltip,
} from "chart.js";
import { IoTrendingUp, IoTrendingDown } from "react-icons/io5";
import { RANGES, getAnalytics } from "../../data/analyticsData";
import { BRAND, formatCurrency } from "../../data/dashboardData";
import { useApp } from "../../context/AppContext";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip);

const UP = "#34CAA5";
const DOWN = "#ED544E";

const compactCurrency = (v) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 }).format(v);

const formatValue = (value, format) => {
    if (format === "currency") return formatCurrency(value);
    if (format === "percent") return `${value.toFixed(2)}%`;
    return value.toLocaleString();
};

const chartTheme = (isDarkMode) => ({
    tick: isDarkMode ? "#CBD5E1" : "#6B7280",
    grid: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
    muted: isDarkMode ? "#64748B" : "#CBD5E1",
});

const tooltipBase = {
    backgroundColor: "#090C2C",
    padding: 10,
    cornerRadius: 8,
    titleFont: { weight: "600" },
};

const RangeFilter = ({ value, onChange }) => (
    <div role="radiogroup" aria-label="Date range" className="flex rounded-full bg-[#F5F5F5] dark:bg-slate-600 p-1">
        {RANGES.map((r) => (
            <button
                key={r.id}
                type="button"
                role="radio"
                aria-checked={r.id === value}
                onClick={() => onChange(r.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    r.id === value
                        ? "bg-white text-[#26282C] shadow-sm dark:bg-slate-800 dark:text-white"
                        : "text-[#737373] hover:text-[#26282C] dark:text-slate-300 dark:hover:text-white"
                }`}
            >
                {r.label}
            </button>
        ))}
    </div>
);

const KpiTile = ({ label, value, format, change, unit = "%" }) => {
    const up = change >= 0;
    const color = up ? UP : DOWN;
    const TrendIcon = up ? IoTrendingUp : IoTrendingDown;
    return (
        <div className="card flex flex-col gap-2 p-5">
            <h3 className="text-sm text-[#898989] dark:text-slate-300">{label}</h3>
            <p className="text-2xl font-semibold">{formatValue(value, format)}</p>
            <div className="flex items-center gap-2">
                <span
                    className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium"
                    style={{ color, backgroundColor: `${color}1A` }}
                >
                    <TrendIcon aria-hidden="true" />
                    {up ? "+" : "-"}
                    {Math.abs(change).toFixed(1)}
                    {unit === "pts" ? " pts" : "%"}
                </span>
                <span className="text-xs text-[#606060] dark:text-slate-300">vs. previous period</span>
            </div>
        </div>
    );
};

const LegendItem = ({ color, dashed, children }) => (
    <span className="flex items-center gap-1.5 text-xs text-[#525252] dark:text-slate-300">
        <span className="inline-block w-4 border-t-2" style={{ borderColor: color, borderStyle: dashed ? "dashed" : "solid" }} />
        {children}
    </span>
);

const RevenueChart = ({ revenue, isDarkMode }) => {
    const theme = chartTheme(isDarkMode);

    const data = useMemo(
        () => ({
            labels: revenue.labels,
            datasets: [
                {
                    label: "This period",
                    data: revenue.current,
                    borderColor: BRAND,
                    borderWidth: 2,
                    backgroundColor: (ctx) => {
                        const { chart } = ctx;
                        if (!chart.chartArea) return "transparent";
                        const g = chart.ctx.createLinearGradient(0, chart.chartArea.top, 0, chart.chartArea.bottom);
                        g.addColorStop(0, "rgba(52, 202, 165, 0.25)");
                        g.addColorStop(1, "rgba(52, 202, 165, 0)");
                        return g;
                    },
                    fill: true,
                    tension: 0.35,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: BRAND,
                    pointHoverBorderColor: isDarkMode ? "#334155" : "#fff",
                    pointHoverBorderWidth: 2,
                },
                {
                    label: "Previous period",
                    data: revenue.previous,
                    borderColor: theme.muted,
                    borderWidth: 2,
                    borderDash: [5, 4],
                    fill: false,
                    tension: 0.35,
                    pointRadius: 0,
                    pointHoverRadius: 4,
                    pointHoverBackgroundColor: theme.muted,
                },
            ],
        }),
        [revenue, isDarkMode, theme.muted]
    );

    const options = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 400 },
            interaction: { mode: "index", intersect: false },
            plugins: {
                legend: { display: false },
                tooltip: {
                    ...tooltipBase,
                    callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${formatCurrency(ctx.parsed.y)}` },
                },
            },
            scales: {
                x: {
                    grid: { display: false },
                    border: { display: false },
                    ticks: { color: theme.tick, maxRotation: 0, autoSkip: true, maxTicksLimit: 8 },
                },
                y: {
                    beginAtZero: true,
                    border: { display: false },
                    grid: { color: theme.grid, drawTicks: false },
                    ticks: { color: theme.tick, padding: 8, maxTicksLimit: 6, callback: compactCurrency },
                },
            },
        }),
        [theme.tick, theme.grid]
    );

    return (
        <div className="card p-5 flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="card-title">Revenue over time</h2>
                <div className="flex items-center gap-4">
                    <LegendItem color={BRAND}>This period</LegendItem>
                    <LegendItem color={theme.muted} dashed>
                        Previous period
                    </LegendItem>
                </div>
            </div>
            <div className="mt-5 h-[280px]">
                <Line data={data} options={options} aria-label="Revenue over time compared with the previous period" role="img" />
            </div>
        </div>
    );
};

const PlatformChart = ({ platforms, isDarkMode }) => {
    const theme = chartTheme(isDarkMode);

    const data = useMemo(
        () => ({
            labels: platforms.map((p) => p.name),
            datasets: [
                {
                    data: platforms.map((p) => p.value),
                    backgroundColor: "rgba(52, 202, 165, 0.85)",
                    hoverBackgroundColor: BRAND,
                    borderRadius: 4,
                    borderSkipped: "start",
                    barThickness: 14,
                },
            ],
        }),
        [platforms]
    );

    const options = useMemo(
        () => ({
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 400 },
            plugins: {
                legend: { display: false },
                tooltip: {
                    ...tooltipBase,
                    displayColors: false,
                    callbacks: { label: (ctx) => formatCurrency(ctx.parsed.x) },
                },
            },
            scales: {
                x: {
                    beginAtZero: true,
                    border: { display: false },
                    grid: { color: theme.grid, drawTicks: false },
                    ticks: { color: theme.tick, maxTicksLimit: 5, callback: compactCurrency },
                },
                y: { grid: { display: false }, border: { display: false }, ticks: { color: theme.tick } },
            },
        }),
        [theme.tick, theme.grid]
    );

    return (
        <div className="card p-5 flex flex-col h-full">
            <h2 className="card-title">Revenue by platform</h2>
            <div className="mt-4 flex-1 min-h-[280px]">
                <Bar data={data} options={options} aria-label="Revenue by platform" role="img" />
            </div>
        </div>
    );
};

const Funnel = ({ steps }) => {
    const top = steps[0].value;
    return (
        <div className="card p-5 h-full">
            <h2 className="card-title">Conversion funnel</h2>
            <ol className="mt-4 flex flex-col gap-4">
                {steps.map((s, i) => {
                    const pct = (s.value / top) * 100;
                    const fromPrev = i ? (s.value / steps[i - 1].value) * 100 : null;
                    return (
                        <li key={s.label}>
                            <div className="mb-1.5 flex items-baseline justify-between gap-2 text-sm">
                                <span className="font-medium">{s.label}</span>
                                <span className="text-[#525252] dark:text-slate-300">
                                    {s.value.toLocaleString()}
                                    <span className="ml-2 text-xs text-[#A3A3A3]">{pct.toFixed(1)}%</span>
                                </span>
                            </div>
                            <div
                                className="h-2 w-full rounded-full bg-[#F5F5F5] dark:bg-slate-600"
                                title={fromPrev ? `${fromPrev.toFixed(1)}% of the previous step` : undefined}
                            >
                                <div
                                    className="h-2 rounded-full bg-[#34CAA5] transition-[width] duration-700"
                                    style={{ width: `${Math.max(pct, 1)}%` }}
                                />
                            </div>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
};

const Analytics = () => {
    const { isDarkMode } = useApp();
    const [range, setRange] = useState("30d");
    const analytics = useMemo(() => getAnalytics(range), [range]);

    return (
        <div className="flex flex-col gap-4 lg:gap-5 [&>*]:min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-[#737373] dark:text-slate-300">How the store is performing, compared with the previous period.</p>
                <RangeFilter value={range} onChange={setRange} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {analytics.kpis.map((kpi) => (
                    <KpiTile key={kpi.id} {...kpi} />
                ))}
            </div>

            <RevenueChart revenue={analytics.revenue} isDarkMode={isDarkMode} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 [&>*]:min-w-0">
                <PlatformChart platforms={analytics.platforms} isDarkMode={isDarkMode} />
                <Funnel steps={analytics.funnel} />
            </div>

            <footer className="py-2 text-center text-xs text-[#A3A3A3]">© {new Date().getFullYear()} FASTA. All rights reserved.</footer>
        </div>
    );
};

export default Analytics;
