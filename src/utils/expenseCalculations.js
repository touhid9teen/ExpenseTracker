import { formatShortDate, getRelativeInputDate, isThisMonth, isThisWeek, isToday } from "./dateUtils";

export const normalizeExpenseAmount = (amount) => {
    if (typeof amount === "number" && Number.isFinite(amount)) return amount;

    const parsedAmount = Number.parseFloat(amount);
    return Number.isFinite(parsedAmount) ? parsedAmount : 0;
};

export const normalizeExpenseRecord = (expense) => ({
    ...expense,
    item: expense.item ?? expense.description ?? "",
    amount: normalizeExpenseAmount(expense.amount)
});

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

export const calculateSummaryCards = (expenses) => {
    let total = 0;
    let today = 0;
    let week = 0;
    let month = 0;

    expenses.forEach((exp) => {
        const amount = normalizeExpenseAmount(exp.amount);
        total += amount;
        if (isToday(exp.date)) today += amount;
        if (isThisWeek(exp.date)) week += amount;
        if (isThisMonth(exp.date)) month += amount;
    });

    return { total, today, week, month };
};

export const calculateQuickStats = (expenses) => {
    if (expenses.length === 0) {
        return {
            highest: { date: "N/A", amount: 0 },
            lowest: { date: "N/A", amount: 0 },
            mostUsedCategory: "N/A",
            avgDaily: 0
        };
    }

    const dateGroups = {};
    const categoryCounts = {};

    expenses.forEach((exp) => {
        const amount = normalizeExpenseAmount(exp.amount);
        dateGroups[exp.date] = (dateGroups[exp.date] || 0) + amount;
        categoryCounts[exp.category] = (categoryCounts[exp.category] || 0) + 1;
    });

    const dateEntries = Object.entries(dateGroups);
    let highest = { date: "N/A", amount: 0 };
    let lowest = { date: "N/A", amount: Infinity };

    dateEntries.forEach(([date, amount]) => {
        if (amount > highest.amount) highest = { date, amount };
        if (amount < lowest.amount) lowest = { date, amount };
    });

    if (lowest.amount === Infinity) lowest.amount = 0;

    let mostUsedCategory = "N/A";
    let maxCount = 0;
    Object.entries(categoryCounts).forEach(([category, count]) => {
        if (count > maxCount) {
            maxCount = count;
            mostUsedCategory = category;
        }
    });

    const totalAmount = expenses.reduce((sum, exp) => sum + normalizeExpenseAmount(exp.amount), 0);
    const avgDaily = totalAmount / dateEntries.length;

    return { highest, lowest, mostUsedCategory, avgDaily };
};

export const calculateCategoryBreakdown = (expenses) => {
    if (expenses.length === 0) return [];

    const totals = {};
    let grandTotal = 0;

    expenses.forEach((exp) => {
        const amount = normalizeExpenseAmount(exp.amount);
        totals[exp.category] = (totals[exp.category] || 0) + amount;
        grandTotal += amount;
    });

    return Object.entries(totals)
        .map(([category, amount]) => ({
            category,
            amount,
            percentage: Math.round((amount / grandTotal) * 100)
        }))
        .sort((a, b) => b.amount - a.amount);
};

export const calculateDailySpendingTrend = (expenses) => {
    const trendDays = [];
    const dateValues = {};
    for (let i = 6; i >= 0; i--) {
        const dateStr = getRelativeInputDate(-i);
        trendDays.push(dateStr);
        dateValues[dateStr] = 0;
    }

    expenses.forEach((exp) => {
        if (dateValues[exp.date] !== undefined) {
            dateValues[exp.date] += normalizeExpenseAmount(exp.amount);
        }
    });

    const maxSpent = Math.max(1, ...Object.values(dateValues));

    return trendDays.map((date) => ({
        date,
        label: formatShortDate(date),
        amount: dateValues[date],
        heightPct: Math.round((dateValues[date] / maxSpent) * 100)
    }));
};

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Aggregates spending into evenly spaced buckets for the hero overview chart.
 * period: "week" → last 7 days, "month" → last 6 months, "year" → last 6 years.
 * Returns { points: [{ key, label, fullLabel, amount }], total, period }.
 */
// Returns the inclusive [start, end] Date range for a rolling period ending today.
// week → last 7 days, month → current calendar month, year → current calendar year.
export const getPeriodRange = (period = "month", now = new Date()) => {
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    let start;

    if (period === "week") {
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
    } else if (period === "year") {
        start = new Date(now.getFullYear(), 0, 1);
    } else {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return { start, end };
};

const isWithinRange = (dateStr, start, end) => {
    const t = new Date(dateStr).getTime();
    return !Number.isNaN(t) && t >= start.getTime() && t <= end.getTime();
};

/**
 * Category breakdown scoped to a rolling period. Returns
 * { slices: [{ category, amount, percentage }], total, range: {start,end} }.
 */
export const calculatePeriodCategoryBreakdown = (expenses = [], period = "month") => {
    const range = getPeriodRange(period);
    const totals = {};
    let grandTotal = 0;

    expenses.forEach((exp) => {
        if (!isWithinRange(exp.date, range.start, range.end)) return;
        const amount = normalizeExpenseAmount(exp.amount);
        totals[exp.category] = (totals[exp.category] || 0) + amount;
        grandTotal += amount;
    });

    const slices = Object.entries(totals)
        .map(([category, amount]) => ({
            category,
            amount,
            percentage: grandTotal > 0 ? (amount / grandTotal) * 100 : 0
        }))
        .sort((a, b) => b.amount - a.amount);

    return { slices, total: grandTotal, range };
};

export const calculateSpendingOverview = (expenses = [], period = "month") => {
    const now = new Date();
    const buckets = [];
    const index = new Map();

    const pushBucket = (key, label, fullLabel) => {
        const bucket = { key, label, fullLabel, amount: 0 };
        buckets.push(bucket);
        index.set(key, bucket);
    };

    if (period === "week") {
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(now.getDate() - i);
            const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
            pushBucket(key, WEEKDAY_SHORT[d.getDay()], `${MONTH_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`);
        }
    } else if (period === "year") {
        for (let i = 5; i >= 0; i--) {
            const year = now.getFullYear() - i;
            pushBucket(`${year}`, `${year}`, `${year}`);
        }
    } else {
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${d.getMonth()}`;
            pushBucket(key, MONTH_SHORT[d.getMonth()], `${MONTH_SHORT[d.getMonth()]} ${d.getFullYear()}`);
        }
    }

    let total = 0;
    expenses.forEach((exp) => {
        const amount = normalizeExpenseAmount(exp.amount);
        const d = new Date(exp.date);
        if (Number.isNaN(d.getTime())) return;

        let key;
        if (period === "week") key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        else if (period === "year") key = `${d.getFullYear()}`;
        else key = `${d.getFullYear()}-${d.getMonth()}`;

        const bucket = index.get(key);
        if (bucket) {
            bucket.amount += amount;
            total += amount;
        }
    });

    return { points: buckets, total, period };
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
