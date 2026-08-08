import { SparklesIcon } from "../common/Icons";
import { ChatWidget } from "../AIAssistant/ChatWidgets";

// ─── Rich-text (markdown-lite) rendering ───────────────────────

const renderInline = (text, darkMode) => {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={i} className={`font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

const renderProse = (text, darkMode) => {
  const lines = String(text).split("\n");
  const blocks = [];
  let list = null;
  const flushList = () => {
    if (list) {
      blocks.push({ type: "list", ordered: list.ordered, items: list.items });
      list = null;
    }
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushList();
      continue;
    }
    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      flushList();
      blocks.push({ type: "heading", text: heading[2] });
      continue;
    }
    const bullet = line.match(/^[-*•]\s+(.*)$/);
    if (bullet) {
      if (!list) list = { ordered: false, items: [] };
      list.items.push(bullet[1]);
      continue;
    }
    const numbered = line.match(/^\d+[.)]\s+(.*)$/);
    if (numbered) {
      if (!list) list = { ordered: true, items: [] };
      list.items.push(numbered[1]);
      continue;
    }
    flushList();
    blocks.push({ type: "para", text: line });
  }
  flushList();

  return blocks.map((block, i) => {
    if (block.type === "heading") {
      return (
        <h4
          key={i}
          className={`mt-1 mb-0.5 text-sm font-extrabold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}
        >
          {renderInline(block.text, darkMode)}
        </h4>
      );
    }
    if (block.type === "list") {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag
          key={i}
          className={`my-1 pl-5 space-y-0.5 ${block.ordered ? "list-decimal" : "list-disc"}`}
        >
          {block.items.map((item, j) => (
            <li key={j} className="leading-relaxed">
              {renderInline(item, darkMode)}
            </li>
          ))}
        </Tag>
      );
    }
    return (
      <p key={i} className="leading-relaxed">
        {renderInline(block.text, darkMode)}
      </p>
    );
  });
};

// ─── Markdown table rendering ──────────────────────────────────

const renderTable = (lines, darkMode) => {
  const data = lines
    .filter((line) => line.trim().startsWith("|"))
    .map((line) =>
      line
        .replace(/^\s*\|/, "")
        .replace(/\|\s*$/, "")
        .split("|")
        .map((cell) => cell.trim()),
    )
    .filter((row) => !row.every((cell) => /^[-:]+$/.test(cell))); // drop separator rows
  if (data.length < 2) return null;
  const [header, ...rows] = data;

  return (
    <div className="max-w-full overflow-x-auto">
      <table className={`min-w-full text-sm rounded-lg overflow-hidden ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
        <thead className={darkMode ? "bg-slate-700" : "bg-slate-100"}>
          <tr>
            {header.map((h, i) => (
              <th
                key={i}
                className={`px-2.5 py-1.5 font-bold text-left ${
                  darkMode ? "border-b border-slate-600" : "border-b border-slate-200"
                }`}
              >
                {renderInline(h, darkMode)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className={darkMode ? (ri % 2 ? "bg-slate-900/40" : "bg-transparent") : ri % 2 ? "bg-slate-50" : "bg-white"}
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`px-2.5 py-1.5 ${darkMode ? "border-b border-slate-700" : "border-b border-slate-100"}`}
                >
                  {renderInline(cell, darkMode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── Message body (mixed prose + tables) ───────────────────────

const renderBody = (text, darkMode) => {
  const lines = String(text).split("\n");
  const blocks = [];
  let prose = [];
  const flushProse = () => {
    if (prose.length) {
      blocks.push({ kind: "prose", text: prose.join("\n") });
      prose = [];
    }
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const next = lines[i + 1] || "";
    if (line.trim().startsWith("|") && next.trim().startsWith("|") && /-{2,}/.test(next)) {
      flushProse();
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      i--;
      blocks.push({ kind: "table", lines: tableLines });
    } else {
      prose.push(line);
    }
  }
  flushProse();

  return blocks.map((block, i) =>
    block.kind === "table" ? (
      <div key={i} className="my-1">
        {renderTable(block.lines, darkMode)}
      </div>
    ) : (
      <div key={i} className="space-y-1">
        {renderProse(block.text, darkMode)}
      </div>
    ),
  );
};

/**
 * ChatMessage – renders a single chat bubble in the mockup style.
 *
 * AI replies sit on the left behind a blue sparkle avatar in a white card;
 * user messages sit on the right in a light-purple filled card. AI replies
 * support **bold**, # headers, bullet/numbered lists, markdown tables and
 * embedded chart widgets (donut / trend cards).
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
