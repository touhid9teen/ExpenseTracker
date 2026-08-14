import { ChevronLeftIcon, XIcon } from "./Icons";

// ── Shared design tokens matching the app's main (SaaS dashboard) flow ──
// Soft rounded surfaces, slate borders, violet→indigo gradient CTAs and
// focus rings — the same language used by Ledger / Statistics / Admin.

export const fieldClass = (darkMode) =>
  `w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium outline-none transition-colors ${
    darkMode
      ? "bg-slate-800/70 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-violet-500"
      : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-violet-400"
  }`;

export const ghostBtnClass = (darkMode) =>
  `inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all duration-200 active:scale-95 ${
    darkMode
      ? "bg-slate-900 border-slate-700/70 text-slate-200 hover:border-violet-500/50 hover:text-violet-300"
      : "bg-white border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600"
  }`;

export const primaryBtnClass = `inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 shadow-lg shadow-violet-500/30 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed`;

const dividerClass = (darkMode) => (darkMode ? "border-slate-800" : "border-slate-100");

export const ModalShell = ({
  darkMode,
  onClose,
  onBack,
  title,
  subtitle,
  icon,
  children,
  maxWidth = "max-w-lg",
}) => (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-sm">
    <div
      className={`relative w-full ${maxWidth} rounded-2xl border shadow-2xl animate-fadeIn ${
        darkMode ? "bg-slate-900 border-slate-700/70" : "bg-white border-slate-200"
      }`}
    >
      {/* ── Header ── */}
      <div
        className={`flex items-center justify-between px-5 sm:px-6 py-4 border-b ${dividerClass(darkMode)}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              aria-label="Go back"
              className={`p-2 rounded-lg transition-colors shrink-0 ${
                darkMode
                  ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
          )}
          {icon && (
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                darkMode ? "bg-violet-500/15 text-violet-300" : "bg-violet-100 text-violet-600"
              }`}
            >
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <h3
              className={`text-base sm:text-lg font-extrabold tracking-tight truncate ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              {title}
            </h3>
            {subtitle && (
              <p className={`text-[11px] mt-0.5 truncate ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className={`p-2 rounded-lg transition-colors shrink-0 ${
            darkMode
              ? "text-slate-400 hover:bg-slate-800 hover:text-white"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>

      {/* ── Body ── */}
      <div className="px-5 sm:px-6 py-5 max-h-[75vh] overflow-y-auto no-scrollbar">{children}</div>
    </div>
  </div>
);

export default ModalShell;
