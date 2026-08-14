import { CheckIcon, SpinnerIcon } from "../../../common/Icons";
import { ADD_STEPS } from "../../../../hooks/useExpenseForm";
import { ModalShell, ghostBtnClass, primaryBtnClass } from "../ModalShell";
import CategoryStep from "./CategoryStep";
import AmountStep from "./AmountStep";

const StepIndicator = ({ darkMode, active }) => (
    <div className="flex items-center gap-1.5 mb-5">
        <span className={`h-1.5 flex-1 rounded-full transition-colors ${active ? "bg-gradient-to-r from-violet-500 to-indigo-500" : darkMode ? "bg-slate-800" : "bg-slate-200"}`} />
        <span className={`h-1.5 flex-1 rounded-full transition-colors ${!active ? "bg-gradient-to-r from-violet-500 to-indigo-500" : darkMode ? "bg-slate-800" : "bg-slate-200"}`} />
    </div>
);

const dividerClass = (darkMode) => `flex justify-end gap-3 pt-5 mt-5 border-t ${darkMode ? "border-slate-800" : "border-slate-100"}`;

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
