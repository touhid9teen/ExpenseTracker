"use client";

import SUGGESTIONS from "../suggestions";
import { SMART_CATEGORIES } from "../../../utils/smartExpenseParser";
import useAIAssistant from "../../../hooks/useAIAssistant";
import MessageList from "./MessageList";
import QuickConfirmCard from "./QuickConfirmCard";
import Composer from "./Composer";

/**
 * AIAssistant – the full-page AI conversation (ChatGPT/Gemini style).
 *
 * The conversation fills the available height: messages scroll in the middle
 * and the composer is fixed at the bottom. Expense-like text shows a
 * quick-confirm chip; anything else is sent to the AI. AI replies may carry
 * [WIDGET: ...] directives which render real chart cards (donut / trend)
 * computed from the user's actual expenses.
 *
 * Composition only — all state lives in useAIAssistant and the screen is
 * split into MessageList / QuickConfirmCard / Composer.
 *
 * Props:
 *   - darkMode, user, expenses
 *   - addExpenseDirect / updateExpenseDirect / deleteExpenseDirect
 *   - setActiveTab            – for [NAVIGATE] blocks
 *   - pendingAction, setPendingAction – command buttons feed prompts here
 *   - resetSignal             – bump to start a fresh conversation ("New chat")
 *   - visible                 – CSS-show/hide (keeps the conversation mounted)
 */
const AIAssistant = ({
  darkMode,
  visible = true,
  compact = false,
  ...logicProps
}) => {
  const ai = useAIAssistant(logicProps);
  const showWelcome = ai.messages.length === 1 && ai.messages[0].id === "welcome";

  return (
    <div className={`${visible ? "block animate-fadeIn" : "hidden"} ${compact ? "lg:h-full" : ""}`}>
      <div
        className={`flex flex-col overflow-hidden ${
          compact
            ? "h-[calc(100dvh-8.5rem)] min-h-[22rem] lg:h-full lg:min-h-0"
            : "h-[calc(100dvh-7rem)] min-h-[26rem] lg:h-[calc(100dvh-10.5rem)] xl:h-[calc(100dvh-9.5rem)]"
        }`}
      >
        {/* ── Messages ── */}
        <MessageList
          darkMode={darkMode}
          messages={ai.messages}
          isLoading={ai.isLoading}
          showWelcome={showWelcome}
          messagesEndRef={ai.messagesEndRef}
          SUGGESTIONS={SUGGESTIONS}
          onSuggestion={ai.handleSuggestion}
        />

        {/* ── Quick-confirm chip (smart expense entry) ── */}
        {ai.suggestion && (
          <QuickConfirmCard
            darkMode={darkMode}
            suggestion={ai.suggestion}
            setSuggestion={ai.setSuggestion}
            onConfirm={ai.confirmExpense}
            SMART_CATEGORIES={SMART_CATEGORIES}
          />
        )}

        {/* ── Composer (fixed at the bottom) ── */}
        <Composer
          darkMode={darkMode}
          input={ai.input}
          setInput={ai.setInput}
          isLoading={ai.isLoading}
          showQuickActions={ai.showQuickActions}
          setShowQuickActions={ai.setShowQuickActions}
          suggestion={ai.suggestion}
          onConfirm={ai.confirmExpense}
          onSend={ai.handleSend}
          inputRef={ai.inputRef}
          onVoice={ai.startVoice}
          SUGGESTIONS={SUGGESTIONS}
          onSuggestion={ai.handleSuggestion}
        />
      </div>
    </div>
  );
};

export default AIAssistant;
