import { useState } from "react";
import toast from "react-hot-toast";
import { getTodayInputValue } from "../utils/dateUtils";

const DEFAULT_CATEGORY = "Food";

/**
 * Owns the quick-add expense form fields and submit handling.
 * `onSubmit` receives the collected form values; the form resets afterwards.
 */
export const useExpenseForm = (onSubmit) => {
    const [addDate, setAddDate] = useState(getTodayInputValue());
    const [addAmount, setAddAmount] = useState("");
    const [addCategory, setAddCategory] = useState(DEFAULT_CATEGORY);
    const [addDescription, setAddDescription] = useState("");

    const resetForm = () => {
        setAddAmount("");
        setAddDescription("");
        setAddDate(getTodayInputValue());
        setAddCategory(DEFAULT_CATEGORY);
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        if (!addAmount || !addDescription.trim()) {
            toast.error("Please fill in the Amount and Description fields.");
            return;
        }

        await onSubmit({
            description: addDescription,
            amount: addAmount,
            date: addDate,
            category: addCategory
        });

        resetForm();
    };

    return {
        addDate,
        setAddDate,
        addAmount,
        setAddAmount,
        addCategory,
        setAddCategory,
        addDescription,
        setAddDescription,
        resetForm,
        handleAddExpense
    };
};
