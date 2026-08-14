"use client";
import { SparklesIcon, SavingsLeafIcon, ArrowRightIcon } from "../ui/Icons";
import { calculateSpendingInsights } from "../../utils/expenseCalculations/index";
import { formatTaka } from "./panelStyles";

export const AIInsightCards = ({ darkMode, expenses = [], setActiveTab, setPendingAction }) => {
    const { alert, tip } = calculateSpendingInsights(expenses);

    const askAI = (text) => {
        if (setPendingAction) setPendingAction({ action: "send", text });
        if (setActiveTab) setActiveTab("chat");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const alertText = alert
        ? `Your ${alert.category} spending is ${Math.abs(alert.pct)}% ${alert.higher ? "higher" : "lower"} than last month.`
        : "Add a few expenses and I'll surface spending patterns here.";

    const tipText = tip
        ? `Trimming ${tip.category} by ~15% could save about ${formatTaka(tip.savings)} this month.`
        : "Once you have spending data, I'll suggest concrete ways to save.";

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* AI Insight */}
            <div className="relative overflow-hidden rounded-2xl p-3.5 text-white bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 shadow-lg shadow-violet-500/30">
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
                <div className="relative">
                    <div className="flex items-center gap-2.5 mb-2">
                        <span className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                            <SparklesIcon className="w-4 h-4" strokeWidth={2.25} />
                        </span>
                        <h3 className="text-sm font-extrabold">AI Insight</h3>
                    </div>
                    <p className="text-xs leading-relaxed text-white/90">{alertText}</p>
                    <button
                        onClick={() => askAI("Give me a detailed breakdown of my spending changes this month vs last month, by category, with the ৳ amounts.")}
                        className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/95 text-violet-700 transition-all duration-200 hover:scale-[1.03] active:scale-95"
                    >
                        Ask AI about this
                        <ArrowRightIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            {/* Savings Opportunity */}
            <div
                className={`rounded-2xl p-3.5 border ${
                    darkMode ? "bg-slate-900 border-slate-700/70" : "bg-white border-slate-200"
                }`}
            >
                <div className="flex items-center gap-2.5 mb-2">
                    <span className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                        <SavingsLeafIcon className="w-4 h-4" strokeWidth={2.25} />
                    </span>
                    <h3 className={`text-sm font-extrabold ${darkMode ? "text-white" : "text-slate-900"}`}>
                        Savings Opportunity
                    </h3>
                </div>
                <p className={`text-xs leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{tipText}</p>
                <button
                    onClick={() => askAI("Suggest ways I can reduce my spending based on my expenses. Give me 3 practical tips with the ৳ amounts involved.")}
                    className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-gradient-to-br from-emerald-500 to-teal-500 text-white transition-all duration-200 hover:scale-[1.03] active:scale-95"
                >
                    Get savings tips
                    <ArrowRightIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
};

export default AIInsightCards;
