"use client";

import { XIcon, CheckIcon } from "../common/Icons";

/**
 * QuickConfirmCard – the smart-expense entry chip shown above the composer
 * whenever the typed input parses as an expense. Lets the user tweak amount,
 * category, description and date, then add it in one tap.
 */
const QuickConfirmCard = ({ darkMode, suggestion, setSuggestion, onConfirm, SMART_CATEGORIES }) => {
  const fieldClass = (focus) =>
    `w-full px-2.5 py-1.5 rounded-lg border text-sm outline-none transition-colors ${
      darkMode
        ? `bg-slate-800 border-slate-700 ${focus}`
        : `bg-slate-50 border-slate-200 ${focus}`
    }`;

  const labelClass = `block text-[10px] font-semibold uppercase mb-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`;

  return (
    <div className="px-4 sm:px-6 pt-3 flex-shrink-0">
      <div
        className={`rounded-xl border p-3 sm:p-4 shadow-sm ${
          darkMode
            ? "bg-slate-900 border-slate-700"
            : "bg-white border-slate-200"
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <p className={`text-[11px] font-bold uppercase tracking-widest ${darkMode ? "text-violet-300" : "text-violet-600"}`}>
            ⚡ Quick add expense
          </p>
          <button
            onClick={() => setSuggestion(null)}
            aria-label="Dismiss"
            className={`p-1 transition-colors ${darkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-400 hover:text-slate-600"}`}
          >
            <XIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <label className="block">
            <span className={labelClass}>Amount (৳)</span>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={suggestion.amount}
              onChange={(e) => setSuggestion((s) => ({ ...s, amount: e.target.value }))}
              className={`${fieldClass(darkMode ? "text-violet-300 focus:border-violet-500" : "text-violet-700 focus:border-violet-400")} font-bold`}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Category</span>
            <select
              value={suggestion.category}
              onChange={(e) => setSuggestion((s) => ({ ...s, category: e.target.value }))}
              className={`${fieldClass(darkMode ? "text-slate-100 focus:border-violet-500" : "text-slate-800 focus:border-violet-400")} font-semibold cursor-pointer`}
            >
              {SMART_CATEGORIES.map((c) => (
                <option key={c} value={c} className={darkMode ? "bg-slate-900" : "bg-white"}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={labelClass}>Description</span>
            <input
              type="text"
              value={suggestion.description}
              onChange={(e) => setSuggestion((s) => ({ ...s, description: e.target.value }))}
              className={`${fieldClass(darkMode ? "text-slate-100 focus:border-violet-500" : "text-slate-800 focus:border-violet-400")} font-medium`}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Date</span>
            <input
              type="date"
              value={suggestion.date}
              onChange={(e) => setSuggestion((s) => ({ ...s, date: e.target.value }))}
              className={`${fieldClass(darkMode ? "text-slate-100 focus:border-violet-500" : "text-slate-800 focus:border-violet-400")} font-medium`}
            />
          </label>
        </div>

        <div className="flex justify-end gap-2 mt-3">
          <button
            onClick={() => setSuggestion(null)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-colors ${darkMode ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-br from-violet-500 to-indigo-500 shadow-sm shadow-violet-500/30 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
          >
            <CheckIcon className="w-3.5 h-3.5" strokeWidth={3} />
            Add Expense
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickConfirmCard;
