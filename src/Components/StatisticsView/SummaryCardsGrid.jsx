const SummaryCard = ({ darkMode, title, value = 0, icon, accentClass, note }) => (
    <div className={`p-4 sm:p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 shadow-md ${darkMode ? "bg-slate-900/60 border-slate-800/80 shadow-black/15" : "bg-white border-slate-200 shadow-slate-200/50"}`}>
        <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
            <span className={`text-[9px] sm:text-xs font-bold uppercase tracking-wider truncate ${darkMode ? "text-slate-400" : "text-slate-550"}`}>{title}</span>
            <div className={`w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-lg ${accentClass} flex items-center justify-center shrink-0`}>{icon}</div>
        </div>
        <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-3xl font-extrabold tracking-tight truncate">৳{Math.round(value).toLocaleString()}</span>
        </div>
        <p className={`text-[10px] sm:text-xs font-medium mt-2 truncate ${darkMode ? "text-slate-500" : "text-slate-400"}`}>{note}</p>
    </div>
);

import { TrendingUpIcon, CalendarIcon, ChartBarIcon, ChartPieIcon } from "../Icons";

export const SummaryCardsGrid = ({ darkMode = true, summaryCards = {}, dateLabels = {} }) => {
    const safeSummaryCards = {
        total: 0,
        today: 0,
        week: 0,
        month: 0,
        ...summaryCards
    };
    const safeDateLabels = {
        today: "",
        week: "",
        month: "",
        ...dateLabels
    };

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <SummaryCard darkMode={darkMode} title="All-Time" value={safeSummaryCards.total} note="Filtered dataset" accentClass="bg-emerald-500/10 text-emerald-500" icon={<TrendingUpIcon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />} />
            <SummaryCard darkMode={darkMode} title="Today" value={safeSummaryCards.today} note={safeDateLabels.today} accentClass="bg-teal-500/10 text-teal-500" icon={<CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />} />
            <SummaryCard darkMode={darkMode} title="This Week" value={safeSummaryCards.week} note={safeDateLabels.week} accentClass="bg-cyan-500/10 text-cyan-500" icon={<ChartBarIcon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />} />
            <SummaryCard darkMode={darkMode} title="This Month" value={safeSummaryCards.month} note={safeDateLabels.month} accentClass="bg-purple-500/10 text-purple-500" icon={<ChartPieIcon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />} />
        </div>
    );
};
