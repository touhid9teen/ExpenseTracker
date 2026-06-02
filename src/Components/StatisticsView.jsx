import { StatisticsHeader } from "./StatisticsView/StatisticsHeader";
import { SummaryCardsGrid } from "./StatisticsView/SummaryCardsGrid";
import { QuickStatsGrid } from "./StatisticsView/QuickStatsGrid";
import { CategoryBreakdown } from "./StatisticsView/CategoryBreakdown";
import { DailyTrendChart } from "./StatisticsView/DailyTrendChart";

const StatisticsView = (props) => {
    return props.activeTab === "statistics" ? (
        <div className="space-y-8 animate-fadeIn">
            <StatisticsHeader
                darkMode={props.darkMode}
                setActiveTab={props.setActiveTab}
                dateLabels={props.dateLabels}
            />
            <SummaryCardsGrid darkMode={props.darkMode} summaryCards={props.summaryCards} dateLabels={props.dateLabels} />
            <QuickStatsGrid darkMode={props.darkMode} quickStats={props.quickStats} formatDate={props.formatDate} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CategoryBreakdown darkMode={props.darkMode} categoryBreakdown={props.categoryBreakdown} getCategoryStyles={props.getCategoryStyles} />
                <DailyTrendChart darkMode={props.darkMode} dailySpendingTrend={props.dailySpendingTrend} />
            </div>
        </div>
    ) : null;
};

export default StatisticsView;
