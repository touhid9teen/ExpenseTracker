import { ChartPieIcon } from "../common/Icons";
import { cardSurface } from "./cardStyles";

export const CategoryBreakdown = ({ darkMode = true, categoryBreakdown = [], getCategoryStyles = () => ({ bullet: "bg-slate-400" }) }) => {
    return (
        <div>
            <h2 className={`text-base font-bold tracking-tight mb-4 flex items-center gap-2 ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                <ChartPieIcon className="w-5 h-5 text-purple-500" />
                Category Weight
            </h2>
            <div className={`p-5 rounded-tl-[48px] rounded-br-[48px] space-y-4 max-h-[250px] overflow-y-auto ${cardSurface("purple", darkMode)}`}>
                {categoryBreakdown.length === 0 ? (
                    <div className={`text-center py-12 text-sm ${darkMode ? "text-slate-500" : "text-slate-400"}`}>No active category data</div>
                ) : (
                    categoryBreakdown.map(({ category, amount, percentage }) => {
                        const style = getCategoryStyles(category);
                        return (
                            <div key={category} className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs font-semibold">
                                    <div className="flex items-center gap-2"><span className={`w-2.5 h-2.5 rounded-full ${style.bullet}`}></span><span className={`font-bold ${darkMode ? "text-slate-200" : "text-slate-800"}`}>{category}</span></div>
                                    <div className="flex gap-2"><span className={darkMode ? "text-slate-400" : "text-slate-500"}>{percentage}%</span><span className={`font-extrabold ${darkMode ? "text-slate-100" : "text-slate-800"}`}>৳{Math.round(amount).toLocaleString()}</span></div>
                                </div>
                                <div className={`w-full h-2.5 rounded-full overflow-hidden ${darkMode ? "bg-slate-700/60" : "bg-slate-100"}`}>
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
