"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "../common/Icons";

const PAGE_SIZES = [5, 10, 25, 50];

// Builds a compact page list with ellipses: 1 … 4 5 [6] 7 8 … 20
const buildPageList = (current, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = new Set([1, total, current, current - 1, current + 1]);
    const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
    const out = [];
    let prev = 0;
    for (const p of sorted) {
        if (p - prev > 1) out.push(`gap-${p}`);
        out.push(p);
        prev = p;
    }
    return out;
};

/**
 * Reusable pagination bar for the admin tables — shows a "rows per page"
 * selector plus prev / numbered / next navigation.
 */
export const AdminPagination = ({ darkMode, page, setPage, rowsPerPage, setRowsPerPage, total }) => {
    const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
    const pages = buildPageList(page, totalPages);
    const from = total === 0 ? 0 : (page - 1) * rowsPerPage + 1;
    const to = Math.min(page * rowsPerPage, total);

    const navBtn = `flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
        darkMode
            ? "bg-slate-900 border border-slate-700/70 text-slate-300 hover:border-violet-500/50 hover:text-violet-300"
            : "bg-white border border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600"
    }`;

    const selectClass = `px-2 py-1.5 rounded-lg text-xs font-bold border outline-none cursor-pointer transition-colors ${
        darkMode
            ? "bg-slate-900 border-slate-700/70 text-slate-200"
            : "bg-white border-slate-200 text-slate-600"
    }`;

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
                <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Showing <span className="font-bold text-violet-500">{from}</span> to{" "}
                    <span className="font-bold text-violet-500">{to}</span> of{" "}
                    <span className="font-bold text-violet-500">{total}</span>
                </p>
                <label className={`inline-flex items-center gap-2 text-xs font-bold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Rows per page
                    <select
                        value={rowsPerPage}
                        onChange={(e) => setRowsPerPage(e.target.value)}
                        className={selectClass}
                        aria-label="Rows per page"
                    >
                        {PAGE_SIZES.map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="flex items-center gap-1.5">
                <button disabled={page === 1} onClick={() => setPage(page - 1)} className={navBtn} aria-label="Previous page">
                    <ChevronLeftIcon className="w-4 h-4" strokeWidth={2.5} />
                </button>

                {pages.map((p) =>
                    typeof p === "string" ? (
                        <span key={p} className={`w-8 h-8 flex items-center justify-center text-sm ${darkMode ? "text-slate-600" : "text-slate-400"}`}>…</span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            aria-current={p === page}
                            className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                                p === page
                                    ? "bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-sm shadow-violet-500/30"
                                    : darkMode
                                        ? "bg-slate-900 border border-slate-700/70 text-slate-300 hover:border-violet-500/50 hover:text-violet-300"
                                        : "bg-white border border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600"
                            }`}
                        >
                            {p}
                        </button>
                    )
                )}

                <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className={navBtn} aria-label="Next page">
                    <ChevronRightIcon className="w-4 h-4" strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
};

export default AdminPagination;
