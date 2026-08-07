import { formatShortDate, getRelativeInputDate, getTodayInputValue, getWeekRange, isThisMonth, isThisWeek, isToday } from "./dateUtils";

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

// Fixed monthly budget target used by the Statistics "Budget Used" card and
// the AI Insights rail (the app has no per-user budget feature yet).
export const MONTHLY_BUDGET = 35000;

// Percentage change from `prev` → `cur`, rounded. Guards divide-by-zero.
const pctChange = (cur, prev) => {
    if (!prev) return cur > 0 ? 100 : 0;
    return Math.round(((cur - prev) / prev) * 100);
};

const parseYMD = (dateStr) => {
    if (!dateStr) return null;
    const [y, m, d] = String(dateStr).split("-").map(Number);
    if (!y || !m || !d) return null;
    return { y, m: m - 1, d };
};

/**
 * Rich per-period summary for the Statistics stat cards. Every value is real,
 * derived from `expenses`; only the budget target is a fixed constant.
 * Returns totals + previous-period comparisons as signed percentages.
 */
export const calculateStatisticsSummary = (expenses = [], budget = MONTHLY_BUDGET) => {
    const now = new Date();
    const todayStr = getTodayInputValue();
    const yesterdayStr = getRelativeInputDate(-1);
    const thisWeek = getWeekRange(now);
    const lastWeekBase = new Date(now);
    lastWeekBase.setDate(now.getDate() - 7);
    const lastWeek = getWeekRange(lastWeekBase);
    const curMonth = { y: now.getFullYear(), m: now.getMonth() };
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonth = { y: prevMonthDate.getFullYear(), m: prevMonthDate.getMonth() };

    let allTime = 0, today = 0, yesterday = 0;
    let week = 0, prevWeek = 0, month = 0, prevMonthTotal = 0;

    for (const exp of expenses) {
        const amount = normalizeExpenseAmount(exp.amount);
        allTime += amount;
        if (exp.date === todayStr) today += amount;
        if (exp.date === yesterdayStr) yesterday += amount;

        const parts = parseYMD(exp.date);
        if (parts) {
            const dt = new Date(parts.y, parts.m, parts.d);
            if (dt >= thisWeek.start && dt <= thisWeek.end) week += amount;
            if (dt >= lastWeek.start && dt <= lastWeek.end) prevWeek += amount;
            if (parts.y === curMonth.y && parts.m === curMonth.m) month += amount;
            if (parts.y === prevMonth.y && parts.m === prevMonth.m) prevMonthTotal += amount;
        }
    }

    return {
        allTime,
        today,
        week,
        month,
        deltas: {
            todayVsYesterday: pctChange(today, yesterday),
            weekVsLastWeek: pctChange(week, prevWeek),
            monthVsLastMonth: pctChange(month, prevMonthTotal)
        },
        budget: {
            used: month,
            target: budget,
            pct: budget > 0 ? Math.round((month / budget) * 100) : 0
        }
    };
};

/**
 * Category-level insights for the "Category Spending Insights" cards:
 * highest/lowest spending category (+ share of total), most-used category
 * (by count), average daily spend, and an "unusual" spike (highest single
 * day vs the daily average).
 */
export const calculateCategoryInsights = (expenses = []) => {
    const totals = {};
    const counts = {};
    const dayTotals = {};
    let grandTotal = 0;

    for (const exp of expenses) {
        const amount = normalizeExpenseAmount(exp.amount);
        totals[exp.category] = (totals[exp.category] || 0) + amount;
        counts[exp.category] = (counts[exp.category] || 0) + 1;
        dayTotals[exp.date] = (dayTotals[exp.date] || 0) + amount;
        grandTotal += amount;
    }

    const entries = Object.entries(totals);
    const share = (amount) => (grandTotal > 0 ? +((amount / grandTotal) * 100).toFixed(1) : 0);

    let highest = { category: "N/A", amount: 0, pct: 0 };
    let lowest = null;
    for (const [category, amount] of entries) {
        if (amount > highest.amount) highest = { category, amount, pct: share(amount) };
        if (!lowest || amount < lowest.amount) lowest = { category, amount, pct: share(amount) };
    }
    if (!lowest) lowest = { category: "N/A", amount: 0, pct: 0 };

    let mostUsed = { category: "N/A", count: 0 };
    for (const [category, count] of Object.entries(counts)) {
        if (count > mostUsed.count) mostUsed = { category, count };
    }

    const days = Object.keys(dayTotals).length || 1;
    const avgDaily = grandTotal / days;
    const peakDay = Math.max(0, ...Object.values(dayTotals));

    return {
        highest,
        lowest,
        mostUsed,
        avgDaily,
        activeDays: days,
        unusual: {
            amount: peakDay,
            pct: avgDaily > 0 ? Math.max(0, Math.round((peakDay / avgDaily - 1) * 100)) : 0
        }
    };
};

/**
 * Compact insights for the AI Insights rail: a spending alert (category with
 * the largest month-over-month jump), a smart saving tip (top category this
 * month), and budget status. All real except the fixed budget target.
 */
export const calculateSpendingInsights = (expenses = [], budget = MONTHLY_BUDGET) => {
    const now = new Date();
    const curMonth = { y: now.getFullYear(), m: now.getMonth() };
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonth = { y: prevMonthDate.getFullYear(), m: prevMonthDate.getMonth() };

    const thisMonthByCat = {};
    const lastMonthByCat = {};
    let monthTotal = 0;

    for (const exp of expenses) {
        const parts = parseYMD(exp.date);
        if (!parts) continue;
        const amount = normalizeExpenseAmount(exp.amount);
        if (parts.y === curMonth.y && parts.m === curMonth.m) {
            thisMonthByCat[exp.category] = (thisMonthByCat[exp.category] || 0) + amount;
            monthTotal += amount;
        } else if (parts.y === prevMonth.y && parts.m === prevMonth.m) {
            lastMonthByCat[exp.category] = (lastMonthByCat[exp.category] || 0) + amount;
        }
    }

    // Alert: category with the largest positive month-over-month change.
    let alert = null;
    for (const [category, amount] of Object.entries(thisMonthByCat)) {
        const prev = lastMonthByCat[category] || 0;
        const delta = pctChange(amount, prev);
        if (!alert || Math.abs(delta) > Math.abs(alert.pct)) {
            alert = { category, pct: delta, higher: delta >= 0 };
        }
    }

    // Smart tip: trim the biggest spending category this month by ~15%.
    let topCategory = null;
    for (const [category, amount] of Object.entries(thisMonthByCat)) {
        if (!topCategory || amount > topCategory.amount) topCategory = { category, amount };
    }
    const tip = topCategory
        ? { category: topCategory.category, savings: Math.round(topCategory.amount * 0.15) }
        : null;

    return {
        alert,
        tip,
        budget: {
            used: monthTotal,
            target: budget,
            pct: budget > 0 ? Math.round((monthTotal / budget) * 100) : 0
        }
    };
};

/**
 * Even-bucket spending for the Statistics "Expense Trend" bar chart.
 * granularity: "daily" → last 7 days, "weekly" → last 5 weeks,
 * "monthly" → last 6 months. Returns [{ key, label, rangeLabel, amount }].
 */
export const calculateExpenseTrend = (expenses = [], granularity = "weekly") => {
    const now = new Date();
    const buckets = [];
    const index = new Map();
    const monthShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const fmt = (dt) => `${monthShort[dt.getMonth()]} ${dt.getDate()}`;

    if (granularity === "daily") {
        for (let i = 6; i >= 0; i--) {
            const dt = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
            const key = `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;
            const b = { key, label: fmt(dt), rangeLabel: fmt(dt), amount: 0, start: dt, end: dt };
            buckets.push(b);
            index.set(key, b);
        }
        for (const exp of expenses) {
            const p = parseYMD(exp.date);
            if (!p) continue;
            const key = `${p.y}-${p.m}-${p.d}`;
            const b = index.get(key);
            if (b) b.amount += normalizeExpenseAmount(exp.amount);
        }
    } else if (granularity === "monthly") {
        for (let i = 5; i >= 0; i--) {
            const dt = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${dt.getFullYear()}-${dt.getMonth()}`;
            const b = { key, label: monthShort[dt.getMonth()], rangeLabel: `${monthShort[dt.getMonth()]} ${dt.getFullYear()}`, amount: 0 };
            buckets.push(b);
            index.set(key, b);
        }
        for (const exp of expenses) {
            const p = parseYMD(exp.date);
            if (!p) continue;
            const b = index.get(`${p.y}-${p.m}`);
            if (b) b.amount += normalizeExpenseAmount(exp.amount);
        }
    } else {
        // weekly — last 5 weeks
        for (let i = 4; i >= 0; i--) {
            const base = new Date(now);
            base.setDate(now.getDate() - i * 7);
            const { start, end } = getWeekRange(base);
            const key = `${start.getFullYear()}-${start.getMonth()}-${start.getDate()}`;
            const b = { key, label: `${fmt(start)}`, rangeLabel: `${fmt(start)} – ${fmt(end)}`, amount: 0, start, end };
            buckets.push(b);
            index.set(key, b);
        }
        for (const exp of expenses) {
            const p = parseYMD(exp.date);
            if (!p) continue;
            const dt = new Date(p.y, p.m, p.d);
            for (const b of buckets) {
                if (dt >= b.start && dt <= b.end) {
                    b.amount += normalizeExpenseAmount(exp.amount);
                    break;
                }
            }
        }
    }

    return buckets;
};
