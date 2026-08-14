"use client";

import { XIcon, SendIcon, SparklesIcon, PaperclipIcon } from "../../ui/Icons";

/**
 * Composer – the fixed-at-the-bottom input row: quick-actions popover,
 * attach + voice buttons, the text input, and the send button. Enter
 * confirms the quick-add chip when one is visible, otherwise sends to the AI.
 */
const Composer = ({
  darkMode,
  input,
  setInput,
  isLoading,
  showQuickActions,
  setShowQuickActions,
  suggestion,
  onConfirm,
  onSend,
  inputRef,
  onVoice,
  SUGGESTIONS,
  onSuggestion,
}) => {
  const submit = (e) => {
    e.preventDefault();
    if (suggestion) {
      onConfirm();
    } else {
      onSend(e);
    }
  };

  const ghostBtn = (active = false) =>
    `flex-shrink-0 p-2 rounded-full transition-all ${
      active
        ? "bg-violet-500 text-white"
        : darkMode
          ? "text-violet-300 hover:bg-violet-500/15"
          : "text-violet-500 hover:bg-violet-100"
    }`;

  const ghostIcon = (active = false) =>
    `flex-shrink-0 p-2 rounded-full transition-colors ${
      active
        ? darkMode
          ? "text-violet-300 hover:bg-violet-500/15"
          : "text-violet-600 hover:bg-violet-100"
        : darkMode
          ? "text-slate-400 hover:text-violet-300 hover:bg-violet-500/15"
          : "text-slate-400 hover:text-violet-600 hover:bg-violet-100"
    }`;

  return (
    <div className="px-4 sm:px-6 py-4 flex-shrink-0">
      <div className="relative">
        {showQuickActions && (
          <div
            className={`absolute bottom-full left-0 right-0 mb-2 rounded-xl border overflow-hidden shadow-lg ${
              darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"
            }`}
          >
            {SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => onSuggestion(s)}
                className={`flex items-center gap-3 px-4 py-2.5 text-left w-full transition-all border-b last:border-b-0 ${
                  darkMode ? "border-slate-800 hover:bg-slate-800/60" : "border-slate-100 hover:bg-slate-50"
                }`}
              >
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${s.iconBg}`}>
                  {s.icon}
                </span>
                <span className="min-w-0">
                  <span className={`block text-xs font-semibold leading-tight truncate ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
                    {s.label}
                  </span>
                  <span className={`block text-[10px] leading-tight truncate mt-0.5 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                    {s.sub}
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={submit}
          className={`flex items-center gap-1.5 sm:gap-2 rounded-full border pl-2 pr-1.5 py-1.5 sm:pl-3 sm:pr-2 shadow-sm transition-colors ${
            darkMode
              ? "bg-slate-900 border-slate-700 focus-within:border-violet-500/60"
              : "bg-white border-violet-200 focus-within:border-violet-400"
          }`}
        >
          <button
            type="button"
            onClick={() => setShowQuickActions((prev) => !prev)}
            aria-label="Quick actions"
            className={ghostBtn(showQuickActions)}
          >
            {showQuickActions ? (
              <XIcon className="w-4 h-4" strokeWidth={2.5} />
            ) : (
              <SparklesIcon className="w-5 h-5" strokeWidth={2.25} />
            )}
          </button>

          <button
            type="button"
            onClick={() => inputRef.current?.focus()}
            aria-label="Attach"
            className={ghostIcon()}
          >
            <PaperclipIcon className="w-4 h-4" strokeWidth={2.25} />
          </button>

          <input
            ref={inputRef}
            type="text"
            name="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your finances..."
            className={`flex-1 min-w-0 bg-transparent outline-none text-sm py-2 ${darkMode ? "text-white placeholder-slate-500" : "text-slate-800 placeholder-slate-400"}`}
            disabled={isLoading}
          />

          <button
            type="button"
            onClick={onVoice}
            aria-label="Voice input"
            title="Voice input"
            disabled={isLoading}
            className={ghostIcon()}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
          </button>

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
            className={`flex-shrink-0 p-2.5 rounded-full text-white bg-gradient-to-br from-violet-500 to-indigo-500 shadow-lg shadow-violet-500/30 transition-all duration-200 hover:scale-105 active:scale-95 ${
              !input.trim() || isLoading ? "opacity-40" : ""
            }`}
          >
            <SendIcon className="w-4 h-4" />
          </button>
        </form>

        <p className={`text-[10px] mt-2.5 text-center ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
          Tip: Try &quot;How can I reduce my expenses?&quot; or &quot;Show trends for last 6 months&quot;
        </p>
      </div>
    </div>
  );
};

export default Composer;
