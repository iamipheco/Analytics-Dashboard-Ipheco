import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeft2,
    ArrowRight2,
    Barcode,
    Chart,
    Crown1,
    Danger,
    DocumentDownload,
    Filter,
    Lamp,
    Messages2,
    Moon,
    Refresh2,
    SearchNormal1,
    Star1,
    TickCircle,
    UserEdit,
} from "iconsax-react";
import { TIP_TOPICS, shortcuts, tips } from "../../data/tipsData";
import { useApp } from "../../context/AppContext";

const STORAGE_KEY = "tips-done";

const ICONS = { Barcode, Chart, Crown1, Danger, DocumentDownload, Filter, Messages2, Moon, Refresh2, SearchNormal1, Star1, UserEdit };

const loadDone = () => {
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (Array.isArray(stored)) return stored;
    } catch {
        // storage unavailable or corrupt
    }
    return [];
};

// Same tip all day, a different one tomorrow.
const dayIndex = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    return Math.floor((now - start) / 86400000) % tips.length;
};

const DoneButton = ({ done, onToggle, className = "" }) => (
    <button
        type="button"
        aria-pressed={done}
        onClick={onToggle}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            done
                ? "bg-[#34CAA5]/10 text-[#34CAA5] dark:text-emerald-300"
                : "border border-[#DADDDD] text-[#737373] hover:border-[#34CAA5] hover:text-[#34CAA5] dark:border-slate-500 dark:text-slate-300"
        } ${className}`}
    >
        <TickCircle size="14" color="currentColor" variant={done ? "Bold" : "Linear"} />
        {done ? "Tried" : "Mark as tried"}
    </button>
);

const TipOfTheDay = ({ index, setIndex, done, onToggle }) => {
    const tip = tips[index];
    const Icon = ICONS[tip.icon];
    const step = (delta) => setIndex((i) => (i + delta + tips.length) % tips.length);
    return (
        <div className="card relative overflow-hidden p-5 sm:p-6">
            <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#34CAA5]/10" />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#34CAA5] text-white">
                    <Icon size="24" color="currentColor" variant="Bold" />
                </span>
                <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[#34CAA5]">
                        <Lamp size="14" color="currentColor" variant="Bold" /> Tip of the day · {tip.topic}
                    </p>
                    <h2 className="mt-1 text-lg font-semibold">{tip.title}</h2>
                    <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[#525252] dark:text-slate-300">{tip.body}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        <Link
                            to={tip.link}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#34CAA5] px-4 py-2 text-xs font-medium text-white hover:bg-[#2bb592]"
                        >
                            {tip.cta} <ArrowRight2 size="14" color="currentColor" />
                        </Link>
                        <DoneButton done={done} onToggle={onToggle} />
                    </div>
                </div>
                <div className="flex gap-1 self-end sm:self-start">
                    <button
                        type="button"
                        aria-label="Previous tip"
                        onClick={() => step(-1)}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#DADDDD] text-[#697689] hover:border-[#34CAA5] hover:text-[#34CAA5] dark:border-slate-500"
                    >
                        <ArrowLeft2 size="16" color="currentColor" />
                    </button>
                    <button
                        type="button"
                        aria-label="Next tip"
                        onClick={() => step(1)}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#DADDDD] text-[#697689] hover:border-[#34CAA5] hover:text-[#34CAA5] dark:border-slate-500"
                    >
                        <ArrowRight2 size="16" color="currentColor" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const Progress = ({ done, total }) => {
    const pct = Math.round((done / total) * 100);
    return (
        <div className="card p-5">
            <div className="flex items-baseline justify-between">
                <h2 className="card-title">Your progress</h2>
                <span className="text-sm font-semibold">{pct}%</span>
            </div>
            <div
                className="mt-3 h-2 rounded-full bg-[#F5F5F5] dark:bg-slate-600"
                role="progressbar"
                aria-valuenow={done}
                aria-valuemin={0}
                aria-valuemax={total}
                aria-label="Tips tried"
            >
                <div className="h-2 rounded-full bg-[#34CAA5] transition-[width] duration-500" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-2 text-xs text-[#737373] dark:text-slate-300">
                {done === total ? "You've tried every tip. Nice work! 🎉" : `You've tried ${done} of ${total} tips.`}
            </p>
        </div>
    );
};

const Shortcuts = () => (
    <div className="card p-5">
        <h2 className="card-title">Keyboard shortcuts</h2>
        <ul className="mt-3 space-y-2.5">
            {shortcuts.map((s) => (
                <li key={s.action} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-[#525252] dark:text-slate-300">{s.action}</span>
                    <span className="flex shrink-0 gap-1">
                        {s.keys.map((k) => (
                            <kbd
                                key={k}
                                className="min-w-[1.75rem] rounded-md border border-b-2 border-slate-200 bg-slate-50 px-1.5 py-0.5 text-center text-[11px] font-medium dark:border-slate-500 dark:bg-slate-800"
                            >
                                {k}
                            </kbd>
                        ))}
                    </span>
                </li>
            ))}
        </ul>
    </div>
);

const TipCard = ({ tip, done, onToggle }) => {
    const Icon = ICONS[tip.icon];
    return (
        <li className="card flex flex-col p-5 transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#34CAA5]/10">
                    <Icon size="20" color="#34CAA5" variant="Bulk" />
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-[#737373] dark:bg-slate-600 dark:text-slate-300">{tip.topic}</span>
            </div>
            <h3 className="mt-3 text-sm font-semibold">{tip.title}</h3>
            <p className="mt-1 flex-1 text-xs leading-relaxed text-[#737373] dark:text-slate-300">{tip.body}</p>
            <div className="mt-4 flex items-center justify-between gap-2">
                <Link to={tip.link} className="link-action inline-flex items-center gap-1 text-xs">
                    {tip.cta} <ArrowRight2 size="12" color="currentColor" />
                </Link>
                <DoneButton done={done} onToggle={onToggle} />
            </div>
        </li>
    );
};

const Tips = () => {
    const { searchQuery } = useApp();
    const [done, setDone] = useState(loadDone);
    const [topic, setTopic] = useState("All");
    const [featured, setFeatured] = useState(dayIndex);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
        } catch {
            // ignore
        }
    }, [done]);

    const toggle = (id) => setDone((list) => (list.includes(id) ? list.filter((d) => d !== id) : [...list, id]));

    const visible = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return tips.filter(
            (t) => (topic === "All" || t.topic === topic) && (!q || t.title.toLowerCase().includes(q) || t.body.toLowerCase().includes(q))
        );
    }, [topic, searchQuery]);

    return (
        <div className="flex flex-col gap-4 lg:gap-5 [&>*]:min-w-0">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5 [&>*]:min-w-0">
                <div className="lg:col-span-2">
                    <TipOfTheDay index={featured} setIndex={setFeatured} done={done.includes(tips[featured].id)} onToggle={() => toggle(tips[featured].id)} />
                </div>
                <Progress done={done.length} total={tips.length} />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5 [&>*]:min-w-0">
                <div className="lg:col-span-2">
                    <div className="flex flex-wrap gap-2">
                        {["All", ...TIP_TOPICS].map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setTopic(t)}
                                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                                    topic === t
                                        ? "border-[#34CAA5] bg-[#34CAA5]/10 font-medium text-[#34CAA5]"
                                        : "border-[#DADDDD] bg-white text-[#737373] hover:border-[#34CAA5] dark:border-slate-500 dark:bg-slate-700 dark:text-slate-300"
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {visible.map((t) => (
                            <TipCard key={t.id} tip={t} done={done.includes(t.id)} onToggle={() => toggle(t.id)} />
                        ))}
                        {visible.length === 0 && (
                            <li className="card col-span-full p-10 text-center text-xs text-[#A3A3A3]">
                                No tips match{searchQuery ? ` “${searchQuery}”` : ""}.
                            </li>
                        )}
                    </ul>
                </div>
                <div className="lg:pt-[46px]">
                    <Shortcuts />
                </div>
            </div>

            <footer className="py-2 text-center text-xs text-[#A3A3A3]">© {new Date().getFullYear()} FASTA. All rights reserved.</footer>
        </div>
    );
};

export default Tips;
