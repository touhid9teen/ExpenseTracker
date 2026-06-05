import React from "react";
import { LightningBoltIcon, XIcon } from "../Icons";

/**
 * ChatBotHeader – avatar, title, online status dot, and close button.
 *
 * Props:
 *   - darkMode : boolean
 *   - onClose  : () => void
 */
const ChatBotHeader = ({ darkMode, onClose }) => (
  <div
    className={`px-5 py-4 border-b flex items-center justify-between gap-3 flex-shrink-0 ${
      darkMode
        ? "bg-slate-800/80 border-slate-700"
        : "bg-slate-50 border-slate-200"
    }`}
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg flex-shrink-0">
        <LightningBoltIcon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3
          className={`font-bold text-base ${darkMode ? "text-white" : "text-slate-800"}`}
        >
          FinVue AI
        </h3>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
          <p
            className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}
          >
            Always here to help
          </p>
        </div>
      </div>
    </div>
    <button
      onClick={onClose}
      aria-label="Close chat"
      className={`p-2 rounded-full transition-colors ${
        darkMode
          ? "hover:bg-slate-700 text-slate-400"
          : "hover:bg-slate-200 text-slate-500"
      }`}
    >
      <XIcon className="w-4 h-4" />
    </button>
  </div>
);

export default ChatBotHeader;
