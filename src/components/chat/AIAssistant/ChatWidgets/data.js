// Data builders + helpers for the chat widget cards. Computed client-side
// from the user's real expenses.

const monthKey = (dateStr) => (dateStr || "").slice(0, 7); // "YYYY-MM"

export const formatTaka = (value) =>
  `৳${Math.round(Number(value) || 0).toLocaleString("en-US")}`;

export const monthLabel = (key) => {
  const [y, m] = key.split("-");
  return new Date(Number(y), Number(m) - 1, 1).toLocaleString("en-US", {
    month: "short",
  });
};

const getLatestMonth = (expenses) => {
  const keys = (expenses || []).map((e) => monthKey(e.date)).filter(Boolean);
  return keys.length ? [...keys].sort().at(-1) : monthKey(new Date().toISOString());
};

export const buildCategoryBreakdown = (expenses) => {
  const list = Array.isArray(expenses) ? expenses : [];
  const latest = getLatestMonth(list);
  const inMonth = list.filter((e) => monthKey(e.date) === latest);
  const totals = {};
  let total = 0;
  for (const e of inMonth) {
    const amt = Number(e.amount) || 0;
    totals[e.category || "Others"] = (totals[e.category || "Others"] || 0) + amt;
    total += amt;
  }
  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const items = entries.slice(0, 5).map(([category, amount]) => ({
    category,
    amount,
    pct: total ? (amount / total) * 100 : 0,
  }));
  const rest = entries.slice(5).reduce((sum, [, amount]) => sum + amount, 0);
  if (rest > 0) items.push({ category: "Others", amount: rest, pct: total ? (rest / total) * 100 : 0 });
  return { monthLabel: monthLabel(latest), total, items };
};

export const buildMonthlyTrend = (expenses, category) => {
  const list = Array.isArray(expenses) ? expenses : [];
  const filtered = category
    ? list.filter((e) => (e.category || "").toLowerCase() === category.toLowerCase())
    : list;
  const latest = getLatestMonth(filtered);
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(Number(latest.slice(0, 4)), Number(latest.slice(5, 7)) - 1 - i, 1);
    months.push({ key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` });
  }
  for (const m of months) {
    m.total = filtered
      .filter((e) => monthKey(e.date) === m.key)
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  }
  return { months };
};
