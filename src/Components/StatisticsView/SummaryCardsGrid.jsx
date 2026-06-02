const SummaryCard = ({ darkMode, title, value = 0, icon, accentClass, note }) => (
    <div className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 shadow-sm ${darkMode ? "bg-slate-900/60 border-slate-800/80 shadow-black/10" : "bg-white border-slate-100 shadow-slate-100/30"}`}>
        <div className="flex items-center justify-between mb-4">
            <span className={`text-xs font-bold uppercase tracking-wider ${darkMode ? "text-slate-450" : "text-slate-500"}`}>{title}</span>
            <div className={`w-8 h-8 rounded-lg ${accentClass} flex items-center justify-center`}>{icon}</div>
        </div>
        <div className="flex items-baseline gap-1"><span className="text-3xl font-extrabold tracking-tight">৳{Math.round(value).toLocaleString()}</span></div>
        <p className={`text-xs font-medium mt-2 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>{note}</p>
    </div>
);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <SummaryCard darkMode={darkMode} title="All-Time Total" value={safeSummaryCards.total} note="Filtered active dataset" accentClass="bg-emerald-500/10 text-emerald-500" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} />
            <SummaryCard darkMode={darkMode} title="Today&apos;s Expense" value={safeSummaryCards.today} note={safeDateLabels.today} accentClass="bg-teal-500/10 text-teal-500" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
            <SummaryCard darkMode={darkMode} title="This Week" value={safeSummaryCards.week} note={safeDateLabels.week} accentClass="bg-cyan-500/10 text-cyan-500" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" /></svg>} />
            <SummaryCard darkMode={darkMode} title="This Month" value={safeSummaryCards.month} note={safeDateLabels.month} accentClass="bg-purple-500/10 text-purple-500" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>} />
        </div>
    );
};
