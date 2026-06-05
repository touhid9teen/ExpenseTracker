import { XIcon } from "../Icons";

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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm transition-opacity duration-300">
                    <div className={`w-full max-w-xl rounded-2xl border shadow-2xl p-6 transform scale-100 transition-transform ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
                        <div className="flex items-center justify-between border-b pb-4 mb-4 border-slate-200 dark:border-slate-800">
                            <div>
                                <h3 className="text-lg font-bold tracking-tight text-emerald-500 font-black">
                                    {formatDate(dailyModalDetails.date)}
                                </h3>
                                <span className={`text-xs font-medium block ${darkMode ? "text-slate-400" : "text-slate-555"}`}>
                                    {dailyModalDetails.count} transaction{dailyModalDetails.count !== 1 ? "s" : ""} on this day
                                </span>
                            </div>
                            <button
                                onClick={() => setSelectedDailyDate(null)}
                                className={`p-1.5 rounded-lg transition-colors ${darkMode ? "hover:bg-slate-800 text-slate-400 hover:text-slate-200" : "hover:bg-slate-100 text-slate-500 hover:text-slate-700"}`}
                            >
                                <XIcon className="w-5.5 h-5.5" />
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[300px] overflow-y-auto mb-5 pr-1">
                            {dailyModalDetails.items.map((item) => {
                                const style = getCategoryStyles(item.category);
                                return (
                                    <div key={item.id} className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 ${darkMode ? "bg-slate-800/35 border-slate-850" : "bg-slate-50 border-slate-150"}`}>
                                        <div className="space-y-1 truncate max-w-[340px]">
                                            <p className={`text-sm font-bold truncate ${darkMode ? "text-slate-200" : "text-slate-750"}`}>
                                                {item.description}
                                            </p>
                                            <span className={`inline-flex items-center gap-1 text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full border ${style.bg}`}>
                                                {item.category}
                                            </span>
                                        </div>
                                        <span className="font-black text-sm text-emerald-500 flex-shrink-0">
                                            ৳{Math.round(item.amount).toLocaleString()}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="border-t pt-4 border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <span className={`font-bold text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Total Expense of Day:</span>
                            <span className="text-xl font-extrabold text-emerald-500">৳{Math.round(dailyModalDetails.total).toLocaleString()}</span>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setSelectedDailyDate(null)}
                                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${darkMode ? "bg-slate-800 border-slate-700 text-slate-250 hover:bg-slate-750" : "bg-slate-100 border-slate-200 text-slate-650 hover:bg-slate-200"}`}
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
