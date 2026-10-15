import { useCallback, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from "chart.js";
import { ArrowDown2, TickCircle } from "iconsax-react";
import { formatCurrency } from "../data/dashboardData";
import { computeTrend } from "../utils/dashboardStats";
import { useApp } from "../context/AppContext";
import { useClickOutside } from "../hooks/useClickOutside";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const PERIODS = [
    { id: "weekly", label: "Weekly" },
    { id: "monthly", label: "Monthly" },
    { id: "yearly", label: "Yearly" },
];

const compact = (v) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 }).format(v);

const MyBarChart = () => {
    const { isDarkMode, orders, dateFilter } = useApp();
    const [period, setPeriod] = useState("monthly");
    const [menuOpen, setMenuOpen] = useState(false);
    const close = useCallback(() => setMenuOpen(false), []);
    const menuRef = useClickOutside(close, menuOpen);

    const buckets = useMemo(() => computeTrend(orders, period, dateFilter), [orders, period, dateFilter]);
    const series = useMemo(() => ({ labels: buckets.map((b) => b.label), data: buckets.map((b) => b.value) }), [buckets]);
    const total = series.data.reduce((a, b) => a + b, 0);
    const peakIndex = series.data.indexOf(Math.max(...series.data));
    // Bars inside the selected day or month are solid; if every bar is selected, fall back to marking the peak.
    const highlighted = buckets.every((b) => b.highlight) ? buckets.map((_, i) => i === peakIndex) : buckets.map((b) => b.highlight);

    const data = useMemo(
        () => ({
            labels: series.labels,
            datasets: [
                {
                    data: series.data,
                    backgroundColor: highlighted.map((on) => (on ? "rgba(52, 202, 165, 0.9)" : "rgba(52, 202, 165, 0.25)")),
                    hoverBackgroundColor: "rgba(52, 202, 165, 0.9)",
                    borderRadius: 20,
                    borderSkipped: false,
                    maxBarThickness: 32,
                },
            ],
        }),
        [series, highlighted]
    );

    const options = useMemo(() => {
        const tick = isDarkMode ? "#CBD5E1" : "#6B7280";
        const grid = isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)";
        return {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 400 },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "#090C2C",
                    padding: 10,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: { label: (ctx) => formatCurrency(ctx.parsed.y) },
                },
            },
            scales: {
                x: { grid: { display: false }, border: { display: false }, ticks: { color: tick } },
                y: {
                    beginAtZero: true,
                    border: { display: false },
                    grid: { color: grid, drawTicks: false },
                    ticks: { color: tick, padding: 8, maxTicksLimit: 6, callback: compact },
                },
            },
        };
    }, [isDarkMode]);

    const current = PERIODS.find((p) => p.id === period);

    return (
        <div className="card p-5 h-full flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                    <h2 className="card-title">Sales Trends</h2>
                    <p className="mt-0.5 text-xs text-[#737373] dark:text-slate-300">
                        {formatCurrency(total)} total · peak in <span className="text-[#34CAA5] font-medium">{series.labels[peakIndex]}</span>
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-[#3A3F51] dark:text-slate-300">Sort by:</span>
                    <div ref={menuRef} className="relative">
                        <button
                            type="button"
                            aria-haspopup="listbox"
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen((o) => !o)}
                            className="flex items-center gap-2 rounded-full border border-[#E1DFDF] dark:border-slate-500 px-3 py-1.5 text-xs text-[#3A3F51] dark:text-white hover:border-[#34CAA5]"
                        >
                            {current.label}
                            <ArrowDown2 size="14" color="#697689" className={`transition-transform ${menuOpen ? "rotate-180" : ""}`} />
                        </button>
                        {menuOpen && (
                            <ul role="listbox" className="popover right-0 w-36 py-1">
                                {PERIODS.map((p) => (
                                    <li key={p.id}>
                                        <button
                                            type="button"
                                            role="option"
                                            aria-selected={p.id === period}
                                            onClick={() => {
                                                setPeriod(p.id);
                                                setMenuOpen(false);
                                            }}
                                            className="flex w-full items-center justify-between px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-600"
                                        >
                                            {p.label}
                                            {p.id === period && <TickCircle size="14" color="#34CAA5" variant="Bold" />}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-5 flex-1 min-h-[220px] lg:min-h-[260px]">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default MyBarChart;
