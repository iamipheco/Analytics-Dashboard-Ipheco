import { useState } from "react";
import { platforms, formatCurrency } from "../data/dashboardData";
import Modal from "./Modal";

const PREVIEW_COUNT = 4;

const ProgressBar = ({ name, progress, amount, color }) => (
    <div className="px-3 py-2.5">
        <h3 className="mb-2 text-sm font-semibold">{name}</h3>
        <div
            className="h-2 w-full rounded-full bg-[#F5F5F5] dark:bg-slate-600"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={name}
        >
            <div className="h-2 rounded-full transition-[width] duration-700" style={{ width: `${progress}%`, backgroundColor: color }} />
        </div>
        <div className="mt-2 flex justify-between text-xs text-[#525252] dark:text-slate-300">
            <span>{formatCurrency(amount)}</span>
            <span>+{progress}%</span>
        </div>
    </div>
);

const Platforms = () => {
    const [showAll, setShowAll] = useState(false);
    const sorted = [...platforms].sort((a, b) => b.amount - a.amount);

    return (
        <div className="card p-2 h-full flex flex-col">
            <div className="flex items-center justify-between px-3 pt-3 pb-2">
                <h2 className="card-title">Top Platform</h2>
                <button type="button" onClick={() => setShowAll(true)} className="link-action">
                    See All
                </button>
            </div>
            <div className="flex flex-col">
                {sorted.slice(0, PREVIEW_COUNT).map((p) => (
                    <ProgressBar key={p.name} {...p} />
                ))}
            </div>

            <Modal open={showAll} onClose={() => setShowAll(false)} title={`All platforms (${sorted.length})`} size="max-w-lg">
                <div className="-mx-3 flex flex-col">
                    {sorted.map((p) => (
                        <ProgressBar key={p.name} {...p} />
                    ))}
                </div>
            </Modal>
        </div>
    );
};

export default Platforms;
