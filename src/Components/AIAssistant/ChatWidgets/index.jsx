"use client";

import { ChartPieIcon, TrendingUpIcon } from "../../common/Icons";
import DonutChart, { TrendChart, DONUT_COLORS } from "./charts";
import { buildCategoryBreakdown, buildMonthlyTrend, formatTaka, monthLabel } from "./data";

export { buildCategoryBreakdown, buildMonthlyTrend };

const cardClass = (darkMode) =>
  `rounded-2xl border p-4 shadow-sm ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`;

// ─── Widget cards ──────────────────────────────────────────────

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
