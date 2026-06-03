import React from "react";

/**
 * FloatingTrigger – the FAB button and "Ask AI" tooltip bubble.
 *
 * Props:
 *   - isOpen   : boolean – whether the chat window is visible
 *   - onToggle : () => void – toggle chat open/close
 *   - darkMode : boolean
 */
const FloatingTrigger = ({ isOpen, onToggle, darkMode }) => (
  <div className="fixed sm:bottom-8 sm:right-8 bottom-[90px] right-4 z-50 flex items-center gap-3">
    {!isOpen && (
      <div
        className="flex items-center gap-1.5 cursor-default select-none animate-pulse"
        style={{ animationDuration: "3s" }}
      >
        <svg
          className={`w-3 h-3 ${darkMode ? "text-indigo-400" : "text-indigo-500"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 2l1.236 3.804h4.001l-3.236 2.352 1.236 3.804L10 9.608 6.764 11.96l1.236-3.804L4.764 5.804h4.001L10 2z" />
        </svg>
        <span
          className={`text-[11px] font-bold tracking-wide uppercase ${
            darkMode ? "text-indigo-400" : "text-indigo-600"
          }`}
        >
          Ask AI
        </span>
        <span
          className={`block h-[2px] absolute -bottom-0.5 left-0 right-0 rounded-full ${
            darkMode
              ? "bg-gradient-to-r from-indigo-500 to-purple-500"
              : "bg-gradient-to-r from-indigo-500 to-pink-500"
          }`}
        />
      </div>
    )}

    <button
      onClick={onToggle}
      className={`p-3 sm:p-4 rounded-full shadow-2xl transition-colors flex items-center justify-center relative ${
        isOpen
          ? "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/40"
          : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-purple-500/40"
      }`}
      aria-label="Toggle AI Chat"
    >
      {isOpen ? (
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 relative z-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ) : (
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 relative z-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      )}
    </button>
  </div>
);

export default FloatingTrigger;
