"use client";
import { TrendingUpIcon, CalendarIcon, ChartBarIcon, ChartPieIcon, WalletIcon, ArrowUpRightIcon, ArrowDownRightIcon } from "../ui/Icons";
import { chipClass, formatTaka, mutedText } from "./panelStyles";

const cards = [
    { key: "allTime", label: "All Time", icon: TrendingUpIcon, chip: "violet" },
    { key: "today", label: "Today", icon: CalendarIcon, chip: "sky", showDelta: "todayVsYesterday" },
    { key: "week", label: "This Week", icon: ChartBarIcon, chip: "indigo", showDelta: "weekVsLastWeek" },
    { key: "month", label: "This Month", icon: ChartPieIcon, chip: "emerald", showDelta: "monthVsLastMonth" },
    { key: "budget", label: "Budget Used", icon: WalletIcon, chip: "amber", isBudget: true },
];

const SummaryCard = ({ darkMode, card, value, delta, budgetPct }) => {
    const Icon = card.icon;
    const showDelta = card.showDelta && delta !== undefined;
    const isBudget = card.isBudget;

    return (
        <div
            className={`group relative overflow-hidden rounded-xl p-2.5 border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                darkMode
                    ? "bg-slate-900 border-slate-700/70 hover:border-violet-500/50 hover:shadow-violet-500/10"
                    : "bg-white border-slate-200 hover:border-violet-300 hover:shadow-violet-500/10"
            }`}
        >
            <div className="flex items-start justify-between mb-1.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${chipClass(card.chip, darkMode)}`}>
                    <Icon className="w-3.5 h-3.5" strokeWidth={2.25} />
                </div>
                {showDelta && (
                    <span className={`flex items-center gap-0.5 text-[10px] font-bold ${delta >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                        {delta >= 0 ? <ArrowUpRightIcon /> : <ArrowDownRightIcon />}
                        {Math.abs(delta)}%
                    </span>
                )}
            </div>

            <p className={`text-[10px] font-semibold ${mutedText(darkMode)}`}>{card.label}</p>
            <p className={`text-sm font-black tracking-tight mt-0.5 ${darkMode ? "text-white" : "text-slate-900"}`}>
                {isBudget ? `${budgetPct}%` : formatTaka(value)}
            </p>
        </div>
    );
};

export const SummaryCardsGrid = ({ darkMode, summary }) => {
    if (!summary) return null;
    const { allTime, today, week, month, deltas, budget } = summary;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {cards.map((card) => {
                let value = 0;
                let delta = undefined;
                let budgetPct = 0;
                if (card.key === "allTime") value = allTime;
                else if (card.key === "today") { value = today; delta = deltas?.todayVsYesterday; }
                else if (card.key === "week") { value = week; delta = deltas?.weekVsLastWeek; }
                else if (card.key === "month") { value = month; delta = deltas?.monthVsLastMonth; }
                else if (card.key === "budget") budgetPct = budget?.pct ?? 0;

                return (
                    <SummaryCard
                        key={card.key}
                        darkMode={darkMode}
                        card={card}
                        value={value}
                        delta={delta}
                        budgetPct={budgetPct}
                    />
                );
            })}
        </div>
    );
};

export default SummaryCardsGrid;
