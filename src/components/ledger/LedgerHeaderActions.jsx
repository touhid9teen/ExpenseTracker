"use client";
import { PlusIcon, FilterFunnelIcon, UploadExportIcon } from "../ui/Icons";

export const LedgerHeaderActions = ({ darkMode, setShowQuickAdd, showFilters, setShowFilters, onExport }) => {
    const ghostBtn = darkMode
        ? "bg-slate-900 border-slate-700/70 text-slate-200 hover:border-violet-500/50 hover:text-violet-300"
        : "bg-white border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600";

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
                <h1 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
                    Transactions
                </h1>
                <p className={`text-xs mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Search, sort, and manage all your expenses
                </p>
            </div>

            <div className="flex items-center gap-2.5">
                <button
                    onClick={() => setShowFilters((v) => !v)}
                    aria-pressed={showFilters}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition-all duration-200 active:scale-95 ${
                        showFilters
                            ? "bg-violet-500/10 border-violet-500/40 text-violet-500"
                            : ghostBtn
                    }`}
                >
                    <FilterFunnelIcon className="w-4 h-4" strokeWidth={2.25} />
                    <span className="hidden sm:inline">Filter</span>
                </button>
                <button
                    onClick={onExport}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition-all duration-200 active:scale-95 ${ghostBtn}`}
                >
                    <UploadExportIcon className="w-4 h-4" strokeWidth={2.25} />
                    <span className="hidden sm:inline">Export</span>
                </button>
                <button
                    onClick={() => setShowQuickAdd(true)}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 shadow-lg shadow-violet-500/30 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                >
                    <PlusIcon className="w-4 h-4" strokeWidth={2.5} />
                    Add Expense
                </button>
            </div>
        </div>
    );
};
