import React from "react";
import QuickActionsPopover from "./QuickActionsPopover";

/**
 * ChatInput – bottom input bar with quick-actions toggle,
 * text field, and send button.
 *
 * Props:
 *   - input            : string
 *   - setInput         : (val) => void
 *   - isLoading        : boolean
 *   - darkMode         : boolean
 *   - showQuickActions : boolean
 *   - setShowQuickActions : (val) => void
 *   - onSend           : (e) => void
 *   - onSelectAction   : (suggestion) => void
 *   - inputRef         : React.RefObject
 */
const ChatInput = ({
  input,
  setInput,
  isLoading,
  darkMode,
  showQuickActions,
  setShowQuickActions,
  onSend,
  onSelectAction,
  inputRef,
}) => (
  <div
    className={`p-4 border-t flex-shrink-0 ${
      darkMode ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200"
    }`}
  >
    {/* Quick Actions Popover */}
    <div className="quick-actions-container relative">
      {showQuickActions && (
        <QuickActionsPopover
          darkMode={darkMode}
          onClose={() => setShowQuickActions(false)}
          onSelectAction={onSelectAction}
        />
      )}

      {/* Input row */}
      <form onSubmit={onSend} className="relative flex items-center gap-2">
        {/* Quick Actions toggle button */}
        <button
          type="button"
          onClick={() => setShowQuickActions((prev) => !prev)}
          aria-label="Quick actions"
          className={`flex-shrink-0 p-2.5 rounded-xl border transition-all ${
            showQuickActions
              ? "bg-indigo-500 border-indigo-500 text-white shadow-sm shadow-indigo-500/30"
              : darkMode
                ? "bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                : "bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
          }`}
        >
          {showQuickActions ? (
            <svg
              className="w-4 h-4"
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
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          )}
        </button>

        {/* Text input */}
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your expenses..."
            className={`w-full pl-4 pr-12 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
              darkMode
                ? "bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:bg-slate-800"
                : "bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white"
            }`}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
              !input.trim() || isLoading
                ? darkMode
                  ? "text-slate-600"
                  : "text-slate-400"
                : "text-emerald-500 hover:bg-emerald-500/10"
            }`}
          >
            <svg
              className="w-5 h-5 transform rotate-90"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default ChatInput;
