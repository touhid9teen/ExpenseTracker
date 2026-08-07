"use client";

import { memo } from "react";
import { SunIcon, MoonIcon, LogoutIcon, LogInIcon } from "./Icons";

const TITLES = {
  overview: "Command Center",
  chat: "Ask AI",
  ledger: "Table",
  statistics: "Statistics",
  about: "About",
  admin: "Admin",
};

/**
 * AppHeader – the dashboard header above the main content (matches the
 * mockup): section title + subtitle on the left, theme toggle + login/logout
 * on the right. Sticky at the top of the content column.
 */
const AppHeader = memo(function AppHeader({
  darkMode,
  toggleTheme,
  user,
  handleLogout,
  onLogin,
  activeTab = "overview",
}) {
  const title = TITLES[activeTab] || "Command Center";

  return (
    <header
      className={`sticky top-0 z-30 border-b backdrop-blur-md transition-colors duration-300 ${
        darkMode
          ? "bg-[#0b0f19]/85 border-slate-800"
          : "bg-white/85 border-slate-200"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        {/* Title + subtitle */}
        <div className="min-w-0">
          <h1
            className={`text-xl sm:text-2xl font-extrabold tracking-tight truncate ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            {title}
          </h1>
          <p
            className={`text-xs sm:text-sm truncate ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Smartly manage your finances with FinVue AI ✨
          </p>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2.5">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className={`p-2.5 rounded-xl border transition-all duration-200 hover:scale-105 active:scale-95 ${
              darkMode
                ? "bg-slate-900 border-slate-700 text-violet-300 hover:border-violet-500/60"
                : "bg-white border-slate-200 text-slate-500 hover:border-violet-300 hover:text-violet-600 shadow-sm"
            }`}
          >
            {darkMode ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </button>

          {user ? (
            <button
              onClick={handleLogout}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
                darkMode
                  ? "bg-rose-500/10 text-rose-300 border-rose-800/60 hover:bg-rose-500/20"
                  : "bg-white text-rose-500 border-rose-200 hover:bg-rose-50 shadow-sm"
              }`}
            >
              <LogoutIcon className="w-4 h-4" strokeWidth={2.5} />
              Logout
            </button>
          ) : (
            <button
              onClick={onLogin}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-br from-violet-500 to-indigo-500 shadow-lg shadow-violet-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-95"
            >
              <LogInIcon className="w-4 h-4" strokeWidth={2.5} />
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
});

export default AppHeader;
