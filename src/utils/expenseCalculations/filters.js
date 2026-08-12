import { isToday, isThisWeek, isThisMonth } from "../dateUtils";
import { normalizeExpenseAmount, normalizeExpenseRecord } from "./normalization";

export const filterAndSortExpenses = ({
    expenses,
    searchQuery,
    categoryFilter,
    activeDateFilter,
    appliedCustomRange,
    specificDate,
    sortBy,
    sortOrder
}) => {
    let result = expenses.map(normalizeExpenseRecord);

    if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        result = result.filter(
            (exp) =>
                (exp.description || "").toLowerCase().includes(query) ||
                (exp.item || "").toLowerCase().includes(query)
        );
    }

    if (categoryFilter !== "All") {
        result = result.filter((exp) => exp.category === categoryFilter);
    }

    if (activeDateFilter === "today") {
        result = result.filter((exp) => isToday(exp.date));
    } else if (activeDateFilter === "week") {
        result = result.filter((exp) => isThisWeek(exp.date));
    } else if (activeDateFilter === "month") {
        result = result.filter((exp) => isThisMonth(exp.date));
    } else if (activeDateFilter === "specific" && specificDate) {
        result = result.filter((exp) => exp.date === specificDate);
    } else if (activeDateFilter === "custom" && appliedCustomRange) {
        result = result.filter((exp) => {
            const expTime = new Date(exp.date).getTime();
            const startTime = new Date(appliedCustomRange.start).getTime();
            const endTime = new Date(appliedCustomRange.end).getTime();
            return expTime >= startTime && expTime <= endTime;
        });
    }

    result.sort((a, b) => {
        if (sortBy === "date") {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
        }

        if (sortBy === "amount") {
            return sortOrder === "desc" ? b.amount - a.amount : a.amount - b.amount;
        }

        return 0;
    });

    return result;
};

export const calculateCustomRangeSum = (expenses, customStart, customEnd) => {
    if (!customStart || !customEnd) return 0;

    const startTime = new Date(customStart).getTime();
    const endTime = new Date(customEnd).getTime();

    return expenses
        .filter((exp) => {
            const time = new Date(exp.date).getTime();
            return time >= startTime && time <= endTime;
        })
        .reduce((sum, exp) => sum + normalizeExpenseAmount(exp.amount), 0);
};

export const paginateExpenses = (expenses, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return expenses.slice(startIndex, startIndex + itemsPerPage);
};

export const getDailyModalDetails = (expenses, selectedDailyDate) => {
    if (!selectedDailyDate) return null;

    const items = expenses.filter((expense) => expense.date === selectedDailyDate);
    const total = items.reduce((sum, expense) => sum + normalizeExpenseAmount(expense.amount), 0);

    return {
        date: selectedDailyDate,
        items,
        total,
        count: items.length
    };
};
