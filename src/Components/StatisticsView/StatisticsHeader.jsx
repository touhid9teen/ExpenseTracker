export const StatisticsHeader = ({ darkMode, setActiveTab, dateLabels }) => {
    const safeDateLabels = dateLabels ?? { today: "" };

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
                <h1 className={`text-2xl font-black tracking-tight flex items-center gap-3 ${darkMode ? "text-slate-100" : "text-slate-900"}`}>
                    <span className={`inline-block w-2 h-8 cyber-cut-sm ${darkMode ? "bg-cyan-400" : "bg-cyan-500"}`} />
                    Statistics Analytics
                </h1>
                <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Real-time visual breakdown of active dashboard expenditures
                </p>
            </div>
            <div className="mt-2 md:mt-0 flex items-center gap-2">
                <span className={`px-3 py-1.5 cyber-cut-sm text-xs font-bold border-2 ${
                    darkMode
                        ? "bg-cyan-950/50 text-cyan-300 border-cyan-800/60"
                        : "bg-cyan-50 text-cyan-700 border-cyan-200"
                }`}>
                    Today: {safeDateLabels.today}
                </span>
                <button
                    onClick={() => setActiveTab("ledger")}
                    className="hidden sm:inline-block px-4 py-1.5 cyber-cut-sm text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 shadow-[3px_3px_0px_rgba(34,211,238,0.3)]"
                >
                    Open Ledger →
                </button>
            </div>
        </div>
    );
};
