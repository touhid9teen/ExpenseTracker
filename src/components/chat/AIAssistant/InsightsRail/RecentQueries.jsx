"use client";

import { ClockIcon, ArrowRightIcon } from "../../../ui/Icons";

/**
 * RecentQueries – the last handful of prompts the user sent, click to re-run.
 */
const RecentQueries = ({ darkMode, queries = [], onAsk }) => {
  const panelClass = darkMode ? "bg-slate-900 border-slate-700/70" : "bg-white border-slate-200";
  const heading = darkMode ? "text-white" : "text-slate-900";
  const muted = darkMode ? "text-slate-400" : "text-slate-500";

  return (
    <section className={`rounded-2xl border ${panelClass}`}>
      <div className={`flex items-center gap-2.5 px-5 py-4 border-b ${darkMode ? "border-slate-800" : "border-slate-100"}`}>
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-500"}`}>
          <ClockIcon className="w-4 h-4" strokeWidth={2.25} />
        </span>
        <h3 className={`text-sm font-extrabold ${heading}`}>Recent Queries</h3>
      </div>

      <div className="p-3">
        {queries.length === 0 ? (
          <p className={`px-2 py-6 text-center text-xs font-medium ${muted}`}>
            Your recent questions will show up here.
          </p>
        ) : (
          <ul className="space-y-1">
            {queries.map((q, idx) => (
              <li key={`${idx}-${q.slice(0, 12)}`}>
                <button
                  onClick={() => onAsk(q)}
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
  );
};

export default RecentQueries;
