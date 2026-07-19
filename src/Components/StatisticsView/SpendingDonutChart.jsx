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
    // midAngle is used to nudge the active slice outward from the center.
    const arcs = useMemo(() => {
        let offset = 0;
        return slices.map((slice) => {
            const fraction = slice.percentage / 100;
            // Angle to the slice's midpoint in the SVG's native frame (0 = 3 o'clock,
            // clockwise). The whole <svg> is CSS-rotated, so the pop nudge rotates with it.
            const midAngle = ((offset + slice.percentage / 2) / 100) * 2 * Math.PI;
            const arc = {
                ...slice,
                hex: getCategoryHex(slice.category),
                dash: fraction * CIRCUMFERENCE,
                gap: CIRCUMFERENCE - fraction * CIRCUMFERENCE,
                rotation: (offset / 100) * 360,
                midAngle
            };
            offset += slice.percentage;
            return arc;
        });
    }, [slices]);

    // Click a slice to select it (click again to clear). stopPropagation keeps
    // the card's click-to-clear handler from firing on the same click.
    const toggleCategory = (event, category) => {
        event.stopPropagation();
        setActiveCategory((current) => (current === category ? null : category));
    };

    const focused = activeCategory ? slices.find((s) => s.category === activeCategory) : null;
    const centerLabel = focused ? focused.category : "Total Spent";
    const centerValue = focused ? focused.amount : total;
    const centerPct = focused ? Math.round(focused.percentage) : null;

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

            <div
                onClick={() => setActiveCategory(null)}
                className={`p-6 sm:p-8 lg:p-10 rounded-tl-[48px] rounded-br-[48px] ${cardSurface("sky", darkMode)}`}
            >
                {/* Visible date range */}
                <p className={`text-center text-xs sm:text-sm font-semibold mb-6 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    {formatRange(range)}
                </p>

                {slices.length === 0 ? (
                    <div className={`text-center py-16 text-sm ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                        No spending in this period
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                        {/* Donut */}
                        <div className="relative shrink-0 w-52 h-52 sm:w-60 sm:h-60 lg:w-72 lg:h-72">
                            <svg viewBox="0 0 160 160" className="-rotate-90 w-full h-full">
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
                                    const selected = activeCategory === arc.category;
                                    const dimmed = activeCategory && !selected;
                                    // Nudge the selected slice outward along its mid-angle.
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
            {/* Center label — shows the total, or the clicked slice's amount + share */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
                                <span
                                    className={`text-xs sm:text-sm font-bold uppercase tracking-wide max-w-[70%] truncate ${
                                        focused ? "" : darkMode ? "text-slate-500" : "text-slate-400"
                                    }`}
                                    style={focused ? { color: focused.hex } : undefined}
                                >
                                    {centerLabel}
                                </span>
                                <span
                                    className={`text-xl sm:text-2xl lg:text-3xl font-black tracking-tight ${
                                        focused
                                            ? darkMode ? "text-slate-100" : "text-slate-800"
                                            : accentText("sky", darkMode)
                                    }`}
                                >
                                    {formatCurrency(centerValue)}
                                </span>
                                {centerPct !== null && (
                                    <span className={`text-xs sm:text-sm font-bold mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                                        {centerPct}%
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Legend — all items shown, laid out in a responsive grid */}
                        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                            {arcs.map((arc) => {
                                const selected = activeCategory === arc.category;
                                const dimmed = activeCategory && !selected;
                                return (
                                    <button
                                        key={arc.category}
                                        onClick={(e) => toggleCategory(e, arc.category)}
                                        className={`w-full flex items-center justify-between gap-3 text-left rounded-xl px-3 py-2 transition-all duration-200 ${dimmed ? "opacity-40" : "opacity-100"} ${selected ? (darkMode ? "bg-slate-700/50" : "bg-slate-100") : darkMode ? "hover:bg-slate-700/30" : "hover:bg-slate-50"}`}
                                    >
                                        <span className="flex items-center gap-2.5 min-w-0">
                                            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: arc.hex }}></span>
                                            <span className={`text-sm font-bold truncate ${darkMode ? "text-slate-200" : "text-slate-700"}`}>{arc.category}</span>
                                        </span>
                                        <span className="flex items-center gap-2.5 shrink-0">
                                            <span className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{Math.round(arc.percentage)}%</span>
                                            <span className={`text-sm font-extrabold ${darkMode ? "text-slate-100" : "text-slate-800"}`}>{formatCurrency(arc.amount)}</span>
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
