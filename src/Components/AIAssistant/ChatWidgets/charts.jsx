"use client";

import { useId } from "react";
import { formatTaka } from "./data";

export const DONUT_COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ec4899", "#94a3b8"];

// ─── Donut chart (inline SVG) ──────────────────────────────────

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

export default DonutChart;
export { TrendChart };
