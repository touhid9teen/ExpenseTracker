import { PlusIcon } from "../common/Icons";

export const LedgerHeaderActions = ({ darkMode, setActiveTab, setShowQuickAdd }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 pb-4 border-cyan-500/30 relative">
            {/* Neon accent strip */}
            <span className="absolute -bottom-[2px] left-0 h-[2px] w-24 bg-gradient-to-r from-cyan-400 to-sky-400" />
            <div>
                <h1 className="text-2xl font-black tracking-tight flex items-center gap-3">
                    <span className={`inline-block w-2 h-8 cyber-cut-sm ${darkMode ? "bg-cyan-400" : "bg-cyan-500"}`} />
                    Transactions Ledger
                </h1>
                <p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Log, search, sort, and edit expenditures safely
                </p>
            </div>
            <div className="mt-3 md:mt-0 flex gap-2">
                <button
                    onClick={() => setShowQuickAdd(true)}
                    className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 cyber-cut-sm text-xs sm:text-sm font-extrabold text-white cyber-btn-accent active:scale-[0.97] transition-all duration-200 shadow-[4px_4px_0px_var(--accent-glow)] hover:shadow-[2px_2px_0px_var(--accent-glow-strong)] focus:outline-none"
                >
                    <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                    Log New Expense
                </button>
                <button
                    onClick={() => setActiveTab("statistics")}
                    className={`hidden sm:inline-block px-4 py-2 cyber-cut-sm text-xs font-bold transition-all border-2 ${
                        darkMode
                            ? "bg-slate-900 hover:bg-slate-800 border-cyan-900 text-cyan-300"
                            : "bg-white hover:bg-slate-100 border-cyan-300 text-cyan-700"
                    }`}
                >
                    ← Open Analytics
                </button>
            </div>
        </div>
    );
};
