import { buildCategoryBreakdown, buildMonthlyTrend } from "./ChatWidgets";

/**
 * parseDirectives – pulls the structured directives out of an AI response:
 *   [WIDGET: category-breakdown | monthly-trend | trend: <category>] → chart data
 *   [ACTION: {json}]            → expense mutations (executed by the caller)
 *   [NAVIGATE: "tab"]           → section switching (executed by the caller)
 *
 * Returns the cleaned text plus the parsed { widgets, actions, navs }.
 */
const parseDirectives = (aiText, expenses) => {
  let text = aiText || "";
  const widgets = [];
  const actions = [];

  // Chart widget directives → real cards computed from real expenses.
  const widgetRegex = /\[WIDGET:\s*([^\]]+)\s*\]/gi;
  const widgetMatches = [...text.matchAll(widgetRegex)];
  text = text.replace(widgetRegex, "").trim();
  for (const match of widgetMatches) {
    const directive = (match[1] || "").trim();
    if (/^category-breakdown$/i.test(directive)) {
      widgets.push({ type: "category-breakdown", data: buildCategoryBreakdown(expenses) });
    } else if (/^monthly-trend$/i.test(directive)) {
      widgets.push({ type: "trend", data: buildMonthlyTrend(expenses), category: null });
    } else {
      const cat = directive.match(/^trend:\s*(.+)$/i);
      if (cat) {
        const name = cat[1].trim();
        widgets.push({ type: "trend", data: buildMonthlyTrend(expenses, name), category: name });
      }
    }
  }

  // Expense mutations.
  const actionRegex = /\[ACTION:\s*({.*?})\s*\]/gs;
  const actionMatches = [...text.matchAll(actionRegex)];
  text = text.replace(actionRegex, "").trim();
  for (const match of actionMatches) {
    try {
      actions.push(JSON.parse(match[1]));
    } catch (err) {
      console.error("Failed to parse action JSON", err);
    }
  }

  // On-demand section switching ("show my table" → ledger).
  const navRegex = /\[NAVIGATE:\s*"([a-z]+)"\s*\]/gi;
  const navs = [...text.matchAll(navRegex)];
  text = text.replace(navRegex, "").trim();

  return { text, widgets, actions, navs };
};

export default parseDirectives;
