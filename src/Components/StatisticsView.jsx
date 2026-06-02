const StatisticsView = ({
    activeTab,
    darkMode,
    setActiveTab,
    summaryCards,
    quickStats,
    formatDate,
    categoryBreakdown,
    getCategoryStyles,
    dailySpendingTrend,
    dateLabels
}) => {
    return (
        <>
                {activeTab === "statistics" && (
                    <div className="space-y-8 animate-fadeIn">
                        <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 border-slate-200/50 dark:border-slate-800/50">
                            <div>
                                <h1 className="text-2xl font-black tracking-tight">Statistics Analytics</h1>
                                <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-550"}`}>Real-time visual breakdown of active dashboard expenditures</p>
                            </div>
                            <div className="mt-2 md:mt-0 flex gap-2">
                                <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${darkMode ? "bg-slate-900/80 border-slate-850" : "bg-slate-100 border-slate-250"}`}>
                                    Today: {dateLabels.today}
                                </span>
                                <button
                                    onClick={() => setActiveTab("ledger")}
                                    className="px-3.5 py-1 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-md shadow-emerald-500/15"
                                >
                                    Open Ledger →
                                </button>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {/* Card 1: Total */}
                            <div className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 shadow-sm ${darkMode ? "bg-slate-900/60 border-slate-800/80 shadow-black/10" : "bg-white border-slate-100 shadow-slate-100/30"}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`text-xs font-bold uppercase tracking-wider ${darkMode ? "text-slate-450" : "text-slate-500"}`}>All-Time Total</span>
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-extrabold tracking-tight">৳{Math.round(summaryCards.total).toLocaleString()}</span>
                                </div>
                                <p className={`text-xs font-medium mt-2 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Filtered active dataset</p>
                            </div>

                            {/* Card 2: Today */}
                            <div className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 shadow-sm ${darkMode ? "bg-slate-900/60 border-slate-800/80 shadow-black/10" : "bg-white border-slate-100 shadow-slate-100/30"}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`text-xs font-bold uppercase tracking-wider ${darkMode ? "text-slate-450" : "text-slate-500"}`}>Today&apos;s Expense</span>
                                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-500">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-extrabold tracking-tight">৳{Math.round(summaryCards.today).toLocaleString()}</span>
                                </div>
                                <p className={`text-xs font-medium mt-2 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>{dateLabels.today}</p>
                            </div>

                            {/* Card 3: Week */}
                            <div className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 shadow-sm ${darkMode ? "bg-slate-900/60 border-slate-800/80 shadow-black/10" : "bg-white border-slate-100 shadow-slate-100/30"}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`text-xs font-bold uppercase tracking-wider ${darkMode ? "text-slate-450" : "text-slate-500"}`}>This Week</span>
                                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-extrabold tracking-tight">৳{Math.round(summaryCards.week).toLocaleString()}</span>
                                </div>
                                <p className={`text-xs font-medium mt-2 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>{dateLabels.week}</p>
                            </div>

                            {/* Card 4: Month */}
                            <div className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 shadow-sm ${darkMode ? "bg-slate-900/60 border-slate-800/80 shadow-black/10" : "bg-white border-slate-100 shadow-slate-100/30"}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`text-xs font-bold uppercase tracking-wider ${darkMode ? "text-slate-450" : "text-slate-500"}`}>This Month</span>
                                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-extrabold tracking-tight">৳{Math.round(summaryCards.month).toLocaleString()}</span>
                                </div>
                                <p className={`text-xs font-medium mt-2 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>{dateLabels.month}</p>
                            </div>
                        </div>

                        {/* Quick Statistics Grid */}
                        <div className={`p-6 rounded-2xl border shadow-sm ${darkMode ? "bg-slate-900/60 border-slate-800/80 shadow-black/10" : "bg-white border-slate-100 shadow-slate-100/30"}`}>
                            <h2 className="text-base font-bold tracking-tight mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Core Spending Statistics
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {/* Peak Spending Day */}
                                <div className={`p-4 rounded-xl border ${darkMode ? "bg-slate-800/30 border-slate-850" : "bg-slate-50 border-slate-150"}`}>
                                    <span className={`text-[10px] uppercase font-bold tracking-widest block ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Highest Spending Day</span>
                                    <span className="text-lg font-black tracking-tight text-rose-500 mt-1 block">
                                        ৳{Math.round(quickStats.highest.amount).toLocaleString()}
                                    </span>
                                    <span className={`text-xs font-medium block truncate ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                                        {quickStats.highest.date !== "N/A" ? formatDate(quickStats.highest.date) : "N/A"}
                                    </span>
                                </div>

                                {/* Lowest Spending Day */}
                                <div className={`p-4 rounded-xl border ${darkMode ? "bg-slate-800/30 border-slate-850" : "bg-slate-50 border-slate-150"}`}>
                                    <span className={`text-[10px] uppercase font-bold tracking-widest block ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Lowest Spending Day</span>
                                    <span className="text-lg font-black tracking-tight text-emerald-500 mt-1 block">
                                        ৳{Math.round(quickStats.lowest.amount).toLocaleString()}
                                    </span>
                                    <span className={`text-xs font-medium block truncate ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                                        {quickStats.lowest.date !== "N/A" ? formatDate(quickStats.lowest.date) : "N/A"}
                                    </span>
                                </div>

                                {/* Most Used Category */}
                                <div className={`p-4 rounded-xl border ${darkMode ? "bg-slate-800/30 border-slate-850" : "bg-slate-50 border-slate-150"}`}>
                                    <span className={`text-[10px] uppercase font-bold tracking-widest block ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Most Used Category</span>
                                    <span className="text-lg font-black tracking-tight text-purple-500 mt-1 block truncate">
                                        {quickStats.mostUsedCategory}
                                    </span>
                                    <span className={`text-xs font-medium block ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                                        Frequent category
                                    </span>
                                </div>

                                {/* Average Daily Expense */}
                                <div className={`p-4 rounded-xl border ${darkMode ? "bg-slate-800/30 border-slate-850" : "bg-slate-50 border-slate-150"}`}>
                                    <span className={`text-[10px] uppercase font-bold tracking-widest block ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Average Daily Expense</span>
                                    <span className="text-lg font-black tracking-tight text-teal-500 mt-1 block">
                                        ৳{Math.round(quickStats.avgDaily).toLocaleString()}
                                    </span>
                                    <span className={`text-xs font-medium block ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                                        Per active day
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Visual Charts Grid Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Spending Category Share */}
                            <div className={`p-6 rounded-2xl border shadow-sm ${darkMode ? "bg-slate-900/60 border-slate-800/80 shadow-black/10" : "bg-white border-slate-100 shadow-slate-100/30"}`}>
                                <h2 className="text-base font-bold tracking-tight mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                    </svg>
                                    Category Weight
                                </h2>

                                <div className="space-y-4 max-h-[250px] overflow-y-auto pr-1">
                                    {categoryBreakdown.length === 0 ? (
                                        <div className="text-center py-12 text-sm text-slate-500">No active category data</div>
                                    ) : (
                                        categoryBreakdown.map(({ category, amount, percentage }) => {
                                            const style = getCategoryStyles(category);
                                            return (
                                                <div key={category} className="space-y-1.5">
                                                    <div className="flex items-center justify-between text-xs font-semibold">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`w-2.5 h-2.5 rounded-full ${style.bullet}`}></span>
                                                            <span className="font-bold">{category}</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className={darkMode ? "text-slate-450" : "text-slate-500"}>{percentage}%</span>
                                                            <span className="font-extrabold text-slate-200 dark:text-slate-100">৳{Math.round(amount).toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                    <div className={`w-full h-2.5 rounded-full overflow-hidden ${darkMode ? "bg-slate-800" : "bg-slate-100"}`}>
                                                        <div
                                                            style={{ width: `${percentage}%` }}
                                                            className={`h-full rounded-full transition-all duration-500 ${style.bullet}`}
                                                        ></div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            {/* Dynamic SVG Daily spending trend (Last 7 Days Chart) */}
                            <div className={`p-6 rounded-2xl border shadow-sm flex flex-col ${darkMode ? "bg-slate-900/60 border-slate-800/80 shadow-black/10" : "bg-white border-slate-100 shadow-slate-100/30"}`}>
                                <h2 className="text-base font-bold tracking-tight mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    Last 7 Days Spending Trend
                                </h2>

                                <div className="flex-1 flex items-end justify-between gap-2.5 pt-6 h-[200px]">
                                    {dailySpendingTrend.map((t) => (
                                        <div key={t.date} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                                            {/* Amount Hover Indicator Tooltip */}
                                            <div className="absolute bottom-full mb-2 scale-0 group-hover:scale-100 transition-all duration-150 origin-bottom px-2 py-1 rounded bg-slate-950 text-[10px] font-bold text-white z-10 border border-slate-800 whitespace-nowrap">
                                                ৳{Math.round(t.amount).toLocaleString()}
                                            </div>

                                            {/* Column Bar graphic */}
                                            <div
                                                style={{ height: `${t.heightPct}%` }}
                                                className={`w-full max-w-[28px] rounded-t-lg transition-all duration-500 ${t.amount > 0 ? "bg-gradient-to-t from-emerald-500 to-teal-450 hover:from-emerald-600 hover:to-teal-500" : darkMode ? "bg-slate-800" : "bg-slate-150"} shadow-md`}
                                            ></div>
                                            
                                            {/* Date label */}
                                            <span className={`text-[10px] font-bold mt-2 text-center select-none ${darkMode ? "text-slate-450" : "text-slate-500"}`}>
                                                {t.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                )}
        </>
    );
};

export default StatisticsView;
