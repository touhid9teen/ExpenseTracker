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
        <table className={`min-w-full text-sm ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
          <thead className={darkMode ? "bg-slate-800" : "bg-slate-100"}>
            <tr>
              {header.map((h, i) => (
                <th
                  key={i}
                  className={`px-2 py-1 border font-bold text-left ${
                    darkMode ? "border-slate-700" : "border-slate-300"
                  }`}
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
                className={darkMode ? (ri % 2 === 0 ? "bg-slate-900/50" : "bg-slate-900/20") : (ri % 2 === 0 ? "bg-white" : "bg-slate-50")}
              >
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`px-2 py-1 border ${
                      darkMode ? "border-slate-700" : "border-slate-300"
                    }`}
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
      className={`max-w-[85%] cyber-cut-sm px-4 py-2.5 text-sm ${
        msg.sender === "user"
          ? "cyber-btn-accent text-white shadow-md shadow-cyan-500/20"
          : darkMode
            ? "bg-slate-800 text-slate-100 border-2 border-slate-700 cyber-3d-sm [--glow-3d:var(--accent-glow-soft)]"
            : "bg-slate-100 text-slate-700 border-2 border-slate-300"}`}
    >
      <div className="whitespace-pre-wrap">{msg.text}</div>
    </div>
  );
};

export default ChatMessage;
