"use client";
import { useMemo, useState } from "react";
import { ChartPieIcon } from "../common/Icons";
import { calculatePeriodCategoryBreakdown } from "../../utils/expenseCalculations";
import { getCategoryHex } from "../../utils/categoryStyles";
import { cardSurface, accentText } from "./cardStyles";

const PERIODS = [
    { key: "week", label: "Week" },
    { key: "month", label: "Month" },
    { key: "year", label: "Year" }
];

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const RADIUS = 60;
const STROKE = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const formatCurrency = (value) => `৳${Math.round(Number(value) || 0).toLocaleString()}`;

const formatRange = ({ start, end }) => {
    const s = `${MONTHS_SHORT[start.getMonth()]} ${start.getDate()}`;
    const e = `${MONTHS_SHORT[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()}`;
    return `${s} – ${e}`;
};

export const SpendingDonutChart = ({ darkMode = true, expenses = [] }) => {
    const [period, setPeriod] = useState("month");
    const [activeCategory, setActiveCategory] = useState(null);

    const { slices, total, range } = useMemo(
        () => calculatePeriodCategoryBreakdown(expenses, period),
        [expenses, period]
    );

    // Precompute stroke dash offsets so slices sit end-to-end around the ring.
    const arcs = useMemo(() => {
        let offset = 0;
        return slices.map((slice) => {
            const fraction = slice.percentage / 100;
            const arc = {
                ...slice,
                hex: getCategoryHex(slice.category),
                dash: fraction * CIRCUMFERENCE,
                gap: CIRCUMFERENCE - fraction * CIRCUMFERENCE,
                rotation: (offset / 100) * 360
            };
            offset += slice.percentage;
            return arc;
        });
    }, [slices]);

    const focused = activeCategory ? slices.find((s) => s.category === activeCategory) : null;
    const centerLabel = focused ? focused.category : "Total Spent";
    const centerValue = focused ? focused.amount : total;

    return (
        <div>
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                <h2 className={`text-base font-bold tracking-tight flex items-center gap-2 ${darkMode ? "text-slate-100" : "text-slate-800"}`}>
                    <ChartPieIcon className="w-5 h-5 text-sky-400" />
                    Spending by Category
                </h2>

                {/* Period toggle */}
                <div className={`flex rounded-full p-1 ${darkMode ? "bg-slate-900/60" : "bg-slate-100"}`} role="tablist" aria-label="Spending period">
                    {PERIODS.map((p) => {
                        const selected = period === p.key;
                        return (
                            <button
                                key={p.key}
                                role="tab"
                                aria-selected={selected}
                                onClick={() => setPeriod(p.key)}
                                className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all duration-200 ${
                                    selected
                                        ? "bg-sky-500 text-white shadow shadow-sky-500/25"
                                        : darkMode
                                            ? "text-slate-400 hover:text-sky-300"
                                            : "text-slate-500 hover:text-sky-600"
                                }`}
                            >
                                {p.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className={`p-6 rounded-tl-[48px] rounded-br-[48px] ${cardSurface("sky", darkMode)}`}>
                {/* Visible date range */}
                <p className={`text-center text-xs font-semibold mb-5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    {formatRange(range)}
                </p>

                {slices.length === 0 ? (
                    <div className={`text-center py-16 text-sm ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                        No spending in this period
                    </div>
                ) : (
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        {/* Donut */}
                        <div className="relative shrink-0">
                            <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
                                {/* Track */}
                                <circle
                                    cx="80"
                                    cy="80"
                                    r={RADIUS}
                                    fill="none"
                                    strokeWidth={STROKE}
                                    stroke={darkMode ? "#1e293b" : "#f1f5f9"}
                                />
                                {arcs.map((arc) => {
                                    const dimmed = activeCategory && activeCategory !== arc.category;
                                    return (
                                        <circle
                                            key={arc.category}
                                            cx="80"
                                            cy="80"
                                            r={RADIUS}
                                            fill="none"
                                            strokeWidth={STROKE}
                                            stroke={arc.hex}
                                            strokeDasharray={`${arc.dash} ${arc.gap}`}
                                            strokeDashoffset={-((arc.rotation / 360) * CIRCUMFERENCE)}
                                            strokeLinecap="butt"
                                            className="transition-opacity duration-200 cursor-pointer"
                                            style={{ opacity: dimmed ? 0.25 : 1 }}
                                            onMouseEnter={() => setActiveCategory(arc.category)}
                                            onMouseLeave={() => setActiveCategory(null)}
                                        />
                                    );
                                })}
                            </svg>
                            {/* Center label */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                                <span className={`text-[10px] font-bold uppercase tracking-wide ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                                    {centerLabel}
                                </span>
                                <span className={`text-lg font-black tracking-tight ${accentText("sky", darkMode)}`}>
                                    {formatCurrency(centerValue)}
                                </span>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex-1 w-full space-y-2.5 max-h-[180px] overflow-y-auto">
                            {arcs.map((arc) => {
                                const dimmed = activeCategory && activeCategory !== arc.category;
                                return (
                                    <button
                                        key={arc.category}
                                        onMouseEnter={() => setActiveCategory(arc.category)}
                                        onMouseLeave={() => setActiveCategory(null)}
                                        className={`w-full flex items-center justify-between gap-3 text-left transition-opacity duration-200 ${dimmed ? "opacity-40" : "opacity-100"}`}
                                    >
                                        <span className="flex items-center gap-2 min-w-0">
                                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: arc.hex }}></span>
                                            <span className={`text-xs font-bold truncate ${darkMode ? "text-slate-200" : "text-slate-700"}`}>{arc.category}</span>
                                        </span>
                                        <span className="flex items-center gap-2 shrink-0">
                                            <span className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{Math.round(arc.percentage)}%</span>
                                            <span className={`text-xs font-extrabold ${darkMode ? "text-slate-100" : "text-slate-800"}`}>{formatCurrency(arc.amount)}</span>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SpendingDonutChart;
