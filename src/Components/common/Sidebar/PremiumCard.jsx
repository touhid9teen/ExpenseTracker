"use client";

/**
 * PremiumCard – the "Go Premium" upsell shown above the dark-mode toggle.
 */
const PremiumCard = ({ darkMode }) => (
  <div className="px-4 pb-3">
    <div
      className={`rounded-xl border p-4 ${
        darkMode
          ? "bg-[#0e1428] border-slate-800"
          : "bg-[#FAFAFC] border-[#EBEBEC]"
      }`}
    >
      <p
        className={`text-sm font-bold ${
          darkMode ? "text-white" : "text-slate-900"
        }`}
      >
        Go Premium ✨✨
      </p>
      <p
        className={`mt-1 text-xs leading-relaxed ${
          darkMode ? "text-slate-400" : "text-slate-500"
        }`}
      >
        Unlock advanced reports, custom categories &amp; more.
      </p>
      <button
        className={`mt-3 w-full rounded-full border py-2 text-xs font-bold transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
          darkMode
            ? "bg-transparent text-violet-400 border-violet-500/50 hover:bg-violet-500/10"
            : "bg-white text-violet-600 border-violet-500/50 hover:bg-violet-50"
        }`}
      >
        Upgrade Now
      </button>
    </div>
  </div>
);

export default PremiumCard;
