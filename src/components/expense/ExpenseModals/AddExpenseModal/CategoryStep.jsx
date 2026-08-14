import { getCategoryIcon } from "../../../ui/categoryIcons";
import { fieldClass } from "../../../ui/ModalShell";

const labelClass = (darkMode) => `block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`;

/**
 * CategoryStep – pick a category from an icon grid, plus an optional note.
 * Tapping a category tile immediately advances to the amount step.
 */
const CategoryStep = ({
    darkMode,
    CATEGORIES,
    getCategoryStyles,
    addCategory,
    addDescription,
    setAddDescription,
    selectCategory
}) => (
    <div className="animate-fadeIn">
        <p className={labelClass(darkMode)}>What did you spend on?</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORIES.map((cat) => {
                const Icon = getCategoryIcon(cat);
                const styles = getCategoryStyles(cat);
                const isActive = cat === addCategory;
                return (
                    <button
                        key={cat}
                        type="button"
                        onClick={() => selectCategory(cat)}
                        className={`group flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 focus:outline-none ${
                            isActive
                                ? "border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/20"
                                : darkMode
                                ? "border-slate-700/70 bg-slate-800/40 hover:border-violet-500/50 hover:bg-slate-800/70"
                                : "border-slate-200 bg-slate-50 hover:border-violet-300 hover:bg-white"
                        }`}
                    >
                        <span className={`w-11 h-11 rounded-xl flex items-center justify-center ${styles.bg}`}>
                            <Icon className="w-6 h-6" />
                        </span>
                        <span className={`text-xs font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                            {cat}
                        </span>
                    </button>
                );
            })}
        </div>

        <div className="mt-5">
            <label className={labelClass(darkMode)}>
                Note <span className="font-medium normal-case tracking-normal opacity-70">(optional)</span>
            </label>
            <input
                type="text"
                placeholder="e.g. Rice, meat and vegetables"
                value={addDescription}
                onChange={(e) => setAddDescription(e.target.value)}
                className={fieldClass(darkMode)}
            />
        </div>
    </div>
);

export default CategoryStep;
