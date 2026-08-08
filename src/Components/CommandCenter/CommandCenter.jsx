"use client";

import { memo } from "react";
import {
  ClipboardListIcon,
  InfoCircleIcon,
  PlusIcon,
  SparklesIcon,
  LightbulbIcon,
  ShieldCheckIcon,
  ChartBarSquareIcon,
} from "../common/Icons";

const TIP_PROMPT =
  "Suggest ways I can reduce my spending based on my expenses. Give me 3 practical tips with the ৳ amounts involved.";

/**
 * CommandCenter – the nav cards row shown at the top of the content area
 * (matches the dashboard mockup): soft rounded cards, with the active card
 * filled by the violet→indigo gradient.
 */
const CommandCenter = memo(function CommandCenter({
  darkMode,
  activeTab,
  setActiveTab,
  setShowQuickAdd,
  setPendingAction,
  isAdmin = false,
}) {
  const handleClick = (cmd) => {
    if (cmd.action === "modal") {
      setShowQuickAdd(true);
      return;
    }
    if (cmd.action === "tips") {
      setPendingAction({ action: "send", text: TIP_PROMPT });
      setActiveTab("chat");
    } else {
      setActiveTab(cmd.key);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Each command gets its own icon color (tinted icon chip), matching the
  // mockup's colored icon boxes.
  const commands = [
    { key: "chat", label: "Ask AI", icon: SparklesIcon, iconBg: "bg-violet-100 text-violet-600", iconBgDark: "bg-violet-500/15 text-violet-300" },
    { key: "add", label: "Add Expense", icon: PlusIcon, action: "modal", iconBg: "bg-emerald-100 text-emerald-600", iconBgDark: "bg-emerald-500/15 text-emerald-300" },
    { key: "ledger", label: "Table", icon: ClipboardListIcon, iconBg: "bg-sky-100 text-sky-600", iconBgDark: "bg-sky-500/15 text-sky-400" },
    { key: "statistics", label: "Statistics", icon: ChartBarSquareIcon, iconBg: "bg-indigo-100 text-indigo-600", iconBgDark: "bg-indigo-500/15 text-indigo-300" },
    { key: "tips", label: "Budget Tips", icon: LightbulbIcon, action: "tips", iconBg: "bg-amber-200/60 text-amber-600", iconBgDark: "bg-amber-500/15 text-amber-300" },
    { key: "about", label: "About", icon: InfoCircleIcon, iconBg: "bg-cyan-100 text-cyan-600", iconBgDark: "bg-cyan-500/15 text-cyan-300" },
    ...(isAdmin
      ? [{ key: "admin", label: "Admin", icon: ShieldCheckIcon, iconBg: "bg-rose-100 text-rose-600", iconBgDark: "bg-rose-500/15 text-rose-300" }]
      : []),
  ];

  const isCommandActive = (cmd) => !cmd.action && cmd.key === activeTab;

  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3 rounded-2xl border p-3 sm:p-4 shadow-sm ${
        darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
      }`}
    >
      {commands.map((cmd) => {
        const Icon = cmd.icon;
        const isActive = isCommandActive(cmd);
        return (
          <button
            key={cmd.key}
            onClick={() => handleClick(cmd)}
            aria-pressed={isActive}
            className={`relative flex flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-3.5 sm:py-4 transition-all duration-200 active:scale-95 focus:outline-none ${
              isActive
                ? "bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 text-white border-violet-200 shadow-lg shadow-violet-500/30"
                : darkMode
                  ? "bg-slate-900 border-slate-700/70 text-slate-100 hover:-translate-y-0.5 hover:border-violet-500/50 hover:text-violet-300 hover:shadow-lg hover:shadow-violet-500/10"
                  : "bg-white border-slate-200 text-slate-500 hover:-translate-y-0.5 hover:border-violet-300 hover:text-violet-600 hover:shadow-lg hover:shadow-violet-500/10"
            }`}
          >
            <span
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-200 ${
                isActive ? "bg-white/20 text-white" : darkMode ? cmd.iconBgDark : cmd.iconBg
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={2.25} />
            </span>
            <span className="text-[11px] sm:text-xs font-bold leading-tight">
              {cmd.label}
            </span>
          </button>
        );
      })}
    </div>
  );
});

export default CommandCenter;
