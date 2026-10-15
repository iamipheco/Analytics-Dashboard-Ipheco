import { ArrowDown2, ArrowLeft2, ArrowRight2, ArrowUp2 } from "iconsax-react";

export const SortHeader = ({ label, field, sort, onSort, className = "" }) => {
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

const pageButton =
    "rounded-full p-1.5 hover:bg-slate-100 dark:hover:bg-slate-600 disabled:opacity-40 disabled:hover:bg-transparent";

export const Pagination = ({ page, pageSize, total, onChange }) => {
    const pageCount = Math.max(1, Math.ceil(total / pageSize));
    if (total <= pageSize) return null;
    return (
        <div className="flex items-center justify-between gap-2 border-t border-[#EDF2F6] dark:border-slate-600 px-3 pt-3 pb-1 text-xs text-[#737373] dark:text-slate-300">
            <span>
                {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
            </span>
            <span className="flex items-center gap-1">
                <button type="button" aria-label="Previous page" disabled={page === 1} onClick={() => onChange(page - 1)} className={pageButton}>
                    <ArrowLeft2 size="14" color="currentColor" />
                </button>
                <span className="px-1">
                    Page {page} of {pageCount}
                </span>
                <button type="button" aria-label="Next page" disabled={page === pageCount} onClick={() => onChange(page + 1)} className={pageButton}>
                    <ArrowRight2 size="14" color="currentColor" />
                </button>
            </span>
        </div>
    );
};
