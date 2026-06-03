import React from "react";
import ChatMessage from "./ChatMessage";

/**
 * ChatMessageList – scrollable messages area with a "Today" separator,
 * message bubbles, and a typing indicator.
 *
 * Props:
 *   - messages       : Array<{ id, text, sender }>
 *   - isLoading      : boolean
 *   - darkMode       : boolean
 *   - messagesEndRef : React.RefObject – anchors auto-scroll
 */
const ChatMessageList = ({ messages, isLoading, darkMode, messagesEndRef }) => (
  <div
    className={`flex-1 overflow-y-auto p-4 flex flex-col gap-4 ${
      darkMode ? "bg-slate-900" : "bg-white"
    }`}
  >
    {/* Date separator */}
    <div className="flex items-center gap-2 my-1">
      <div className={`flex-1 h-px ${darkMode ? "bg-slate-700" : "bg-slate-200"}`} />
      <span className={`text-[10px] px-2 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
        Today
      </span>
      <div className={`flex-1 h-px ${darkMode ? "bg-slate-700" : "bg-slate-200"}`} />
    </div>

    {messages.map((msg) => (
      <div
        key={msg.id}
        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
      >
        <ChatMessage msg={msg} darkMode={darkMode} />
      </div>
    ))}

    {/* Typing indicator */}
    {isLoading && (
      <div className="flex justify-start">
        <div
          className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm rounded-bl-none border ${
            darkMode
              ? "bg-slate-800 border-slate-700"
              : "bg-slate-100 border-slate-200"
          }`}
        >
          <div className="flex gap-1.5 items-center h-4">
            <div
              className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>
    )}

    {/* Scroll anchor */}
    <div ref={messagesEndRef} />
  </div>
);

export default ChatMessageList;
