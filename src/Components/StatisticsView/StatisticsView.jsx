import dynamic from "next/dynamic";

const StatisticsHeader = dynamic(() => import("./StatisticsHeader").then(m => m.StatisticsHeader));
const SummaryCardsGrid = dynamic(() => import("./SummaryCardsGrid").then(m => m.SummaryCardsGrid));
const QuickStatsGrid = dynamic(() => import("./QuickStatsGrid").then(m => m.QuickStatsGrid));
const CategoryBreakdown = dynamic(() => import("./CategoryBreakdown").then(m => m.CategoryBreakdown));
const DailyTrendChart = dynamic(() => import("./DailyTrendChart").then(m => m.DailyTrendChart));
const SpendingOverviewChart = dynamic(() => import("./SpendingOverviewChart").then(m => m.SpendingOverviewChart));

const StatisticsView = (props) => {
    const {
        activeTab,
        darkMode = true,
        setActiveTab,
        summaryCards = { total: 0, today: 0, week: 0, month: 0 },
        quickStats = { highest: { date: "N/A", amount: 0 }, lowest: { date: "N/A", amount: 0 }, mostUsedCategory: "N/A", avgDaily: 0 },
        formatDate = (value) => value || "",
        categoryBreakdown = [],
        getCategoryStyles = () => ({ bullet: "bg-slate-400" }),
        dailySpendingTrend = [],
        dateLabels = { today: "", week: "", month: "" },
        expenses = []
    } = props;

    return activeTab === "statistics" ? (
        <div className="space-y-8 animate-fadeIn">
            <StatisticsHeader
                darkMode={darkMode}
                setActiveTab={setActiveTab}
                dateLabels={dateLabels}
            />
            <SpendingOverviewChart darkMode={darkMode} expenses={expenses} />
            <SummaryCardsGrid darkMode={darkMode} summaryCards={summaryCards} dateLabels={dateLabels} />
            <QuickStatsGrid darkMode={darkMode} quickStats={quickStats} formatDate={formatDate} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CategoryBreakdown darkMode={darkMode} categoryBreakdown={categoryBreakdown} getCategoryStyles={getCategoryStyles} />
                <DailyTrendChart darkMode={darkMode} dailySpendingTrend={dailySpendingTrend} />
            </div>
        </div>
    ) : null;
};

export default StatisticsView;
