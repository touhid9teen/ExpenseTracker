import { ChartTrendDownIcon } from "../Icons";

export const DailyTrendChart = ({ darkMode = true, dailySpendingTrend = [] }) => {
    return (
        <div>
            <h2 className={`text-base font-bold tracking-tight mb-4 flex items-center gap-2 ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                <ChartTrendDownIcon className="w-5 h-5 text-teal-400" />
                Last 7 Days Spending Trend
            </h2>
            <div className="bg-[#C9E4F9] p-5 rounded-tl-[48px] rounded-br-[48px] shadow-md shadow-black/15 flex flex-col">
                <div className="flex items-end justify-between gap-2.5 pt-6 h-[200px]">
                    {dailySpendingTrend.map((t) => (
                        <div key={t.date} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                            <div className="absolute bottom-full mb-2 scale-0 group-hover:scale-100 transition-all duration-150 origin-bottom px-2 py-1 rounded bg-slate-800 text-[10px] font-bold text-white z-10 whitespace-nowrap">৳{Math.round(t.amount).toLocaleString()}</div>
                            <div style={{ height: `${t.heightPct}%` }} className={`w-full max-w-[28px] rounded-t-lg transition-all duration-500 ${t.amount > 0 ? "bg-gradient-to-t from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700" : "bg-slate-300/50"} shadow-md`}></div>
                            <span className="text-[10px] font-bold mt-2 text-center select-none text-sky-700">{t.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
