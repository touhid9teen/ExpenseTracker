import React from "react";

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
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
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
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
);

export default ChatBotHeader;
