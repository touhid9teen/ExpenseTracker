import { SparklesIcon } from "../../ui/Icons";
import { ChatWidget } from "../AIAssistant/ChatWidgets/index";
import renderBody from "./markdown";

/**
 * ChatMessage – renders a single chat bubble in the mockup style.
 *
 * AI replies sit on the left behind a blue sparkle avatar in a white card;
 * user messages sit on the right in a light-purple filled card. AI replies
 * support **bold**, # headers, bullet/numbered lists, markdown tables and
 * embedded chart widgets (donut / trend cards). The markdown-lite rendering
 * lives in ./markdown.jsx.
 *
 * Props:
 *   - msg      : { id, text, sender, time?, widgets? }
 *   - darkMode : boolean
 */
const ChatMessage = ({ msg, darkMode }) => {
  const isUser = msg.sender === "user";

  const bubbleClass = isUser
    ? darkMode
      ? "bg-violet-600 text-white rounded-2xl rounded-br-md shadow-sm"
      : "bg-[#EFEFFB] text-violet-900 border border-violet-100 rounded-2xl rounded-br-md shadow-sm"
    : darkMode
      ? "bg-slate-800 text-slate-100 border border-slate-700 rounded-2xl rounded-bl-md"
      : "bg-white text-slate-700 border border-slate-200 rounded-2xl rounded-bl-md shadow-sm";

  return (
    <div className={`flex items-end gap-2.5 max-w-[88%] ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar (AI only) */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shrink-0 shadow-md shadow-blue-500/25">
          <SparklesIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
      )}

      <div className={`min-w-0 flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div className={`px-4 py-2.5 text-sm ${bubbleClass}`}>
          <div className="space-y-1">{renderBody(msg.text, darkMode)}</div>
        </div>
        {msg.time && (
          <span className={`mt-1 px-1 text-[10px] font-medium ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
            {msg.time}
          </span>
        )}
        {!isUser && msg.widgets?.length > 0 && (
          <div className="w-full">
            {msg.widgets.map((widget, i) => (
              <ChatWidget key={i} widget={widget} darkMode={darkMode} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
