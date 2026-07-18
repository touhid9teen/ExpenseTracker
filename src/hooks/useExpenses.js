import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getTodayInputValue } from "../utils/dateUtils";
import { normalizeExpenseRecord } from "../utils/expenseCalculations";

const generateExpenseId = () =>
    `exp-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

/**
 * Owns the expense list: fetching for the current user and CRUD operations.
 * The `quiet` flag switches toast copy for chatbot-triggered ("automatic") actions.
 */
export const useExpenses = (user) => {
    const [expenses, setExpenses] = useState([]);
    const [isExpensesLoading, setIsExpensesLoading] = useState(false);

    useEffect(() => {
        const fetchExpenses = async () => {
            if (!user) return;
            setIsExpensesLoading(true);
            try {
                const response = await fetch("/api/expenses");
                if (response.ok) {
                    const data = await response.json();
                    const formattedData = Array.isArray(data)
                        ? data.map((exp) =>
                              normalizeExpenseRecord({
                                  ...exp,
                                  date: exp.date ? String(exp.date).split("T")[0] : ""
                              })
                          )
                        : [];
                    setExpenses(formattedData);
                }
            } catch (error) {
                console.error("Failed to fetch expenses:", error);
                toast.error("Failed to load expenses.");
            } finally {
                setIsExpensesLoading(false);
            }
        };

        fetchExpenses();
    }, [user]);

    const addExpense = async (expenseData, { quiet = false } = {}) => {
        const newExpense = {
            id: generateExpenseId(),
            description: expenseData.description.trim(),
            amount: parseFloat(expenseData.amount),
            date: expenseData.date || getTodayInputValue(),
            category: expenseData.category || "Other"
        };
        try {
            const res = await fetch("/api/expenses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newExpense)
            });
            if (res.ok) {
                const savedExpense = normalizeExpenseRecord(await res.json());
                setExpenses((current) => [savedExpense, ...current]);
                toast.success(quiet ? "Expense added automatically!" : "Expense added successfully!");
                return savedExpense;
            }
            toast.error("Failed to add expense.");
        } catch (error) {
            console.error("Failed to add expense", error);
            toast.error("An error occurred while adding expense.");
        }
        return null;
    };

    const updateExpense = async (expenseData, { quiet = false } = {}) => {
        const expenseToUpdate = {
            ...expenseData,
            description: expenseData.description?.trim(),
            amount: parseFloat(expenseData.amount)
        };
        try {
            const res = await fetch(`/api/expenses/${expenseToUpdate.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(expenseToUpdate)
            });
            if (res.ok) {
                const updatedExpense = normalizeExpenseRecord(await res.json());
                setExpenses((current) =>
                    current.map((exp) => (exp.id === updatedExpense.id ? updatedExpense : exp))
                );
                toast.success(quiet ? "Expense updated automatically!" : "Expense updated successfully!");
                return updatedExpense;
            }
            toast.error("Failed to update expense.");
        } catch (error) {
            console.error("Failed to update expense", error);
            toast.error("An error occurred while updating expense.");
        }
        return null;
    };

    const deleteExpense = async (id, { quiet = false } = {}) => {
        try {
            const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
            if (res.ok) {
                setExpenses((current) => current.filter((exp) => exp.id !== id));
                toast.success(quiet ? "Expense deleted automatically!" : "Expense deleted successfully!");
                return true;
            }
            toast.error("Failed to delete expense.");
        } catch (error) {
            console.error("Failed to delete expense", error);
            toast.error("An error occurred while deleting expense.");
        }
        return false;
    };

    return {
        expenses,
        setExpenses,
        isExpensesLoading,
        addExpense,
        updateExpense,
        deleteExpense
    };
};
