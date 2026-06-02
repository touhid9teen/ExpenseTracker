import { useEffect, useMemo, useState } from "react";
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

    useEffect(() => {
        const handleClickOutside = () => setOpenMenuId(null);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchExpenses = async () => {
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
        setDarkMode(loadThemePreference());
    }, []);

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
                sortBy,
                sortOrder
            }),
        [expenses, searchQuery, categoryFilter, activeDateFilter, appliedCustomRange, sortBy, sortOrder]
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, categoryFilter, activeDateFilter, appliedCustomRange]);

    const summaryCards = useMemo(() => calculateSummaryCards(filteredExpenses), [filteredExpenses]);
    const quickStats = useMemo(() => calculateQuickStats(filteredExpenses), [filteredExpenses]);
    const categoryBreakdown = useMemo(() => calculateCategoryBreakdown(filteredExpenses), [filteredExpenses]);
    const dailySpendingTrend = useMemo(() => calculateDailySpendingTrend(filteredExpenses), [filteredExpenses]);
    const dashboardDateLabels = useMemo(() => getDashboardDateLabels(), []);

    const handleAddExpense = async (e) => {
        e.preventDefault();
        if (!addAmount || !addDescription.trim()) {
            alert("Please fill in the Amount and Description fields.");
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
            }
        } catch (error) {
            console.error("Failed to add expense", error);
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
            alert("Description and Amount are required.");
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
            }
        } catch (error) {
            console.error("Failed to update expense", error);
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
            }
        } catch (error) {
            console.error("Failed to delete expense", error);
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
        setSortBy("date");
        setSortOrder("desc");
        setCurrentPage(1);
    };

    const handleApplyCustomRange = () => {
        if (!customStart || !customEnd) {
            alert("Please select both Start and End dates.");
            return;
        }
        if (new Date(customStart) > new Date(customEnd)) {
            alert("Start Date cannot be after End Date.");
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

    return {
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
        totalPages,
        paginatedExpenses,
        dailyModalDetails,
        formatDate,
        CATEGORIES
    };
};
