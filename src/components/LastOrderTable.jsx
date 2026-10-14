import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { ArrowDown2, ArrowUp2, DocumentDownload, DocumentText, Printer } from "iconsax-react";
import { orders as initialOrders, formatCurrency, formatDate } from "../data/dashboardData";
import { useApp } from "../context/AppContext";
import Modal, { Button } from "./Modal";

const STATUS_FILTERS = ["All", "Paid", "Refund"];
const PREVIEW_ROWS = 5;

const StatusBadge = ({ status }) => (
    <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
            status === "Paid"
                ? "bg-[#34CAA5]/10 text-[#34CAA5] dark:text-emerald-300"
                : "bg-[#ED544E]/10 text-[#ED544E] dark:text-red-300"
        }`}
    >
        {status}
    </span>
);

const downloadCsv = (rows) => {
    const header = ["Invoice", "Name", "Date", "Amount", "Status"];
    const lines = rows.map((o) => [o.id, o.name, o.date, o.amount, o.status].map((v) => `"${v}"`).join(","));
    const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), { href: url, download: "orders.csv" });
    a.click();
    URL.revokeObjectURL(url);
};

const printInvoice = (order) => {
    const w = window.open("", "_blank", "width=640,height=720");
    if (!w) {
        toast.error("Allow pop-ups to print invoices.");
        return;
    }
    w.document.write(`<!doctype html><title>${order.id}</title>
<body style="font-family:system-ui,sans-serif;padding:40px;color:#26282C">
<h1 style="margin:0;color:#34CAA5">FASTA</h1><p style="color:#737373">Invoice ${order.id}</p><hr/>
<p><b>Billed to:</b> ${order.name}</p><p><b>Date:</b> ${formatDate(order.date)}</p>
<p><b>Status:</b> ${order.status}</p><h2>Total: ${formatCurrency(order.amount)}</h2>
<script>window.onload=()=>{window.print()}</script></body>`);
    w.document.close();
};

const SortHeader = ({ label, field, sort, onSort, className = "" }) => {
    const active = sort.field === field;
    const Arrow = active && sort.dir === "asc" ? ArrowUp2 : ArrowDown2;
    return (
        <th scope="col" className={`px-3 py-3 font-medium ${className}`}>
            <button
                type="button"
                onClick={() => onSort(field)}
                className={`inline-flex items-center gap-1 hover:text-[#34CAA5] ${active ? "text-[#34CAA5]" : ""}`}
            >
                {label}
                <Arrow size="12" color="currentColor" className={active ? "" : "opacity-40"} />
            </button>
        </th>
    );
};

const LastOrdersTable = () => {
    const { searchQuery } = useApp();
    const [orders, setOrders] = useState(initialOrders);
    const [status, setStatus] = useState("All");
    const [sort, setSort] = useState({ field: "date", dir: "desc" });
    const [showAll, setShowAll] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const selected = orders.find((o) => o.id === selectedId);

    const rows = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        const filtered = orders.filter(
            (o) =>
                (status === "All" || o.status === status) &&
                (!q || o.name.toLowerCase().includes(q) || o.id.toLowerCase().includes(q))
        );
        const dir = sort.dir === "asc" ? 1 : -1;
        return [...filtered].sort((a, b) => {
            const x = a[sort.field];
            const y = b[sort.field];
            return (typeof x === "string" ? x.localeCompare(y) : x - y) * dir;
        });
    }, [orders, status, sort, searchQuery]);

    // The card shows a preview; "See All" opens every order in a pop-up. Searching shows all matches inline.
    const preview = searchQuery ? rows : rows.slice(0, PREVIEW_ROWS);

    const onSort = (field) =>
        setSort((s) => ({ field, dir: s.field === field && s.dir === "desc" ? "asc" : "desc" }));

    const toggleStatus = (order) => {
        const next = order.status === "Paid" ? "Refund" : "Paid";
        setOrders((list) => list.map((o) => (o.id === order.id ? { ...o, status: next } : o)));
        toast.success(`${order.id} marked as ${next === "Paid" ? "paid" : "refunded"}.`);
    };

    const toolbar = (
        <>
            <div className="flex rounded-full bg-slate-100 dark:bg-slate-600 p-0.5 text-xs">
                {STATUS_FILTERS.map((s) => (
                    <button
                        key={s}
                        type="button"
                        onClick={() => setStatus(s)}
                        className={`rounded-full px-3 py-1 transition-colors ${
                            status === s
                                ? "bg-white dark:bg-slate-800 shadow-sm font-medium text-[#26282C] dark:text-white"
                                : "text-[#737373] dark:text-slate-300"
                        }`}
                    >
                        {s}
                    </button>
                ))}
            </div>
            <button
                type="button"
                title="Export CSV"
                aria-label="Export CSV"
                onClick={() => {
                    downloadCsv(rows);
                    toast.success(`Exported ${rows.length} orders.`);
                }}
                className="rounded-full p-1.5 text-[#697689] hover:bg-[#34CAA5]/10 hover:text-[#34CAA5]"
            >
                <DocumentDownload size="18" color="currentColor" variant="Broken" />
            </button>
        </>
    );

    const renderTable = (list) => (
        <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="sticky top-0 z-10 bg-white dark:bg-slate-700 text-xs text-[#737373] dark:text-slate-300">
                <tr>
                    <SortHeader label="Name" field="name" sort={sort} onSort={onSort} />
                    <SortHeader label="Date" field="date" sort={sort} onSort={onSort} />
                    <SortHeader label="Amount" field="amount" sort={sort} onSort={onSort} />
                    <th scope="col" className="px-3 py-3 font-medium">Status</th>
                    <th scope="col" className="px-3 py-3 font-medium">Invoice</th>
                </tr>
            </thead>
            <tbody>
                {list.map((order) => (
                    <tr
                        key={order.id}
                        className="border-t border-[#EDF2F6] dark:border-slate-600 transition-colors hover:bg-slate-50 dark:hover:bg-slate-600/50"
                    >
                        <td className="px-3 py-2.5">
                            <span className="flex items-center gap-3 font-medium">
                                <img src={order.userImage} alt="" className="h-8 w-8 rounded-full" />
                                {order.name}
                            </span>
                        </td>
                        <td className="px-3 py-2.5 text-[#737373] dark:text-slate-300 whitespace-nowrap">
                            {formatDate(order.date)}
                        </td>
                        <td className="px-3 py-2.5 font-medium text-[#0D062D] dark:text-white">
                            {formatCurrency(order.amount)}
                        </td>
                        <td className="px-3 py-2.5">
                            <StatusBadge status={order.status} />
                        </td>
                        <td className="px-3 py-2.5">
                            <button
                                type="button"
                                onClick={() => setSelectedId(order.id)}
                                className="inline-flex items-center gap-1.5 text-[#0D062D] dark:text-slate-200 hover:text-[#34CAA5]"
                            >
                                <DocumentText size="16" color="currentColor" variant="Broken" />
                                View
                            </button>
                        </td>
                    </tr>
                ))}
                {list.length === 0 && (
                    <tr>
                        <td colSpan={5} className="px-3 py-10 text-center text-xs text-[#A3A3A3]">
                            No orders match{searchQuery ? ` “${searchQuery}”` : " this filter"}.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );

    return (
        <div className="card p-2 h-full flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 pt-3 pb-2">
                <h2 className="card-title">Last Orders</h2>
                <div className="flex items-center gap-2">
                    {toolbar}
                    <button type="button" onClick={() => setShowAll(true)} className="link-action">
                        See All
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto scroll-thin">{renderTable(preview)}</div>

            <Modal
                open={showAll}
                onClose={() => !selected && setShowAll(false)}
                title={`All orders (${rows.length})`}
                size="max-w-4xl"
            >
                <div className="mb-3 flex justify-end">
                    <div className="flex items-center gap-2">{toolbar}</div>
                </div>
                {/* Own scroll area so the sticky header stays pinned while rows scroll. */}
                <div className="max-h-[calc(100dvh-12rem)] overflow-auto scroll-thin">{renderTable(rows)}</div>
            </Modal>

            <Modal
                open={!!selected}
                onClose={() => setSelectedId(null)}
                title={selected ? `Invoice ${selected.id}` : ""}
                footer={
                    selected && (
                        <>
                            <Button variant="ghost" onClick={() => toggleStatus(selected)}>
                                Mark as {selected.status === "Paid" ? "refunded" : "paid"}
                            </Button>
                            <Button onClick={() => printInvoice(selected)}>
                                <Printer size="14" color="currentColor" /> Print
                            </Button>
                        </>
                    )
                }
            >
                {selected && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <img src={selected.userImage} alt="" className="h-12 w-12 rounded-full" />
                            <div>
                                <p className="font-semibold">{selected.name}</p>
                                <p className="text-xs text-[#737373] dark:text-slate-300">{formatDate(selected.date)}</p>
                            </div>
                            <div className="ml-auto">
                                <StatusBadge status={selected.status} />
                            </div>
                        </div>
                        <dl className="rounded-xl bg-slate-50 dark:bg-slate-800 p-4 text-xs space-y-2">
                            <div className="flex justify-between"><dt className="text-[#737373] dark:text-slate-300">Subtotal</dt><dd>{formatCurrency(selected.amount * 0.95)}</dd></div>
                            <div className="flex justify-between"><dt className="text-[#737373] dark:text-slate-300">Fees (5%)</dt><dd>{formatCurrency(selected.amount * 0.05)}</dd></div>
                            <div className="flex justify-between border-t border-slate-200 dark:border-slate-600 pt-2 text-sm font-semibold"><dt>Total</dt><dd>{formatCurrency(selected.amount)}</dd></div>
                        </dl>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default LastOrdersTable;
