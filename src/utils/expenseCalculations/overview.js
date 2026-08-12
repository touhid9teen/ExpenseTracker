import { getWeekRange } from "../dateUtils";
import { MONTH_SHORT, WEEKDAY_SHORT, parseYMD } from "./helpers";
import { normalizeExpenseAmount } from "./normalization";

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

/**
 * Aggregates spending into evenly spaced buckets for the hero overview chart.
 * period: "week" → last 7 days, "month" → last 6 months, "year" → last 6 years.
 * Returns { points: [{ key, label, fullLabel, amount }], total, period }.
 */
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

/**
 * Even-bucket spending for the Statistics "Expense Trend" bar chart.
 * granularity: "daily" → last 7 days, "weekly" → last 5 weeks,
 * "monthly" → last 6 months. Returns [{ key, label, rangeLabel, amount }].
 */
export const calculateExpenseTrend = (expenses = [], granularity = "weekly") => {
    const now = new Date();
    const buckets = [];
    const index = new Map();
    const fmt = (dt) => `${MONTH_SHORT[dt.getMonth()]} ${dt.getDate()}`;

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
            const b = { key, label: MONTH_SHORT[dt.getMonth()], rangeLabel: `${MONTH_SHORT[dt.getMonth()]} ${dt.getFullYear()}`, amount: 0 };
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
