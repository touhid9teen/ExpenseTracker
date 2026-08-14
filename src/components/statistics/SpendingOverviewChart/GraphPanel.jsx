"use client";
import { buildSmoothPath, formatCurrency, VIEW_W, VIEW_H, PAD_BOTTOM } from "./chartPath";

const lineColor = "#8b5cf6";

/**
 * GraphPanel – the area/line chart of the spending trend with a hoverable
 * tooltip, hit-targets over each point and clickable period labels below.
 */
const GraphPanel = ({ darkMode, coords, activeIndex, setActiveIndex }) => {
    const active = coords[activeIndex] || coords[coords.length - 1];
    const tooltipLeftPct = active ? (active.x / VIEW_W) * 100 : 50;

    const linePath = buildSmoothPath(coords);
    const areaPath = linePath
        ? `${linePath} L ${coords[coords.length - 1].x} ${VIEW_H - PAD_BOTTOM} L ${coords[0].x} ${VIEW_H - PAD_BOTTOM} Z`
        : "";

    return (
        <div className="p-3 sm:p-4">
            <div className="relative">
                {active && (
                    <div
                        className="absolute -top-1 z-10 -translate-x-1/2 transition-all duration-300 pointer-events-none"
                        style={{ left: `${tooltipLeftPct}%` }}
                    >
                        <div className="px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap text-white bg-gradient-to-br from-violet-500 to-indigo-500 shadow-lg shadow-violet-500/30">
                            {formatCurrency(active.amount)}
                        </div>
                    </div>
                )}

                <svg
                    viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                    className="w-full h-[84px] overflow-visible"
                    preserveAspectRatio="none"
                    role="img"
                    aria-label="Spending trend over time"
                >
                    <defs>
                        <linearGradient id="overviewLine" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#6366f1" />
                        </linearGradient>
                        <linearGradient id="overviewArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={darkMode ? 0.35 : 0.22} />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {areaPath && <path d={areaPath} fill="url(#overviewArea)" />}
                    {linePath && (
                        <path
                            d={linePath}
                            fill="none"
                            stroke="url(#overviewLine)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    )}
                    {active && (
                        <line
                            x1={active.x}
                            y1={active.y}
                            x2={active.x}
                            y2={VIEW_H - PAD_BOTTOM}
                            stroke={darkMode ? "#475569" : "#cbd5e1"}
                            strokeWidth="1.5"
                            strokeDasharray="3 3"
                        />
                    )}
                    {coords.map((c, i) => (
                        <rect
                            key={`hit-${c.key}`}
                            x={c.x - (VIEW_W / coords.length) / 2}
                            y={0}
                            width={VIEW_W / coords.length}
                            height={VIEW_H}
                            fill="transparent"
                            className="cursor-pointer"
                            onMouseEnter={() => setActiveIndex(i)}
                            onClick={() => setActiveIndex(i)}
                        />
                    ))}
                    {active && (
                        <circle
                            cx={active.x}
                            cy={active.y}
                            r="6"
                            fill={darkMode ? "#0f172a" : "#ffffff"}
                            stroke={lineColor}
                            strokeWidth="3"
                        />
                    )}
                </svg>

                <div className="flex justify-between mt-1.5 px-1">
                    {coords.map((c, i) => (
                        <button
                            key={`label-${c.key}`}
                            onClick={() => setActiveIndex(i)}
                            className={`flex-1 text-[9px] sm:text-[11px] font-medium transition-colors ${
                                i === activeIndex
                                    ? darkMode ? "text-slate-100 font-bold" : "text-slate-900 font-bold"
                                    : darkMode ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"
                            }`}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GraphPanel;
