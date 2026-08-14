"use client";
import { useMemo, useState, useEffect } from "react";
import { calculateSpendingOverview } from "../../../utils/expenseCalculations/index";
import { panelClass } from "../panelStyles";
import SummaryPanel from "./SummaryPanel";
import GraphPanel from "./GraphPanel";
import { VIEW_W, VIEW_H, PAD_X, PAD_TOP, PAD_BOTTOM } from "./chartPath";

/**
 * SpendingOverviewChart – the dashboard spending overview panel: a summary
 * column (total + delta + period toggle) beside an interactive area chart.
 * The two halves live in SummaryPanel / GraphPanel; this file owns the
 * derived chart geometry and the hover state.
 */
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

    const active = coords[activeIndex] || coords[coords.length - 1];
    const divider = darkMode ? "border-slate-700/70" : "border-slate-200";

    return (
        <div className={`rounded-xl overflow-hidden ${panelClass(darkMode)}`}>
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(230px,0.85fr)_1.4fr]">
                <SummaryPanel
                    darkMode={darkMode}
                    total={total}
                    delta={delta}
                    period={period}
                    setPeriod={setPeriod}
                    active={active}
                    divider={divider}
                />
                <GraphPanel
                    darkMode={darkMode}
                    coords={coords}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                />
            </div>
        </div>
    );
};

export default SpendingOverviewChart;
