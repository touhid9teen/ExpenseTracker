import { PlusIcon } from "../Icons";

export const LedgerHeaderActions = ({ darkMode, setActiveTab, showQuickAdd, setShowQuickAdd }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 border-slate-200/50 dark:border-slate-800/50">
            <div>
                <h1 className="text-2xl font-black tracking-tight">Transactions Ledger</h1>
                <p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-550"}`}>Log, search, sort, and edit expenditures safely</p>
            </div>
            <div className="mt-3 md:mt-0 flex gap-2">
                <button
                    onClick={() => setShowQuickAdd(!showQuickAdd)}
                    className="flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-md focus:outline-none"
                >
                    <PlusIcon className={`w-4 h-4 transition-transform duration-300 ${showQuickAdd ? "rotate-45" : ""}`} strokeWidth={2.5} />
                    {showQuickAdd ? "Collapse Form" : "Log New Expense"}
                </button>
                <button
                    onClick={() => setActiveTab("statistics")}
                    className={`hidden sm:inline-block px-4 py-2 rounded-xl text-xs font-bold transition-all border ${darkMode ? "bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300" : "bg-white hover:bg-slate-100 border-slate-200 text-slate-650"}`}
                >
                    ← Open Analytics
                </button>
            </div>
        </div>
    );
};
