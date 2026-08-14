"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { parseSmartExpense } from "../utils/smartExpenseParser";
import { getTodayInputValue } from "../utils/dateUtils";
import parseDirectives from "../components/chat/AIAssistant/parseDirectives";

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
 * useAIAssistant – all state + side effects for the full-page AI conversation
 * (messages, composer input, smart-expense suggestion chip, voice input and
 * the chat API round-trip with [WIDGET]/[ACTION]/[NAVIGATE] directives).
 * The view layer (index.jsx + child components) only renders what this hook
 * returns.
 */
const useAIAssistant = ({
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
          const { text: aiText, widgets, actions, navs } = parseDirectives(data.response || "", expenses);

          // Execute expense mutations.
          for (const action of actions) {
            try {
              if (action.type === "ADD_EXPENSE") await addExpenseDirect(action.payload);
              else if (action.type === "UPDATE_EXPENSE") await updateExpenseDirect(action.payload);
              else if (action.type === "DELETE_EXPENSE") await deleteExpenseDirect(action.payload.id);
            } catch (err) {
              console.error("Failed to execute action", err);
            }
          }

          // On-demand section switching ("show my table" → ledger).
          if (navs.length > 0) {
            const target = navs[navs.length - 1][1].toLowerCase();
            if (["overview", "ledger", "statistics", "chat", "about"].includes(target)) {
              setActiveTab(target);
              scrollTop();
            }
          }

          const finalText =
            aiText ||
            `Done! I've processed ${actions.length} expense operation${actions.length !== 1 ? "s" : ""}.`;
          setMessages((prev) => [
            ...prev,
            { id: Date.now() + 1, text: finalText, sender: "ai", time: nowTime(), widgets },
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

  return {
    messages,
    input,
    setInput,
    isLoading,
    showQuickActions,
    setShowQuickActions,
    suggestion,
    setSuggestion,
    messagesEndRef,
    inputRef,
    handleSend,
    confirmExpense,
    startVoice,
    handleSuggestion,
  };
};

export default useAIAssistant;
