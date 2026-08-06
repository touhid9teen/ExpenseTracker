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
    className={`p-4 border-t-2 flex-shrink-0 ${
      darkMode ? "bg-slate-900/90 border-cyan-900/60": "bg-white border-cyan-200"}`}
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
          className={`flex-shrink-0 p-2.5 cyber-cut-sm border-2 transition-all ${
            showQuickActions
              ? "cyber-btn-accent border-cyan-500 text-white shadow-sm shadow-cyan-500/30"
              : darkMode
                ? "bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-cyan-300 hover:border-cyan-800": "bg-slate-100 border-slate-300 text-slate-500 hover:bg-slate-200 hover:text-cyan-600 hover:border-cyan-300"}`}
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
            className={`cyber-input w-full pl-1 pr-12 py-3 text-sm ${
              darkMode
                ? "text-white placeholder-slate-500": "text-slate-800 placeholder-slate-400"}`}
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
                : "text-cyan-500 hover:bg-cyan-500/10"
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
