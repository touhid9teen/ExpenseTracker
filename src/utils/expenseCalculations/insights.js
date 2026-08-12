import { getRelativeInputDate, getTodayInputValue, getWeekRange } from "../dateUtils";
import { pctChange, parseYMD } from "./helpers";
import { normalizeExpenseAmount } from "./normalization";

// Fixed monthly budget target used by the Statistics "Budget Used" card and
// the AI Insights rail (the app has no per-user budget feature yet).
export const MONTHLY_BUDGET = 35000;

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
