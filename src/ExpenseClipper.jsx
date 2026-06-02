import { useEffect, useState, useMemo } from "react";
import AppHeader from "./Components/AppHeader";
import FilterAlert from "./Components/FilterAlert";
import StatisticsView from "./Components/StatisticsView";
import LedgerView from "./Components/LedgerView";
import { DailyExpenseModal, EditExpenseModal, DeleteExpenseModal } from "./Components/ExpenseModals";
import { CATEGORIES } from "./data/expenseData";
import { formatDate, getDashboardDateLabels, getTodayInputValue } from "./utils/dateUtils";
import { getCategoryStyles } from "./utils/categoryStyles";
import { loadStoredExpenses, loadThemePreference, saveStoredExpenses, saveThemePreference } from "./utils/storageUtils";
import {
    calculateCategoryBreakdown,
    calculateDailySpendingTrend,
    calculateQuickStats,
    calculateSummaryCards,
    filterAndSortExpenses,
    getDailyModalDetails,
    paginateExpenses
} from "./utils/expenseCalculations";

const ExpenseClipper = () => {
    // ----------------------------------------------------
    // STATE DECLARATIONS
    // ----------------------------------------------------
    const [expenses, setExpenses] = useState([]);
    
    // Page selection state: 'statistics' | 'ledger'
    const [activeTab, setActiveTab] = useState("statistics");

    // Core filtering states (shared across tabs for live statistics feedback)
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [activeDateFilter, setActiveDateFilter] = useState("all"); // 'all' | 'today' | 'week' | 'month' | 'custom'
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");
    const [appliedCustomRange, setAppliedCustomRange] = useState(null); // { start, end }

    // Sorting states
    const [sortBy, setSortBy] = useState("date"); // 'date' | 'amount'
    const [sortOrder, setSortOrder] = useState("desc"); // 'asc' | 'desc'

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);

    // Modal/Panel control states
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [selectedDailyDate, setSelectedDailyDate] = useState(null);
    const [editingExpense, setEditingExpense] = useState(null);
    const [deletingExpense, setDeletingExpense] = useState(null);

    // Three-dot dropdown menu open state (tracks which row's menu is visible)
    const [openMenuId, setOpenMenuId] = useState(null);

    // Theme state (default to beautiful dark mode)
    const [darkMode, setDarkMode] = useState(true);

    // Add new expense form state
    const [addDate, setAddDate] = useState(getTodayInputValue());
    const [addAmount, setAddAmount] = useState("");
    const [addCategory, setAddCategory] = useState("Food");
    const [addDescription, setAddDescription] = useState("");

    // Close three-dot dropdown when clicking anywhere outside it
    useEffect(() => {
        const handleClickOutside = () => setOpenMenuId(null);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    // ----------------------------------------------------
    // LIFECYCLE / INITIALIZATION
    // ----------------------------------------------------
    useEffect(() => {
        setExpenses(loadStoredExpenses());
        setDarkMode(loadThemePreference());
    }, []);

    // Sync theme to localStorage
    const toggleTheme = () => {
        const nextTheme = !darkMode;
        setDarkMode(nextTheme);
        saveThemePreference(nextTheme);
    };

    // Helper: Write current expenses to storage
    const saveExpensesToStorage = (updatedList) => {
        setExpenses(updatedList);
        saveStoredExpenses(updatedList);
    };

    const getCategoryStylesForTheme = (category) => getCategoryStyles(category, darkMode);

    // ----------------------------------------------------
    // FILTER & SORT COMPUTATION
    // ----------------------------------------------------
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

    // Reset page index if filters reduce count below current page bound
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, categoryFilter, activeDateFilter, appliedCustomRange]);

    // ----------------------------------------------------
    // DERIVED DATA
    // ----------------------------------------------------
    const summaryCards = useMemo(() => calculateSummaryCards(filteredExpenses), [filteredExpenses]);
    const quickStats = useMemo(() => calculateQuickStats(filteredExpenses), [filteredExpenses]);
    const categoryBreakdown = useMemo(() => calculateCategoryBreakdown(filteredExpenses), [filteredExpenses]);
    const dailySpendingTrend = useMemo(() => calculateDailySpendingTrend(filteredExpenses), [filteredExpenses]);
    const dashboardDateLabels = useMemo(() => getDashboardDateLabels(), []);

    // ----------------------------------------------------
    // ACTIONS: ADD, EDIT, DELETE, RESET
    // ----------------------------------------------------
    const handleAddExpense = (e) => {
        e.preventDefault();
        if (!addAmount || !addDescription.trim()) {
            alert("Please fill in the Amount and Description fields.");
            return;
        }

        const newExpense = {
            id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            item: addDescription.trim(),
            description: addDescription.trim(),
            amount: parseFloat(addAmount),
            date: addDate,
            category: addCategory
        };

        const updated = [newExpense, ...expenses];
        saveExpensesToStorage(updated);

        // Reset Add inputs
        setAddAmount("");
        setAddDescription("");
        setAddDate(getTodayInputValue());
        setAddCategory("Food");
        setShowQuickAdd(false);
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();
        if (!editingExpense.description.trim() || !editingExpense.amount) {
            alert("Description and Amount are required.");
            return;
        }

        const updated = expenses.map((exp) =>
            exp.id === editingExpense.id
                ? {
                      ...editingExpense,
                      item: editingExpense.description,
                      amount: parseFloat(editingExpense.amount)
                  }
                : exp
        );
        saveExpensesToStorage(updated);
        setEditingExpense(null);
    };

    const handleConfirmDelete = () => {
        if (!deletingExpense) return;
        const updated = expenses.filter((exp) => exp.id !== deletingExpense.id);
        saveExpensesToStorage(updated);
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

    // ----------------------------------------------------
    // TABLE PAGINATION CALCULATIONS
    // ----------------------------------------------------
    const totalPages = Math.max(1, Math.ceil(filteredExpenses.length / itemsPerPage));
    const paginatedExpenses = useMemo(
        () => paginateExpenses(filteredExpenses, currentPage, itemsPerPage),
        [filteredExpenses, currentPage, itemsPerPage]
    );
    const dailyModalDetails = useMemo(
        () => getDailyModalDetails(expenses, selectedDailyDate),
        [expenses, selectedDailyDate]
    );

    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? "bg-[#0b0f19] text-slate-100" : "bg-[#f8fafc] text-slate-800"}`}>
            <AppHeader
                darkMode={darkMode}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                toggleTheme={toggleTheme}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <FilterAlert
                    searchQuery={searchQuery}
                    categoryFilter={categoryFilter}
                    activeDateFilter={activeDateFilter}
                    darkMode={darkMode}
                    handleResetFilters={handleResetFilters}
                />

                <StatisticsView
                    activeTab={activeTab}
                    darkMode={darkMode}
                    setActiveTab={setActiveTab}
                    summaryCards={summaryCards}
                    quickStats={quickStats}
                    formatDate={formatDate}
                    categoryBreakdown={categoryBreakdown}
                    getCategoryStyles={getCategoryStylesForTheme}
                    dailySpendingTrend={dailySpendingTrend}
                    dateLabels={dashboardDateLabels}
                />

                <LedgerView
                    activeTab={activeTab}
                    darkMode={darkMode}
                    setActiveTab={setActiveTab}
                    showQuickAdd={showQuickAdd}
                    setShowQuickAdd={setShowQuickAdd}
                    handleAddExpense={handleAddExpense}
                    addDescription={addDescription}
                    setAddDescription={setAddDescription}
                    addAmount={addAmount}
                    setAddAmount={setAddAmount}
                    addCategory={addCategory}
                    setAddCategory={setAddCategory}
                    addDate={addDate}
                    setAddDate={setAddDate}
                    CATEGORIES={CATEGORIES}
                    filteredExpenses={filteredExpenses}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    categoryFilter={categoryFilter}
                    setCategoryFilter={setCategoryFilter}
                    activeDateFilter={activeDateFilter}
                    setActiveDateFilter={setActiveDateFilter}
                    customStart={customStart}
                    setCustomStart={setCustomStart}
                    customEnd={customEnd}
                    setCustomEnd={setCustomEnd}
                    setAppliedCustomRange={setAppliedCustomRange}
                    handleApplyCustomRange={handleApplyCustomRange}
                    handleResetFilters={handleResetFilters}
                    paginatedExpenses={paginatedExpenses}
                    getCategoryStyles={getCategoryStylesForTheme}
                    formatDate={formatDate}
                    openMenuId={openMenuId}
                    setOpenMenuId={setOpenMenuId}
                    setSelectedDailyDate={setSelectedDailyDate}
                    setEditingExpense={setEditingExpense}
                    setDeletingExpense={setDeletingExpense}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    totalPages={totalPages}
                />
            </main>

            <DailyExpenseModal
                selectedDailyDate={selectedDailyDate}
                dailyModalDetails={dailyModalDetails}
                darkMode={darkMode}
                formatDate={formatDate}
                getCategoryStyles={getCategoryStylesForTheme}
                setSelectedDailyDate={setSelectedDailyDate}
            />

            <EditExpenseModal
                editingExpense={editingExpense}
                setEditingExpense={setEditingExpense}
                darkMode={darkMode}
                handleSaveEdit={handleSaveEdit}
                CATEGORIES={CATEGORIES}
            />

            <DeleteExpenseModal
                deletingExpense={deletingExpense}
                setDeletingExpense={setDeletingExpense}
                darkMode={darkMode}
                handleConfirmDelete={handleConfirmDelete}
            />
        </div>
    );
};

export default ExpenseClipper;
