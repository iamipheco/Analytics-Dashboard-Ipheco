import { useId } from "react";
import { BoxTick, Coin1, I3DRotate, ShoppingCart } from "iconsax-react";
import { IoTrendingUp, IoTrendingDown } from "react-icons/io5";
import { kpis } from "../data/dashboardData";

const ICONS = { BoxTick, Coin1, I3DRotate, ShoppingCart };
const UP = "#34CAA5";
const DOWN = "#ED544E";

const Sparkline = ({ points, color, width = 106, height = 33 }) => {
    const id = `spark${useId().replace(/:/g, "")}`;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const coords = points.map((p, i) => [
        (i / (points.length - 1)) * (width - 2) + 1,
        height - 2 - ((p - min) / (max - min || 1)) * (height - 6),
    ]);
    const line = coords.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
    const area = `${line} L${width - 1} ${height} L1 ${height} Z`;

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" aria-hidden="true">
            <defs>
                <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor={color} stopOpacity="0.25" />
                    <stop offset="1" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={area} fill={`url(#${id})`} />
            <path d={line} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

const KpiCard = ({ label, value, change, icon, prefix = "", trend }) => {
    const Icon = ICONS[icon];
    const up = change >= 0;
    const color = up ? UP : DOWN;
    const TrendIcon = up ? IoTrendingUp : IoTrendingDown;

    return (
        <div className="card flex flex-col gap-3 p-5 transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
                <div className="rounded-full border border-[#DADDDD] dark:border-slate-500 p-2">
                    <Icon size="24" color={UP} variant="Bulk" />
                </div>
                <Sparkline points={trend} color={color} />
            </div>
            <div>
                <h3 className="text-sm text-[#898989] dark:text-slate-300">{label}</h3>
                <p className="text-2xl font-semibold">
                    {prefix}
                    {value.toLocaleString()}
                </p>
            </div>
            <div className="flex items-center justify-between gap-2">
                <span
                    className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium"
                    style={{ color, backgroundColor: `${color}1A` }}
                >
                    <TrendIcon />
                    {Math.abs(change)}%
                </span>
                <span className="text-xs text-[#606060] dark:text-slate-300 whitespace-nowrap">vs. last month</span>
            </div>
        </div>
    );
};

const IncomeBox = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
        {kpis.map((kpi) => (
            <KpiCard key={kpi.id} {...kpi} />
        ))}
    </div>
);

export default IncomeBox;
