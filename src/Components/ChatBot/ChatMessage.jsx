import React from "react";

/**
 * ChatMessage – renders a single chat bubble.
 *
 * If the AI response contains a markdown-style table (`\n|`),
 * it is parsed into a real <table>. Otherwise a plain text bubble
 * is rendered with sender-specific styling.
 *
 * Props:
 *   - msg      : { id, text, sender }
 *   - darkMode : boolean
 */
const ChatMessage = ({ msg, darkMode }) => {
  // ── Markdown-table detection ──
  if (msg.sender === "ai" && msg.text.includes("\n|")) {
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
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              {header.map((h, i) => (
                <th
                  key={i}
                  className="px-2 py-1 border border-gray-300 font-medium text-left"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr
                key={ri}
                className={ri % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className="px-2 py-1 border border-gray-300"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // ── Plain text bubble ──
  return (
    <div
      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
        msg.sender === "user"
          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-none shadow-md shadow-emerald-500/20"
          : darkMode
            ? "bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700": "bg-slate-100 text-slate-700 rounded-bl-none border border-slate-300"}`}
    >
      <div className="whitespace-pre-wrap">{msg.text}</div>
    </div>
  );
};

export default ChatMessage;
