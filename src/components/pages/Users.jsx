import { useEffect, useMemo, useState } from "react";
import { Location, Sms, Calendar } from "iconsax-react";
import { ACTIVE_DAYS, users } from "../../data/usersData";
import { formatDate } from "../../data/dashboardData";
import { useApp } from "../../context/AppContext";
import Modal from "../Modal";
import Select from "../Select";
import { Pagination, SortHeader } from "../Table";
import { sortBy } from "../../utils/sort";

const PAGE_SIZE = 8;
const STATUS_FILTERS = ["All", "Active", "Inactive"];

const formatMoney = (v) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);

const Avatar = ({ user, size = "h-9 w-9", text = "text-xs" }) =>
    user.image ? (
        <img src={user.image} alt="" className={`${size} shrink-0 rounded-full object-cover`} />
    ) : (
        <span
            aria-hidden="true"
            className={`${size} ${text} flex shrink-0 items-center justify-center rounded-full bg-[#34CAA5]/15 font-semibold text-[#34CAA5]`}
        >
            {user.name
                .split(" ")
                .map((w) => w[0])
                .join("")}
        </span>
    );

const Pill = ({ tone, children }) => {
    const tones = {
        green: "bg-[#34CAA5]/10 text-[#34CAA5] dark:text-emerald-300",
        red: "bg-[#ED544E]/10 text-[#ED544E] dark:text-red-300",
        gray: "bg-slate-100 text-[#737373] dark:bg-slate-600 dark:text-slate-300",
    };
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${tones[tone]}`}>
            {children}
        </span>
    );
};

const StatusPill = ({ status }) => (
    <Pill tone={status === "Active" ? "green" : "gray"}>
        <span className={`h-1.5 w-1.5 rounded-full ${status === "Active" ? "bg-[#34CAA5]" : "bg-[#A3A3A3]"}`} />
        {status}
    </Pill>
);

const SummaryTile = ({ label, value, hint }) => (
    <div className="card p-4 sm:p-5">
        <h3 className="text-xs sm:text-sm text-[#898989] dark:text-slate-300">{label}</h3>
        <p className="mt-1 text-xl sm:text-2xl font-semibold">{value}</p>
        {hint && <p className="mt-1 text-[11px] sm:text-xs text-[#A3A3A3]">{hint}</p>}
    </div>
);

// Phones have no column headers to tap, so sorting is a dropdown there.
const MOBILE_SORTS = [
    { value: "totalSpent-desc", label: "Top spenders" },
    { value: "lastOrder-desc", label: "Most recent order" },
    { value: "orderCount-desc", label: "Most orders" },
    { value: "name-asc", label: "Name (A–Z)" },
];

const UserCard = ({ user: u, onOpen }) => (
    <li>
        <button
            type="button"
            onClick={onOpen}
            className="flex w-full items-center gap-3 px-3 py-3.5 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-600/50"
        >
            <Avatar user={u} size="h-10 w-10" />
            <span className="min-w-0 flex-1">
                <span className="flex items-start justify-between gap-2">
                    <span className="truncate text-sm font-medium">{u.name}</span>
                    <span className="shrink-0 text-sm font-semibold tabular-nums">{formatMoney(u.totalSpent)}</span>
                </span>
                <span className="mt-0.5 block truncate text-xs text-[#A3A3A3]">
                    {u.location} · {u.orderCount} {u.orderCount === 1 ? "order" : "orders"}
                </span>
                <span className="mt-2 flex items-center justify-between gap-2">
                    <StatusPill status={u.status} />
                    <span className="text-[11px] text-[#737373] dark:text-slate-300">Last order {formatDate(u.lastOrder)}</span>
                </span>
            </span>
        </button>
    </li>
);

const UserDetails = ({ user, onClose }) => (
    <Modal open={!!user} onClose={onClose} title="Customer details" size="max-w-2xl">
        {user && (
            <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-4">
                    <Avatar user={user} size="h-14 w-14" text="text-base" />
                    <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-2 font-semibold">
                            {user.name} <StatusPill status={user.status} />
                        </p>
                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#737373] dark:text-slate-300">
                            <span className="flex items-center gap-1">
                                <Sms size="14" color="currentColor" /> {user.email}
                            </span>
                            <span className="flex items-center gap-1">
                                <Location size="14" color="currentColor" /> {user.location}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar size="14" color="currentColor" /> Joined {formatDate(user.joined)}
                            </span>
                        </div>
                    </div>
                </div>

                <dl className="grid grid-cols-3 gap-3 rounded-xl bg-slate-50 dark:bg-slate-800 p-4 text-center">
                    <div>
                        <dt className="text-xs text-[#737373] dark:text-slate-300">Total spent</dt>
                        <dd className="mt-1 font-semibold">{formatMoney(user.totalSpent)}</dd>
                    </div>
                    <div>
                        <dt className="text-xs text-[#737373] dark:text-slate-300">Orders</dt>
                        <dd className="mt-1 font-semibold">{user.orderCount}</dd>
                    </div>
                    <div>
                        <dt className="text-xs text-[#737373] dark:text-slate-300">Refunds</dt>
                        <dd className="mt-1 font-semibold">{user.refunds}</dd>
                    </div>
                </dl>

                <div>
                    <h3 className="mb-2 text-sm font-semibold">Order history</h3>
                    <div className="overflow-x-auto scroll-thin">
                        <table className="w-full min-w-[420px] text-left text-sm">
                            <thead className="text-xs text-[#737373] dark:text-slate-300">
                                <tr>
                                    <th scope="col" className="px-3 py-2 font-medium">Invoice</th>
                                    <th scope="col" className="px-3 py-2 font-medium">Date</th>
                                    <th scope="col" className="px-3 py-2 font-medium">Amount</th>
                                    <th scope="col" className="px-3 py-2 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {user.orders.map((o) => (
                                    <tr key={o.id} className="border-t border-[#EDF2F6] dark:border-slate-600">
                                        <td className="px-3 py-2 text-[#737373] dark:text-slate-300">{o.id}</td>
                                        <td className="px-3 py-2 whitespace-nowrap">{formatDate(o.date)}</td>
                                        <td className="px-3 py-2 font-medium">{formatMoney(o.amount)}</td>
                                        <td className="px-3 py-2">
                                            <Pill tone={o.status === "Paid" ? "green" : "red"}>{o.status}</Pill>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}
    </Modal>
);

const Users = () => {
    const { searchQuery } = useApp();
    const [status, setStatus] = useState("All");
    const [sort, setSort] = useState({ field: "totalSpent", dir: "desc" });
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState(null);

    const rows = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        const filtered = users.filter(
            (u) =>
                (status === "All" || u.status === status) &&
                (!q || u.name.toLowerCase().includes(q) || u.email.includes(q) || u.location.toLowerCase().includes(q))
        );
        return sortBy(filtered, sort);
    }, [status, sort, searchQuery]);

    useEffect(() => setPage(1), [status, sort, searchQuery]);

    const visible = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const summary = useMemo(() => {
        const active = users.filter((u) => u.status === "Active").length;
        const repeat = users.filter((u) => u.orderCount > 1).length;
        const spent = users.reduce((t, u) => t + u.totalSpent, 0);
        return {
            total: users.length,
            active,
            avgValue: spent / users.length,
            repeatRate: Math.round((repeat / users.length) * 100),
        };
    }, []);

    const onSort = (field) =>
        setSort((s) => ({ field, dir: s.field === field && s.dir === "desc" ? "asc" : "desc" }));

    const sortValue = `${sort.field}-${sort.dir}`;

    return (
        <div className="flex flex-col gap-4 lg:gap-5 [&>*]:min-w-0">
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
                <SummaryTile label="Customers" value={summary.total} />
                <SummaryTile label="Active" value={summary.active} hint={`Ordered in the last ${ACTIVE_DAYS} days`} />
                <SummaryTile label="Avg. lifetime value" value={formatMoney(summary.avgValue)} hint="Paid orders per customer" />
                <SummaryTile label="Repeat customers" value={`${summary.repeatRate}%`} hint="More than one order" />
            </div>

            <div className="card p-2">
                <div className="flex flex-col gap-3 px-3 pt-3 pb-2 md:flex-row md:flex-wrap md:items-center md:justify-between">
                    <h2 className="card-title">
                        Customers <span className="font-normal text-[#A3A3A3]">({rows.length})</span>
                    </h2>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <div className="flex rounded-full bg-slate-100 dark:bg-slate-600 p-0.5 text-xs [&>button]:flex-1 md:[&>button]:flex-none">
                            {STATUS_FILTERS.map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setStatus(s)}
                                    className={`rounded-full px-3 py-1.5 md:py-1 transition-colors ${
                                        status === s
                                            ? "bg-white dark:bg-slate-800 shadow-sm font-medium text-[#26282C] dark:text-white"
                                            : "text-[#737373] dark:text-slate-300"
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                        <Select
                            variant="pill"
                            aria-label="Sort by"
                            className="md:hidden sm:min-w-[200px]"
                            value={sortValue}
                            onChange={(v) => {
                                const [field, dir] = v.split("-");
                                setSort({ field, dir });
                            }}
                            options={[
                                ...(MOBILE_SORTS.some((o) => o.value === sortValue) ? [] : [{ value: sortValue, label: "Sort: Custom order" }]),
                                ...MOBILE_SORTS.map((o) => ({ value: o.value, label: `Sort: ${o.label}` })),
                            ]}
                        />
                    </div>
                </div>

                <ul className="divide-y divide-[#EDF2F6] border-t border-[#EDF2F6] dark:divide-slate-600 dark:border-slate-600 md:hidden">
                    {visible.map((u) => (
                        <UserCard key={u.id} user={u} onOpen={() => setSelected(u)} />
                    ))}
                    {visible.length === 0 && (
                        <li className="px-3 py-10 text-center text-xs text-[#A3A3A3]">
                            No customers match{searchQuery ? ` “${searchQuery}”` : " this filter"}.
                        </li>
                    )}
                </ul>

                <div className="hidden md:block overflow-x-auto scroll-thin">
                    <table className="w-full min-w-[760px] text-left text-sm">
                        <thead className="text-xs text-[#737373] dark:text-slate-300">
                            <tr>
                                <SortHeader label="Customer" field="name" sort={sort} onSort={onSort} />
                                <SortHeader label="Location" field="location" sort={sort} onSort={onSort} />
                                <SortHeader label="Orders" field="orderCount" sort={sort} onSort={onSort} />
                                <SortHeader label="Total spent" field="totalSpent" sort={sort} onSort={onSort} />
                                <SortHeader label="Last order" field="lastOrder" sort={sort} onSort={onSort} />
                                <th scope="col" className="px-3 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visible.map((u) => (
                                <tr
                                    key={u.id}
                                    onClick={() => setSelected(u)}
                                    className="cursor-pointer border-t border-[#EDF2F6] dark:border-slate-600 transition-colors hover:bg-slate-50 dark:hover:bg-slate-600/50"
                                >
                                    <td className="px-3 py-2.5">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelected(u);
                                            }}
                                            className="flex items-center gap-3 text-left"
                                        >
                                            <Avatar user={u} />
                                            <span>
                                                <span className="block font-medium hover:text-[#34CAA5]">{u.name}</span>
                                                <span className="block text-xs text-[#A3A3A3]">{u.email}</span>
                                            </span>
                                        </button>
                                    </td>
                                    <td className="px-3 py-2.5 text-[#737373] dark:text-slate-300 whitespace-nowrap">{u.location}</td>
                                    <td className="px-3 py-2.5 tabular-nums">{u.orderCount}</td>
                                    <td className="px-3 py-2.5 font-medium tabular-nums">{formatMoney(u.totalSpent)}</td>
                                    <td className="px-3 py-2.5 text-[#737373] dark:text-slate-300 whitespace-nowrap">{formatDate(u.lastOrder)}</td>
                                    <td className="px-3 py-2.5">
                                        <StatusPill status={u.status} />
                                    </td>
                                </tr>
                            ))}
                            {visible.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-3 py-10 text-center text-xs text-[#A3A3A3]">
                                        No customers match{searchQuery ? ` “${searchQuery}”` : " this filter"}.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination page={page} pageSize={PAGE_SIZE} total={rows.length} onChange={setPage} />
            </div>

            <UserDetails user={selected} onClose={() => setSelected(null)} />

            <footer className="py-2 text-center text-xs text-[#A3A3A3]">© {new Date().getFullYear()} FASTA. All rights reserved.</footer>
        </div>
    );
};

export default Users;
