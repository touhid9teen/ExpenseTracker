import { memo } from "react";
import {
  FinVueLogoIcon,
  SunIcon,
  MoonIcon,
  CrownIcon,
} from "./Icons";

const AppHeader = memo(function AppHeader({
  darkMode,
  toggleTheme,
  user,
  handleLogout,
}) {
  const isAdmin = !!user?.isAdmin;
  return (
    <header
      className={`sticky top-0 z-30 transition-colors duration-300 border-b-2 ${
        darkMode
          ? "bg-[#0a0f1e]/92 border-cyan-900/40 backdrop-blur-md"
          : "bg-white/95 border-cyan-200/60 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 py-3 sm:py-0 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
        {/* Logo Area */}
        <div className="flex min-w-0 flex-1 sm:flex-none items-center gap-3">
          <div className="relative w-10 h-10 shrink-0 cyber-cut bg-gradient-to-tr from-cyan-500 via-sky-500 to-violet-500 flex items-center justify-center cyber-3d-sm [--glow-3d:var(--accent-glow-soft)]">
            <FinVueLogoIcon className="w-6 h-6 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
          </div>
          <div className="min-w-0">
            <span className={`block truncate font-extrabold text-xl tracking-tight ${darkMode ? "text-gradient-aurora" : "text-gradient-aurora-deep"}`}>
              FinVue
            </span>
            <span
              className={`text-xs block truncate font-medium -mt-1 ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Expense Control Center
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2.5 cyber-cut-sm border-2 transition-all duration-200 hover:scale-105 cyber-3d-sm [--glow-3d:var(--accent-glow-soft)] ${
              darkMode
                ? "bg-slate-900 border-cyan-800/60 text-cyan-400 hover:border-violet-500/70 hover:text-violet-400"
                : "bg-slate-100 border-slate-300 text-cyan-600 hover:border-violet-400 hover:text-violet-600"
            }`}
            id="theme-toggler"
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </button>

          {/* User Profile & Logout */}
          {user && (
            <div className="flex items-center gap-2 border-l-2 pl-3 ml-1 border-cyan-500/30">
              <div className="hidden sm:flex items-center gap-1.5">
                <div
                  className={`flex items-center justify-center w-8 h-8 cyber-cut-sm font-bold text-xs cyber-3d-sm [--glow-3d:var(--accent-glow-soft)] ${
                    darkMode
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "bg-cyan-100 text-cyan-700"
                  }`}
                >
                  {user.username.charAt(0).toUpperCase()}
                </div>
                {isAdmin && (
                  <span
                    title="Administrator"
                    className={`flex items-center justify-center w-6 h-6 cyber-cut-sm ${
                      darkMode ? "bg-violet-500/15 text-violet-400" : "bg-violet-100 text-violet-600"
                    }`}
                  >
                    <CrownIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className={`px-3 py-1.5 cyber-cut-sm text-xs font-bold transition-all duration-200 border-2 ${
                  darkMode
                    ? "bg-red-500/10 text-red-400 hover:bg-red-500/25 border-red-900/50"
                    : "bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                }`}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
});

export default AppHeader;
