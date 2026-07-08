"use client";

import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

import FloatingTrigger from "./FloatingTrigger";
import ChatBotHeader from "./ChatBotHeader";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";

/**
 * ChatBot – main orchestrator component.
 *
 * Manages all state (messages, input, open/close, quick-actions visibility)
 * and the send-message / action-parsing logic, then delegates rendering
 * to focused sub-components.
 */
const ChatBot = ({
  darkMode,
  user,
  expenses,
  addExpenseDirect,
  updateExpenseDirect,
  deleteExpenseDirect,
  setActiveTab,
  chatOpen,
  setChatOpen,
  pendingAction,
  setPendingAction,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = chatOpen !== undefined ? chatOpen : internalOpen;
  const setIsOpen = setChatOpen || setInternalOpen;
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! I'm FinVue AI. How can I help you manage your expenses today?",
      sender: "ai",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // ── Auto-scroll to bottom ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // ── Close quick actions on outside click ──
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showQuickActions && !e.target.closest(".quick-actions-container")) {
        setShowQuickActions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showQuickActions]);

  // ── Handle pending quick action from nav ──
  useEffect(() => {
    if (pendingAction) {
      setPendingAction(null);
      if (pendingAction.action === "send") {
        // Small delay to let chat open first
        setTimeout(() => handleSend(null, pendingAction.text), 100);
      } else {
        setInput(pendingAction.text);
        setTimeout(() => {
          const len = pendingAction.text.length;
          inputRef.current?.focus();
          inputRef.current?.setSelectionRange(len, len);
        }, 200);
      }
    }
  }, [pendingAction]);

  // ── Send handler ──
  const handleSend = async (e, directText = null) => {
    if (e) e.preventDefault();
    const textToSend = directText || input;
    if (!textToSend.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: textToSend.trim(),
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text, user, expenses }),
      });

      const data = await res.json();

      if (res.ok) {
        let aiResponseText = data.response;
        const actionRegex = /\[ACTION:\s*({.*?})\s*\]/gs;
        const matches = [...aiResponseText.matchAll(actionRegex)];

        if (matches.length > 0) {
          // Remove all action blocks from the response text
          aiResponseText = aiResponseText.replace(actionRegex, "").trim();

          // Process actions sequentially
          for (const match of matches) {
            try {
              const actionData = JSON.parse(match[1]);

              if (actionData.type === "ADD_EXPENSE") {
                await addExpenseDirect(actionData.payload);
              } else if (actionData.type === "UPDATE_EXPENSE") {
                await updateExpenseDirect(actionData.payload);
              } else if (actionData.type === "DELETE_EXPENSE") {
                await deleteExpenseDirect(actionData.payload.id);
              }
            } catch (e) {
              console.error("Failed to parse action JSON", e);
            }
          }

          // Auto-close chat and switch to ledger tab after action is completed
          setIsOpen(false);
          if (setActiveTab) setActiveTab("ledger");
        }

        if (!aiResponseText)
          aiResponseText = `Done! I've processed ${matches.length} expense operation${matches.length !== 1 ? "s" : ""}.`;

        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, text: aiResponseText, sender: "ai" },
        ]);
      } else {
        const errorResponse =
          data.response || "Sorry, I encountered an error. Please try again.";
        toast.error(errorResponse);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text: errorResponse,
            sender: "ai",
          },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
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
  };

  // ── Quick-action handler ──
  const handleSuggestion = (suggestion) => {
    setShowQuickActions(false);
    if (suggestion.action === "send") {
      handleSend(null, suggestion.text);
    } else {
      setInput(suggestion.text);
      setTimeout(() => {
        inputRef.current?.focus();
        const len = suggestion.text.length;
        inputRef.current?.setSelectionRange(len, len);
      }, 10);
    }
  };

  return (
    <>
      <FloatingTrigger
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        darkMode={darkMode}
        tooltipDismissed={tooltipDismissed}
        onDismissTooltip={() => setTooltipDismissed(true)}
      />

      {isOpen && (
        <div
          className={`
            fixed inset-0 z-50 flex flex-col overflow-hidden
            sm:inset-auto sm:bottom-28 sm:right-8
            sm:w-[400px] sm:h-[560px]
            sm:rounded-2xl sm:border
            transition-all duration-300 animate-fadeIn
            ${
              darkMode
                ? "bg-slate-900 border-slate-700/80 shadow-2xl shadow-black/60": "bg-white border-slate-300 shadow-2xl shadow-slate-300/60"}
          `}
        >
          <ChatBotHeader darkMode={darkMode} onClose={() => setIsOpen(false)} />

          <ChatMessageList
            messages={messages}
            isLoading={isLoading}
            darkMode={darkMode}
            messagesEndRef={messagesEndRef}
          />

          <ChatInput
            input={input}
            setInput={setInput}
            isLoading={isLoading}
            darkMode={darkMode}
            showQuickActions={showQuickActions}
            setShowQuickActions={setShowQuickActions}
            onSend={handleSend}
            onSelectAction={handleSuggestion}
            inputRef={inputRef}
          />
        </div>
      )}
    </>
  );
};

export default ChatBot;
