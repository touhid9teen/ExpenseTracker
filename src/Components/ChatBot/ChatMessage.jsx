import { SparklesIcon } from "../common/Icons";

/**
 * ChatMessage – renders a single chat bubble in the clean SaaS style.
 *
 * AI replies sit on the left behind a gradient sparkle avatar; user
 * messages sit on the right in a violet→indigo bubble. If an AI reply
 * contains a markdown-style table (`\n|`), it is parsed into a real
 * <table> inside the bubble.
 *
 * Props:
 *   - msg      : { id, text, sender, time? }
 *   - darkMode : boolean
 */
const ChatMessage = ({ msg, darkMode }) => {
  const isUser = msg.sender === "user";
  const hasTable = !isUser && msg.text.includes("\n|");

  // ── Markdown-table body ──
  const renderTable = () => {
    const lines = msg.text.trim().split("\n");
    const header = lines[0]
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((h) => h.trim());
    const rows = lines.slice(2).map((line) =>
      line
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((cell) => cell.trim()),
    );

    return (
      <div className="max-w-full overflow-x-auto">
        <table className={`min-w-full text-sm rounded-lg overflow-hidden ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
          <thead className={darkMode ? "bg-slate-800" : "bg-slate-100"}>
            <tr>
              {header.map((h, i) => (
                <th key={i} className={`px-2.5 py-1.5 font-bold text-left ${darkMode ? "border-b border-slate-700" : "border-b border-slate-200"}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className={darkMode ? (ri % 2 ? "bg-slate-900/40" : "bg-slate-900/10") : (ri % 2 ? "bg-slate-50" : "bg-white")}>
                {row.map((cell, ci) => (
                  <td key={ci} className={`px-2.5 py-1.5 ${darkMode ? "border-b border-slate-800" : "border-b border-slate-100"}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const bubbleClass = isUser
    ? "bg-gradient-to-br from-violet-500 to-indigo-500 text-white rounded-2xl rounded-br-md shadow-sm shadow-violet-500/25"
    : darkMode
      ? "bg-slate-800 text-slate-100 border border-slate-700 rounded-2xl rounded-bl-md"
      : "bg-white text-slate-700 border border-slate-200 rounded-2xl rounded-bl-md shadow-sm";

  return (
    <div className={`flex items-end gap-2.5 max-w-[88%] ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar (AI only) */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 flex items-center justify-center shrink-0 shadow-md shadow-violet-500/25">
          <SparklesIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
      )}

      <div className={`min-w-0 flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div className={`px-4 py-2.5 text-sm ${bubbleClass}`}>
          {hasTable ? renderTable() : <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>}
        </div>
        {msg.time && (
          <span className={`mt-1 px-1 text-[10px] font-medium ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
            {msg.time}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
