import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Add, Edit2, Trash, TickCircle, Danger, CloseCircle } from "iconsax-react";
import { CATEGORIES, LOW_STOCK, PRODUCTS_KEY, loadProducts, stockStatus } from "../../data/productsData";
import { useApp } from "../../context/AppContext";
import Modal, { Button } from "../Modal";
import Select from "../Select";
import { Pagination, SortHeader } from "../Table";
import { sortBy } from "../../utils/sort";

const PAGE_SIZE = 8;
const STOCK_FILTERS = ["All", "In stock", "Low stock", "Out of stock"];

const CATEGORY_COLORS = {
    Books: "#6160DC",
    Crafts: "#FFB74A",
    Toys: "#F37BB8",
    Electronics: "#54C5EB",
    Home: "#34CAA5",
};

const formatPrice = (v) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);
const formatCompact = (v) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 }).format(v);

const STATUS_STYLES = {
    "In stock": { icon: TickCircle, className: "bg-[#34CAA5]/10 text-[#34CAA5] dark:text-emerald-300" },
    "Low stock": { icon: Danger, className: "bg-[#FFB74A]/15 text-[#B7791F] dark:text-amber-300" },
    "Out of stock": { icon: CloseCircle, className: "bg-[#ED544E]/10 text-[#ED544E] dark:text-red-300" },
};

const StockBadge = ({ stock }) => {
    const status = stockStatus(stock);
    const { icon: Icon, className } = STATUS_STYLES[status];
    return (
        <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ${className}`}>
            <Icon size="12" color="currentColor" variant="Bold" />
            {status}
        </span>
    );
};

const Thumb = ({ name, category }) => {
    const color = CATEGORY_COLORS[category] ?? "#697689";
    const initials = name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();
    return (
        <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold"
            style={{ backgroundColor: `${color}26`, color }}
        >
            {initials}
        </span>
    );
};

const SummaryTile = ({ label, value, hint }) => (
    <div className="card p-4 sm:p-5">
        <h3 className="text-xs sm:text-sm text-[#898989] dark:text-slate-300">{label}</h3>
        <p className="mt-1 text-xl sm:text-2xl font-semibold">{value}</p>
        {hint && <p className="mt-1 text-[11px] sm:text-xs text-[#A3A3A3]">{hint}</p>}
    </div>
);

// Phones have no column headers to tap, so sorting is a dropdown there.
const MOBILE_SORTS = [
    { value: "name-asc", label: "Name (A–Z)" },
    { value: "price-asc", label: "Price: low to high" },
    { value: "price-desc", label: "Price: high to low" },
    { value: "stock-asc", label: "Stock: lowest first" },
    { value: "sold-desc", label: "Best selling" },
];

const ProductCard = ({ product: p, onEdit, onDelete }) => (
    <li className="flex gap-3 px-3 py-3.5">
        <Thumb name={p.name} category={p.category} />
        <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
                <p className="truncate text-sm font-medium">{p.name}</p>
                <p className="shrink-0 text-sm font-semibold">{formatPrice(p.price)}</p>
            </div>
            <p className="mt-0.5 truncate text-xs text-[#A3A3A3]">
                {p.sku} · {p.category} · {p.sold.toLocaleString()} sold
            </p>
            <div className="mt-2 flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-xs text-[#737373] dark:text-slate-300">
                    <StockBadge stock={p.stock} />
                    {p.stock > 0 && <span className="tabular-nums">{p.stock} left</span>}
                </span>
                <span className="-mr-1.5 flex gap-1">
                    <button
                        type="button"
                        aria-label={`Edit ${p.name}`}
                        onClick={onEdit}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[#697689] hover:bg-[#34CAA5]/10 hover:text-[#34CAA5]"
                    >
                        <Edit2 size="16" color="currentColor" />
                    </button>
                    <button
                        type="button"
                        aria-label={`Delete ${p.name}`}
                        onClick={onDelete}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[#697689] hover:bg-[#ED544E]/10 hover:text-[#ED544E]"
                    >
                        <Trash size="16" color="currentColor" />
                    </button>
                </span>
            </div>
        </div>
    </li>
);

const inputClass =
    "w-full rounded-lg border border-[#DADDDD] dark:border-slate-500 bg-white dark:bg-slate-800 px-3 py-2 text-sm outline-none transition focus:border-[#34CAA5] focus:ring-2 focus:ring-[#34CAA5]/20";

const EMPTY_FORM = { name: "", sku: "", category: CATEGORIES[0], price: "", stock: "" };

const ProductForm = ({ open, product, products, onClose, onSave }) => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!open) return;
        setForm(product ? { ...product, price: String(product.price), stock: String(product.stock) } : EMPTY_FORM);
        setErrors({});
    }, [open, product]);

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const validate = () => {
        const next = {};
        const sku = form.sku.trim().toUpperCase();
        if (!form.name.trim()) next.name = "Enter a product name.";
        if (!sku) next.sku = "Enter a SKU.";
        else if (products.some((p) => p.sku === sku && p.id !== product?.id)) next.sku = "Another product already uses this SKU.";
        if (!(Number(form.price) > 0)) next.price = "Price must be more than 0.";
        if (form.stock === "" || !Number.isInteger(Number(form.stock)) || Number(form.stock) < 0)
            next.stock = "Stock must be a whole number, 0 or more.";
        return next;
    };

    const submit = (e) => {
        e.preventDefault();
        const next = validate();
        setErrors(next);
        if (Object.keys(next).length) return;
        onSave({
            ...product,
            name: form.name.trim(),
            sku: form.sku.trim().toUpperCase(),
            category: form.category,
            price: Math.round(Number(form.price) * 100) / 100,
            stock: Number(form.stock),
            sold: product?.sold ?? 0,
        });
    };

    const field = (key, label, input) => (
        <label className="block">
            <span className="mb-1 block text-xs font-medium text-[#525252] dark:text-slate-300">{label}</span>
            {input}
            {errors[key] && <span className="mt-1 block text-xs text-[#ED544E]">{errors[key]}</span>}
        </label>
    );

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={product ? "Edit product" : "Add product"}
            footer={
                <>
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" form="product-form">
                        {product ? "Save changes" : "Add product"}
                    </Button>
                </>
            }
        >
            <form id="product-form" onSubmit={submit} noValidate className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                    {field("name", "Name", <input className={inputClass} value={form.name} onChange={set("name")} autoFocus />)}
                </div>
                {field("sku", "SKU", <input className={`${inputClass} uppercase`} value={form.sku} onChange={set("sku")} />)}
                {field(
                    "category",
                    "Category",
                    <Select
                        className="w-full"
                        value={form.category}
                        onChange={(category) => setForm((f) => ({ ...f, category }))}
                        options={CATEGORIES}
                    />
                )}
                {field(
                    "price",
                    "Price (USD)",
                    <input className={inputClass} type="number" min="0" step="0.01" inputMode="decimal" value={form.price} onChange={set("price")} />
                )}
                {field(
                    "stock",
                    "Stock",
                    <input className={inputClass} type="number" min="0" step="1" inputMode="numeric" value={form.stock} onChange={set("stock")} />
                )}
            </form>
        </Modal>
    );
};

const Products = () => {
    const { searchQuery } = useApp();
    const [products, setProducts] = useState(loadProducts);
    const [category, setCategory] = useState("All");
    const [stockFilter, setStockFilter] = useState("All");
    const [sort, setSort] = useState({ field: "name", dir: "asc" });
    const [page, setPage] = useState(1);
    const [editing, setEditing] = useState(null); // null = closed, {} = new, product = edit
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        try {
            localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
        } catch {
            // ignore
        }
    }, [products]);

    const rows = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        const filtered = products.filter(
            (p) =>
                (category === "All" || p.category === category) &&
                (stockFilter === "All" || stockStatus(p.stock) === stockFilter) &&
                (!q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
        );
        return sortBy(filtered, sort);
    }, [products, category, stockFilter, sort, searchQuery]);

    const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));

    // Go back to the first page whenever the list changes shape.
    useEffect(() => setPage(1), [category, stockFilter, searchQuery, sort]);
    useEffect(() => setPage((p) => Math.min(p, pageCount)), [pageCount]);

    const visible = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const summary = useMemo(
        () => ({
            total: products.length,
            value: products.reduce((t, p) => t + p.price * p.stock, 0),
            low: products.filter((p) => stockStatus(p.stock) === "Low stock").length,
            out: products.filter((p) => p.stock === 0).length,
        }),
        [products]
    );

    const onSort = (field) =>
        setSort((s) => ({ field, dir: s.field === field && s.dir === "asc" ? "desc" : "asc" }));

    const save = (product) => {
        if (product.id) {
            setProducts((list) => list.map((p) => (p.id === product.id ? product : p)));
            toast.success(`${product.name} updated.`);
        } else {
            const id = Math.max(0, ...products.map((p) => p.id)) + 1;
            setProducts((list) => [{ ...product, id }, ...list]);
            toast.success(`${product.name} added.`);
        }
        setEditing(null);
    };

    const confirmDelete = () => {
        setProducts((list) => list.filter((p) => p.id !== deleting.id));
        toast.success(`${deleting.name} deleted.`);
        setDeleting(null);
    };

    const sortValue = `${sort.field}-${sort.dir}`;

    return (
        <div className="flex flex-col gap-4 lg:gap-5 [&>*]:min-w-0">
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
                <SummaryTile label="Products" value={summary.total} hint={`${CATEGORIES.length} categories`} />
                <SummaryTile label="Inventory value" value={formatCompact(summary.value)} hint="Price × stock on hand" />
                <SummaryTile label="Low stock" value={summary.low} hint={`${LOW_STOCK} or fewer left`} />
                <SummaryTile label="Out of stock" value={summary.out} hint="Needs restocking" />
            </div>

            <div className="card p-2">
                <div className="flex flex-col gap-3 px-3 pt-3 pb-2 md:flex-row md:flex-wrap md:items-center md:justify-between">
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="card-title">
                            All products <span className="font-normal text-[#A3A3A3]">({rows.length})</span>
                        </h2>
                        <Button className="md:hidden" onClick={() => setEditing({})}>
                            <Add size="16" color="currentColor" /> Add
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 md:flex md:items-center">
                        <Select
                            variant="pill"
                            aria-label="Category"
                            value={category}
                            onChange={setCategory}
                            options={[{ value: "All", label: "All categories" }, ...CATEGORIES]}
                        />
                        <Select
                            variant="pill"
                            aria-label="Stock"
                            value={stockFilter}
                            onChange={setStockFilter}
                            options={STOCK_FILTERS.map((s) => ({ value: s, label: s === "All" ? "Any stock" : s }))}
                        />
                        <Select
                            variant="pill"
                            aria-label="Sort by"
                            className="col-span-2 md:hidden"
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
                        <Button className="hidden md:inline-flex" onClick={() => setEditing({})}>
                            <Add size="16" color="currentColor" /> Add product
                        </Button>
                    </div>
                </div>

                <ul className="divide-y divide-[#EDF2F6] dark:divide-slate-600 border-t border-[#EDF2F6] dark:border-slate-600 md:hidden">
                    {visible.map((p) => (
                        <ProductCard key={p.id} product={p} onEdit={() => setEditing(p)} onDelete={() => setDeleting(p)} />
                    ))}
                    {visible.length === 0 && (
                        <li className="px-3 py-10 text-center text-xs text-[#A3A3A3]">
                            No products match{searchQuery ? ` “${searchQuery}”` : " these filters"}.
                        </li>
                    )}
                </ul>

                <div className="hidden md:block overflow-x-auto scroll-thin">
                    <table className="w-full min-w-[720px] text-left text-sm">
                        <thead className="text-xs text-[#737373] dark:text-slate-300">
                            <tr>
                                <SortHeader label="Product" field="name" sort={sort} onSort={onSort} />
                                <SortHeader label="Category" field="category" sort={sort} onSort={onSort} />
                                <SortHeader label="Price" field="price" sort={sort} onSort={onSort} />
                                <SortHeader label="Stock" field="stock" sort={sort} onSort={onSort} />
                                <SortHeader label="Sold" field="sold" sort={sort} onSort={onSort} />
                                <th scope="col" className="px-3 py-3 font-medium text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {visible.map((p) => (
                                <tr
                                    key={p.id}
                                    className="border-t border-[#EDF2F6] dark:border-slate-600 transition-colors hover:bg-slate-50 dark:hover:bg-slate-600/50"
                                >
                                    <td className="px-3 py-2.5">
                                        <span className="flex items-center gap-3">
                                            <Thumb name={p.name} category={p.category} />
                                            <span>
                                                <span className="block font-medium">{p.name}</span>
                                                <span className="block text-xs text-[#A3A3A3]">{p.sku}</span>
                                            </span>
                                        </span>
                                    </td>
                                    <td className="px-3 py-2.5 text-[#737373] dark:text-slate-300">{p.category}</td>
                                    <td className="px-3 py-2.5 font-medium">{formatPrice(p.price)}</td>
                                    <td className="px-3 py-2.5">
                                        <span className="flex items-center gap-2">
                                            <span className="w-8 tabular-nums">{p.stock}</span>
                                            <StockBadge stock={p.stock} />
                                        </span>
                                    </td>
                                    <td className="px-3 py-2.5 tabular-nums text-[#737373] dark:text-slate-300">{p.sold.toLocaleString()}</td>
                                    <td className="px-3 py-2.5">
                                        <span className="flex justify-end gap-1">
                                            <button
                                                type="button"
                                                aria-label={`Edit ${p.name}`}
                                                title="Edit"
                                                onClick={() => setEditing(p)}
                                                className="rounded-full p-1.5 text-[#697689] hover:bg-[#34CAA5]/10 hover:text-[#34CAA5]"
                                            >
                                                <Edit2 size="16" color="currentColor" />
                                            </button>
                                            <button
                                                type="button"
                                                aria-label={`Delete ${p.name}`}
                                                title="Delete"
                                                onClick={() => setDeleting(p)}
                                                className="rounded-full p-1.5 text-[#697689] hover:bg-[#ED544E]/10 hover:text-[#ED544E]"
                                            >
                                                <Trash size="16" color="currentColor" />
                                            </button>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {visible.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-3 py-10 text-center text-xs text-[#A3A3A3]">
                                        No products match{searchQuery ? ` “${searchQuery}”` : " these filters"}.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination page={page} pageSize={PAGE_SIZE} total={rows.length} onChange={setPage} />
            </div>

            <ProductForm
                open={!!editing}
                product={editing?.id ? editing : null}
                products={products}
                onClose={() => setEditing(null)}
                onSave={save}
            />

            <Modal
                open={!!deleting}
                onClose={() => setDeleting(null)}
                title="Delete product?"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setDeleting(null)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </>
                }
            >
                <p className="text-[#737373] dark:text-slate-300">
                    <span className="font-medium text-[#26282C] dark:text-white">{deleting?.name}</span> will be removed from your catalogue.
                </p>
            </Modal>

            <footer className="py-2 text-center text-xs text-[#A3A3A3]">© {new Date().getFullYear()} FASTA. All rights reserved.</footer>
        </div>
    );
};

export default Products;
