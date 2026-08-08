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
const VIEW_H = 140;
const PAD_X = 12;
const PAD_TOP = 24;
const PAD_BOTTOM = 14;

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

    const divider = darkMode ? "border-slate-700/70" : "border-slate-200";

    return (
        <div className={`rounded-xl overflow-hidden ${panelClass(darkMode)}`}>
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(230px,0.85fr)_1.4fr]">
                {/* Part 1 — Total Expenses figure */}
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

                {/* Part 2 — Spending graph */}
                <div className="p-3 sm:p-4">
                    <div className="relative">
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
                            className="w-full h-[84px] overflow-visible"
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

                        <div className="flex justify-between mt-1.5 px-1">
                            {coords.map((c, i) => (
                                <button
                                    key={`label-${c.key}`}
                                    onClick={() => setActiveIndex(i)}
                                    className={`flex-1 text-[9px] sm:text-[11px] font-medium transition-colors ${
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
            </div>
        </div>
    );
};

export default SpendingOverviewChart;
