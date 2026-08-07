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
 * CommandCenter – the "command buttons in the middle of the site".
 * Replaces the old tab dock: every feature is one big button. Clicking a
 * button scrolls to the top and swaps the content below.
 *
 * Props:
 *   - darkMode      : boolean
 *   - activeTab     : string  (current section)
 *   - setActiveTab  : (tab) => void
 *   - setShowQuickAdd : (bool) => void – opens the manual add modal
 *   - setPendingAction : (action) => void – routes AI commands to chat
 *   - isAdmin       : boolean
 */
const CommandCenter = memo(function CommandCenter({
  darkMode,
  activeTab,
  setActiveTab,
  setShowQuickAdd,
  setPendingAction,
  isAdmin = false,
}) {
  const base =
    "relative flex flex-col items-center justify-center gap-1.5 cyber-cut-sm border-2 px-3 sm:px-4 py-3 sm:py-3.5 transition-all duration-200 active:scale-95 focus:outline-none";

  const idle = darkMode
    ? "bg-slate-900/80 border-slate-700/70 text-slate-300 hover:border-cyan-600/70 hover:text-cyan-300 hover:-translate-y-0.5 cyber-3d-sm [--glow-3d:var(--accent-glow-soft)]"
    : "bg-white border-slate-300 text-slate-600 hover:border-cyan-400 hover:text-cyan-600 hover:-translate-y-0.5 cyber-3d-sm";

  // NOTE: no cyber-cut-shadow here — it would override cyber-btn-accent's
  // filter (utilities layer beats components layer in the cascade) and
  // flatten the button's 3D pressable edge.
  const active = "cyber-btn-accent text-white border-cyan-400/80";

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

  const isCommandActive = (cmd) =>
    !cmd.action && cmd.key === activeTab;

  return (
    <div
      className={`relative cyber-cut-lg border-2 cyber-3d cyber-inner-edge cyber-shine overflow-hidden ${
        darkMode
          ? "bg-slate-900/80 border-cyan-900/50"
          : "bg-white/90 border-cyan-300/70"
      }`}
    >
      <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 opacity-80 pointer-events-none" />

      {/* Label */}
      <div className="flex items-center justify-center gap-2 px-4 pt-3.5 pb-1">
        <span
          className={`text-[11px] font-bold uppercase tracking-[0.22em] ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          Command Center
        </span>
        <span
          className={`inline-block w-1 h-3 cyber-cut-sm bg-gradient-to-b ${
            darkMode ? "from-cyan-400 to-violet-500" : "from-cyan-500 to-violet-600"
          }`}
        />
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 p-3.5 sm:p-4">
        {commands.map((cmd) => {
          const Icon = cmd.icon;
          const isActive = isCommandActive(cmd);
          return (
            <button
              key={cmd.key}
              onClick={() => handleClick(cmd)}
              aria-pressed={isActive}
              className={`${base} ${isActive ? active : idle}`}
            >
              {isActive && (
                <span className="absolute -top-px left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 opacity-90" />
              )}
              <Icon
                className="w-5 h-5 sm:w-6 sm:h-6"
                strokeWidth={2.5}
              />
              <span className="text-[11px] sm:text-xs font-bold leading-tight">
                {cmd.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

export default CommandCenter;
