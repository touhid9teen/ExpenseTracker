import { CheckIcon, SpinnerIcon } from "../../common/Icons";
import { getCategoryIcon } from "../../common/categoryIcons";
import { ADD_STEPS } from "../../../hooks/useExpenseForm";
import { ModalShell, fieldClass, ghostBtnClass, primaryBtnClass } from "./ModalShell";

const StepIndicator = ({ darkMode, active }) => (
    <div className="flex items-center gap-1.5 mb-5">
        <span className={`h-1.5 flex-1 rounded-full transition-colors ${active ? "bg-gradient-to-r from-violet-500 to-indigo-500" : darkMode ? "bg-slate-800" : "bg-slate-200"}`} />
        <span className={`h-1.5 flex-1 rounded-full transition-colors ${!active ? "bg-gradient-to-r from-violet-500 to-indigo-500" : darkMode ? "bg-slate-800" : "bg-slate-200"}`} />
    </div>
);

const labelClass = (darkMode) => `block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`;

const dividerClass = (darkMode) => `flex justify-end gap-3 pt-5 mt-5 border-t ${darkMode ? "border-slate-800" : "border-slate-100"}`;

// Step 1 — pick a category from an icon grid, plus an optional note. Tapping a
// category tile immediately advances to the amount step.
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

// Step 2 — enter the amount (and date) for the chosen category, then save.
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

export const AddExpenseModal = ({
    showQuickAdd,
    setShowQuickAdd,
    darkMode,
    CATEGORIES,
    getCategoryStyles,
    addStep,
    goToAmountStep,
    goToCategoryStep,
    selectCategory,
    addCategory,
    addDescription,
    setAddDescription,
    addAmount,
    setAddAmount,
    addDate,
    setAddDate,
    handleAddExpense,
    isAddingExpense,
    closeAddModal
}) => {
    if (!showQuickAdd) return null;

    const onCategoryStep = addStep === ADD_STEPS.CATEGORY;
    const close = closeAddModal ?? (() => setShowQuickAdd(false));

    return (
        <ModalShell
            darkMode={darkMode}
            onClose={close}
            onBack={!onCategoryStep ? goToCategoryStep : null}
            title={onCategoryStep ? "Add Expense" : "Enter Amount"}
            subtitle={onCategoryStep ? "Pick a category to continue" : "How much did you spend?"}
        >
            <StepIndicator darkMode={darkMode} active={onCategoryStep} />

            {onCategoryStep ? (
                <CategoryStep
                    darkMode={darkMode}
                    CATEGORIES={CATEGORIES}
                    getCategoryStyles={getCategoryStyles}
                    addCategory={addCategory}
                    addDescription={addDescription}
                    setAddDescription={setAddDescription}
                    selectCategory={selectCategory}
                    goToAmountStep={goToAmountStep}
                />
            ) : (
                <form onSubmit={handleAddExpense}>
                    <AmountStep
                        darkMode={darkMode}
                        addCategory={addCategory}
                        getCategoryStyles={getCategoryStyles}
                        addAmount={addAmount}
                        setAddAmount={setAddAmount}
                        addDate={addDate}
                        setAddDate={setAddDate}
                    />
                    <div className={dividerClass(darkMode)}>
                        <button
                            type="button"
                            onClick={goToCategoryStep}
                            className={ghostBtnClass(darkMode)}
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            disabled={isAddingExpense}
                            className={primaryBtnClass}
                        >
                            {isAddingExpense ? <SpinnerIcon className="w-4 h-4 text-white" /> : <CheckIcon className="w-4 h-4" strokeWidth={3} />}
                            {isAddingExpense ? "Saving..." : "Save Expense"}
                        </button>
                    </div>
                </form>
            )}

            {/* Category-step footer: advance only after a category is chosen */}
            {onCategoryStep && (
                <div className={dividerClass(darkMode)}>
                    <button
                        type="button"
                        onClick={goToAmountStep}
                        className={primaryBtnClass}
                    >
                        Continue →
                    </button>
                </div>
            )}
        </ModalShell>
    );
};
