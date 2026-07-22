import { useMemo } from "react";
import toast from "react-hot-toast";
import { CATEGORIES } from "../data/expenseData";
import SUGGESTIONS from "../Components/ChatBot/suggestions";
import { formatDate, getDashboardDateLabels } from "../utils/dateUtils";
import { getDailyModalDetails } from "../utils/expenseCalculations";
import { useAuth } from "./useAuth";
import { useTheme } from "./useTheme";
import { useExpenses } from "./useExpenses";
import { useExpenseFilters } from "./useExpenseFilters";
import { useUIState } from "./useUIState";
import { useExpenseForm } from "./useExpenseForm";
import { useOnlineStatus } from "./useOnlineStatus";

/**
 * Composition layer that wires the focused hooks together and exposes
 * a single props object for the app shell. State ownership lives in:
 *  - useAuth           → user session
 *  - useTheme          → dark mode
 *  - useExpenses       → expense data + CRUD
 *  - useExpenseFilters → filters, sorting, pagination, derived stats
 *  - useUIState        → tabs, modals, menus, chat overlay
 *  - useExpenseForm    → quick-add form fields
 */
export const useExpenseClipper = () => {
    const theme = useTheme();
    const ui = useUIState();
    const isOnline = useOnlineStatus();

    const auth = useAuth({ onLogout: () => expensesApi.setExpenses([]) });
    const expensesApi = useExpenses(auth.user, isOnline);
    const filters = useExpenseFilters(expensesApi.expenses);

    const form = useExpenseForm(async (formValues) => {
        await expensesApi.addExpense(formValues);
        ui.setShowQuickAdd(false);
    });

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        const { editingExpense, setEditingExpense } = ui;
        if (!editingExpense?.description?.trim() || !editingExpense?.amount) {
            toast.error("Description and Amount are required.");
            return;
        }
        await expensesApi.updateExpense(editingExpense);
        setEditingExpense(null);
    };

    const handleConfirmDelete = async () => {
        if (!ui.deletingExpense) return;
        await expensesApi.deleteExpense(ui.deletingExpense.id);
        ui.setDeletingExpense(null);
    };

    const dashboardDateLabels = useMemo(() => getDashboardDateLabels(), []);
    const dailyModalDetails = useMemo(
        () => getDailyModalDetails(expensesApi.expenses, ui.selectedDailyDate),
        [expensesApi.expenses, ui.selectedDailyDate]
    );

    return {
        // Auth
        ...auth,

        // Theme
        ...theme,
        getCategoryStyles: theme.getCategoryStylesForTheme,

        // UI chrome (tabs, modals, menus, chat)
        ...ui,

        // Expense data + CRUD
        ...expensesApi,
        addExpenseDirect: (data) => expensesApi.addExpense(data, { quiet: true }),
        updateExpenseDirect: (data) => expensesApi.updateExpense(data, { quiet: true }),
        deleteExpenseDirect: (id) => expensesApi.deleteExpense(id, { quiet: true }),

        // Filters, sorting, pagination, derived stats
        ...filters,

        // Quick-add form
        ...form,
        handleSaveEdit,
        handleConfirmDelete,

        // Derived helpers + static data
        dashboardDateLabels,
        dateLabels: dashboardDateLabels,
        dailyModalDetails,
        formatDate,
        CATEGORIES,
        quickActionSuggestions: SUGGESTIONS,

        // Connectivity
        isOnline
    };
};
