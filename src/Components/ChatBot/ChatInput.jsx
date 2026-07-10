import React from "react";
import { XIcon, MenuHamburgerIcon, SendIcon } from "../common/Icons";
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
      darkMode ? "bg-slate-800/80 border-slate-700": "bg-white border-slate-300"}`}
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
                ? "bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200": "bg-slate-100 border-slate-300 text-slate-500 hover:bg-slate-200 hover:text-slate-700"}`}
        >
          {showQuickActions ? (
            <XIcon className="w-4 h-4" strokeWidth={2.5} />
          ) : (
            <MenuHamburgerIcon className="w-4 h-4" />
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
                ? "bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:bg-slate-800": "bg-slate-100 border border-slate-300 text-slate-800 placeholder-slate-400 focus:bg-white"}`}
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
            <SendIcon className="w-5 h-5 transform rotate-90" />
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default ChatInput;
