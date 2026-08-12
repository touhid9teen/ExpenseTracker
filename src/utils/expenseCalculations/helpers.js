// Internal helpers shared across the expenseCalculations submodules.
// Not part of the public API — import from the barrel (index.js) instead.

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

export { MONTH_SHORT, WEEKDAY_SHORT, pctChange, parseYMD };
