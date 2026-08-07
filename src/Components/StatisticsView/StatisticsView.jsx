"use client";
import { memo, useMemo } from "react";
import dynamic from "next/dynamic";
import { calculateStatisticsSummary, calculateCategoryInsights } from "../../utils/expenseCalculations";

const StatisticsHeader = dynamic(() => import("./StatisticsHeader").then((m) => m.StatisticsHeader));
const SummaryCardsGrid = dynamic(() => import("./SummaryCardsGrid").then((m) => m.SummaryCardsGrid));
const CategoryInsightsGrid = dynamic(() => import("./CategoryInsightsGrid").then((m) => m.CategoryInsightsGrid));
const SpendingOverviewChart = dynamic(() => import("./SpendingOverviewChart").then((m) => m.SpendingOverviewChart));
const SpendingDonutChart = dynamic(() => import("./SpendingDonutChart").then((m) => m.SpendingDonutChart));
const ExpenseTrendChart = dynamic(() => import("./ExpenseTrendChart").then((m) => m.ExpenseTrendChart));
const AIInsightCards = dynamic(() => import("./AIInsightCards").then((m) => m.AIInsightCards));

const StatisticsView = memo(function StatisticsView(props) {
    const {
        activeTab,
        visible,
        darkMode = true,
        dateLabels = {},
        expenses = [],
        setActiveTab,
        setPendingAction,
    } = props;

    // Compute all real derived data once per render (expenses change).
    const summary = useMemo(() => calculateStatisticsSummary(expenses), [expenses]);
    const insights = useMemo(() => calculateCategoryInsights(expenses), [expenses]);

    // Use CSS visibility instead of conditional rendering to preserve chart state.
    const show = visible !== undefined ? visible : activeTab === "statistics";
    return (
        <div className={show ? "space-y-6 animate-fadeIn" : "hidden"}>
            <StatisticsHeader darkMode={darkMode} dateLabels={dateLabels} expenses={expenses} />
            <SpendingOverviewChart darkMode={darkMode} expenses={expenses} />
            <SummaryCardsGrid darkMode={darkMode} summary={summary} />
            <CategoryInsightsGrid darkMode={darkMode} insights={insights} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SpendingDonutChart darkMode={darkMode} expenses={expenses} />
                <ExpenseTrendChart darkMode={darkMode} expenses={expenses} />
            </div>

            <AIInsightCards
                darkMode={darkMode}
                expenses={expenses}
                setActiveTab={setActiveTab}
                setPendingAction={setPendingAction}
            />
        </div>
    );
});

export default StatisticsView;
