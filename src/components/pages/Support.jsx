import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { ArrowDown2, Call, Sms, TickCircle } from "iconsax-react";
import { PRIORITIES, SUPPORT_EMAIL, SUPPORT_PHONE, TOPICS, faqs } from "../../data/supportData";
import { formatDate } from "../../data/dashboardData";
import { useApp } from "../../context/AppContext";
import { Button } from "../Modal";
import Select from "../Select";

const STORAGE_KEY = "tickets";

const inputClass =
    "w-full rounded-lg border border-[#DADDDD] dark:border-slate-500 bg-white dark:bg-slate-800 px-3 py-2 text-sm outline-none transition focus:border-[#34CAA5] focus:ring-2 focus:ring-[#34CAA5]/20";

const loadTickets = () => {
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (Array.isArray(stored)) return stored;
    } catch {
        // storage unavailable or corrupt
    }
    return [];
};

const ContactCard = ({ icon: Icon, title, detail, href }) => {
    const body = (
        <>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#34CAA5]/10">
                <Icon size="20" color="#34CAA5" variant="Bulk" />
            </span>
            <span className="min-w-0">
                <span className="block text-sm font-semibold">{title}</span>
                <span className="block truncate text-xs text-[#737373] dark:text-slate-300">{detail}</span>
            </span>
        </>
    );
    return href ? (
        <a href={href} className="card flex items-center gap-3 p-4 transition-shadow hover:shadow-md">
            {body}
        </a>
    ) : (
        <div className="card flex items-center gap-3 p-4">{body}</div>
    );
};

const Faq = ({ searchQuery }) => {
    const [topic, setTopic] = useState("All");
    const [openQ, setOpenQ] = useState(null);

    const visible = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return faqs.filter(
            (f) => (topic === "All" || f.topic === topic) && (!q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q))
        );
    }, [topic, searchQuery]);

    return (
        <div className="card p-5">
            <h2 className="card-title">Frequently asked questions</h2>
            <div className="mt-3 flex flex-wrap gap-2">
                {["All", ...TOPICS].map((t) => (
                    <button
                        key={t}
                        type="button"
                        onClick={() => setTopic(t)}
                        className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                            topic === t
                                ? "border-[#34CAA5] bg-[#34CAA5]/10 font-medium text-[#34CAA5]"
                                : "border-[#DADDDD] text-[#737373] hover:border-[#34CAA5] dark:border-slate-500 dark:text-slate-300"
                        }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <ul className="mt-4 divide-y divide-[#EDF2F6] dark:divide-slate-600">
                {visible.map((f) => {
                    const open = openQ === f.q;
                    return (
                        <li key={f.q}>
                            <button
                                type="button"
                                aria-expanded={open}
                                onClick={() => setOpenQ(open ? null : f.q)}
                                className="flex w-full items-center justify-between gap-4 py-3.5 text-left text-sm font-medium hover:text-[#34CAA5]"
                            >
                                {f.q}
                                <ArrowDown2 size="16" color="currentColor" className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
                            </button>
                            {open && <p className="pb-4 pr-8 text-sm leading-relaxed text-[#525252] dark:text-slate-300">{f.a}</p>}
                        </li>
                    );
                })}
                {visible.length === 0 && (
                    <li className="py-10 text-center text-xs text-[#A3A3A3]">
                        No answers match{searchQuery ? ` “${searchQuery}”` : ""}. Send us a message and we&apos;ll help.
                    </li>
                )}
            </ul>
        </div>
    );
};

const EMPTY_FORM = { subject: "", topic: TOPICS[0], priority: "Normal", message: "" };

const ContactForm = ({ onSubmit }) => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const submit = (e) => {
        e.preventDefault();
        const next = {};
        if (!form.subject.trim()) next.subject = "Add a short subject.";
        if (form.message.trim().length < 10) next.message = "Tell us a bit more (at least 10 characters).";
        setErrors(next);
        if (Object.keys(next).length) return;
        onSubmit({ ...form, subject: form.subject.trim(), message: form.message.trim() });
        setForm(EMPTY_FORM);
    };

    return (
        <form onSubmit={submit} noValidate className="card space-y-4 p-5">
            <div>
                <h2 className="card-title">Contact support</h2>
                <p className="mt-1 text-xs text-[#737373] dark:text-slate-300">We usually reply within one business day.</p>
            </div>
            <label className="block">
                <span className="mb-1 block text-xs font-medium text-[#525252] dark:text-slate-300">Subject</span>
                <input className={inputClass} value={form.subject} onChange={set("subject")} />
                {errors.subject && <span className="mt-1 block text-xs text-[#ED544E]">{errors.subject}</span>}
            </label>
            <div className="grid grid-cols-2 gap-3">
                <label className="block">
                    <span className="mb-1 block text-xs font-medium text-[#525252] dark:text-slate-300">Topic</span>
                    <Select className="w-full" value={form.topic} onChange={(topic) => setForm((f) => ({ ...f, topic }))} options={TOPICS} />
                </label>
                <label className="block">
                    <span className="mb-1 block text-xs font-medium text-[#525252] dark:text-slate-300">Priority</span>
                    <Select
                        className="w-full"
                        value={form.priority}
                        onChange={(priority) => setForm((f) => ({ ...f, priority }))}
                        options={PRIORITIES}
                    />
                </label>
            </div>
            <label className="block">
                <span className="mb-1 block text-xs font-medium text-[#525252] dark:text-slate-300">Message</span>
                <textarea rows={5} className={`${inputClass} resize-y`} value={form.message} onChange={set("message")} />
                {errors.message && <span className="mt-1 block text-xs text-[#ED544E]">{errors.message}</span>}
            </label>
            <div className="flex justify-end">
                <Button type="submit">Send request</Button>
            </div>
        </form>
    );
};

const PRIORITY_STYLES = {
    Low: "bg-slate-100 text-[#737373] dark:bg-slate-600 dark:text-slate-300",
    Normal: "bg-[#54C5EB]/15 text-[#1F8FB5] dark:text-sky-300",
    Urgent: "bg-[#ED544E]/10 text-[#ED544E] dark:text-red-300",
};

const Tickets = ({ tickets }) => (
    <div className="card p-5">
        <h2 className="card-title">Your requests</h2>
        {tickets.length === 0 ? (
            <p className="mt-3 text-xs text-[#A3A3A3]">Requests you send will show up here so you can keep track of them.</p>
        ) : (
            <ul className="mt-3 divide-y divide-[#EDF2F6] dark:divide-slate-600">
                {tickets.map((t) => (
                    <li key={t.id} className="flex items-start justify-between gap-3 py-3">
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{t.subject}</p>
                            <p className="mt-0.5 text-xs text-[#A3A3A3]">
                                {t.id} · {t.topic} · {formatDate(t.created)}
                            </p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1">
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#34CAA5]/10 px-2 py-0.5 text-[11px] font-medium text-[#34CAA5] dark:text-emerald-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#34CAA5]" /> Open
                            </span>
                            <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${PRIORITY_STYLES[t.priority]}`}>{t.priority}</span>
                        </div>
                    </li>
                ))}
            </ul>
        )}
    </div>
);

const Support = () => {
    const { searchQuery } = useApp();
    const [tickets, setTickets] = useState(loadTickets);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
        } catch {
            // ignore
        }
    }, [tickets]);

    const createTicket = (form) => {
        const id = `#${1000 + tickets.length + 1}`;
        const today = new Date();
        const created = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        setTickets((list) => [{ id, created, ...form }, ...list]);
        toast.success(`Request ${id} sent. We'll be in touch soon.`);
    };

    return (
        <div className="flex flex-col gap-4 lg:gap-5 [&>*]:min-w-0">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <ContactCard icon={Sms} title="Email us" detail={SUPPORT_EMAIL} href={`mailto:${SUPPORT_EMAIL}`} />
                <ContactCard icon={Call} title="Call us" detail={`${SUPPORT_PHONE} · Mon–Fri, 9–5`} href={`tel:${SUPPORT_PHONE.replace(/[^+\d]/g, "")}`} />
                <ContactCard icon={TickCircle} title="System status" detail="All systems operational" />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-5 [&>*]:min-w-0">
                <div className="lg:col-span-3">
                    <Faq searchQuery={searchQuery} />
                </div>
                <div className="flex flex-col gap-4 lg:col-span-2 lg:gap-5">
                    <ContactForm onSubmit={createTicket} />
                    <Tickets tickets={tickets} />
                </div>
            </div>

            <footer className="py-2 text-center text-xs text-[#A3A3A3]">© {new Date().getFullYear()} FASTA. All rights reserved.</footer>
        </div>
    );
};

export default Support;
