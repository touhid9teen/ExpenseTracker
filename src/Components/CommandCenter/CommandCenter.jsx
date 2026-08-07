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

  const commands = [
    { key: "chat", label: "Ask AI", icon: SparklesIcon },
    { key: "add", label: "Add Expense", icon: PlusIcon, action: "modal" },
    { key: "ledger", label: "Table", icon: ClipboardListIcon },
    { key: "statistics", label: "Statistics", icon: ChartBarSquareIcon },
    { key: "tips", label: "Budget Tips", icon: LightbulbIcon, action: "tips" },
    { key: "about", label: "About", icon: InfoCircleIcon },
    ...(isAdmin
      ? [{ key: "admin", label: "Admin", icon: ShieldCheckIcon }]
      : []),
  ];

  const isCommandActive = (cmd) => !cmd.action && cmd.key === activeTab;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
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
                ? "bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 text-white border-transparent shadow-lg shadow-violet-500/30"
                : darkMode
                  ? "bg-slate-900 border-slate-700/70 text-slate-100 hover:-translate-y-0.5 hover:border-violet-500/50 hover:text-violet-300 hover:shadow-lg hover:shadow-violet-500/10"
                  : "bg-white border-slate-200 text-slate-500 hover:-translate-y-0.5 hover:border-violet-300 hover:text-violet-600 hover:shadow-lg hover:shadow-violet-500/10"
            }`}
          >
            <Icon
              className={`w-6 h-6 ${isActive ? "drop-shadow" : darkMode ? "text-violet-400" : ""}`}
              strokeWidth={2.25}
            />
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
