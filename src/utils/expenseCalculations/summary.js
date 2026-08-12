import { formatShortDate, getRelativeInputDate, isThisMonth, isThisWeek, isToday } from "../dateUtils";

export const calculateSummaryCards = (expenses) => {
    let total = 0;
    let today = 0;
    let week = 0;
    let month = 0;

    const len = expenses.length;
    for (let i = 0; i < len; i++) {
        const exp = expenses[i];
        const amount = exp.amount ?? 0;
        total += amount;
        if (isToday(exp.date)) today += amount;
        if (isThisWeek(exp.date)) week += amount;
        if (isThisMonth(exp.date)) month += amount;
    }

    return { total, today, week, month };
};

export const calculateQuickStats = (expenses) => {
    const len = expenses.length;
    if (len === 0) {
        return {
            highest: { date: "N/A", amount: 0 },
            lowest: { date: "N/A", amount: 0 },
            mostUsedCategory: "N/A",
            avgDaily: 0
        };
    }

    const dateGroups = {};
    const categoryCounts = {};
    let totalAmount = 0;

    for (let i = 0; i < len; i++) {
        const exp = expenses[i];
        const amount = exp.amount ?? 0;
        totalAmount += amount;
        dateGroups[exp.date] = (dateGroups[exp.date] || 0) + amount;
        categoryCounts[exp.category] = (categoryCounts[exp.category] || 0) + 1;
    }

    const dateEntries = Object.entries(dateGroups);
    let highest = { date: "N/A", amount: 0 };
    let lowest = { date: "N/A", amount: Infinity };

    for (let i = 0; i < dateEntries.length; i++) {
        const [date, amount] = dateEntries[i];
        if (amount > highest.amount) highest = { date, amount };
        if (amount < lowest.amount) lowest = { date, amount };
    }

    if (lowest.amount === Infinity) lowest.amount = 0;

    let mostUsedCategory = "N/A";
    let maxCount = 0;
    const categoryEntries = Object.entries(categoryCounts);
    for (let i = 0; i < categoryEntries.length; i++) {
        const [category, count] = categoryEntries[i];
        if (count > maxCount) {
            maxCount = count;
            mostUsedCategory = category;
        }
    }

    const avgDaily = totalAmount / dateEntries.length;

    return { highest, lowest, mostUsedCategory, avgDaily };
};

export const calculateCategoryBreakdown = (expenses) => {
    const len = expenses.length;
    if (len === 0) return [];

    const totals = {};
    let grandTotal = 0;

    for (let i = 0; i < len; i++) {
        const exp = expenses[i];
        const amount = exp.amount ?? 0;
        totals[exp.category] = (totals[exp.category] || 0) + amount;
        grandTotal += amount;
    }

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

    const len = expenses.length;
    for (let i = 0; i < len; i++) {
        const exp = expenses[i];
        if (dateValues[exp.date] !== undefined) {
            dateValues[exp.date] += exp.amount ?? 0;
        }
    }

    const vals = Object.values(dateValues);
    let maxSpent = 1;
    for (let i = 0; i < vals.length; i++) {
        if (vals[i] > maxSpent) maxSpent = vals[i];
    }

    return trendDays.map((date) => ({
        date,
        label: formatShortDate(date),
        amount: dateValues[date],
        heightPct: Math.round((dateValues[date] / maxSpent) * 100)
    }));
};
