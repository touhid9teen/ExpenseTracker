"use client";
import { useMemo, useState } from "react";
import { ChartBarSquareIcon } from "../ui/Icons";
import { calculateExpenseTrend } from "../../utils/expenseCalculations/index";
import { panelClass, mutedText, headingText, formatTaka } from "./panelStyles";
import { SegmentedToggle } from "../ui/SegmentedToggle";

const GRANULARITIES = [
    { key: "daily", label: "Daily" },
    { key: "weekly", label: "Weekly" },
    { key: "monthly", label: "Monthly" },
];

export const ExpenseTrendChart = ({ darkMode, expenses = [] }) => {
    const [granularity, setGranularity] = useState("weekly");
    const [activeKey, setActiveKey] = useState(null);

    const buckets = useMemo(
        () => calculateExpenseTrend(expenses, granularity),
        [expenses, granularity]
    );

    const maxAmount = useMemo(() => Math.max(1, ...buckets.map((b) => b.amount)), [buckets]);
    const hasData = buckets.some((b) => b.amount > 0);

    return (
        <div className={`rounded-xl p-3 h-full ${panelClass(darkMode)}`}>
            <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
                <h2 className={`text-sm font-bold tracking-tight flex items-center gap-2 ${headingText(darkMode)}`}>
                    <ChartBarSquareIcon className="w-5 h-5 text-violet-500" strokeWidth={2.25} />
                    Expense Trend
                </h2>
                <SegmentedToggle options={GRANULARITIES} value={granularity} onChange={setGranularity} darkMode={darkMode} ariaLabel="Trend granularity" />
            </div>

            {!hasData ? (
                <div className={`text-center py-10 text-sm ${mutedText(darkMode)}`}>No spending to chart yet</div>
            ) : (
                <div className="flex items-end justify-between gap-2 sm:gap-3 h-32 pt-3">
                    {buckets.map((bucket) => {
                        const heightPct = Math.max(2, Math.round((bucket.amount / maxAmount) * 100));
                        const isActive = activeKey === bucket.key;
                        return (
                            <div
                                key={bucket.key}
                                className="group flex-1 flex flex-col items-center justify-end h-full min-w-0"
                                onMouseEnter={() => setActiveKey(bucket.key)}
                                onMouseLeave={() => setActiveKey(null)}
                            >
                                <div className="relative w-full flex-1 flex items-end justify-center">
                                    {/* Value tooltip on hover */}
                                    <span
                                        className={`absolute -top-1 text-[11px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap transition-opacity duration-200 ${
                                            isActive ? "opacity-100" : "opacity-0"
                                        } ${darkMode ? "bg-slate-800 text-slate-100" : "bg-slate-800 text-white"}`}
                                    >
                                        {formatTaka(bucket.amount)}
                                    </span>
                                    <div
                                        className="w-full max-w-[42px] rounded-t-lg bg-gradient-to-t from-indigo-500 to-violet-400 transition-all duration-300 group-hover:from-indigo-600 group-hover:to-violet-500"
                                        style={{ height: `${heightPct}%` }}
                                        title={`${bucket.rangeLabel}: ${formatTaka(bucket.amount)}`}
                                    />
                                </div>
                                <span className={`mt-2 text-[10px] sm:text-xs font-medium truncate max-w-full ${mutedText(darkMode)}`}>
                                    {bucket.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ExpenseTrendChart;
