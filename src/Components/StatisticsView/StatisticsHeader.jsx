export const StatisticsHeader = ({ darkMode, setActiveTab, dateLabels }) => {
    const safeDateLabels = dateLabels ?? { today: "" };

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
                <h1 className={`text-2xl font-black tracking-tight ${darkMode ? "text-slate-100" : "text-slate-900"}`}>Statistics Analytics</h1>
                <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Real-time visual breakdown of active dashboard expenditures</p>
            </div>
            <div className="mt-2 md:mt-0 flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#C9E4F9] text-sky-800">Today: {safeDateLabels.today}</span>
                <button onClick={() => setActiveTab("ledger")} className="hidden sm:inline-block px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 shadow-md shadow-amber-500/15">Open Ledger →</button>
            </div>
        </div>
    );
};
