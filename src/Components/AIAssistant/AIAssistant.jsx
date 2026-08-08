"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ChatMessage from "../ChatBot/ChatMessage";
import SUGGESTIONS from "../ChatBot/suggestions";
import { parseSmartExpense, SMART_CATEGORIES } from "../../utils/smartExpenseParser";
import { getTodayInputValue } from "../../utils/dateUtils";
import {
  XIcon,
  SendIcon,
  SparklesIcon,
  CheckIcon,
  PaperclipIcon,
} from "../common/Icons";
import { buildCategoryBreakdown, buildMonthlyTrend } from "./ChatWidgets";

// Short local time label (e.g. "3:42 PM") for message timestamps.
const nowTime = () =>
  new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

const buildWelcome = (user) => {
  const name = user?.username || user?.email?.split("@")[0] || "there";
  return {
    id: "welcome",
    text: `Hi ${name}! 👋\n\nI'm FinVue AI. I can help you analyze your spending, find insights, set budgets, and answer any questions about your finances.\n\nHow can I help you today?`,
    sender: "ai",
    time: nowTime(),
  };
};

/**
 * AIAssistant – the full-page AI conversation (ChatGPT/Gemini style).
 *
 * The conversation fills the available height: messages scroll in the middle
 * and the composer is fixed at the bottom. Expense-like text shows a
 * quick-confirm chip; anything else is sent to the AI. AI replies may carry
 * [WIDGET: ...] directives which render real chart cards (donut / trend)
 * computed from the user's actual expenses.
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
  user,
  expenses,
  addExpenseDirect,
  updateExpenseDirect,
  deleteExpenseDirect,
  setActiveTab,
  pendingAction,
  setPendingAction,
  pushRecentQuery,
  resetSignal = 0,
  visible = true,
}) => {
  const [messages, setMessages] = useState(() => [buildWelcome(user)]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [suggestion, setSuggestion] = useState(null); // quick-confirm chip
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll to the latest message.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // "New chat" from the header resets the conversation.
  useEffect(() => {
    if (resetSignal <= 0) return;
    setMessages([buildWelcome(user)]);
    setInput("");
    setSuggestion(null);
    setShowQuickActions(false);
    setPendingAction?.(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetSignal]);

  // Live quick-confirm chip: whenever the input looks like an expense,
  // prepare a suggestion card (user can still just press Enter to send).
  useEffect(() => {
    const parsed = parseSmartExpense(input);
    if (parsed) {
      setSuggestion({ ...parsed, date: getTodayInputValue() });
    } else {
      setSuggestion(null);
    }
  }, [input]);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // ── Core send: user message → AI → parse [ACTION] / [NAVIGATE] / [WIDGET] ──
  const handleSend = useCallback(
    async (e, directText = null) => {
      if (e) e.preventDefault();
      const textToSend = (directText || input).trim();
      if (!textToSend) return;

      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: textToSend, sender: "user", time: nowTime() },
      ]);
      setInput("");
      setSuggestion(null);
      setIsLoading(true);
      pushRecentQuery?.(textToSend);

      try {
        const expensesForChat = Array.isArray(expenses)
          ? expenses.slice(-60).map(({ id, description, amount, date, category }) => ({
              id, description, amount, date, category,
            }))
          : [];

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: textToSend,
            user,
            expenses: expensesForChat,
            expenseCount: expenses?.length || 0,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          let aiText = data.response || "";

          // Chart widget directives → real cards computed from real expenses.
          const widgetRegex = /\[WIDGET:\s*([^\]]+)\s*\]/gi;
          const widgetMatches = [...aiText.matchAll(widgetRegex)];
          aiText = aiText.replace(widgetRegex, "").trim();
          const widgets = [];
          for (const match of widgetMatches) {
            const directive = (match[1] || "").trim();
            if (/^category-breakdown$/i.test(directive)) {
              widgets.push({ type: "category-breakdown", data: buildCategoryBreakdown(expenses) });
            } else if (/^monthly-trend$/i.test(directive)) {
              widgets.push({ type: "trend", data: buildMonthlyTrend(expenses), category: null });
            } else {
              const cat = directive.match(/^trend:\s*(.+)$/i);
              if (cat) {
                const name = cat[1].trim();
                widgets.push({ type: "trend", data: buildMonthlyTrend(expenses, name), category: name });
              }
            }
          }

          // Execute expense mutations.
          const actionRegex = /\[ACTION:\s*({.*?})\s*\]/gs;
          const actions = [...aiText.matchAll(actionRegex)];
          aiText = aiText.replace(actionRegex, "").trim();
          for (const match of actions) {
            try {
              const action = JSON.parse(match[1]);
              if (action.type === "ADD_EXPENSE") await addExpenseDirect(action.payload);
              else if (action.type === "UPDATE_EXPENSE") await updateExpenseDirect(action.payload);
              else if (action.type === "DELETE_EXPENSE") await deleteExpenseDirect(action.payload.id);
            } catch (err) {
              console.error("Failed to parse action JSON", err);
            }
          }

          // On-demand section switching ("show my table" → ledger).
          const navRegex = /\[NAVIGATE:\s*"([a-z]+)"\s*\]/gi;
          const navs = [...aiText.matchAll(navRegex)];
          aiText = aiText.replace(navRegex, "").trim();
          if (navs.length > 0) {
            const target = navs[navs.length - 1][1].toLowerCase();
            if (["overview", "ledger", "statistics", "chat", "about"].includes(target)) {
              setActiveTab(target);
              scrollTop();
            }
          }

          if (!aiText) {
            aiText = `Done! I've processed ${actions.length} expense operation${actions.length !== 1 ? "s" : ""}.`;
          }
          setMessages((prev) => [
            ...prev,
            { id: Date.now() + 1, text: aiText, sender: "ai", time: nowTime(), widgets },
          ]);
        } else {
          const errorText = data.response || "Sorry, I encountered an error. Please try again.";
          toast.error(errorText);
          setMessages((prev) => [...prev, { id: Date.now() + 1, text: errorText, sender: "ai", time: nowTime() }]);
        }
      } catch (error) {
        console.error("AI error:", error);
        toast.error("Failed to connect to AI");
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text: "Sorry, I couldn't reach the server. Please check your connection.",
            sender: "ai",
            time: nowTime(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, expenses, user, addExpenseDirect, updateExpenseDirect, deleteExpenseDirect, setActiveTab, pushRecentQuery]
  );

  // ── Commands from the CommandCenter (e.g. "Budget Tips") feed the composer.
  // Declared AFTER handleSend so the callback reference is unambiguous.
  useEffect(() => {
    if (!pendingAction) return;
    setPendingAction(null);
    if (pendingAction.action === "send") {
      handleSend(null, pendingAction.text);
    } else {
      setInput(pendingAction.text);
      inputRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingAction]);

  // ── Quick confirm: add the parsed expense in one tap ──
  const confirmExpense = async () => {
    if (!suggestion) return;
    const amount = Number.parseFloat(suggestion.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }
    try {
      await addExpenseDirect({
        amount,
        description: suggestion.description.trim() || suggestion.category,
        category: suggestion.category,
        date: suggestion.date || getTodayInputValue(),
      });
      setInput("");
      setSuggestion(null);
      toast.success("Expense added!");
    } catch (error) {
      console.error("Failed to add expense", error);
      toast.error("Could not add expense.");
    }
  };

  // ── Voice input (Web Speech API) ──
  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Voice input is not supported in this browser.");
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognitionRef.current = recognition;

      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript || "";
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        inputRef.current?.focus();
      };
      recognition.onerror = (event) => {
        if (event.error !== "aborted" && event.error !== "no-speech") {
          toast.error(`Voice error: ${event.error}`);
        }
      };
      recognition.start();
      toast.success("Listening…");
    } catch (error) {
      console.error("Voice input failed", error);
      toast.error("Voice input could not start.");
    }
  };

  const handleSuggestion = (s) => {
    setShowQuickActions(false);
    if (s.action === "send") handleSend(null, s.text);
    else {
      setInput(s.text);
      inputRef.current?.focus();
    }
  };

  const showWelcome = messages.length === 1 && messages[0].id === "welcome";

  return (
    <div className={visible ? "block animate-fadeIn" : "hidden"}>
      <div
        className="flex flex-col overflow-hidden h-[calc(100dvh-10.5rem)] min-h-[26rem] xl:h-[calc(100dvh-9.5rem)]"
      >
        {/* ── Messages ── */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 sm:px-6 py-5 flex flex-col gap-4">
          {showWelcome ? (
            <div className="my-auto py-6">
              <div className="text-center mb-6">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-3">
                  <SparklesIcon className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <h3 className={`text-lg font-black tracking-tight ${darkMode ? "text-white" : "text-slate-800"}`}>
                  What would you like to do?
                </h3>
                <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Ask anything, or type an expense — I&apos;ll do the rest.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto">
                {SUGGESTIONS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestion(s)}
                    className={`flex items-center gap-3 px-3.5 py-3 text-left rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                      darkMode
                        ? "bg-slate-900/70 border-slate-700/70 hover:border-violet-500/50"
                        : "bg-white border-slate-200 hover:border-violet-300"
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${s.iconBg}`}>
                      {s.icon}
                    </span>
                    <span className="min-w-0">
                      <span className={`block text-xs font-bold leading-tight truncate ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
                        {s.label}
                      </span>
                      <span className={`block text-[10px] leading-tight truncate mt-0.5 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                        {s.sub}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <ChatMessage msg={msg} darkMode={darkMode} />
                </div>
              ))}
            </>
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className={`flex gap-1.5 items-center h-4 px-4 py-3 rounded-full border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ── Quick-confirm chip (smart expense entry) ── */}
        {suggestion && (
          <div className="px-4 sm:px-6 pt-3 flex-shrink-0">
            <div
              className={`rounded-xl border p-3 sm:p-4 shadow-sm ${
                darkMode
                  ? "bg-slate-900 border-slate-700"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <p className={`text-[11px] font-bold uppercase tracking-widest ${darkMode ? "text-violet-300" : "text-violet-600"}`}>
                  ⚡ Quick add expense
                </p>
                <button
                  onClick={() => setSuggestion(null)}
                  aria-label="Dismiss"
                  className={`p-1 transition-colors ${darkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-400 hover:text-slate-600"}`}
                >
                  <XIcon className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <label className="block">
                  <span className={`block text-[10px] font-semibold uppercase mb-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Amount (৳)</span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={suggestion.amount}
                    onChange={(e) => setSuggestion((s) => ({ ...s, amount: e.target.value }))}
                    className={`w-full px-2.5 py-1.5 rounded-lg border text-sm font-bold outline-none transition-colors ${
                      darkMode
                        ? "bg-slate-800 border-slate-700 text-violet-300 focus:border-violet-500"
                        : "bg-slate-50 border-slate-200 text-violet-700 focus:border-violet-400"
                    }`}
                  />
                </label>
                <label className="block">
                  <span className={`block text-[10px] font-semibold uppercase mb-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Category</span>
                  <select
                    value={suggestion.category}
                    onChange={(e) => setSuggestion((s) => ({ ...s, category: e.target.value }))}
                    className={`w-full px-2.5 py-1.5 rounded-lg border text-sm font-semibold outline-none transition-colors cursor-pointer ${
                      darkMode
                        ? "bg-slate-800 border-slate-700 text-slate-100 focus:border-violet-500"
                        : "bg-slate-50 border-slate-200 text-slate-800 focus:border-violet-400"
                    }`}
                  >
                    {SMART_CATEGORIES.map((c) => (
                      <option key={c} value={c} className={darkMode ? "bg-slate-900" : "bg-white"}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className={`block text-[10px] font-semibold uppercase mb-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Description</span>
                  <input
                    type="text"
                    value={suggestion.description}
                    onChange={(e) => setSuggestion((s) => ({ ...s, description: e.target.value }))}
                    className={`w-full px-2.5 py-1.5 rounded-lg border text-sm font-medium outline-none transition-colors ${
                      darkMode
                        ? "bg-slate-800 border-slate-700 text-slate-100 focus:border-violet-500"
                        : "bg-slate-50 border-slate-200 text-slate-800 focus:border-violet-400"
                    }`}
                  />
                </label>
                <label className="block">
                  <span className={`block text-[10px] font-semibold uppercase mb-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Date</span>
                  <input
                    type="date"
                    value={suggestion.date}
                    onChange={(e) => setSuggestion((s) => ({ ...s, date: e.target.value }))}
                    className={`w-full px-2.5 py-1.5 rounded-lg border text-sm font-medium outline-none transition-colors ${
                      darkMode
                        ? "bg-slate-800 border-slate-700 text-slate-100 focus:border-violet-500"
                        : "bg-slate-50 border-slate-200 text-slate-800 focus:border-violet-400"
                    }`}
                  />
                </label>
              </div>

              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => setSuggestion(null)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-colors ${darkMode ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmExpense}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-br from-violet-500 to-indigo-500 shadow-sm shadow-violet-500/30 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                >
                  <CheckIcon className="w-3.5 h-3.5" strokeWidth={3} />
                  Add Expense
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Composer (fixed at the bottom) ── */}
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
                    onClick={() => handleSuggestion(s)}
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
              onSubmit={(e) => {
                e.preventDefault();
                // Zero-friction: Enter confirms the quick-add chip when visible.
                if (suggestion) {
                  confirmExpense();
                } else {
                  handleSend(e);
                }
              }}
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
                className={`flex-shrink-0 p-2 rounded-full transition-all ${
                  showQuickActions
                    ? "bg-violet-500 text-white"
                    : darkMode
                      ? "text-violet-300 hover:bg-violet-500/15"
                      : "text-violet-500 hover:bg-violet-100"
                }`}
              >
                {showQuickActions ? <XIcon className="w-4 h-4" strokeWidth={2.5} /> : <SparklesIcon className="w-5 h-5" strokeWidth={2.25} />}
              </button>

              <button
                type="button"
                onClick={() => inputRef.current?.focus()}
                aria-label="Attach"
                className={`flex-shrink-0 p-2 rounded-full transition-colors ${
                  darkMode ? "text-slate-400 hover:text-violet-300 hover:bg-violet-500/15" : "text-slate-400 hover:text-violet-600 hover:bg-violet-100"
                }`}
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
                onClick={startVoice}
                aria-label="Voice input"
                title="Voice input"
                disabled={isLoading}
                className={`flex-shrink-0 p-2 rounded-full transition-colors ${
                  darkMode ? "text-slate-400 hover:text-violet-300 hover:bg-violet-500/15" : "text-slate-400 hover:text-violet-600 hover:bg-violet-100"
                }`}
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
              Tip: Try “How can I reduce my expenses?” or “Show trends for last 6 months”
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
