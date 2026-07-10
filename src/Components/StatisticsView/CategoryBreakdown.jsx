import { ChartPieIcon } from "../common/Icons";

export const CategoryBreakdown = ({ darkMode = true, categoryBreakdown = [], getCategoryStyles = () => ({ bullet: "bg-slate-400" }) }) => {
    return (
        <div>
            <h2 className={`text-base font-bold tracking-tight mb-4 flex items-center gap-2 ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                <ChartPieIcon className="w-5 h-5 text-purple-500" />
                Category Weight
            </h2>
            <div className="bg-[#DCD3F7] p-5 rounded-tl-[48px] rounded-br-[48px] shadow-md shadow-black/15 space-y-4 max-h-[250px] overflow-y-auto">
                {categoryBreakdown.length === 0 ? (
                    <div className="text-center py-12 text-sm text-purple-700/60">No active category data</div>
                ) : (
                    categoryBreakdown.map(({ category, amount, percentage }) => {
                        const style = getCategoryStyles(category);
                        return (
                            <div key={category} className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs font-semibold">
                                    <div className="flex items-center gap-2"><span className={`w-2.5 h-2.5 rounded-full ${style.bullet}`}></span><span className="font-bold text-slate-800">{category}</span></div>
                                    <div className="flex gap-2"><span className="text-slate-600">{percentage}%</span><span className="font-extrabold text-slate-800">৳{Math.round(amount).toLocaleString()}</span></div>
                                </div>
                                <div className="w-full h-2.5 rounded-full overflow-hidden bg-white/50">
                                    <div style={{ width: `${percentage}%` }} className={`h-full rounded-full transition-all duration-500 ${style.bullet}`}></div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
