"use client";

import { useMemo } from "react";
import { calculateSpendingInsights, MONTHLY_BUDGET } from "../../../utils/expenseCalculations";
import {
  SparklesIcon,
  WarningTriangleIcon,
  LightbulbIcon,
  WalletIcon,
} from "../../common/Icons";
import InsightCard from "./InsightCard";
import RecentQueries from "./RecentQueries";

const formatTaka = (value) => `৳${Math.round(Number(value) || 0).toLocaleString()}`;

/**
 * InsightsRail – the right-hand column on the AI Assistant screen.
 *
 * Two stacked panels:
 *   1. "AI Insights" — three real, derived cards (spending alert, smart saving
 *      tip, budget status) from calculateSpendingInsights(). Each has an
 *      "Ask AI" affordance that pipes a prompt into the chat composer.
 *   2. "Recent Queries" — the last handful of prompts the user sent, click to
 *      re-run them.
 *
 * Props:
 *   - darkMode
 *   - expenses                     – drives the derived insights
 *   - recentQueries                – array of prompt strings (newest first)
 *   - setActiveTab, setPendingAction – route a prompt into the chat
 */
const InsightsRail = ({
  darkMode,
  expenses = [],
  recentQueries = [],
  setActiveTab,
  setPendingAction,
}) => {
  const insights = useMemo(() => calculateSpendingInsights(expenses, MONTHLY_BUDGET), [expenses]);
  const { alert, tip, budget } = insights;

  const ask = (text) => {
    if (!text) return;
    setPendingAction?.({ action: "send", text });
    setActiveTab?.("chat");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const panelClass = darkMode ? "bg-slate-900 border-slate-700/70" : "bg-white border-slate-200";
  const heading = darkMode ? "text-white" : "text-slate-900";
  const muted = darkMode ? "text-slate-400" : "text-slate-500";

  // Prompts for the three insight cards (fall back gracefully with no data).
  const alertPrompt = alert
    ? `Why did my ${alert.category} spending change by ${alert.pct >= 0 ? "+" : ""}${alert.pct}% this month, and how do I keep it in check?`
    : "Analyze my spending this month and flag anything unusual.";
  const tipPrompt = tip
    ? `Give me 3 practical ways to cut my ${tip.category} spending and save around ${formatTaka(tip.savings)} this month.`
    : "Suggest practical ways I can reduce my spending based on my expenses.";
  const budgetPrompt = `I've used ${budget.pct}% of my ${formatTaka(budget.target)} monthly budget. Am I on track, and what should I watch?`;

  const budgetPct = Math.min(100, Math.max(0, budget.pct));
  const overBudget = budget.pct > 100;

  return (
    <div className="space-y-5">
      {/* ── AI Insights ── */}
      <section className={`rounded-2xl border ${panelClass}`}>
        <div className={`flex items-center gap-2.5 px-5 py-4 border-b ${darkMode ? "border-slate-800" : "border-slate-100"}`}>
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-sm shadow-violet-500/30">
            <SparklesIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
          </span>
          <div className="min-w-0">
            <h3 className={`text-sm font-extrabold leading-tight ${heading}`}>AI Insights</h3>
            <p className={`text-[11px] font-medium ${muted}`}>Personalized from your spending</p>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {/* Spending Alert */}
          <InsightCard
            darkMode={darkMode}
            tone="rose"
            icon={<WarningTriangleIcon className="w-3.5 h-3.5" strokeWidth={2.5} />}
            title="Spending Alert"
            prompt={alertPrompt}
            onAsk={ask}
          >
            {alert ? (
              <>
                You spent{" "}
                <span className={`font-bold ${alert.higher ? "text-rose-500" : "text-emerald-500"}`}>
                  {Math.abs(alert.pct)}% {alert.higher ? "more" : "less"}
                </span>{" "}
                on <span className={`font-bold ${heading}`}>{alert.category}</span> this month vs last.
              </>
            ) : (
              "Not enough history yet to compare months — keep logging expenses."
            )}
          </InsightCard>

          {/* Smart Tip */}
          <InsightCard
            darkMode={darkMode}
            tone="emerald"
            icon={<LightbulbIcon className="w-3.5 h-3.5" strokeWidth={2.5} />}
            title="Smart Tip"
            prompt={tipPrompt}
            onAsk={ask}
          >
            {tip ? (
              <>
                Trimming <span className={`font-bold ${heading}`}>{tip.category}</span> could save you about{" "}
                <span className="font-bold text-emerald-500">{formatTaka(tip.savings)}</span> this month.
              </>
            ) : (
              "Log a few expenses and I'll surface a personalized saving tip."
            )}
          </InsightCard>

          {/* Budget Status */}
          <InsightCard
            darkMode={darkMode}
            tone="violet"
            icon={<WalletIcon className="w-3.5 h-3.5" strokeWidth={2.5} />}
            title="Budget Status"
            badge={
              <span className={`ml-auto text-xs font-black ${overBudget ? "text-rose-500" : darkMode ? "text-violet-300" : "text-violet-600"}`}>
                {budget.pct}%
              </span>
            }
            prompt={budgetPrompt}
            onAsk={ask}
            footer={
              <>
                <div className={`h-2 rounded-full overflow-hidden ${darkMode ? "bg-slate-700" : "bg-slate-200"}`}>
                  <div
                    className={`h-full rounded-full ${overBudget ? "bg-gradient-to-r from-rose-500 to-orange-500" : "bg-gradient-to-r from-violet-500 to-indigo-500"}`}
                    style={{ width: `${budgetPct}%` }}
                  />
                </div>
                <p className={`mt-2 text-[11px] font-medium ${muted}`}>
                  {formatTaka(budget.used)} of {formatTaka(budget.target)} used
                </p>
              </>
            }
          />
        </div>
      </section>

      {/* ── Recent Queries ── */}
      <RecentQueries darkMode={darkMode} queries={recentQueries} onAsk={ask} />
    </div>
  );
};

export default InsightsRail;
