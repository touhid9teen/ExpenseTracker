export const DailyTrendChart = ({ darkMode = true, dailySpendingTrend = [] }) => {
    return (
        <div className={`p-6 rounded-2xl border shadow-sm flex flex-col ${darkMode ? "bg-slate-900/60 border-slate-800/80 shadow-black/10" : "bg-white border-slate-100 shadow-slate-100/30"}`}>
            <h2 className="text-base font-bold tracking-tight mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                Last 7 Days Spending Trend
            </h2>
            <div className="flex-1 flex items-end justify-between gap-2.5 pt-6 h-[200px]">
                {dailySpendingTrend.map((t) => (
                    <div key={t.date} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                        <div className="absolute bottom-full mb-2 scale-0 group-hover:scale-100 transition-all duration-150 origin-bottom px-2 py-1 rounded bg-slate-950 text-[10px] font-bold text-white z-10 border border-slate-800 whitespace-nowrap">৳{Math.round(t.amount).toLocaleString()}</div>
                        <div style={{ height: `${t.heightPct}%` }} className={`w-full max-w-[28px] rounded-t-lg transition-all duration-500 ${t.amount > 0 ? "bg-gradient-to-t from-emerald-500 to-teal-450 hover:from-emerald-600 hover:to-teal-500" : darkMode ? "bg-slate-800" : "bg-slate-150"} shadow-md`}></div>
                        <span className={`text-[10px] font-bold mt-2 text-center select-none ${darkMode ? "text-slate-450" : "text-slate-500"}`}>{t.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
