import { SEED_EXPENSES } from "../data/expenseData";
import { getTodayInputValue } from "./dateUtils";

const EXPENSES_KEY = "My_Expenses";
const THEME_KEY = "theme";

const normalizeExpense = (item, index) => ({
    id: item.id || "legacy-" + index + "-" + Date.now(),
    item: item.item || item.description || "Untitled Expense",
    description: item.description || item.item || "No description",
    amount: Number(item.amount) || 0,
    date: item.date || getTodayInputValue(),
    category: item.category || "Others"
});

export const loadStoredExpenses = () => {
    const stored = localStorage.getItem(EXPENSES_KEY);
    if (!stored) {
        localStorage.setItem(EXPENSES_KEY, JSON.stringify(SEED_EXPENSES));
        return SEED_EXPENSES;
    }

    try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map(normalizeExpense);
        }

        localStorage.setItem(EXPENSES_KEY, JSON.stringify(SEED_EXPENSES));
        return SEED_EXPENSES;
    } catch (error) {
        console.error("Failed to parse stored expenses. Loading seeds.", error);
        return SEED_EXPENSES;
    }
};

export const saveStoredExpenses = (expenses) => {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
};

export const loadThemePreference = () => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) return savedTheme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

export const saveThemePreference = (darkMode) => {
    localStorage.setItem(THEME_KEY, darkMode ? "dark" : "light");
};
