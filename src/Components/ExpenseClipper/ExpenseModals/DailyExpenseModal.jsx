import { CalendarIcon } from "../../common/Icons";
import { ModalShell, ghostBtnClass } from "./ModalShell";

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
                <ModalShell
                    darkMode={darkMode}
                    onClose={() => setSelectedDailyDate(null)}
                    title={formatDate(dailyModalDetails.date)}
                    subtitle={`${dailyModalDetails.count} transaction${dailyModalDetails.count !== 1 ? "s" : ""} on this day`}
                    icon={<CalendarIcon className="w-5 h-5" />}
                    maxWidth="max-w-xl"
                >
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                        {dailyModalDetails.items.map((item) => {
                            const style = getCategoryStyles(item.category);
                            return (
                                <div
                                    key={item.id}
                                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-all hover:translate-x-1 ${
                                        darkMode ? "bg-slate-800/50 border-slate-700/70" : "bg-slate-50 border-slate-200"
                                    }`}
                                >
                                    <div className="space-y-1.5 truncate max-w-[340px]">
                                        <p className={`text-sm font-bold truncate ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
                                            {item.description}
                                        </p>
                                        <span className={`inline-flex items-center gap-1 text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-md ${style.bg}`}>
                                            {item.category}
                                        </span>
                                    </div>
                                    <span className={`font-black text-sm font-mono flex-shrink-0 ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                                        ৳{Math.round(item.amount).toLocaleString()}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div className={`border-t pt-4 mt-5 flex items-center justify-between ${darkMode ? "border-slate-800" : "border-slate-100"}`}>
                        <span className={`font-bold text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>Total Expense of Day:</span>
                        <span className={`text-xl font-extrabold font-mono ${darkMode ? "text-violet-300" : "text-violet-600"}`}>৳{Math.round(dailyModalDetails.total).toLocaleString()}</span>
                    </div>

                    <div className="mt-5 flex justify-end">
                        <button
                            onClick={() => setSelectedDailyDate(null)}
                            className={ghostBtnClass(darkMode)}
                        >
                            Close View
                        </button>
                    </div>
                </ModalShell>
            )}
        </>
    );
};
