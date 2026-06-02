export const CategoryBreakdown = ({ darkMode = true, categoryBreakdown = [], getCategoryStyles = () => ({ bullet: "bg-slate-400" }) }) => {
    return (
        <div className={`p-6 rounded-2xl border shadow-sm ${darkMode ? "bg-slate-900/60 border-slate-800/80 shadow-black/10" : "bg-white border-slate-100 shadow-slate-100/30"}`}>
            <h2 className="text-base font-bold tracking-tight mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /></svg>
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
                                    <div className="flex items-center gap-2"><span className={`w-2.5 h-2.5 rounded-full ${style.bullet}`}></span><span className="font-bold">{category}</span></div>
                                    <div className="flex gap-2"><span className={darkMode ? "text-slate-450" : "text-slate-500"}>{percentage}%</span><span className="font-extrabold text-slate-200 dark:text-slate-100">৳{Math.round(amount).toLocaleString()}</span></div>
                                </div>
                                <div className={`w-full h-2.5 rounded-full overflow-hidden ${darkMode ? "bg-slate-800" : "bg-slate-100"}`}>
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
