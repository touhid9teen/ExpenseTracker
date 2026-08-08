"use client";
import { TrendingUpIcon, ChartTrendDownIcon, TagIcon, ChartBarSquareIcon, LightningBoltIcon } from "../common/Icons";
import { getCategoryHex } from "../../utils/categoryStyles";
import { chipClass, formatTaka, mutedText, headingText } from "./panelStyles";

const InsightCard = ({ darkMode, icon: Icon, chip, title, value, note, dotCategory }) => (
    <div
        className={`rounded-xl p-2.5 border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
            darkMode
                ? "bg-slate-900 border-slate-700/70 hover:border-violet-500/50 hover:shadow-violet-500/10"
                : "bg-white border-slate-200 hover:border-violet-300 hover:shadow-violet-500/10"
        }`}
    >
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-1.5 ${chipClass(chip, darkMode)}`}>
            <Icon className="w-3.5 h-3.5" strokeWidth={2.25} />
        </div>
        <p className={`text-[10px] font-semibold ${mutedText(darkMode)}`}>{title}</p>
        <p className={`flex items-center gap-1.5 text-[13px] font-black tracking-tight mt-0.5 ${headingText(darkMode)}`}>
            {dotCategory && (
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: getCategoryHex(dotCategory) }} />
            )}
            <span className="truncate">{value}</span>
        </p>
        <p className={`text-[10px] mt-0.5 ${mutedText(darkMode)}`}>{note}</p>
    </div>
);

export const CategoryInsightsGrid = ({ darkMode, insights }) => {
    if (!insights) return null;
    const { highest, lowest, mostUsed, avgDaily, activeDays, unusual } = insights;

    return (
        <div>
            <h2 className={`text-sm font-bold tracking-tight mb-1.5 ${headingText(darkMode)}`}>
                Category Spending Insights
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
                <InsightCard
                    darkMode={darkMode}
                    icon={TrendingUpIcon}
                    chip="rose"
                    title="Highest Category"
                    value={highest.category}
                    dotCategory={highest.category}
                    note={`${formatTaka(highest.amount)} · ${highest.pct}% of total`}
                />
                <InsightCard
                    darkMode={darkMode}
                    icon={ChartTrendDownIcon}
                    chip="emerald"
                    title="Lowest Category"
                    value={lowest.category}
                    dotCategory={lowest.category}
                    note={`${formatTaka(lowest.amount)} · ${lowest.pct}% of total`}
                />
                <InsightCard
                    darkMode={darkMode}
                    icon={TagIcon}
                    chip="violet"
                    title="Most Used"
                    value={mostUsed.category}
                    dotCategory={mostUsed.category}
                    note={`${mostUsed.count} ${mostUsed.count === 1 ? "entry" : "entries"}`}
                />
                <InsightCard
                    darkMode={darkMode}
                    icon={ChartBarSquareIcon}
                    chip="sky"
                    title="Average Daily"
                    value={formatTaka(avgDaily)}
                    note={`over ${activeDays} active ${activeDays === 1 ? "day" : "days"}`}
                />
                <InsightCard
                    darkMode={darkMode}
                    icon={LightningBoltIcon}
                    chip="amber"
                    title="Peak Day"
                    value={formatTaka(unusual.amount)}
                    note={`${unusual.pct}% above average`}
                />
            </div>
        </div>
    );
};

export default CategoryInsightsGrid;
