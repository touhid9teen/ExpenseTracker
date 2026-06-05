const StatCard = ({ darkMode, title, value = "", valueClass, note, children }) => (
    <div className={`p-4 rounded-xl border ${darkMode ? "bg-slate-800/30 border-slate-850" : "bg-slate-50 border-slate-150"}`}>
        <span className={`text-[10px] uppercase font-bold tracking-widest block ${darkMode ? "text-slate-500" : "text-slate-400"}`}>{title}</span>
        <span className={`text-lg font-black tracking-tight mt-1 block ${valueClass}`}>{value}</span>
        <span className={`text-xs font-medium block truncate ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{note}</span>
        {children}
    </div>
);

import { ChartBarSquareIcon } from "../Icons";

export const QuickStatsGrid = ({ darkMode = true, quickStats = {}, formatDate = (value) => value || "" }) => {
    const safeQuickStats = {
        highest: { date: "N/A", amount: 0 },
        lowest: { date: "N/A", amount: 0 },
        mostUsedCategory: "N/A",
        avgDaily: 0,
        ...quickStats
    };

    return (
        <div className={`p-6 rounded-2xl border shadow-md ${darkMode ? "bg-slate-900/60 border-slate-800/80 shadow-black/15" : "bg-white border-slate-200 shadow-slate-200/50"}`}>
            <h2 className="text-base font-bold tracking-tight mb-4 flex items-center gap-2">
                <ChartBarSquareIcon className="w-5 h-5 text-emerald-500" />
                Core Spending Statistics
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard darkMode={darkMode} title="Highest Spending Day" value={`৳${Math.round(safeQuickStats.highest.amount).toLocaleString()}`} valueClass="text-rose-500" note={safeQuickStats.highest.date !== "N/A" ? formatDate(safeQuickStats.highest.date) : "N/A"} />
                <StatCard darkMode={darkMode} title="Lowest Spending Day" value={`৳${Math.round(safeQuickStats.lowest.amount).toLocaleString()}`} valueClass="text-emerald-500" note={safeQuickStats.lowest.date !== "N/A" ? formatDate(safeQuickStats.lowest.date) : "N/A"} />
                <StatCard darkMode={darkMode} title="Most Used Category" value={safeQuickStats.mostUsedCategory} valueClass="text-purple-500 truncate" note="Frequent category" />
                <StatCard darkMode={darkMode} title="Average Daily Expense" value={`৳${Math.round(safeQuickStats.avgDaily).toLocaleString()}`} valueClass="text-teal-500" note="Per active day" />
            </div>
        </div>
    );
};
