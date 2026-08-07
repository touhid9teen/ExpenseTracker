"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ChatMessage from "../ChatBot/ChatMessage";
import SUGGESTIONS from "../ChatBot/suggestions";
import { parseSmartExpense, SMART_CATEGORIES } from "../../utils/smartExpenseParser";
import { getTodayInputValue } from "../../utils/dateUtils";
import {
  XIcon,
  MenuHamburgerIcon,
  SendIcon,
  LightningBoltIcon,
  SparklesIcon,
  CheckIcon,
} from "../common/Icons";

const WELCOME_MESSAGE = {
  id: "welcome",
  text: "Hi there! I'm FinVue AI. Ask me about your spending, or just type something like “spent 120 on lunch” and I'll add it instantly.",
  sender: "ai",
};

/**
 * AIAssistant – the modern, full-page AI conversation (ChatGPT/Gemini style).
 *
 * A single always-visible composer drives everything:
 *  - Expense-like text → inline quick-confirm chip (editable, one-tap add)
 *  - Anything else      → sent to the AI for a full-page answer
 *
 * Props:
 *   - darkMode, user, expenses
 *   - addExpenseDirect / updateExpenseDirect / deleteExpenseDirect
 *   - setActiveTab            – for [NAVIGATE] blocks + close
 *   - pendingAction, setPendingAction – command buttons feed prompts here
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
  visible = true,
}) => {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
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

  // ── Core send: user message → AI → parse [ACTION] / [NAVIGATE] ──
  const handleSend = useCallback(
    async (e, directText = null) => {
      if (e) e.preventDefault();
      const textToSend = (directText || input).trim();
      if (!textToSend) return;

      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: textToSend, sender: "user" },
      ]);
      setInput("");
      setSuggestion(null);
      setIsLoading(true);

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
          const actionRegex = /\[ACTION:\s*({.*?})\s*\]/gs;
          const navRegex = /\[NAVIGATE:\s*"([a-z]+)"\s*\]/gi;

          // Execute expense mutations.
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
            { id: Date.now() + 1, text: aiText, sender: "ai" },
          ]);
        } else {
          const errorText = data.response || "Sorry, I encountered an error. Please try again.";
          toast.error(errorText);
          setMessages((prev) => [...prev, { id: Date.now() + 1, text: errorText, sender: "ai" }]);
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
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, expenses, user, addExpenseDirect, updateExpenseDirect, deleteExpenseDirect, setActiveTab]
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

  const resetConversation = () => {
    setMessages([WELCOME_MESSAGE]);
    setInput("");
    setSuggestion(null);
    setShowQuickActions(false);
    setPendingAction?.(null);
  };

  const showWelcome = messages.length === 1 && messages[0].id === "welcome";

  return (
    <div className={visible ? "block animate-fadeIn" : "hidden"}>
      <div
        className={`relative cyber-cut-lg border-2 cyber-3d cyber-inner-edge overflow-hidden flex flex-col ${
          darkMode
            ? "bg-slate-900/80 border-cyan-900/50"
            : "bg-white/95 border-cyan-300/70"
        }`}
        style={{ minHeight: "60vh", maxHeight: "78vh" }}
      >
        <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 opacity-80 pointer-events-none" />

        {/* ── Header ── */}
        <div
          className={`flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b-2 flex-shrink-0 ${
            darkMode ? "border-cyan-900/60" : "border-cyan-200"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 cyber-cut bg-gradient-to-tr from-cyan-500 via-sky-500 to-violet-500 flex items-center justify-center cyber-3d-sm [--glow-3d-2:var(--violet-glow)] flex-shrink-0">
              <LightningBoltIcon className="w-6 h-6 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
            </div>
            <div className="min-w-0">
              <h3 className={`font-extrabold text-base ${darkMode ? "text-white" : "text-slate-800"}`}>
                FinVue AI
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 cyber-cut-sm bg-emerald-400 inline-block" />
                <p className={`text-xs truncate ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  {isLoading ? "Thinking…" : "On demand · always ready"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={resetConversation}
              className={`hidden sm:inline-block px-3 py-1.5 cyber-cut-sm text-xs font-bold border-2 cyber-3d-sm transition-all ${
                darkMode
                  ? "bg-slate-900 border-slate-700 text-slate-300 hover:border-cyan-700 hover:text-cyan-300"
                  : "bg-slate-50 border-slate-300 text-slate-600 hover:border-cyan-400 hover:text-cyan-600"
              }`}
            >
              New chat
            </button>
            <button
              onClick={() => {
                setActiveTab("overview");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              aria-label="Close assistant"
              className={`p-2 cyber-cut-sm border-2 cyber-3d-sm transition-colors ${
                darkMode
                  ? "bg-slate-900 border-slate-700 text-slate-300 hover:border-rose-600/60 hover:text-rose-300"
                  : "bg-slate-50 border-slate-300 text-slate-500 hover:border-rose-400 hover:text-rose-600"
              }`}
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div
          className={`flex-1 overflow-y-auto px-4 sm:px-6 py-5 flex flex-col gap-4 ${
            darkMode ? "bg-slate-950/40" : "bg-slate-50/60"
          }`}
        >
          {showWelcome ? (
            <div className="my-auto py-6">
              <div className="text-center mb-6">
                <div className="mx-auto w-14 h-14 cyber-cut bg-gradient-to-tr from-cyan-500 via-sky-500 to-violet-500 flex items-center justify-center cyber-3d-sm [--glow-3d-2:var(--violet-glow)] mb-3">
                  <SparklesIcon className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <h3 className={`text-lg font-black tracking-tight ${darkMode ? "text-white" : "text-slate-800"}`}>
                  What would you like to do?
                </h3>
                <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Ask anything, or type an expense — I&apos;ll do the rest.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-w-3xl mx-auto">
                {SUGGESTIONS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestion(s)}
                    className={`flex items-center gap-3 px-3.5 py-3 text-left cyber-cut-sm border-2 transition-all duration-200 hover:-translate-y-0.5 cyber-3d-sm ${
                      darkMode
                        ? "bg-slate-900/80 border-slate-700/70 hover:border-cyan-600/70"
                        : "bg-white border-slate-300 hover:border-cyan-400"
                    }`}
                  >
                    <span className={`w-8 h-8 cyber-cut-sm flex items-center justify-center flex-shrink-0 ${s.iconBg}`}>
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
              <div className={`flex gap-1.5 items-center h-4 px-4 py-3 cyber-cut-sm border-2 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-100 border-slate-300"}`}>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ── Quick-confirm chip (smart expense entry) ── */}
        {suggestion && (
          <div className="px-4 sm:px-6 pt-3 flex-shrink-0">
            <div
              className={`cyber-cut-sm border-2 cyber-3d-sm cyber-inner-edge p-3 sm:p-4 ${
                darkMode
                  ? "bg-slate-950 border-cyan-700/70"
                  : "bg-white border-cyan-400"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <p className={`text-[11px] font-bold uppercase tracking-widest ${darkMode ? "text-cyan-400" : "text-cyan-700"}`}>
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
                    className={`cyber-input w-full px-1 py-1.5 text-sm font-black font-mono ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}
                  />
                </label>
                <label className="block">
                  <span className={`block text-[10px] font-semibold uppercase mb-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Category</span>
                  <select
                    value={suggestion.category}
                    onChange={(e) => setSuggestion((s) => ({ ...s, category: e.target.value }))}
                    className={`cyber-input w-full px-1 py-1.5 text-sm font-bold bg-transparent ${darkMode ? "text-slate-100" : "text-slate-800"}`}
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
                    className={`cyber-input w-full px-1 py-1.5 text-sm font-medium ${darkMode ? "text-slate-100" : "text-slate-800"}`}
                  />
                </label>
                <label className="block">
                  <span className={`block text-[10px] font-semibold uppercase mb-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Date</span>
                  <input
                    type="date"
                    value={suggestion.date}
                    onChange={(e) => setSuggestion((s) => ({ ...s, date: e.target.value }))}
                    className={`cyber-input w-full px-1 py-1.5 text-sm font-medium ${darkMode ? "text-slate-100" : "text-slate-800"}`}
                  />
                </label>
              </div>

              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => setSuggestion(null)}
                  className={`px-3 py-1.5 cyber-cut-sm text-xs font-bold border-2 ${darkMode ? "bg-slate-900 border-slate-700 text-slate-300" : "bg-slate-50 border-slate-300 text-slate-600"}`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmExpense}
                  className="flex items-center gap-1.5 px-4 py-1.5 cyber-cut-sm text-xs font-bold text-white cyber-btn-accent"
                >
                  <CheckIcon className="w-3.5 h-3.5" strokeWidth={3} />
                  Add Expense
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Composer ── */}
        <div className={`px-4 sm:px-6 py-4 border-t-2 flex-shrink-0 ${darkMode ? "border-cyan-900/60" : "border-cyan-200"}`}>
          <div className="relative">
            {showQuickActions && (
              <div
                className={`absolute bottom-full left-0 right-0 mb-2 cyber-cut border-2 overflow-hidden cyber-3d-sm ${
                  darkMode ? "bg-slate-950 border-cyan-800/60" : "bg-white border-cyan-300"
                }`}
              >
                {SUGGESTIONS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestion(s)}
                    className={`flex items-center gap-3 px-4 py-2.5 text-left w-full transition-all border-b last:border-b-0 ${
                      darkMode ? "border-slate-800 hover:bg-slate-900" : "border-slate-100 hover:bg-slate-50"
                    }`}
                  >
                    <span className={`w-7 h-7 cyber-cut-sm flex items-center justify-center flex-shrink-0 ${s.iconBg}`}>
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
              className="relative flex items-center gap-2"
            >
              <button
                type="button"
                onClick={() => setShowQuickActions((prev) => !prev)}
                aria-label="Quick actions"
                className={`flex-shrink-0 p-2.5 cyber-cut-sm border-2 transition-all ${
                  showQuickActions
                    ? "cyber-btn-accent border-cyan-500 text-white"
                    : darkMode
                      ? "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-cyan-300 hover:border-cyan-800 cyber-3d-sm [--glow-3d:var(--accent-glow-soft)]"
                      : "bg-slate-100 border-slate-300 text-slate-500 hover:bg-slate-200 hover:text-cyan-600 hover:border-cyan-300"
                }`}
              >
                {showQuickActions ? <XIcon className="w-4 h-4" strokeWidth={2.5} /> : <MenuHamburgerIcon className="w-4 h-4" />}
              </button>

              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask FinVue AI… or type “spent 120 on lunch”"
                  className={`cyber-input w-full pl-1 pr-24 py-3 text-sm ${darkMode ? "text-white placeholder-slate-500" : "text-slate-800 placeholder-slate-400"}`}
                  disabled={isLoading}
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={startVoice}
                    aria-label="Voice input"
                    title="Voice input"
                    disabled={isLoading}
                    className={`p-1.5 rounded-lg transition-colors ${
                      darkMode ? "text-slate-400 hover:text-violet-300 hover:bg-violet-500/10" : "text-slate-400 hover:text-violet-600 hover:bg-violet-50"
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
                    className={`p-1.5 rounded-lg transition-colors ${
                      !input.trim() || isLoading
                        ? darkMode ? "text-slate-600" : "text-slate-400"
                        : "text-cyan-500 hover:bg-cyan-500/10"
                    }`}
                  >
                    <SendIcon className="w-5 h-5 transform rotate-90" />
                  </button>
                </div>
              </div>
            </form>

            <p className={`text-[10px] mt-2 text-center ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
              Tip: try “spent 120 on lunch”, “show my table”, or “give me budget tips”
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
