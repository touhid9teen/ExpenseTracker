// Public API for expense math/aggregation.
// Split from a single large file into focused submodules; this barrel keeps
// every existing `utils/expenseCalculations` import working unchanged.
export {
    normalizeExpenseAmount,
    normalizeExpenseRecord
} from "./normalization";

export {
    filterAndSortExpenses,
    calculateCustomRangeSum,
    paginateExpenses,
    getDailyModalDetails
} from "./filters";

export {
    calculateSummaryCards,
    calculateQuickStats,
    calculateCategoryBreakdown,
    calculateDailySpendingTrend
} from "./summary";

export {
    getPeriodRange,
    calculatePeriodCategoryBreakdown,
    calculateSpendingOverview,
    calculateExpenseTrend
} from "./overview";

export {
    MONTHLY_BUDGET,
    calculateStatisticsSummary,
    calculateCategoryInsights,
    calculateSpendingInsights
} from "./insights";
