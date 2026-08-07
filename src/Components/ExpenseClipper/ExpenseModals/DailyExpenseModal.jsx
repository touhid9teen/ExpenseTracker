import { XIcon } from "../../common/Icons";

export const DailyExpenseModal = ({
    selectedDailyDate,
    dailyModalDetails,
    darkMode,
    formatDate,
    getCategoryStyles,
    setSelectedDailyDate
}) => {
    return (
        <>
            {selectedDailyDate && dailyModalDetails && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xl transition-opacity duration-300">
                    <div className={`relative w-full max-w-xl cyber-cut-lg border-2 p-6 transform scale-100 transition-transform cyber-3d-lg cyber-inner-edge [--glow-3d-2:var(--violet-glow-soft)] ${
                        darkMode
                            ? "bg-slate-950 border-cyan-700/60"
                            : "bg-white border-cyan-400"
                    }`}>
                        <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 opacity-80 pointer-events-none" />
                        <div className="flex items-center justify-between border-b-2 pb-4 mb-4 border-cyan-500/25">
                            <div>
                                <h3 className={`text-lg font-bold tracking-tight font-black flex items-center gap-2 ${darkMode ? "text-cyan-300" : "text-cyan-600"}`}>
                                    {formatDate(dailyModalDetails.date)}
                                    <span className={`inline-block w-1.5 h-5 cyber-cut-sm bg-gradient-to-b ${darkMode ? "from-cyan-400 to-violet-500" : "from-cyan-500 to-violet-600"}`} />
                                </h3>
                                <span className={`text-xs font-medium block ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                                    {dailyModalDetails.count} transaction{dailyModalDetails.count !== 1 ? "s" : ""} on this day
                                </span>
                            </div>
                            <button
                                onClick={() => setSelectedDailyDate(null)}
                                className={`p-1.5 cyber-cut-sm transition-colors ${darkMode ? "hover:bg-slate-900 text-slate-400 hover:text-cyan-300" : "hover:bg-slate-100 text-slate-500 hover:text-cyan-600"}`}
                            >
                                <XIcon className="w-5.5 h-5.5" />
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[300px] overflow-y-auto mb-5 pr-1">
                            {dailyModalDetails.items.map((item) => {
                                const style = getCategoryStyles(item.category);
                                return (
                                    <div key={item.id} className={`p-3.5 cyber-cut-sm border-2 flex items-center justify-between gap-4 transition-all hover:translate-x-1 cyber-3d-sm ${
                                        darkMode ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-cyan-200/70"
                                    }`}>
                                        <div className="space-y-1 truncate max-w-[340px]">
                                            <p className={`text-sm font-bold truncate ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
                                                {item.description}
                                            </p>
                                            <span className={`inline-flex items-center gap-1 text-[9px] uppercase font-extrabold px-2 py-0.5 cyber-cut-sm border-2 ${style.bg}`}>
                                                {item.category}
                                            </span>
                                        </div>
                                        <span className={`font-black text-sm font-mono flex-shrink-0 ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>
                                            ৳{Math.round(item.amount).toLocaleString()}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="border-t-2 pt-4 border-cyan-500/20 flex items-center justify-between">
                            <span className={`font-bold text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>Total Expense of Day:</span>
                            <span className={`text-xl font-extrabold font-mono ${darkMode ? "text-cyan-400 neon-taka" : "text-cyan-600"}`}>৳{Math.round(dailyModalDetails.total).toLocaleString()}</span>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setSelectedDailyDate(null)}
                                className={`px-5 py-2.5 cyber-cut-sm text-xs font-bold transition-all border-2 ${
                                    darkMode
                                        ? "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800"
                                        : "bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200"
                                }`}
                            >
                                Close View
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
