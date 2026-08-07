// ─── Smart natural-language expense parser ─────────────────────────
// Detects expense-like input ("spent 120 on lunch", "uber 22",
// "paid ৳500 for groceries") and extracts amount + description + a
// best-guess category. Used by the AI composer to show a quick-confirm
// chip instead of sending trivial entries to the LLM.

const CATEGORIES = [
  "Food",
  "Transport",
  "Utilities",
  "Entertainment",
  "Healthcare",
  "Shopping",
  "Education",
  "Others",
];

// Keyword → category lookup. First hit wins.
const CATEGORY_KEYWORDS = {
  Transport: [
    "uber", "pathao", "obhai", "ride", "cab", "taxi", "bus", "train",
    "rickshaw", "fuel", "petrol", "gas", "parking", "toll", "bike", "metro",
  ],
  Food: [
    "lunch", "dinner", "breakfast", "coffee", "tea", "food", "restaurant",
    "grocery", "groceries", "snack", "snacks", "pizza", "burger", "kacchi",
    "biriyani", "biriani", "cafe", "meal", "rice", "starbucks", "juice",
  ],
  Utilities: [
    "electricity", "bill", "internet", "water", "gas", "utility",
    "broadband", "mobile", "recharge", "wifi", "dth", "cable", "rent",
  ],
  Entertainment: [
    "movie", "cinema", "netflix", "spotify", "game", "concert",
    "subscription", "youtube", "entertainment", "show",
  ],
  Healthcare: [
    "medicine", "medical", "doctor", "hospital", "pharmacy", "clinic",
    "health", "vitamin", "checkup", "dentist",
  ],
  Shopping: [
    "shopping", "clothes", "shirt", "shoe", "shoes", "sneaker", "gadget",
    "phone", "laptop", "bag", "watch", "gift", "dress",
  ],
  Education: [
    "course", "book", "books", "tuition", "school", "university", "class",
    "training", "udemy", "exam", "fees",
  ],
};

// Leading words that add no meaning to the description.
const NOISE_WORDS = new Set([
  "spent", "spend", "spends", "paid", "pay", "cost", "costs", "bought",
  "purchased", "on", "for", "at", "in", "just", "about", "around", "roughly",
  "approximately", "a", "an", "the", "my", "today", "yesterday", "taka",
  "tk", "bdt", "৳", "$", "rs", "rupees", "worth", "of", "to", "with",
]);

const CURRENCY = "[৳$€£]?\\s?";
const AMOUNT = "(\\d+(?:[.,]\\d+)*)";
const UNIT = "\\s?(?:taka|takas|tk|bdt|৳|\\$|rs)?";
const JOINER = "\\s*(?:on|for|at|in|worth)?\\s*";

// Pattern 1: "spent 120 on lunch" / "paid 500 for groceries" / "cost 30 tk"
const P1 = new RegExp(
  `^(?:spent|spend|spends|paid|pay|paying|cost|costs|bought|purchased)\\s+${CURRENCY}${AMOUNT}${UNIT}${JOINER}(.+)$`,
  "i",
);

// Pattern 2: "120 for lunch" / "৳500 for groceries" / "$22 uber"
const P2 = new RegExp(
  `^${CURRENCY}${AMOUNT}${UNIT}${JOINER}(.+)$`,
  "i",
);

// Pattern 3: "lunch 150" / "uber 22" / "groceries 500 taka" (amount at end)
const P3 = new RegExp(
  `^(.+?)\\s+${CURRENCY}${AMOUNT}${UNIT}$`,
  "i",
);

const cleanDescription = (raw) =>
  raw
    .replace(/[.,!]+$/, "")
    .split(/\s+/)
    .filter((w) => w && !NOISE_WORDS.has(w.toLowerCase()))
    .join(" ")
    .trim();

const guessCategory = (description) => {
  const lower = description.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) return category;
  }
  return "Others";
};

// Normalize amounts with grouping/decimal separators: "1,200" → 1200,
// "120.50" → 120.5, "1,200.50" → 1200.5, "120,5" → 120.5 (Euro style).
const toAmount = (value) => {
  const str = String(value).trim().replace(/\s/g, "");
  let cleaned = str;
  if (str.includes(",") && str.includes(".")) {
    cleaned = str.replace(/,/g, ""); // comma = thousands separator
  } else if (str.includes(",")) {
    cleaned = /,\d{3}(?:\.|$)/.test(str) ? str.replace(/,/g, "") : str.replace(",", ".");
  }
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

// Strong signals that text is really an expense, not casual speech.
const CURRENCY_RE = /[৳$€£]|\b(?:taka|takas|tk|bdt|rs|rupees)\b/i;
const hasCategorySignal = (description) => {
  const lower = description.toLowerCase();
  return Object.values(CATEGORY_KEYWORDS).some((keywords) =>
    keywords.some((kw) => lower.includes(kw)),
  );
};

/**
 * Parse a user input string into an expense suggestion.
 *
 * @param {string} text
 * @returns {null | { amount: number, description: string, category: string }}
 *   null when the text does not look like an expense entry.
 */
export const parseSmartExpense = (text) => {
  if (!text || typeof text !== "string") return null;
  const trimmed = text.trim();
  if (!trimmed || trimmed.length > 90) return null;

  // Questions and pure commands are not expense entries.
  if (trimmed.includes("?")) return null;
  if (/^(how|what|why|which|who|when|show|list|give|tell|summar|compare|budget|tip|suggest)/i.test(trimmed)) {
    return null;
  }

  let match = trimmed.match(P1);
  let description;
  let amount;

  if (match) {
    // Explicit verb ("spent 120 on lunch") — clear intent, accept as-is.
    amount = toAmount(match[1]);
    description = cleanDescription(match[2]);
  } else {
    match = trimmed.match(P2);
    if (match) {
      amount = toAmount(match[1]);
      description = cleanDescription(match[2]);
    } else {
      match = trimmed.match(P3);
      if (match) {
        amount = toAmount(match[2]);
        description = cleanDescription(match[1]);
      }
    }
    // No explicit verb: require a currency symbol OR a category keyword so
    // casual phrases like "5 tips to save" / "see you at 5" don't pop chips.
    if (match && !CURRENCY_RE.test(trimmed) && !hasCategorySignal(description)) {
      return null;
    }
  }

  if (!amount || !description) return null;
  // A real description needs letters — this rejects regex backtracks that
  // spill digits into the description (e.g. "spent 120" → desc "0").
  if (!/[a-zA-Z]/.test(description)) return null;

  return {
    amount,
    description,
    category: guessCategory(description),
  };
};

export { CATEGORIES as SMART_CATEGORIES };
