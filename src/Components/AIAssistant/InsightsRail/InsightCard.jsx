"use client";

import { ArrowRightIcon } from "../../common/Icons";

const toneClasses = {
  rose: {
    card: (dark) => (dark ? "bg-rose-500/5 border-rose-500/20" : "bg-rose-50/60 border-rose-100"),
    icon: (dark) => (dark ? "bg-rose-500/15 text-rose-300" : "bg-rose-100 text-rose-600"),
  },
  emerald: {
    card: (dark) => (dark ? "bg-emerald-500/5 border-emerald-500/20" : "bg-emerald-50/60 border-emerald-100"),
    icon: (dark) => (dark ? "bg-emerald-500/15 text-emerald-300" : "bg-emerald-100 text-emerald-600"),
  },
  violet: {
    card: (dark) => (dark ? "bg-slate-800/50 border-slate-700/70" : "bg-slate-50 border-slate-200"),
    icon: (dark) => (dark ? "bg-violet-500/15 text-violet-300" : "bg-violet-100 text-violet-600"),
  },
};

/**
 * InsightCard – one "Ask AI" insight card in the InsightsRail. Tones
 * (rose / emerald / violet) style the card + icon chip; the body renders
 * arbitrary content and an optional footer slot (e.g. a budget progress bar).
 */
const InsightCard = ({
  darkMode,
  tone = "violet",
  icon,
  title,
  badge = null,
  prompt,
  onAsk,
  children,
  footer = null,
}) => {
  const t = toneClasses[tone] || toneClasses.violet;
  const heading = darkMode ? "text-white" : "text-slate-900";
  const muted = darkMode ? "text-slate-400" : "text-slate-500";

  return (
    <article className={`rounded-xl p-3.5 border ${t.card(darkMode)}`}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className={`w-6 h-6 rounded-lg flex items-center justify-center ${t.icon(darkMode)}`}>
          {icon}
        </span>
        <h4 className={`text-xs font-bold ${heading}`}>{title}</h4>
        {badge}
      </div>
      {children && <p className={`text-xs leading-relaxed ${muted}`}>{children}</p>}
      {footer}
      <button
        onClick={() => onAsk(prompt)}
        className={`mt-2 inline-flex items-center gap-1 text-[11px] font-bold transition-colors ${darkMode ? "text-violet-300 hover:text-violet-200" : "text-violet-600 hover:text-violet-700"}`}
      >
        Ask AI <ArrowRightIcon className="w-3 h-3" strokeWidth={2.5} />
      </button>
    </article>
  );
};

export default InsightCard;
