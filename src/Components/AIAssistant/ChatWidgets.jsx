"use client";

import { useId } from "react";
import { ChartPieIcon, TrendingUpIcon } from "../common/Icons";

// ─── Shared helpers ────────────────────────────────────────────

const monthKey = (dateStr) => (dateStr || "").slice(0, 7); // "YYYY-MM"

const formatTaka = (value) =>
  `৳${Math.round(Number(value) || 0).toLocaleString("en-US")}`;

const monthLabel = (key) => {
  const [y, m] = key.split("-");
  return new Date(Number(y), Number(m) - 1, 1).toLocaleString("en-US", {
    month: "short",
  });
};

const getLatestMonth = (expenses) => {
  const keys = (expenses || []).map((e) => monthKey(e.date)).filter(Boolean);
  return keys.length ? [...keys].sort().at(-1) : monthKey(new Date().toISOString());
};

// ─── Data builders (run client-side on the real expenses) ──────

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

// ─── Donut chart (inline SVG) ──────────────────────────────────

const DONUT_COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ec4899", "#94a3b8"];

const DonutChart = ({ items, total, darkMode }) => {
  const R = 34;
  const C = 2 * Math.PI * R;
  const safeTotal = total || items.reduce((s, i) => s + i.amount, 0) || 1;
  let offset = 0;
  const textColor = darkMode ? "#f1f5f9" : "#1e293b";
  const muted = darkMode ? "#94a3b8" : "#64748b";

  return (
    <svg viewBox="0 0 96 96" className="w-32 h-32 shrink-0" aria-hidden="true">
      <circle cx="48" cy="48" r={R} fill="none" stroke={darkMode ? "#1e293b" : "#f1f5f9"} strokeWidth="13" />
      {items.map((item, i) => {
        const len = (item.amount / safeTotal) * C;
        const seg = (
          <circle
            key={i}
            cx="48"
            cy="48"
            r={R}
            fill="none"
            stroke={DONUT_COLORS[i % DONUT_COLORS.length]}
            strokeWidth="13"
            strokeDasharray={`${Math.max(len - 1.5, 0)} ${C - Math.max(len - 1.5, 0)}`}
            strokeDashoffset={-offset}
            transform="rotate(-90 48 48)"
          />
        );
        offset += len;
        return seg;
      })}
      <text x="48" y="44" textAnchor="middle" fontSize="8" fontWeight="700" fill={muted}>
        Total
      </text>
      <text x="48" y="58" textAnchor="middle" fontSize="11" fontWeight="800" fill={textColor}>
        {formatTaka(safeTotal)}
      </text>
    </svg>
  );
};

// ─── Line / area chart (inline SVG) ────────────────────────────

const TrendChart = ({ points, darkMode, green }) => {
  const uid = useId();
  const W = 260;
  const H = 96;
  const PAD = 10;
  const max = Math.max(...points.map((p) => p.value), 1);
  const n = points.length;
  const stepX = n > 1 ? (W - PAD * 2) / (n - 1) : 0;
  const coords = points.map((p, i) => ({
    x: n > 1 ? PAD + i * stepX : W / 2,
    y: H - PAD - (p.value / max) * (H - PAD * 2),
  }));
  const line = coords.map((c) => `${c.x},${c.y}`).join(" ");
  const area = coords.length
    ? `${coords[0].x},${H - PAD} ${line} ${coords[coords.length - 1].x},${H - PAD}`
    : "";
  const stroke = green ? "#10b981" : "#8b5cf6";
  const gradId = `trend-grad-${uid.replace(/[^a-zA-Z0-9]/g, "")}-${green ? "g" : "v"}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-24" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={green ? "rgba(16,185,129,0.30)" : "rgba(139,92,246,0.28)"} />
          <stop offset="100%" stopColor="rgba(139,92,246,0)" />
        </linearGradient>
      </defs>
      {area && <polygon points={area} fill={`url(#${gradId})`} />}
      {line && (
        <polyline
          points={line}
          fill="none"
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {coords.map((c, i) => (
        <circle
          key={i}
          cx={c.x}
          cy={c.y}
          r="3"
          fill={stroke}
          stroke={darkMode ? "#0e1428" : "#ffffff"}
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
};

// ─── Widget cards ──────────────────────────────────────────────

const cardClass = (darkMode) =>
  `rounded-2xl border p-4 shadow-sm ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`;

export const CategoryBreakdownWidget = ({ data, darkMode }) => {
  if (!data || !data.items.length) return null;
  return (
    <div className={`mt-3 ${cardClass(darkMode)}`}>
      <div className="flex items-center gap-2.5">
        <span
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            darkMode ? "bg-emerald-500/15 text-emerald-300" : "bg-emerald-100 text-emerald-600"
          }`}
        >
          <ChartPieIcon className="w-4 h-4" strokeWidth={2.25} />
        </span>
        <div className="min-w-0">
          <h4 className={`text-sm font-bold leading-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
            Top 5 Categories
          </h4>
          <p className={`text-[11px] font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            {data.monthLabel}
          </p>
        </div>
        <span className={`ml-auto text-lg font-black ${darkMode ? "text-white" : "text-slate-900"}`}>
          {formatTaka(data.total)}
        </span>
      </div>

      <div className="flex items-center gap-4 mt-3">
        <DonutChart items={data.items} total={data.total} darkMode={darkMode} />
        <ul className="flex-1 min-w-0 space-y-1.5">
          {data.items.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }}
              />
              <span className={`flex-1 min-w-0 truncate font-medium ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                {item.category}
              </span>
              <span className={`font-bold shrink-0 ${darkMode ? "text-white" : "text-slate-800"}`}>
                {formatTaka(item.amount)}
              </span>
              <span className={`w-9 text-right font-semibold shrink-0 ${darkMode ? "text-slate-400" : "text-slate-400"}`}>
                {Math.round(item.pct)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const MonthlyTrendWidget = ({ data, category, darkMode }) => {
  if (!data || !data.months || !data.months.length) return null;
  const green = !!category;
  const points = data.months.map((m) => ({ label: monthLabel(m.key), value: m.total }));
  const total = points.reduce((sum, p) => sum + p.value, 0);
  return (
    <div className={`mt-3 ${cardClass(darkMode)}`}>
      <div className="flex items-center gap-2.5">
        <span
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            green
              ? darkMode
                ? "bg-emerald-500/15 text-emerald-300"
                : "bg-emerald-100 text-emerald-600"
              : darkMode
                ? "bg-violet-500/15 text-violet-300"
                : "bg-violet-100 text-violet-600"
          }`}
        >
          <TrendingUpIcon className="w-4 h-4" strokeWidth={2.25} />
        </span>
        <div className="min-w-0">
          <h4 className={`text-sm font-bold leading-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
            {category ? `${category} — last 6 months` : "Monthly spending trend"}
          </h4>
          <p className={`text-[11px] font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Total {formatTaka(total)}
          </p>
        </div>
      </div>
      <div className="mt-3">
        <TrendChart points={points} darkMode={darkMode} green={green} />
        <div className="flex justify-between mt-1 px-1">
          {points.map((p, i) => (
            <span key={i} className={`text-[10px] font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              {p.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

/** Renders whichever widget a chat message carries. */
export const ChatWidget = ({ widget, darkMode }) => {
  if (!widget) return null;
  if (widget.type === "category-breakdown") {
    return <CategoryBreakdownWidget data={widget.data} darkMode={darkMode} />;
  }
  if (widget.type === "trend") {
    return <MonthlyTrendWidget data={widget.data} category={widget.category} darkMode={darkMode} />;
  }
  return null;
};
