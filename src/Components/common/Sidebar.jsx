"use client";

import { memo } from "react";
import {
  SparklesIcon,
  ChartPieIcon,
  PlusIcon,
  ClipboardListIcon,
  ChartBarSquareIcon,
  LightbulbIcon,
  InfoCircleIcon,
  ShieldCheckIcon,
  MoonIcon,
  SunIcon,
  ChevronDownIcon,
  CrownIcon,
} from "./Icons";

const TIP_PROMPT =
  "Suggest ways I can reduce my spending based on my expenses. Give me 3 practical tips with the ৳ amounts involved.";

/**
 * Sidebar – the fixed left navigation panel (matches the dashboard mockup).
 *   - Logo + nav links (Command Center / Add Expense / Table / Statistics /
 *     Budget Tips / About / Admin)
 *   - Go Premium upsell card
 *   - Dark-mode toggle switch
 *   - User profile footer
 *
 * Hidden below `lg` – the CommandCenter nav cards row takes over navigation
 * on small screens (and the header holds theme + login/logout there).
 */
const Sidebar = memo(function Sidebar({
  darkMode,
  toggleTheme,
  user,
  activeTab,
  setActiveTab,
  setShowQuickAdd,
  setPendingAction,
  isAdmin = false,
}) {
  const handleClick = (item) => {
    if (item.action === "modal") {
      setShowQuickAdd(true);
      return;
    }
    if (item.action === "tips") {
      setPendingAction({ action: "send", text: TIP_PROMPT });
      setActiveTab("chat");
    } else {
      setActiveTab(item.key);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navItems = [
    { key: "overview", label: "Command Center", icon: ChartPieIcon },
    { key: "add", label: "Add Expense", icon: PlusIcon, action: "modal" },
    { key: "ledger", label: "Table", icon: ClipboardListIcon },
    { key: "statistics", label: "Statistics", icon: ChartBarSquareIcon },
    { key: "tips", label: "Budget Tips", icon: LightbulbIcon, action: "tips" },
  ];

  const isActive = (item) => !item.action && item.key === activeTab;

  return (
    <aside
      className={`hidden lg:flex lg:flex-col lg:w-64 shrink-0 lg:sticky lg:top-0 lg:h-screen border-r transition-colors duration-300 ${
        darkMode ? "bg-[#0d1326] border-slate-800" : "bg-white border-slate-200"
      }`}
    >
      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-6 pt-6 pb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
          <SparklesIcon className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        <span
          className={`text-xl font-extrabold tracking-tight ${
            darkMode ? "text-white" : "text-slate-900"
          }`}
        >
          FinVue
        </span>
      </div>

      {/* ── Nav links ── */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <p
          className={`px-2 pb-2 text-[11px] font-bold uppercase tracking-widest ${
            darkMode ? "text-slate-500" : "text-slate-400"
          }`}
        >
          Menu
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <button
              key={item.key}
              onClick={() => handleClick(item)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                active
                  ? darkMode
                    ? "bg-violet-500/25 text-white shadow-inner"
                    : "bg-violet-100 text-violet-700"
                  : darkMode
                    ? "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" strokeWidth={2.25} />
              {item.label}
              {active && (
                <span
                  className={`ml-auto w-1.5 h-1.5 rounded-full ${
                    darkMode ? "bg-violet-400" : "bg-violet-500"
                  }`}
                />
              )}
            </button>
          );
        })}

        <div className={`h-px my-3 ${darkMode ? "bg-slate-800" : "bg-slate-100"}`} />

        <button
          onClick={() => setActiveTab("about")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            activeTab === "about"
              ? darkMode
                ? "bg-violet-500/25 text-white"
                : "bg-violet-100 text-violet-700"
              : darkMode
                ? "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <InfoCircleIcon className="w-5 h-5 shrink-0" strokeWidth={2.25} />
          About
        </button>

        {isAdmin && (
          <button
            onClick={() => setActiveTab("admin")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === "admin"
                ? darkMode
                  ? "bg-violet-500/25 text-white"
                  : "bg-violet-100 text-violet-700"
                : darkMode
                  ? "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <ShieldCheckIcon className="w-5 h-5 shrink-0" strokeWidth={2.25} />
            Admin
          </button>
        )}

        {/* ── Go Premium card ── */}
        <div
          className={`mt-4 rounded-2xl p-4 border ${
            darkMode
              ? "bg-[#0e1428] border-violet-500/30"
              : "bg-violet-50 border-violet-100"
          }`}
        >
          <p
            className={`flex items-center gap-1.5 text-sm font-extrabold ${
              darkMode ? "text-violet-300" : "text-violet-700"
            }`}
          >
            <CrownIcon className="w-4 h-4" strokeWidth={2.25} />
            Go Premium
          </p>
          <p
            className={`mt-1 text-xs leading-relaxed ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Unlock advanced reports, custom categories &amp; more.
          </p>
          <button
            className={`mt-3 w-full rounded-full py-2 text-xs font-bold transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
              darkMode
                ? "bg-slate-900 text-white border border-violet-500/50 hover:bg-slate-800 hover:border-violet-400"
                : "bg-white text-violet-600 shadow-sm hover:shadow"
            }`}
          >
            Upgrade Now
          </button>
        </div>
      </nav>

      {/* ── Dark mode toggle ── */}
      <div
        className={`px-6 py-4 border-t flex items-center justify-between ${
          darkMode ? "border-slate-800" : "border-slate-100"
        }`}
      >
        <span
          className={`flex items-center gap-2 text-sm font-semibold ${
            darkMode ? "text-slate-200" : "text-slate-600"
          }`}
        >
          {darkMode ? (
            <MoonIcon className="w-4 h-4" strokeWidth={2.25} />
          ) : (
            <SunIcon className="w-4 h-4" strokeWidth={2.25} />
          )}
          Dark mode
        </span>
        <button
          onClick={toggleTheme}
          role="switch"
          aria-checked={darkMode}
          aria-label="Toggle dark mode"
          className={`relative w-10 h-6 rounded-full transition-colors duration-200 ${
            darkMode ? "bg-violet-500" : "bg-slate-300"
          }`}
        >
          <span
            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
              darkMode ? "translate-x-[18px]" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {/* ── User profile ── */}
      {user && (
        <div
          className={`px-4 pb-5 border-t flex items-center gap-3 ${
            darkMode ? "border-slate-800" : "border-slate-100"
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-sm font-extrabold shrink-0">
            {user.username?.charAt(0).toUpperCase() || "?"}
          </div>
          <div className="min-w-0 flex-1">
            <p
              className={`text-sm font-bold truncate ${
                darkMode ? "text-white" : "text-slate-800"
              }`}
            >
              {user.username}
            </p>
            <p
              className={`text-xs truncate ${
                darkMode ? "text-slate-500" : "text-slate-400"
              }`}
            >
              {user.email || "user@finvue.app"}
            </p>
          </div>
          <ChevronDownIcon
            className={`w-4 h-4 shrink-0 ${
              darkMode ? "text-slate-500" : "text-slate-400"
            }`}
          />
        </div>
      )}
    </aside>
  );
});

export default Sidebar;
