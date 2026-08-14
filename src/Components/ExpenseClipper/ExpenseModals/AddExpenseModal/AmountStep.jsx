import { getCategoryIcon } from "../../../common/categoryIcons";
import { fieldClass } from "../ModalShell";

const labelClass = (darkMode) => `block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`;

/**
 * AmountStep – enter the amount (and date) for the chosen category.
 */
const AmountStep = ({
    darkMode,
    addCategory,
    getCategoryStyles,
    addAmount,
    setAddAmount,
    addDate,
    setAddDate
}) => {
    const Icon = getCategoryIcon(addCategory);
    const styles = getCategoryStyles(addCategory);
    return (
        <div className="animate-fadeIn space-y-5">
            <div className={`flex items-center gap-3 p-3 rounded-xl border ${darkMode ? "bg-slate-800/50 border-slate-700/70" : "bg-slate-50 border-slate-200"}`}>
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${styles.bg}`}>
                    <Icon className="w-5 h-5" />
                </span>
                <div>
                    <p className={`text-[11px] uppercase tracking-wider font-bold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Category</p>
                    <p className={`text-sm font-bold ${darkMode ? "text-slate-200" : "text-slate-700"}`}>{addCategory}</p>
                </div>
            </div>

            <div>
                <label className={labelClass(darkMode)}>Amount (৳)</label>
                <div className="relative">
                    <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black pointer-events-none ${darkMode ? "text-violet-400" : "text-violet-500"}`}>৳</span>
                    <input
                        type="number"
                        required
                        min="0.01"
                        step="0.01"
                        autoFocus
                        placeholder="0.00"
                        value={addAmount}
                        onChange={(e) => setAddAmount(e.target.value)}
                        className={`w-full pl-12 pr-4 py-3.5 rounded-xl border text-2xl font-black font-mono outline-none transition-colors ${
                            darkMode
                                ? "bg-slate-800/70 border-slate-700 text-violet-300 placeholder-slate-600 focus:border-violet-500"
                                : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-300 focus:border-violet-400"
                        }`}
                    />
                </div>
            </div>

            <div>
                <label className={labelClass(darkMode)}>Date</label>
                <input
                    type="date"
                    required
                    value={addDate}
                    onChange={(e) => setAddDate(e.target.value)}
                    className={fieldClass(darkMode)}
                />
            </div>
        </div>
    );
};

export default AmountStep;
