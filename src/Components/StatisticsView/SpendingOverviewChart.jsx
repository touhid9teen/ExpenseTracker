"use client";
import { useMemo, useState, useEffect } from "react";
import { calculateSpendingOverview } from "../../utils/expenseCalculations";
import { ArrowUpRightIcon, ArrowDownRightIcon } from "../common/Icons";
import { panelClass, mutedText } from "./panelStyles";
import { SegmentedToggle } from "./SegmentedToggle";

const PERIODS = [
    { key: "week", label: "Week" },
    { key: "month", label: "Month" },
    { key: "year", label: "Year" },
];

const VIEW_W = 320;
const VIEW_H = 150;
const PAD_X = 12;
const PAD_TOP = 28;
const PAD_BOTTOM = 18;

const formatCurrency = (value) => `৳${Math.round(Number(value) || 0).toLocaleString()}`;

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

export const SpendingOverviewChart = ({ darkMode, expenses = [] }) => {
    const [period, setPeriod] = useState("month");

    const { points, total } = useMemo(
        () => calculateSpendingOverview(expenses, period),
        [expenses, period]
    );

    // Period-over-period change: most recent bucket vs the previous one.
    const delta = useMemo(() => {
        const n = points.length;
        if (n < 2) return null;
        const cur = points[n - 1].amount;
        const prev = points[n - 2].amount;
        if (!prev) return cur > 0 ? 100 : 0;
        return Math.round(((cur - prev) / prev) * 100);
    }, [points]);

    const maxAmount = useMemo(() => Math.max(1, ...points.map((p) => p.amount)), [points]);

    const coords = useMemo(() => {
        const usableW = VIEW_W - PAD_X * 2;
        const usableH = VIEW_H - PAD_TOP - PAD_BOTTOM;
        const step = points.length > 1 ? usableW / (points.length - 1) : 0;
        return points.map((p, i) => ({
            x: PAD_X + step * i,
            y: PAD_TOP + usableH * (1 - p.amount / maxAmount),
            ...p,
        }));
    }, [points, maxAmount]);

    const [activeIndex, setActiveIndex] = useState(coords.length - 1);
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
    const lineColor = "#8b5cf6";

    return (
        <div className={`rounded-2xl p-5 sm:p-6 ${panelClass(darkMode)}`}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <p className={`text-sm font-semibold ${mutedText(darkMode)}`}>Total Expenses</p>
                    <div className="flex items-center gap-3 mt-1">
                        <p className={`text-3xl sm:text-4xl font-black tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
                            {formatCurrency(total)}
                        </p>
                        {delta !== null && (
                            <span
                                className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-lg ${
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
                    <p className={`text-xs mt-1 ${mutedText(darkMode)}`}>
                        vs previous {period} · {active?.fullLabel || ""}
                    </p>
                </div>
                <SegmentedToggle
                    options={PERIODS}
                    value={period}
                    onChange={setPeriod}
                    darkMode={darkMode}
                    ariaLabel="Spending period"
                />
            </div>

            <div className="relative mt-6">
                {active && (
                    <div
                        className="absolute -top-1 z-10 -translate-x-1/2 transition-all duration-300 pointer-events-none"
                        style={{ left: `${tooltipLeftPct}%` }}
                    >
                        <div className="px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap text-white bg-gradient-to-br from-violet-500 to-indigo-500 shadow-lg shadow-violet-500/30">
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
                        <linearGradient id="overviewLine" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#6366f1" />
                        </linearGradient>
                        <linearGradient id="overviewArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={darkMode ? 0.35 : 0.22} />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {areaPath && <path d={areaPath} fill="url(#overviewArea)" />}
                    {linePath && (
                        <path
                            d={linePath}
                            fill="none"
                            stroke="url(#overviewLine)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    )}
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

                <div className="flex justify-between mt-2 px-1">
                    {coords.map((c, i) => (
                        <button
                            key={`label-${c.key}`}
                            onClick={() => setActiveIndex(i)}
                            className={`flex-1 text-[10px] sm:text-xs font-medium transition-colors ${
                                i === activeIndex
                                    ? darkMode ? "text-slate-100 font-bold" : "text-slate-900 font-bold"
                                    : darkMode ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"
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
