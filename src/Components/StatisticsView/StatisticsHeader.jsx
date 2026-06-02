export const StatisticsHeader = ({ darkMode, setActiveTab, dateLabels }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 border-slate-200/50 dark:border-slate-800/50">
            <div>
                <h1 className="text-2xl font-black tracking-tight">Statistics Analytics</h1>
                <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-550"}`}>Real-time visual breakdown of active dashboard expenditures</p>
            </div>
            <div className="mt-2 md:mt-0 flex gap-2">
                <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${darkMode ? "bg-slate-900/80 border-slate-850" : "bg-slate-100 border-slate-250"}`}>Today: {dateLabels.today}</span>
                <button onClick={() => setActiveTab("ledger")} className="px-3.5 py-1 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-md shadow-emerald-500/15">Open Ledger →</button>
            </div>
        </div>
    );
};
