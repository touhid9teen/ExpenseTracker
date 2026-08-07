"use client";
import { useMemo, useState } from "react";
import { ChartPieIcon } from "../common/Icons";
import { calculatePeriodCategoryBreakdown } from "../../utils/expenseCalculations";
import { getCategoryHex } from "../../utils/categoryStyles";
import { panelClass, mutedText, headingText, formatTaka } from "./panelStyles";
import { SegmentedToggle } from "./SegmentedToggle";

const PERIODS = [
    { key: "week", label: "Week" },
    { key: "month", label: "Month" },
    { key: "year", label: "Year" },
];

const RADIUS = 60;
const STROKE = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const SpendingDonutChart = ({ darkMode, expenses = [] }) => {
    const [period, setPeriod] = useState("month");
    const [activeCategory, setActiveCategory] = useState(null);

    const { slices, total } = useMemo(
        () => calculatePeriodCategoryBreakdown(expenses, period),
        [expenses, period]
    );

    const arcs = useMemo(() => {
        let offset = 0;
        return slices.map((slice) => {
            const fraction = slice.percentage / 100;
            const midAngle = ((offset + slice.percentage / 2) / 100) * 2 * Math.PI;
            const arc = {
                ...slice,
                hex: getCategoryHex(slice.category),
                dash: fraction * CIRCUMFERENCE,
                gap: CIRCUMFERENCE - fraction * CIRCUMFERENCE,
                rotation: (offset / 100) * 360,
                midAngle,
            };
            offset += slice.percentage;
            return arc;
        });
    }, [slices]);

    const toggleCategory = (event, category) => {
        event.stopPropagation();
        setActiveCategory((current) => (current === category ? null : category));
    };

    const focused = activeCategory ? slices.find((s) => s.category === activeCategory) : null;
    const centerLabel = focused ? focused.category : "Total Spent";
    const centerValue = focused ? focused.amount : total;
    const centerPct = focused ? Math.round(focused.percentage) : null;

    return (
        <div className={`rounded-2xl p-5 sm:p-6 h-full ${panelClass(darkMode)}`}>
            <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
                <h2 className={`text-lg font-bold tracking-tight flex items-center gap-2 ${headingText(darkMode)}`}>
                    <ChartPieIcon className="w-5 h-5 text-violet-500" strokeWidth={2.25} />
                    Spending by Category
                </h2>
                <SegmentedToggle options={PERIODS} value={period} onChange={setPeriod} darkMode={darkMode} ariaLabel="Spending period" />
            </div>

            {slices.length === 0 ? (
                <div className={`text-center py-16 text-sm ${mutedText(darkMode)}`}>No spending in this period</div>
            ) : (
                <div onClick={() => setActiveCategory(null)} className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                    {/* Donut */}
                    <div className="relative shrink-0 w-44 h-44 sm:w-48 sm:h-48">
                        <svg viewBox="0 0 160 160" className="-rotate-90 w-full h-full">
                            <circle cx="80" cy="80" r={RADIUS} fill="none" strokeWidth={STROKE} stroke={darkMode ? "#1e293b" : "#f1f5f9"} />
                            {arcs.map((arc) => {
                                const selected = activeCategory === arc.category;
                                const dimmed = activeCategory && !selected;
                                const pop = selected ? 5 : 0;
                                const cx = 80 + Math.cos(arc.midAngle) * pop;
                                const cy = 80 + Math.sin(arc.midAngle) * pop;
                                return (
                                    <circle
                                        key={arc.category}
                                        cx={cx}
                                        cy={cy}
                                        r={RADIUS}
                                        fill="none"
                                        strokeWidth={selected ? STROKE + 4 : STROKE}
                                        stroke={arc.hex}
                                        strokeDasharray={`${arc.dash} ${arc.gap}`}
                                        strokeDashoffset={-((arc.rotation / 360) * CIRCUMFERENCE)}
                                        strokeLinecap="butt"
                                        className="cursor-pointer"
                                        style={{ opacity: dimmed ? 0.3 : 1, transition: "opacity 0.2s, stroke-width 0.2s, cx 0.2s, cy 0.2s" }}
                                        onClick={(e) => toggleCategory(e, arc.category)}
                                    />
                                );
                            })}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
                            <span
                                className={`text-[11px] font-bold uppercase tracking-wide max-w-[80%] truncate ${focused ? "" : mutedText(darkMode)}`}
                                style={focused ? { color: focused.hex } : undefined}
                            >
                                {centerLabel}
                            </span>
                            <span className={`text-xl sm:text-2xl font-black tracking-tight ${headingText(darkMode)}`}>
                                {formatTaka(centerValue)}
                            </span>
                            {centerPct !== null && (
                                <span className={`text-xs font-bold mt-0.5 ${mutedText(darkMode)}`}>{centerPct}%</span>
                            )}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex-1 w-full space-y-1">
                        {arcs.map((arc) => {
                            const selected = activeCategory === arc.category;
                            const dimmed = activeCategory && !selected;
                            return (
                                <button
                                    key={arc.category}
                                    onClick={(e) => toggleCategory(e, arc.category)}
                                    className={`w-full flex items-center justify-between gap-3 text-left px-3 py-2 rounded-xl transition-all duration-200 ${dimmed ? "opacity-40" : "opacity-100"} ${
                                        selected
                                            ? darkMode ? "bg-slate-800" : "bg-slate-100"
                                            : darkMode ? "hover:bg-slate-800/60" : "hover:bg-slate-50"
                                    }`}
                                >
                                    <span className="flex items-center gap-2.5 min-w-0">
                                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: arc.hex }} />
                                        <span className={`text-sm font-semibold truncate ${darkMode ? "text-slate-200" : "text-slate-700"}`}>{arc.category}</span>
                                    </span>
                                    <span className="flex items-center gap-2.5 shrink-0">
                                        <span className={`text-xs ${mutedText(darkMode)}`}>{Math.round(arc.percentage)}%</span>
                                        <span className={`text-sm font-bold ${darkMode ? "text-slate-100" : "text-slate-800"}`}>{formatTaka(arc.amount)}</span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpendingDonutChart;
