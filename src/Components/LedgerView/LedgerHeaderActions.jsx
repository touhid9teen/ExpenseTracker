import { PlusIcon } from "../common/Icons";

export const LedgerHeaderActions = ({ darkMode, setActiveTab, showQuickAdd, setShowQuickAdd }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 border-slate-300/60 dark:border-slate-800/50">
            <div>
                <h1 className="text-2xl font-black tracking-tight">Transactions Ledger</h1>
                <p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-550"}`}>Log, search, sort, and edit expenditures safely</p>
            </div>
            <div className="mt-3 md:mt-0 flex gap-2">
                <button
                    onClick={() => setShowQuickAdd(!showQuickAdd)}
                    className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-[0.97] transition-all duration-200 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 focus:outline-none"
                >
                    <PlusIcon className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${showQuickAdd ? "rotate-45" : ""}`} strokeWidth={2.5} />
                    {showQuickAdd ? "Collapse Form" : "Log New Expense"}
                </button>
                <button
                    onClick={() => setActiveTab("statistics")}
                    className={`hidden sm:inline-block px-4 py-2 rounded-xl text-xs font-bold transition-all border ${darkMode ? "bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300" : "bg-white hover:bg-slate-100 border-slate-300 text-slate-650"}`}
                >
                    ← Open Analytics
                </button>
            </div>
        </div>
    );
};
