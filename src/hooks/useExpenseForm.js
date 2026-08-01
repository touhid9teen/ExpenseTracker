import { useState } from "react";
import toast from "react-hot-toast";
import { getTodayInputValue } from "../utils/dateUtils";

const DEFAULT_CATEGORY = "Food";

// The wizard's two steps.
export const ADD_STEPS = {
    CATEGORY: "category",
    AMOUNT: "amount"
};

/**
 * Owns the multi-step add-expense wizard: which step is active, the collected
 * fields, and step navigation. The flow is:
 *   1. CATEGORY — pick a category (icon grid) + optional description
 *   2. AMOUNT   — enter the amount + date, then submit
 *
 * `onSubmit` receives the collected values; the wizard resets afterwards.
 * Description is optional in the UI — when left blank it falls back to the
 * category name so the persisted record always has one.
 */
export const useExpenseForm = (onSubmit) => {
    const [addStep, setAddStep] = useState(ADD_STEPS.CATEGORY);
    const [addDate, setAddDate] = useState(getTodayInputValue());
    const [addAmount, setAddAmount] = useState("");
    const [addCategory, setAddCategory] = useState(DEFAULT_CATEGORY);
    const [addDescription, setAddDescription] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const resetForm = () => {
        setAddStep(ADD_STEPS.CATEGORY);
        setAddAmount("");
        setAddDescription("");
        setAddDate(getTodayInputValue());
        setAddCategory(DEFAULT_CATEGORY);
        setIsSaving(false);
    };

    // Step 1 → 2: lock in the chosen category and advance.
    const selectCategory = (category) => {
        setAddCategory(category);
        setAddStep(ADD_STEPS.AMOUNT);
    };

    const goToCategoryStep = () => setAddStep(ADD_STEPS.CATEGORY);
    const goToAmountStep = () => setAddStep(ADD_STEPS.AMOUNT);

    const handleAddExpense = async (e) => {
        e?.preventDefault?.();
        if (isSaving) return;

        const amountValue = parseFloat(addAmount);
        if (!addAmount || Number.isNaN(amountValue) || amountValue <= 0) {
            toast.error("Please enter a valid amount.");
            return;
        }

        setIsSaving(true);
        try {
            await onSubmit({
                description: addDescription.trim() || addCategory,
                amount: addAmount,
                date: addDate,
                category: addCategory
            });
            resetForm();
        } finally {
            setIsSaving(false);
        }
    };

    return {
        addStep,
        setAddStep,
        selectCategory,
        goToCategoryStep,
        goToAmountStep,
        addDate,
        setAddDate,
        addAmount,
        setAddAmount,
        addCategory,
        setAddCategory,
        addDescription,
        setAddDescription,
        isSaving,
        resetForm,
        handleAddExpense
    };
};
