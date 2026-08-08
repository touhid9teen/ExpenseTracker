"use client";

import { memo } from "react";
import {
  HomeIcon,
  PlusCircleIcon,
  TableCellsIcon,
  ChartBarSquareIcon,
  LightbulbIcon,
  InfoCircleIcon,
  ShieldCheckIcon,
  MoonIcon,
  SunIcon,
  ChevronDownIcon,
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
    { key: "overview", label: "Command Center", icon: HomeIcon },
    { key: "add", label: "Add Expense", icon: PlusCircleIcon, action: "modal" },
    { key: "ledger", label: "Table", icon: TableCellsIcon },
    { key: "statistics", label: "Statistics", icon: ChartBarSquareIcon },
    { key: "tips", label: "Budget Tips", icon: LightbulbIcon, action: "tips" },
  ];

  const isActive = (item) => !item.action && item.key === activeTab;

  const itemClasses = (active) =>
    `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${active
      ? darkMode
        ? "bg-violet-500/25 text-white font-semibold"
        : "bg-[#EFEFFB] text-violet-700 font-semibold"
      : darkMode
        ? "text-slate-300 hover:bg-slate-800/70 hover:text-white font-medium"
        : "text-[#3D3A5C] hover:bg-[#F5F5FA] hover:text-[#1E1B4B] font-medium"}`;

  const renderItem = (item) => {
    const Icon = item.icon;
    return (
      <button
        key={item.key}
        onClick={() => handleClick(item)}
        className={itemClasses(isActive(item))}
      >
        <Icon className="w-5 h-5 shrink-0" strokeWidth={2} />
        {item.label}
      </button>
    );
  };

  const renderLink = (key, label, Icon, active) => (
    <button
      key={key}
      onClick={() => setActiveTab(key)}
      className={itemClasses(active)}
    >
      <Icon className="w-5 h-5 shrink-0" strokeWidth={2} />
      {label}
    </button>
  );

  return (
    <aside
      className={`hidden lg:flex lg:flex-col lg:w-64 shrink-0 lg:sticky lg:top-0 lg:h-screen border-r transition-colors duration-300 ${
        darkMode ? "bg-[#0d1326] border-slate-800" : "bg-white border-[#EBEBEC]"
      }`}
    >
      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-6 pt-6 pb-5">
        <div className="w-10 h-10 [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)] bg-gradient-to-br from-blue-500 via-violet-500 to-purple-600 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 20 20" className="w-6 h-6 text-white" fill="currentColor" aria-hidden="true">
            <path d="M7 0l2.4 4.6L14 7l-4.6 2.4L7 14l-2.4-4.6L0 7l4.6-2.4L7 0z" />
            <path d="M15.5 0l1.35 3.15L20 4.5l-3.15 1.35L15.5 9l-1.35-3.15L11 4.5l3.15-1.35L15.5 0z" />
          </svg>
        </div>
        <span
          className={`text-xl font-extrabold tracking-tight ${
            darkMode ? "text-white" : "text-[#1E1B4B]"
          }`}
        >
          FinVue
        </span>
      </div>

      {/* ── Nav links: top group ── */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map(renderItem)}

        <div className={`h-px my-3 ${darkMode ? "bg-slate-800" : "bg-[#EBEBEC]"}`} />

        {/* ── Nav links: middle group (About / Admin) ── */}
        {renderLink("about", "About", InfoCircleIcon, activeTab === "about")}
        {isAdmin &&
          renderLink("admin", "Admin", ShieldCheckIcon, activeTab === "admin")}
      </nav>

      {/* ── Go Premium card ── */}
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

      {/* ── Dark mode toggle row ── */}
      <div className="px-4 pb-4">
        <div
          className={`flex items-center justify-between rounded-xl border px-3 py-2.5 ${
            darkMode
              ? "bg-[#141a2e] border-slate-800"
              : "bg-[#F7F7FA] border-[#EBEBEC]"
          }`}
        >
          <span
            className={`flex items-center gap-2 text-sm font-medium ${
              darkMode ? "text-slate-200" : "text-[#3D3A5C]"
            }`}
          >
            {darkMode ? (
              <SunIcon className="w-4 h-4" strokeWidth={2.25} />
            ) : (
              <MoonIcon className="w-4 h-4" strokeWidth={2.25} />
            )}
            Dark mode
          </span>
          <button
            onClick={toggleTheme}
            role="switch"
            aria-checked={darkMode}
            aria-label="Toggle dark mode"
            className={`relative w-10 h-6 rounded-full transition-colors duration-200 shrink-0 ${
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
      </div>

      {/* ── User profile footer ── */}
      {user && (
        <div
          className={`px-4 py-4 border-t flex items-center gap-3 ${
            darkMode ? "border-slate-800" : "border-[#EBEBEC]"
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {user.username?.charAt(0).toUpperCase() || "?"}
          </div>
          <div className="min-w-0 flex-1">
            <p
              className={`text-sm font-bold truncate ${
                darkMode ? "text-white" : "text-slate-900"
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
