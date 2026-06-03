import { useEffect, useMemo, useState } from "react";
import toast from 'react-hot-toast';
import { CATEGORIES } from "../data/expenseData";
import { formatDate, getDashboardDateLabels, getTodayInputValue } from "../utils/dateUtils";
import { getCategoryStyles } from "../utils/categoryStyles";
import { loadThemePreference, saveThemePreference } from "../utils/storageUtils";
import {
    calculateCategoryBreakdown,
    calculateDailySpendingTrend,
    calculateQuickStats,
    calculateSummaryCards,
    filterAndSortExpenses,
    getDailyModalDetails,
    paginateExpenses,
    normalizeExpenseRecord
} from "../utils/expenseCalculations";

export const useExpenseClipper = () => {
    const [user, setUser] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [expenses, setExpenses] = useState([]);
    const [activeTab, setActiveTab] = useState("statistics");
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [activeDateFilter, setActiveDateFilter] = useState("all");
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");
    const [appliedCustomRange, setAppliedCustomRange] = useState(null);
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [selectedDailyDate, setSelectedDailyDate] = useState(null);
    const [editingExpense, setEditingExpense] = useState(null);
    const [deletingExpense, setDeletingExpense] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [darkMode, setDarkMode] = useState(true);
    const [addDate, setAddDate] = useState(getTodayInputValue());
    const [addAmount, setAddAmount] = useState("");
    const [addCategory, setAddCategory] = useState("Food");
    const [addDescription, setAddDescription] = useState("");
    const [specificDate, setSpecificDate] = useState("");

    useEffect(() => {
        const handleClickOutside = () => setOpenMenuId(null);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const authRes = await fetch("/api/auth/me");
                if (authRes.ok) {
                    const { user } = await authRes.json();
                    setUser(user);
                }
            } catch (error) {
                console.error("Failed to authenticate:", error);
            } finally {
                setIsAuthLoading(false);
            }
        };

        checkAuth();
        setDarkMode(loadThemePreference());
    }, []);

    useEffect(() => {
        const fetchExpenses = async () => {
            if (!user) return;
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
            }
        };

        fetchExpenses();
    }, [user]);

    const toggleTheme = () => {
        const nextTheme = !darkMode;
        setDarkMode(nextTheme);
        saveThemePreference(nextTheme);
    };

    const getCategoryStylesForTheme = (category) => getCategoryStyles(category, darkMode);

    const filteredExpenses = useMemo(
        () =>
            filterAndSortExpenses({
                expenses,
                searchQuery,
                categoryFilter,
                activeDateFilter,
                appliedCustomRange,
                specificDate,
                sortBy,
                sortOrder
            }),
        [expenses, searchQuery, categoryFilter, activeDateFilter, appliedCustomRange, specificDate, sortBy, sortOrder]
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, categoryFilter, activeDateFilter, appliedCustomRange, specificDate]);

    const summaryCards = useMemo(() => calculateSummaryCards(filteredExpenses), [filteredExpenses]);
    const quickStats = useMemo(() => calculateQuickStats(filteredExpenses), [filteredExpenses]);
    const categoryBreakdown = useMemo(() => calculateCategoryBreakdown(filteredExpenses), [filteredExpenses]);
    const dailySpendingTrend = useMemo(() => calculateDailySpendingTrend(filteredExpenses), [filteredExpenses]);
    const dashboardDateLabels = useMemo(() => getDashboardDateLabels(), []);

    const addExpenseDirect = async (expenseData) => {
        const newExpense = {
            id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
                toast.success("Expense added automatically!");
                return savedExpense;
            }
        } catch (error) {
            console.error("Failed to add expense", error);
        }
        return null;
    };

    const updateExpenseDirect = async (expenseData) => {
        try {
            const res = await fetch(`/api/expenses/${expenseData.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(expenseData)
            });
            if (res.ok) {
                const updatedExpense = normalizeExpenseRecord(await res.json());
                setExpenses((current) =>
                    current.map((exp) => (exp.id === updatedExpense.id ? updatedExpense : exp))
                );
                toast.success("Expense updated automatically!");
                return updatedExpense;
            }
        } catch (error) {
            console.error("Failed to update expense", error);
        }
        return null;
    };

    const deleteExpenseDirect = async (id) => {
        try {
            const res = await fetch(`/api/expenses/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                setExpenses((current) =>
                    current.filter((exp) => exp.id !== id)
                );
                toast.success("Expense deleted automatically!");
                return true;
            }
        } catch (error) {
            console.error("Failed to delete expense", error);
        }
        return false;
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        if (!addAmount || !addDescription.trim()) {
            toast.error("Please fill in the Amount and Description fields.");
            return;
        }

        const newExpense = {
            id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            description: addDescription.trim(),
            amount: parseFloat(addAmount),
            date: addDate,
            category: addCategory
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
                toast.success("Expense added successfully!");
            } else {
                toast.error("Failed to add expense.");
            }
        } catch (error) {
            console.error("Failed to add expense", error);
            toast.error("An error occurred while adding expense.");
        }

        setAddAmount("");
        setAddDescription("");
        setAddDate(getTodayInputValue());
        setAddCategory("Food");
        setShowQuickAdd(false);
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!editingExpense.description.trim() || !editingExpense.amount) {
            toast.error("Description and Amount are required.");
            return;
        }

        const expenseToUpdate = {
            ...editingExpense,
            description: editingExpense.description.trim(),
            amount: parseFloat(editingExpense.amount)
        };

        try {
            const res = await fetch(`/api/expenses/${editingExpense.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(expenseToUpdate)
            });
            if (res.ok) {
                const updatedExpense = normalizeExpenseRecord(await res.json());
                setExpenses((current) =>
                    current.map((exp) => (exp.id === updatedExpense.id ? updatedExpense : exp))
                );
                toast.success("Expense updated successfully!");
            } else {
                toast.error("Failed to update expense.");
            }
        } catch (error) {
            console.error("Failed to update expense", error);
            toast.error("An error occurred while updating expense.");
        }

        setEditingExpense(null);
    };

    const handleConfirmDelete = async () => {
        if (!deletingExpense) return;

        try {
            const res = await fetch(`/api/expenses/${deletingExpense.id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                setExpenses((current) =>
                    current.filter((exp) => exp.id !== deletingExpense.id)
                );
                toast.success("Expense deleted successfully!");
            } else {
                toast.error("Failed to delete expense.");
            }
        } catch (error) {
            console.error("Failed to delete expense", error);
            toast.error("An error occurred while deleting expense.");
        }

        setDeletingExpense(null);
    };

    const handleResetFilters = () => {
        setSearchQuery("");
        setCategoryFilter("All");
        setActiveDateFilter("all");
        setCustomStart("");
        setCustomEnd("");
        setAppliedCustomRange(null);
        setSpecificDate("");
        setSortBy("date");
        setSortOrder("desc");
        setCurrentPage(1);
    };

    const handleApplyCustomRange = () => {
        if (!customStart || !customEnd) {
            toast.error("Please select both Start and End dates.");
            return;
        }
        if (new Date(customStart) > new Date(customEnd)) {
            toast.error("Start Date cannot be after End Date.");
            return;
        }
        setAppliedCustomRange({ start: customStart, end: customEnd });
        setActiveDateFilter("custom");
    };

    const totalPages = Math.max(1, Math.ceil(filteredExpenses.length / itemsPerPage));
    const paginatedExpenses = useMemo(
        () => paginateExpenses(filteredExpenses, currentPage, itemsPerPage),
        [filteredExpenses, currentPage, itemsPerPage]
    );
    const dailyModalDetails = useMemo(
        () => getDailyModalDetails(expenses, selectedDailyDate),
        [expenses, selectedDailyDate]
    );

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            setUser(null);
            setExpenses([]);
            toast.success("Logged out successfully!");
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Failed to log out.");
        }
    };

    return {
        user,
        setUser,
        isAuthLoading,
        handleLogout,
        expenses,
        setExpenses,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        categoryFilter,
        setCategoryFilter,
        activeDateFilter,
        setActiveDateFilter,
        customStart,
        setCustomStart,
        customEnd,
        setCustomEnd,
        appliedCustomRange,
        setAppliedCustomRange,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        showQuickAdd,
        setShowQuickAdd,
        selectedDailyDate,
        setSelectedDailyDate,
        editingExpense,
        setEditingExpense,
        deletingExpense,
        setDeletingExpense,
        openMenuId,
        setOpenMenuId,
        darkMode,
        setDarkMode,
        addDate,
        setAddDate,
        addAmount,
        setAddAmount,
        addCategory,
        setAddCategory,
        addDescription,
        setAddDescription,
        specificDate,
        setSpecificDate,
        toggleTheme,
        getCategoryStylesForTheme,
        getCategoryStyles: getCategoryStylesForTheme,
        filteredExpenses,
        summaryCards,
        quickStats,
        categoryBreakdown,
        dailySpendingTrend,
        dashboardDateLabels,
        dateLabels: dashboardDateLabels,
        handleAddExpense,
        handleSaveEdit,
        handleConfirmDelete,
        handleResetFilters,
        handleApplyCustomRange,
        addExpenseDirect,
        updateExpenseDirect,
        deleteExpenseDirect,
        totalPages,
        paginatedExpenses,
        dailyModalDetails,
        formatDate,
        CATEGORIES
    };
};
