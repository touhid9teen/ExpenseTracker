import { memo } from "react";
import dynamic from "next/dynamic";

const StatisticsHeader = dynamic(() => import("./StatisticsHeader").then(m => m.StatisticsHeader));
const SummaryCardsGrid = dynamic(() => import("./SummaryCardsGrid").then(m => m.SummaryCardsGrid));
const QuickStatsGrid = dynamic(() => import("./QuickStatsGrid").then(m => m.QuickStatsGrid));
const SpendingDonutChart = dynamic(() => import("./SpendingDonutChart").then(m => m.SpendingDonutChart));
const SpendingOverviewChart = dynamic(() => import("./SpendingOverviewChart").then(m => m.SpendingOverviewChart));

const StatisticsView = memo(function StatisticsView(props) {
    const {
        activeTab,
        darkMode = true,
        setActiveTab,
        summaryCards = { total: 0, today: 0, week: 0, month: 0 },
        quickStats = { highest: { date: "N/A", amount: 0 }, lowest: { date: "N/A", amount: 0 }, mostUsedCategory: "N/A", avgDaily: 0 },
        formatDate = (value) => value || "",
        dateLabels = { today: "", week: "", month: "" },
        expenses = []
    } = props;

    // Use CSS visibility instead of conditional rendering to preserve
    // chart state (DOM stays mounted, just hidden).
    return (
        <div className={activeTab === "statistics" ? "space-y-8 animate-fadeIn" : "hidden"}>
            <StatisticsHeader
                darkMode={darkMode}
                setActiveTab={setActiveTab}
                dateLabels={dateLabels}
            />
            <SpendingOverviewChart darkMode={darkMode} expenses={expenses} />
            <SummaryCardsGrid darkMode={darkMode} summaryCards={summaryCards} dateLabels={dateLabels} />
            <QuickStatsGrid darkMode={darkMode} quickStats={quickStats} formatDate={formatDate} />
            <SpendingDonutChart darkMode={darkMode} expenses={expenses} />
        </div>
    );
});

export default StatisticsView;
