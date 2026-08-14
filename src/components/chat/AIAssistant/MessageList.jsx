"use client";

import ChatMessage from "../ChatMessage/index";
import WelcomeScreen from "./WelcomeScreen";

/**
 * MessageList – the scrollable conversation area: welcome hero when the
 * conversation is empty, otherwise the message bubbles plus the typing
 * indicator, with a scroll anchor at the end.
 */
const MessageList = ({
  darkMode,
  messages,
  isLoading,
  showWelcome,
  messagesEndRef,
  SUGGESTIONS,
  onSuggestion,
}) => (
  <div className="flex-1 overflow-y-auto no-scrollbar px-4 sm:px-6 py-5 flex flex-col gap-4">
    {showWelcome ? (
      <WelcomeScreen darkMode={darkMode} SUGGESTIONS={SUGGESTIONS} onSuggestion={onSuggestion} />
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
);

export default MessageList;
