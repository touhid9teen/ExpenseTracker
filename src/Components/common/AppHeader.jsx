"use client";

import { memo } from "react";
import { SunIcon, MoonIcon, LogoutIcon, LogInIcon, SparklesIcon, ExpandIcon, RefreshIcon, MenuHamburgerIcon } from "./Icons";

const TITLES = {
  overview: "Command Center",
  chat: "AI Assistant",
  ledger: "Table",
  statistics: "Statistics",
  about: "About",
  admin: "Admin",
};

const SUBTITLES = {
  chat: "Your smart financial companion",
};

/**
 * AppHeader – the dashboard header above the main content (matches the
 * mockup): section title + subtitle on the left, bordered action buttons on
 * the right. Sticky at the top of the content column, with NO border below.
 * On the chat tab it gains "New chat" + fullscreen-toggle buttons.
 */
const AppHeader = memo(function AppHeader({
  darkMode,
  toggleTheme,
  user,
  handleLogout,
  onLogin,
  activeTab = "overview",
  isChat = false,
  chatExpanded = false,
  onToggleExpanded,
  onNewChat,
  onToggleSidebar,
}) {
  const title = TITLES[activeTab] || "Command Center";
  const subtitle = SUBTITLES[activeTab] || "Smartly manage your finances with FinVue AI ✨";

  const actionBtn =
    darkMode
      ? "bg-slate-900 border-slate-700 text-slate-300 hover:border-violet-500/60 hover:text-violet-300"
      : "bg-white border-slate-200 text-slate-500 hover:border-violet-300 hover:text-violet-600 shadow-sm";

  return (
    <header className="transition-colors duration-300">
      <div className="px-4 sm:px-6 lg:px-6 py-3 flex items-center justify-between gap-4">
        <div className="min-w-0 flex items-center gap-3">
          {/* Collapsible sidebar toggle — small screens only */}
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle navigation menu"
            className={`lg:hidden p-2.5 rounded-xl border transition-all duration-200 hover:scale-105 active:scale-95 ${actionBtn}`}
          >
            <MenuHamburgerIcon className="w-5 h-5" />
          </button>

          {/* Title + subtitle */}
          <div className="min-w-0">
          <h1
            className={`flex items-center gap-2 text-xl sm:text-2xl font-extrabold tracking-tight truncate ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            {isChat && (
              <span className="flex items-center shrink-0 gap-0.5" aria-hidden="true">
                <SparklesIcon className="w-5 h-5 text-violet-500" strokeWidth={2.5} />
                <SparklesIcon className="w-3.5 h-3.5 text-indigo-500 -ml-1" strokeWidth={2.5} />
              </span>
            )}
            {title}
          </h1>
          <p
            className={`text-xs sm:text-sm truncate ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {subtitle}
          </p>
          </div>
        </div>

        {/* Actions — every button is a bordered white card (mockup style) */}
        <div className="flex shrink-0 items-center gap-2.5">
          {isChat && (
            <button
              onClick={onNewChat}
              className={`hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 hover:scale-[1.02] active:scale-95 ${actionBtn}`}
            >
              <RefreshIcon className="w-4 h-4" strokeWidth={2.5} />
              New chat
            </button>
          )}
          {isChat && (
            <button
              onClick={onToggleExpanded}
              aria-label={chatExpanded ? "Exit fullscreen chat" : "Fullscreen chat"}
              className={`hidden xl:inline-flex p-2.5 rounded-xl border transition-all duration-200 hover:scale-105 active:scale-95 ${actionBtn}`}
            >
              <ExpandIcon className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className={`p-2.5 rounded-xl border transition-all duration-200 hover:scale-105 active:scale-95 ${actionBtn}`}
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
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
                darkMode
                  ? "bg-slate-900 text-violet-300 border-violet-500/50 hover:bg-violet-500/10"
                  : "bg-white text-violet-600 border-violet-200 hover:bg-violet-50 shadow-sm"
              }`}
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
