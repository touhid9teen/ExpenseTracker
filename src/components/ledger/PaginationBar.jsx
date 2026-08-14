"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "../ui/Icons";

const formatTaka = (value) => `৳${Math.round(Number(value) || 0).toLocaleString()}`;

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

export const PaginationBar = ({
    darkMode,
    filteredExpenses,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    pageSizes = [5, 10, 25, 50],
    totalPages,
    currentTableTotal,
}) => {
    const from = filteredExpenses.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const to = Math.min(currentPage * itemsPerPage, filteredExpenses.length);
    const pages = buildPageList(currentPage, totalPages);

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
                    <span className="font-bold text-violet-500">{filteredExpenses.length}</span>
                </p>
                <label className={`inline-flex items-center gap-2 text-xs font-bold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Rows per page
                    <select
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(e.target.value)}
                        className={selectClass}
                        aria-label="Rows per page"
                    >
                        {pageSizes.map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                </label>
                <span className={`hidden md:inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${darkMode ? "bg-violet-500/15 text-violet-300" : "bg-violet-50 text-violet-600"}`}>
                    Total {formatTaka(currentTableTotal)}
                </span>
            </div>

            <div className="flex items-center gap-1.5">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className={navBtn} aria-label="Previous page">
                    <ChevronLeftIcon className="w-4 h-4" strokeWidth={2.5} />
                </button>

                {pages.map((p) =>
                    typeof p === "string" ? (
                        <span key={p} className={`w-8 h-8 flex items-center justify-center text-sm ${darkMode ? "text-slate-600" : "text-slate-400"}`}>…</span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => setCurrentPage(p)}
                            aria-current={p === currentPage}
                            className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                                p === currentPage
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

                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className={navBtn} aria-label="Next page">
                    <ChevronRightIcon className="w-4 h-4" strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
};
