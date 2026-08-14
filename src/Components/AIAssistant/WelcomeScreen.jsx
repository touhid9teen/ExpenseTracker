"use client";

import { SparklesIcon } from "../common/Icons";

/**
 * WelcomeScreen – the empty-conversation hero: gradient sparkle badge,
 * headline and the suggestion-card grid that seeds the conversation.
 */
const WelcomeScreen = ({ darkMode, SUGGESTIONS, onSuggestion }) => (
  <div className="my-auto py-6">
    <div className="text-center mb-6">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-3">
        <SparklesIcon className="w-7 h-7 text-white" strokeWidth={2.5} />
      </div>
      <h3 className={`text-lg font-black tracking-tight ${darkMode ? "text-white" : "text-slate-800"}`}>
        What would you like to do?
      </h3>
      <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
        Ask anything, or type an expense — I&apos;ll do the rest.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto">
      {SUGGESTIONS.map((s, idx) => (
        <button
          key={idx}
          onClick={() => onSuggestion(s)}
          className={`flex items-center gap-3 px-3.5 py-3 text-left rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
            darkMode
              ? "bg-slate-900/70 border-slate-700/70 hover:border-violet-500/50"
              : "bg-white border-slate-200 hover:border-violet-300"
          }`}
        >
          <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${s.iconBg}`}>
            {s.icon}
          </span>
          <span className="min-w-0">
            <span className={`block text-xs font-bold leading-tight truncate ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
              {s.label}
            </span>
            <span className={`block text-[10px] leading-tight truncate mt-0.5 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
              {s.sub}
            </span>
          </span>
        </button>
      ))}
    </div>
  </div>
);

export default WelcomeScreen;
