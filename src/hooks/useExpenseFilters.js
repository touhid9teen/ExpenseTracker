import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
    calculateCategoryBreakdown,
    calculateDailySpendingTrend,
    calculateQuickStats,
    calculateSummaryCards,
    filterAndSortExpenses,
    paginateExpenses
} from "../utils/expenseCalculations";

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZES = [5, 10, 25, 50];

/**
 * Owns filtering, sorting, pagination, and all derived statistics
 * computed from the raw expense list.
 */
export const useExpenseFilters = (expenses) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [activeDateFilter, setActiveDateFilter] = useState("all");
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");
    const [appliedCustomRange, setAppliedCustomRange] = useState(null);
    const [specificDate, setSpecificDate] = useState("");
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_PAGE_SIZE);

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

    const totalPages = Math.max(1, Math.ceil(filteredExpenses.length / itemsPerPage));
    const paginatedExpenses = useMemo(
        () => paginateExpenses(filteredExpenses, currentPage, itemsPerPage),
        [filteredExpenses, currentPage, itemsPerPage]
    );

    const handleItemsPerPage = (value) => {
        setItemsPerPage(Number(value) || DEFAULT_PAGE_SIZE);
        setCurrentPage(1);
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

    return {
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
        specificDate,
        setSpecificDate,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage: handleItemsPerPage,
        pageSizes: PAGE_SIZES,
        filteredExpenses,
        summaryCards,
        quickStats,
        categoryBreakdown,
        dailySpendingTrend,
        totalPages,
        paginatedExpenses,
        handleResetFilters,
        handleApplyCustomRange
    };
};
