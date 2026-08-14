"use client";
import { ArrowUpRightIcon, ArrowDownRightIcon } from "../../ui/Icons";
import { mutedText } from "../panelStyles";
import { SegmentedToggle } from "../../ui/SegmentedToggle";
import { formatCurrency } from "./chartPath";

export const PERIODS = [
    { key: "week", label: "Week" },
    { key: "month", label: "Month" },
    { key: "year", label: "Year" },
];

/**
 * SummaryPanel – the "Total Expenses" figure with period-over-period delta
 * and the Week/Month/Year segmented control.
 */
const SummaryPanel = ({ darkMode, total, delta, period, setPeriod, active, divider }) => (
    <div className={`p-3 sm:p-4 border-b lg:border-b-0 lg:border-r ${divider}`}>
        <div className="flex flex-col justify-between gap-3 h-full min-h-[104px]">
            <div>
                <p className={`text-[11px] font-semibold ${mutedText(darkMode)}`}>Total Expenses</p>
                <div className="flex items-center gap-3 mt-1">
                    <p className={`text-xl sm:text-2xl font-black tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
                        {formatCurrency(total)}
                    </p>
                    {delta !== null && (
                        <span
                            className={`flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded-lg ${
                                delta >= 0
                                    ? "text-rose-600 bg-rose-500/10"
                                    : "text-emerald-600 bg-emerald-500/10"
                            }`}
                        >
                            {delta >= 0 ? <ArrowUpRightIcon /> : <ArrowDownRightIcon />}
                            {Math.abs(delta)}%
                        </span>
                    )}
                </div>
                <p className={`text-[10px] mt-1 ${mutedText(darkMode)}`}>
                    vs previous {period} · {active?.fullLabel || ""}
                </p>
            </div>
            <div className="flex justify-between items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-semibold ${mutedText(darkMode)}`}>Period</span>
                <SegmentedToggle
                    options={PERIODS}
                    value={period}
                    onChange={setPeriod}
                    darkMode={darkMode}
                    ariaLabel="Spending period"
                />
            </div>
        </div>
    </div>
);

export default SummaryPanel;
