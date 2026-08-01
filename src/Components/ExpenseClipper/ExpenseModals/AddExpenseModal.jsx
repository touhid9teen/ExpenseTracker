import { XIcon, ChevronLeftIcon, CheckIcon, SpinnerIcon } from "../../common/Icons";
import { getCategoryIcon } from "../../common/categoryIcons";
import { ADD_STEPS } from "../../../hooks/useExpenseForm";

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
        <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            What did you spend on?
        </p>
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
                        className={`group flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-2xl border transition-all duration-200 hover:scale-[1.03] active:scale-95 focus:outline-none ${
                            isActive
                                ? "border-amber-500 ring-2 ring-amber-500/30"
                                : darkMode
                                ? "border-slate-800 hover:border-slate-700 bg-slate-800/40"
                                : "border-slate-200 hover:border-slate-300 bg-slate-50"
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
            <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Note <span className="font-medium normal-case tracking-normal opacity-70">(optional)</span>
            </label>
            <input
                type="text"
                placeholder="e.g. Rice, meat and vegetables"
                value={addDescription}
                onChange={(e) => setAddDescription(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all ${
                    darkMode
                        ? "bg-[#1e293b] border-slate-700 text-slate-150 placeholder-slate-500"
                        : "bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400"
                }`}
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
            <div className={`flex items-center gap-3 p-3 rounded-2xl ${darkMode ? "bg-slate-800/50" : "bg-slate-50"}`}>
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${styles.bg}`}>
                    <Icon className="w-5 h-5" />
                </span>
                <div>
                    <p className={`text-[11px] uppercase tracking-wider font-bold ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Category</p>
                    <p className={`text-sm font-bold ${darkMode ? "text-slate-200" : "text-slate-700"}`}>{addCategory}</p>
                </div>
            </div>

            <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Amount (৳)
                </label>
                <div className="relative">
                    <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black pointer-events-none ${darkMode ? "text-slate-600" : "text-slate-300"}`}>৳</span>
                    <input
                        type="number"
                        required
                        min="0.01"
                        step="0.01"
                        autoFocus
                        placeholder="0.00"
                        value={addAmount}
                        onChange={(e) => setAddAmount(e.target.value)}
                        className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all ${
                            darkMode
                                ? "bg-[#1e293b] border-slate-700 text-slate-100 placeholder-slate-600"
                                : "bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-300"
                        }`}
                    />
                </div>
            </div>

            <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Date
                </label>
                <input
                    type="date"
                    required
                    value={addDate}
                    onChange={(e) => setAddDate(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all ${
                        darkMode
                            ? "bg-[#1e293b] border-slate-700 text-slate-150"
                            : "bg-slate-50 border-slate-300 text-slate-800"
                    }`}
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
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/65 backdrop-blur-sm"
            onClick={close}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`w-full max-w-lg rounded-t-3xl sm:rounded-2xl border shadow-2xl p-6 transform transition-all animate-fadeIn ${
                    darkMode ? "bg-slate-900 border-slate-800 shadow-black/40" : "bg-white border-slate-200 shadow-slate-300/50"
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-4 mb-5 border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        {!onCategoryStep && (
                            <button
                                onClick={goToCategoryStep}
                                aria-label="Back"
                                className={`p-1.5 rounded-lg transition-colors ${darkMode ? "hover:bg-slate-800 text-slate-400 hover:text-slate-200" : "hover:bg-slate-100 text-slate-500 hover:text-slate-700"}`}
                            >
                                <ChevronLeftIcon className="w-5 h-5" />
                            </button>
                        )}
                        <div>
                            <h3 className="text-lg font-bold tracking-tight">
                                {onCategoryStep ? "Add Expense" : "Enter Amount"}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-1">
                                <span className={`h-1.5 w-6 rounded-full transition-colors ${onCategoryStep ? "bg-amber-500" : darkMode ? "bg-slate-700" : "bg-slate-200"}`} />
                                <span className={`h-1.5 w-6 rounded-full transition-colors ${!onCategoryStep ? "bg-amber-500" : darkMode ? "bg-slate-700" : "bg-slate-200"}`} />
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={close}
                        aria-label="Close"
                        className={`p-1.5 rounded-lg transition-colors ${darkMode ? "hover:bg-slate-800 text-slate-400 hover:text-slate-200" : "hover:bg-slate-100 text-slate-500 hover:text-slate-700"}`}
                    >
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                {onCategoryStep ? (
                    <CategoryStep
                        darkMode={darkMode}
                        CATEGORIES={CATEGORIES}
                        getCategoryStyles={getCategoryStyles}
                        addCategory={addCategory}
                        addDescription={addDescription}
                        setAddDescription={setAddDescription}
                        selectCategory={selectCategory}
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
                        <div className="flex justify-end gap-3 pt-5 mt-5 border-t border-slate-200 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={goToCategoryStep}
                                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${darkMode ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-100 border-slate-300 text-slate-650"}`}
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={isAddingExpense}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all shadow-md focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isAddingExpense ? <SpinnerIcon className="w-4 h-4 text-white" /> : <CheckIcon className="w-4 h-4" strokeWidth={3} />}
                                {isAddingExpense ? "Saving..." : "Save Expense"}
                            </button>
                        </div>
                    </form>
                )}

                {/* Category-step footer: advance only after a category is chosen */}
                {onCategoryStep && (
                    <div className="flex justify-end pt-5 mt-5 border-t border-slate-200 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={goToAmountStep}
                            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all shadow-md focus:outline-none"
                        >
                            Continue →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
