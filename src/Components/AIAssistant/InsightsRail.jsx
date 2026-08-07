"use client";

import { useMemo } from "react";
import { calculateSpendingInsights, MONTHLY_BUDGET } from "../../utils/expenseCalculations";
import {
  SparklesIcon,
  WarningTriangleIcon,
  LightbulbIcon,
  WalletIcon,
  ClockIcon,
  ArrowRightIcon,
} from "../common/Icons";

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
          <article className={`rounded-xl p-3.5 border ${darkMode ? "bg-rose-500/5 border-rose-500/20" : "bg-rose-50/60 border-rose-100"}`}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center ${darkMode ? "bg-rose-500/15 text-rose-300" : "bg-rose-100 text-rose-600"}`}>
                <WarningTriangleIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
              </span>
              <h4 className={`text-xs font-bold ${heading}`}>Spending Alert</h4>
            </div>
            <p className={`text-xs leading-relaxed ${muted}`}>
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
            </p>
            <button
              onClick={() => ask(alertPrompt)}
              className={`mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold transition-colors ${darkMode ? "text-violet-300 hover:text-violet-200" : "text-violet-600 hover:text-violet-700"}`}
            >
              Ask AI <ArrowRightIcon className="w-3 h-3" strokeWidth={2.5} />
            </button>
          </article>

          {/* Smart Tip */}
          <article className={`rounded-xl p-3.5 border ${darkMode ? "bg-emerald-500/5 border-emerald-500/20" : "bg-emerald-50/60 border-emerald-100"}`}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center ${darkMode ? "bg-emerald-500/15 text-emerald-300" : "bg-emerald-100 text-emerald-600"}`}>
                <LightbulbIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
              </span>
              <h4 className={`text-xs font-bold ${heading}`}>Smart Tip</h4>
            </div>
            <p className={`text-xs leading-relaxed ${muted}`}>
              {tip ? (
                <>
                  Trimming <span className={`font-bold ${heading}`}>{tip.category}</span> could save you about{" "}
                  <span className="font-bold text-emerald-500">{formatTaka(tip.savings)}</span> this month.
                </>
              ) : (
                "Log a few expenses and I'll surface a personalized saving tip."
              )}
            </p>
            <button
              onClick={() => ask(tipPrompt)}
              className={`mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold transition-colors ${darkMode ? "text-violet-300 hover:text-violet-200" : "text-violet-600 hover:text-violet-700"}`}
            >
              Ask AI <ArrowRightIcon className="w-3 h-3" strokeWidth={2.5} />
            </button>
          </article>

          {/* Budget Status */}
          <article className={`rounded-xl p-3.5 border ${darkMode ? "bg-slate-800/50 border-slate-700/70" : "bg-slate-50 border-slate-200"}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center ${darkMode ? "bg-violet-500/15 text-violet-300" : "bg-violet-100 text-violet-600"}`}>
                <WalletIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
              </span>
              <h4 className={`text-xs font-bold ${heading}`}>Budget Status</h4>
              <span className={`ml-auto text-xs font-black ${overBudget ? "text-rose-500" : darkMode ? "text-violet-300" : "text-violet-600"}`}>
                {budget.pct}%
              </span>
            </div>
            <div className={`h-2 rounded-full overflow-hidden ${darkMode ? "bg-slate-700" : "bg-slate-200"}`}>
              <div
                className={`h-full rounded-full ${overBudget ? "bg-gradient-to-r from-rose-500 to-orange-500" : "bg-gradient-to-r from-violet-500 to-indigo-500"}`}
                style={{ width: `${budgetPct}%` }}
              />
            </div>
            <p className={`mt-2 text-[11px] font-medium ${muted}`}>
              {formatTaka(budget.used)} of {formatTaka(budget.target)} used
            </p>
            <button
              onClick={() => ask(budgetPrompt)}
              className={`mt-2 inline-flex items-center gap-1 text-[11px] font-bold transition-colors ${darkMode ? "text-violet-300 hover:text-violet-200" : "text-violet-600 hover:text-violet-700"}`}
            >
              Ask AI <ArrowRightIcon className="w-3 h-3" strokeWidth={2.5} />
            </button>
          </article>
        </div>
      </section>

      {/* ── Recent Queries ── */}
      <section className={`rounded-2xl border ${panelClass}`}>
        <div className={`flex items-center gap-2.5 px-5 py-4 border-b ${darkMode ? "border-slate-800" : "border-slate-100"}`}>
          <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-500"}`}>
            <ClockIcon className="w-4 h-4" strokeWidth={2.25} />
          </span>
          <h3 className={`text-sm font-extrabold ${heading}`}>Recent Queries</h3>
        </div>

        <div className="p-3">
          {recentQueries.length === 0 ? (
            <p className={`px-2 py-6 text-center text-xs font-medium ${muted}`}>
              Your recent questions will show up here.
            </p>
          ) : (
            <ul className="space-y-1">
              {recentQueries.map((q, idx) => (
                <li key={`${idx}-${q.slice(0, 12)}`}>
                  <button
                    onClick={() => ask(q)}
                    title={q}
                    className={`group w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${
                      darkMode ? "hover:bg-slate-800/70" : "hover:bg-slate-50"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${darkMode ? "bg-violet-400" : "bg-violet-500"}`} />
                    <span className={`flex-1 min-w-0 truncate text-xs font-medium ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                      {q}
                    </span>
                    <ArrowRightIcon className={`w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${darkMode ? "text-violet-300" : "text-violet-500"}`} strokeWidth={2.5} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default InsightsRail;
