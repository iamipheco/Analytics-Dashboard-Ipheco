import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Card, Crown1, DocumentDownload, TickCircle } from "iconsax-react";
import {
    BILLING_KEY,
    YEARLY_MONTHS,
    cardBrand,
    isValidCardNumber,
    loadBilling,
    nextRenewal,
    planPrice,
    plans,
    toIso,
} from "../../data/billingData";
import { loadProducts } from "../../data/productsData";
import { formatDate } from "../../data/dashboardData";
import { useApp } from "../../context/AppContext";
import Modal, { Button } from "../Modal";

const money = (v) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: v % 1 ? 2 : 0 }).format(v);

const inputClass =
    "w-full rounded-lg border border-[#DADDDD] dark:border-slate-500 bg-white dark:bg-slate-800 px-3 py-2 text-sm outline-none transition focus:border-[#34CAA5] focus:ring-2 focus:ring-[#34CAA5]/20";

const IntervalToggle = ({ value, onChange }) => (
    <div role="radiogroup" aria-label="Billing interval" className="inline-flex rounded-full bg-slate-100 dark:bg-slate-600 p-1 text-xs">
        {[
            { id: "monthly", label: "Monthly" },
            { id: "yearly", label: "Yearly", note: "2 months free" },
        ].map((o) => (
            <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={value === o.id}
                onClick={() => onChange(o.id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
                    value === o.id ? "bg-white dark:bg-slate-800 shadow-sm font-medium" : "text-[#737373] dark:text-slate-300"
                }`}
            >
                {o.label}
                {o.note && <span className="rounded-full bg-[#34CAA5]/15 px-1.5 py-0.5 text-[10px] font-medium text-[#34CAA5]">{o.note}</span>}
            </button>
        ))}
    </div>
);

const UsageMeter = ({ label, used, limit, unit = "" }) => {
    const unlimited = !Number.isFinite(limit);
    const pct = unlimited ? 4 : Math.min(100, (used / limit) * 100);
    const color = pct >= 90 ? "#ED544E" : pct >= 75 ? "#FFB74A" : "#34CAA5";
    return (
        <div>
            <div className="flex items-baseline justify-between gap-2 text-xs">
                <span className="font-medium">{label}</span>
                <span className="text-[#737373] dark:text-slate-300 tabular-nums">
                    {used.toLocaleString()}
                    {unit} of {unlimited ? "unlimited" : `${limit.toLocaleString()}${unit}`}
                </span>
            </div>
            <div
                className="mt-1.5 h-2 rounded-full bg-[#F5F5F5] dark:bg-slate-600"
                role="progressbar"
                aria-label={label}
                aria-valuenow={used}
                aria-valuemin={0}
                aria-valuemax={unlimited ? undefined : limit}
            >
                <div className="h-2 rounded-full transition-[width] duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
            </div>
        </div>
    );
};

const CardVisual = ({ card }) => (
    <div className="relative aspect-[1.6] w-full max-w-[320px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E293B] via-[#0F766E] to-[#34CAA5] p-5 text-white shadow-lg">
        <div aria-hidden="true" className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
        <div aria-hidden="true" className="absolute -bottom-12 -left-6 h-32 w-32 rounded-full bg-white/5" />
        <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-center justify-between">
                <span className="h-7 w-10 rounded-md bg-gradient-to-br from-amber-200 to-amber-400 opacity-90" aria-hidden="true" />
                <span className="text-sm font-bold italic tracking-wide">{card.brand}</span>
            </div>
            <p className="font-mono text-lg tracking-[0.2em]" aria-label={`Card ending in ${card.last4}`}>
                •••• •••• •••• {card.last4}
            </p>
            <div className="flex items-end justify-between text-xs">
                <span>
                    <span className="block text-[10px] uppercase text-white/60">Card holder</span>
                    <span className="block max-w-[180px] truncate font-medium">{card.name}</span>
                </span>
                <span className="text-right">
                    <span className="block text-[10px] uppercase text-white/60">Expires</span>
                    <span className="block font-medium tabular-nums">
                        {String(card.expMonth).padStart(2, "0")}/{String(card.expYear).slice(-2)}
                    </span>
                </span>
            </div>
        </div>
    </div>
);

const PlanPicker = ({ open, billing, productCount, onClose, onChoose }) => {
    const [interval, setPickerInterval] = useState(billing.interval);

    useEffect(() => {
        if (open) setPickerInterval(billing.interval);
    }, [open, billing.interval]);

    return (
        <Modal open={open} onClose={onClose} title="Choose a plan" size="max-w-4xl">
            <div className="mb-5 flex justify-center">
                <IntervalToggle value={interval} onChange={setPickerInterval} />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
                {plans.map((p) => {
                    const current = p.id === billing.plan && interval === billing.interval && !billing.cancelled;
                    const tooSmall = productCount > p.limits.products;
                    return (
                        <div
                            key={p.id}
                            className={`relative flex flex-col rounded-2xl border-2 p-5 ${
                                p.popular ? "border-[#34CAA5]" : "border-[#EDF2F6] dark:border-slate-600"
                            }`}
                        >
                            {p.popular && (
                                <span className="absolute -top-3 left-5 rounded-full bg-[#34CAA5] px-2.5 py-0.5 text-[11px] font-medium text-white">
                                    Most popular
                                </span>
                            )}
                            <h3 className="font-semibold">{p.name}</h3>
                            <p className="mt-1 text-xs text-[#737373] dark:text-slate-300">{p.description}</p>
                            <p className="mt-4">
                                <span className="text-3xl font-bold">{money(planPrice(p, interval))}</span>
                                <span className="text-xs text-[#737373] dark:text-slate-300"> / {interval === "yearly" ? "year" : "month"}</span>
                            </p>
                            {interval === "yearly" && (
                                <p className="mt-1 text-[11px] text-[#34CAA5]">Save {money(p.monthly * (12 - YEARLY_MONTHS))} a year</p>
                            )}
                            <ul className="mt-4 flex-1 space-y-2 text-xs">
                                {p.features.map((f) => (
                                    <li key={f} className="flex items-center gap-2">
                                        <TickCircle size="14" color="#34CAA5" variant="Bold" className="shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Button
                                className="mt-5 justify-center"
                                variant={current ? "ghost" : "primary"}
                                disabled={current || tooSmall}
                                onClick={() => onChoose(p.id, interval)}
                            >
                                {current ? "Current plan" : `Switch to ${p.name}`}
                            </Button>
                            {tooSmall && (
                                <p className="mt-2 text-center text-[11px] text-[#ED544E]">
                                    You have {productCount} products, more than this plan allows.
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </Modal>
    );
};

const EMPTY_CARD = { name: "", number: "", expiry: "", cvc: "" };

const CardForm = ({ open, onClose, onSave }) => {
    const [form, setForm] = useState(EMPTY_CARD);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (open) {
            setForm(EMPTY_CARD);
            setErrors({});
        }
    }, [open]);

    const digits = form.number.replace(/\D/g, "");
    const brand = cardBrand(digits);

    const onNumber = (e) => {
        const d = e.target.value.replace(/\D/g, "").slice(0, 19);
        setForm((f) => ({ ...f, number: d.replace(/(\d{4})(?=\d)/g, "$1 ") }));
    };

    const onExpiry = (e) => {
        const d = e.target.value.replace(/\D/g, "").slice(0, 4);
        setForm((f) => ({ ...f, expiry: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d }));
    };

    const submit = (e) => {
        e.preventDefault();
        const next = {};
        if (!form.name.trim()) next.name = "Enter the name on the card.";
        if (!isValidCardNumber(digits)) next.number = "Enter a valid card number.";
        const [mm, yy] = form.expiry.split("/").map(Number);
        const now = new Date();
        const expYear = 2000 + (yy || 0);
        if (!mm || mm > 12 || !yy) next.expiry = "Use MM/YY.";
        else if (expYear < now.getFullYear() || (expYear === now.getFullYear() && mm < now.getMonth() + 1)) next.expiry = "This card has expired.";
        if (!/^\d{3,4}$/.test(form.cvc)) next.cvc = "3 or 4 digits.";
        setErrors(next);
        if (Object.keys(next).length) return;
        // Only what's needed to recognise the card is kept; the full number and CVC are discarded.
        onSave({ brand, last4: digits.slice(-4), expMonth: mm, expYear, name: form.name.trim() });
    };

    const field = (key, label, input, className = "") => (
        <label className={`block ${className}`}>
            <span className="mb-1 block text-xs font-medium text-[#525252] dark:text-slate-300">{label}</span>
            {input}
            {errors[key] && <span className="mt-1 block text-xs text-[#ED544E]">{errors[key]}</span>}
        </label>
    );

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Update payment method"
            footer={
                <>
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" form="card-form">
                        Save card
                    </Button>
                </>
            }
        >
            <form id="card-form" onSubmit={submit} noValidate className="grid grid-cols-2 gap-3">
                {field(
                    "name",
                    "Name on card",
                    <input className={inputClass} autoComplete="cc-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />,
                    "col-span-2"
                )}
                {field(
                    "number",
                    "Card number",
                    <div className="relative">
                        <input
                            className={`${inputClass} pr-24 font-mono tracking-wider`}
                            inputMode="numeric"
                            autoComplete="cc-number"
                            placeholder="1234 1234 1234 1234"
                            value={form.number}
                            onChange={onNumber}
                        />
                        {digits && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold italic text-[#697689]">{brand}</span>
                        )}
                    </div>,
                    "col-span-2"
                )}
                {field(
                    "expiry",
                    "Expiry",
                    <input className={inputClass} inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY" value={form.expiry} onChange={onExpiry} />
                )}
                {field(
                    "cvc",
                    "CVC",
                    <input
                        className={inputClass}
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        placeholder="123"
                        value={form.cvc}
                        onChange={(e) => setForm((f) => ({ ...f, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                    />
                )}
                <p className="col-span-2 text-[11px] text-[#A3A3A3]">
                    Demo only: no payment is taken. Only the card brand, last 4 digits and expiry are saved in this browser.
                </p>
            </form>
        </Modal>
    );
};

const printReceipt = (invoice, billing) => {
    const w = window.open("", "_blank", "width=640,height=720");
    if (!w) {
        toast.error("Allow pop-ups to download invoices.");
        return;
    }
    w.document.write(`<!doctype html><title>${invoice.id}</title>
<body style="font-family:system-ui,sans-serif;padding:40px;color:#26282C">
<h1 style="margin:0;color:#34CAA5">FASTA</h1><p style="color:#737373">Invoice ${invoice.id}</p><hr/>
<p><b>Billed to:</b> ${billing.card.name} (${billing.email})</p><p><b>Date:</b> ${formatDate(invoice.date)}</p>
<p><b>Description:</b> ${invoice.description}</p><p><b>Paid with:</b> ${billing.card.brand} ending ${billing.card.last4}</p>
<h2>Total: ${money(invoice.amount)}</h2>
<script>window.onload=()=>{window.print()}</script></body>`);
    w.document.close();
};

const Billing = () => {
    const { profile } = useApp();
    const [billing, setBilling] = useState(loadBilling);
    const [picking, setPicking] = useState(false);
    const [editingCard, setEditingCard] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const productCount = useMemo(() => loadProducts().length, []);

    useEffect(() => {
        try {
            localStorage.setItem(BILLING_KEY, JSON.stringify(billing));
        } catch {
            // ignore
        }
    }, [billing]);

    const plan = plans.find((p) => p.id === billing.plan);
    const price = planPrice(plan, billing.interval);

    const choosePlan = (planId, interval) => {
        const next = plans.find((p) => p.id === planId);
        const amount = planPrice(next, interval);
        setBilling((b) => ({
            ...b,
            plan: planId,
            interval,
            cancelled: false,
            renews: nextRenewal(interval),
            invoices: [
                {
                    id: `FA-${String(2400 + b.invoices.length + 1).padStart(5, "0")}`,
                    date: toIso(new Date()),
                    description: `${next.name} plan · ${interval === "yearly" ? "Yearly" : "Monthly"}`,
                    amount,
                    status: "Paid",
                },
                ...b.invoices,
            ],
        }));
        setPicking(false);
        toast.success(`You're now on ${next.name} (${interval}).`);
    };

    const saveCard = (card) => {
        setBilling((b) => ({ ...b, card }));
        setEditingCard(false);
        toast.success(`${card.brand} ending ${card.last4} saved.`);
    };

    const cancelPlan = () => {
        setBilling((b) => ({ ...b, cancelled: true }));
        setCancelling(false);
        toast.info(`Your plan stays active until ${formatDate(billing.renews)}.`);
    };

    return (
        <div className="flex flex-col gap-4 lg:gap-5 [&>*]:min-w-0">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-5 [&>*]:min-w-0">
                <section className="card p-5 sm:p-6 lg:col-span-3">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#34CAA5]/10">
                                <Crown1 size="22" color="#34CAA5" variant="Bulk" />
                            </span>
                            <div>
                                <p className="text-xs text-[#737373] dark:text-slate-300">Current plan</p>
                                <h2 className="flex flex-wrap items-center gap-2 text-lg font-semibold">
                                    {plan.name}
                                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-[#737373] dark:bg-slate-600 dark:text-slate-300">
                                        {billing.interval === "yearly" ? "Yearly" : "Monthly"}
                                    </span>
                                    {billing.cancelled && (
                                        <span className="rounded-full bg-[#ED544E]/10 px-2 py-0.5 text-[11px] font-medium text-[#ED544E]">Cancelled</span>
                                    )}
                                </h2>
                            </div>
                        </div>
                        <p className="text-right">
                            <span className="text-2xl font-bold">{money(price)}</span>
                            <span className="text-xs text-[#737373] dark:text-slate-300"> / {billing.interval === "yearly" ? "year" : "month"}</span>
                        </p>
                    </div>

                    <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-xs text-[#525252] dark:bg-slate-800 dark:text-slate-300">
                        {billing.cancelled ? (
                            <>
                                Your plan ends on <b>{formatDate(billing.renews)}</b>. You keep full access until then.
                            </>
                        ) : (
                            <>
                                Renews on <b>{formatDate(billing.renews)}</b> for {money(price)}, charged to {billing.card.brand} ending{" "}
                                {billing.card.last4}.
                            </>
                        )}
                    </p>

                    <div className="mt-5 grid gap-4 sm:grid-cols-3">
                        <UsageMeter label="Products" used={productCount} limit={plan.limits.products} />
                        <UsageMeter label="Team seats" used={billing.seatsUsed} limit={plan.limits.seats} />
                        <UsageMeter label="Storage" used={billing.storageUsed} limit={plan.limits.storage} unit=" GB" />
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                        <Button onClick={() => setPicking(true)}>{billing.cancelled ? "Choose a plan" : "Change plan"}</Button>
                        {billing.cancelled ? (
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setBilling((b) => ({ ...b, cancelled: false }));
                                    toast.success("Welcome back! Your plan will renew as normal.");
                                }}
                            >
                                Resume plan
                            </Button>
                        ) : (
                            <Button variant="ghost" className="text-[#ED544E] dark:text-red-300" onClick={() => setCancelling(true)}>
                                Cancel plan
                            </Button>
                        )}
                    </div>
                </section>

                <section className="card flex flex-col p-5 sm:p-6 lg:col-span-2">
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="card-title">Payment method</h2>
                        <button type="button" onClick={() => setEditingCard(true)} className="link-action text-xs">
                            Update
                        </button>
                    </div>
                    <div className="mt-4 flex flex-1 items-center justify-center">
                        <CardVisual card={billing.card} />
                    </div>
                    <dl className="mt-4 space-y-2 text-xs">
                        <div className="flex justify-between gap-2">
                            <dt className="text-[#737373] dark:text-slate-300">Billing email</dt>
                            <dd className="truncate font-medium">{billing.email}</dd>
                        </div>
                        <div className="flex justify-between gap-2">
                            <dt className="text-[#737373] dark:text-slate-300">Account</dt>
                            <dd className="truncate font-medium">{profile.name}</dd>
                        </div>
                    </dl>
                </section>
            </div>

            <section className="card p-2">
                <div className="flex items-center justify-between gap-2 px-3 pt-3 pb-2">
                    <h2 className="card-title">
                        Billing history <span className="font-normal text-[#A3A3A3]">({billing.invoices.length})</span>
                    </h2>
                </div>

                <ul className="divide-y divide-[#EDF2F6] border-t border-[#EDF2F6] dark:divide-slate-600 dark:border-slate-600 md:hidden">
                    {billing.invoices.map((inv) => (
                        <li key={inv.id} className="flex items-center gap-3 px-3 py-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-600">
                                <Card size="18" color="#697689" />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">{inv.description}</p>
                                <p className="text-xs text-[#A3A3A3]">
                                    {formatDate(inv.date)} · {inv.id}
                                </p>
                            </div>
                            <p className="text-sm font-semibold">{money(inv.amount)}</p>
                            <button
                                type="button"
                                aria-label={`Download ${inv.id}`}
                                onClick={() => printReceipt(inv, billing)}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-[#697689] hover:bg-[#34CAA5]/10 hover:text-[#34CAA5]"
                            >
                                <DocumentDownload size="16" color="currentColor" />
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="hidden overflow-x-auto scroll-thin md:block">
                    <table className="w-full text-left text-sm">
                        <thead className="text-xs text-[#737373] dark:text-slate-300">
                            <tr>
                                <th scope="col" className="px-3 py-3 font-medium">Invoice</th>
                                <th scope="col" className="px-3 py-3 font-medium">Date</th>
                                <th scope="col" className="px-3 py-3 font-medium">Description</th>
                                <th scope="col" className="px-3 py-3 font-medium">Amount</th>
                                <th scope="col" className="px-3 py-3 font-medium">Status</th>
                                <th scope="col" className="px-3 py-3 font-medium text-right">Receipt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {billing.invoices.map((inv) => (
                                <tr key={inv.id} className="border-t border-[#EDF2F6] dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600/50">
                                    <td className="px-3 py-3 text-[#737373] dark:text-slate-300">{inv.id}</td>
                                    <td className="px-3 py-3 whitespace-nowrap">{formatDate(inv.date)}</td>
                                    <td className="px-3 py-3">{inv.description}</td>
                                    <td className="px-3 py-3 font-medium tabular-nums">{money(inv.amount)}</td>
                                    <td className="px-3 py-3">
                                        <span className="inline-flex items-center gap-1 rounded-full bg-[#34CAA5]/10 px-2 py-0.5 text-[11px] font-medium text-[#34CAA5] dark:text-emerald-300">
                                            <TickCircle size="12" color="currentColor" variant="Bold" /> {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3 text-right">
                                        <button
                                            type="button"
                                            onClick={() => printReceipt(inv, billing)}
                                            className="inline-flex items-center gap-1.5 text-[#0D062D] hover:text-[#34CAA5] dark:text-slate-200"
                                        >
                                            <DocumentDownload size="16" color="currentColor" /> Download
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <PlanPicker open={picking} billing={billing} productCount={productCount} onClose={() => setPicking(false)} onChoose={choosePlan} />
            <CardForm open={editingCard} onClose={() => setEditingCard(false)} onSave={saveCard} />
            <Modal
                open={cancelling}
                onClose={() => setCancelling(false)}
                title="Cancel your plan?"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setCancelling(false)}>
                            Keep plan
                        </Button>
                        <Button variant="danger" onClick={cancelPlan}>
                            Cancel plan
                        </Button>
                    </>
                }
            >
                <p className="text-[#737373] dark:text-slate-300">
                    You&apos;ll keep {plan.name} until <b>{formatDate(billing.renews)}</b>, then your plan won&apos;t renew. You can resume any time
                    before then.
                </p>
            </Modal>

            <footer className="py-2 text-center text-xs text-[#A3A3A3]">© {new Date().getFullYear()} FASTA. All rights reserved.</footer>
        </div>
    );
};

export default Billing;
