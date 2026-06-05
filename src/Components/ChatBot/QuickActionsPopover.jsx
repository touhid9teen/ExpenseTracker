import React from "react";
import { XIcon } from "../Icons";
import SUGGESTIONS from "./suggestions";

/**
 * QuickActionsPopover – 2×2 grid of shortcut actions that appears
 * above the input row when toggled.
 *
 * Props:
 *   - darkMode        : boolean
 *   - onClose         : () => void
 *   - onSelectAction  : (suggestion) => void
 */
const QuickActionsPopover = ({ darkMode, onClose, onSelectAction }) => (
  <div
    className={`absolute bottom-full left-0 right-0 mb-2 rounded-2xl border overflow-hidden shadow-xl ${
      darkMode
        ? "bg-slate-800 border-slate-700 shadow-black/40"
        : "bg-white border-slate-200 shadow-slate-200/80"
    }`}
  >
    {/* Popover header */}
    <div
      className={`px-4 py-2.5 border-b flex items-center justify-between ${
        darkMode ? "border-slate-700" : "border-slate-100"
      }`}
    >
      <span
        className={`text-[11px] font-semibold uppercase tracking-widest ${
          darkMode ? "text-slate-400" : "text-slate-400"
        }`}
      >
        Quick actions
      </span>
      <button
        onClick={onClose}
        className={`p-1 rounded-lg transition-colors ${
          darkMode
            ? "hover:bg-slate-700 text-slate-500"
            : "hover:bg-slate-100 text-slate-400"
        }`}
      >
        <XIcon className="w-3.5 h-3.5" />
      </button>
    </div>

    {/* 2×2 grid */}
    <div className="grid grid-cols-2 gap-0">
      {SUGGESTIONS.map((s, idx) => (
        <button
          key={idx}
          onClick={() => onSelectAction(s)}
          className={`flex items-center gap-3 px-4 py-3.5 text-left transition-all border-b border-r ${
            idx % 2 === 1 ? "border-r-0" : ""
          } ${idx >= 2 ? "border-b-0" : ""} ${
            darkMode
              ? "border-slate-700 hover:bg-slate-700/60"
              : "border-slate-100 hover:bg-slate-50"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${s.iconBg}`}
          >
            {s.icon}
          </div>
          <div className="min-w-0">
            <p
              className={`text-xs font-semibold leading-tight truncate ${
                darkMode ? "text-slate-200" : "text-slate-700"
              }`}
            >
              {s.label}
            </p>
            <p
              className={`text-[10px] leading-tight truncate mt-0.5 ${
                darkMode ? "text-slate-500" : "text-slate-400"
              }`}
            >
              {s.sub}
            </p>
          </div>
        </button>
      ))}
    </div>
  </div>
);

export default QuickActionsPopover;
