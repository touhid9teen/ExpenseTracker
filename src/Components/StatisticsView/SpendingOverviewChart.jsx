"use client";
import { useMemo, useState, useEffect } from "react";
import { calculateSpendingOverview } from "../../utils/expenseCalculations";

const PERIODS = [
    { key: "week", label: "Week" },
    { key: "month", label: "Month" },
    { key: "year", label: "Year" }
];

const VIEW_W = 320;
const VIEW_H = 150;
const PAD_X = 12;
const PAD_TOP = 28;
const PAD_BOTTOM = 18;

const formatCurrency = (value) =>
    `৳${Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Builds a smooth SVG path through the points using Catmull-Rom → cubic Bézier.
const buildSmoothPath = (coords) => {
    if (coords.length === 0) return "";
    if (coords.length === 1) return `M ${coords[0].x} ${coords[0].y}`;

    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
        const p0 = coords[i - 1] || coords[i];
        const p1 = coords[i];
        const p2 = coords[i + 1];
        const p3 = coords[i + 2] || p2;

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
};

export const SpendingOverviewChart = ({ darkMode = true, expenses = [] }) => {
    const [period, setPeriod] = useState("month");

    const { points, total } = useMemo(
        () => calculateSpendingOverview(expenses, period),
        [expenses, period]
    );

    const maxAmount = useMemo(
        () => Math.max(1, ...points.map((p) => p.amount)),
        [points]
    );

    // Map data points to SVG coordinates.
    const coords = useMemo(() => {
        const usableW = VIEW_W - PAD_X * 2;
        const usableH = VIEW_H - PAD_TOP - PAD_BOTTOM;
        const step = points.length > 1 ? usableW / (points.length - 1) : 0;

        return points.map((p, i) => ({
            x: PAD_X + step * i,
            y: PAD_TOP + usableH * (1 - p.amount / maxAmount),
            ...p
        }));
    }, [points, maxAmount]);

    const [activeIndex, setActiveIndex] = useState(coords.length - 1);

    // Keep the selected point valid when the period (and point count) changes.
    useEffect(() => {
        setActiveIndex(coords.length - 1);
    }, [period, coords.length]);

    const linePath = useMemo(() => buildSmoothPath(coords), [coords]);
    const areaPath = useMemo(() => {
        if (!linePath) return "";
        const last = coords[coords.length - 1];
        const first = coords[0];
        return `${linePath} L ${last.x} ${VIEW_H - PAD_BOTTOM} L ${first.x} ${VIEW_H - PAD_BOTTOM} Z`;
    }, [linePath, coords]);

    const active = coords[activeIndex] || coords[coords.length - 1];
    const tooltipLeftPct = active ? (active.x / VIEW_W) * 100 : 50;

    const lineColor = darkMode ? "#fbbf24" : "#d97706";

    return (
        <div
            className={`rounded-3xl p-5 sm:p-6 border transition-colors duration-300 ${
                darkMode
                    ? "bg-slate-800 border-amber-500/40 shadow-lg shadow-amber-500/5"
                    : "bg-white border-amber-400 shadow-lg shadow-amber-500/10"
            }`}
        >
            {/* Total + current selection date */}
            <div className="text-center">
                <p className={`text-3xl sm:text-4xl font-black tracking-tight ${darkMode ? "text-amber-400" : "text-amber-600"}`}>
                    {formatCurrency(total)}
                </p>
                <p className={`mt-1 text-xs sm:text-sm font-medium ${darkMode ? "text-slate-400" : "text-slate-400"}`}>
                    {active?.fullLabel || ""}
                </p>
            </div>

            {/* Period toggle */}
            <div
                className={`flex mt-4 rounded-full p-1 max-w-xs mx-auto ${darkMode ? "bg-slate-900/60" : "bg-slate-100"}`}
                role="tablist"
                aria-label="Spending period"
            >
                {PERIODS.map((p) => {
                    const selected = period === p.key;
                    return (
                        <button
                            key={p.key}
                            role="tab"
                            aria-selected={selected}
                            onClick={() => setPeriod(p.key)}
                            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-full transition-all duration-200 ${
                                selected
                                    ? darkMode
                                        ? "bg-amber-500 text-white shadow shadow-amber-500/20"
                                        : "bg-amber-500 text-white shadow shadow-amber-500/25"
                                    : darkMode
                                        ? "text-slate-400 hover:text-amber-300"
                                        : "text-slate-500 hover:text-amber-600"
                            }`}
                        >
                            {p.label}
                        </button>
                    );
                })}
            </div>

            {/* Chart */}
            <div className="relative mt-6">
                {/* Floating tooltip for the active point */}
                {active && (
                    <div
                        className="absolute -top-1 z-10 -translate-x-1/2 transition-all duration-300 pointer-events-none"
                        style={{ left: `${tooltipLeftPct}%` }}
                    >
                        <div
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shadow-lg border ${
                                darkMode
                                    ? "bg-slate-900 text-amber-400 border-amber-500/40"
                                    : "bg-white text-amber-600 border-amber-400"
                            }`}
                        >
                            {formatCurrency(active.amount)}
                        </div>
                    </div>
                )}

                <svg
                    viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                    className="w-full h-[150px] overflow-visible"
                    preserveAspectRatio="none"
                    role="img"
                    aria-label="Spending trend over time"
                >
                    <defs>
                        <linearGradient id="overviewArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={lineColor} stopOpacity={darkMode ? 0.28 : 0.18} />
                            <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Filled area under the curve */}
                    {areaPath && <path d={areaPath} fill="url(#overviewArea)" />}

                    {/* The smooth line */}
                    {linePath && (
                        <path
                            d={linePath}
                            fill="none"
                            stroke={lineColor}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    )}

                    {/* Dashed drop line from active point to the axis */}
                    {active && (
                        <line
                            x1={active.x}
                            y1={active.y}
                            x2={active.x}
                            y2={VIEW_H - PAD_BOTTOM}
                            stroke={darkMode ? "#475569" : "#cbd5e1"}
                            strokeWidth="1.5"
                            strokeDasharray="3 3"
                        />
                    )}

                    {/* Invisible hit targets for each point */}
                    {coords.map((c, i) => (
                        <rect
                            key={`hit-${c.key}`}
                            x={c.x - (VIEW_W / coords.length) / 2}
                            y={0}
                            width={VIEW_W / coords.length}
                            height={VIEW_H}
                            fill="transparent"
                            className="cursor-pointer"
                            onMouseEnter={() => setActiveIndex(i)}
                            onClick={() => setActiveIndex(i)}
                        />
                    ))}

                    {/* Active point marker */}
                    {active && (
                        <circle
                            cx={active.x}
                            cy={active.y}
                            r="6"
                            fill={darkMode ? "#0f172a" : "#ffffff"}
                            stroke={lineColor}
                            strokeWidth="3"
                        />
                    )}
                </svg>

                {/* X-axis labels */}
                <div className="flex justify-between mt-2 px-1">
                    {coords.map((c, i) => (
                        <button
                            key={`label-${c.key}`}
                            onClick={() => setActiveIndex(i)}
                            className={`flex-1 text-[10px] sm:text-xs font-medium transition-colors ${
                                i === activeIndex
                                    ? darkMode
                                        ? "text-slate-100 font-bold"
                                        : "text-slate-900 font-bold"
                                    : darkMode
                                        ? "text-slate-500 hover:text-slate-300"
                                        : "text-slate-400 hover:text-slate-600"
                            }`}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SpendingOverviewChart;
