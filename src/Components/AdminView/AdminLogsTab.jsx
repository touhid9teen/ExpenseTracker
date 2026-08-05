"use client";
import { memo } from "react";
import { ServerIcon, TrashIcon } from "../common/Icons";

const METHOD_STYLES = {
  GET: { dark: "bg-sky-500/10 text-sky-400 border border-sky-500/25", light: "bg-sky-100 text-sky-700 border border-sky-200" },
  POST: { dark: "bg-amber-500/10 text-amber-400 border border-amber-500/25", light: "bg-amber-100 text-amber-700 border border-amber-200" },
  PUT: { dark: "bg-violet-500/10 text-violet-400 border border-violet-500/25", light: "bg-violet-100 text-violet-700 border border-violet-200" },
  PATCH: { dark: "bg-violet-500/10 text-violet-400 border border-violet-500/25", light: "bg-violet-100 text-violet-700 border border-violet-200" },
  DELETE: { dark: "bg-rose-500/10 text-rose-400 border border-rose-500/25", light: "bg-rose-100 text-rose-700 border border-rose-200" },
};

const statusStyle = (status, darkMode) => {
  if (status >= 500) return darkMode ? "text-rose-400" : "text-rose-600";
  if (status >= 400) return darkMode ? "text-amber-400" : "text-amber-600";
  return darkMode ? "text-emerald-400" : "text-emerald-600";
};

const formatDuration = (ms) => {
  if (ms == null) return "—";
  return ms >= 1000 ? `${(ms / 1000).toFixed(2)}s` : `${ms}ms`;
};

const formatTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
};

const AdminLogsTab = memo(
  function AdminLogsTab({ darkMode, logs, isAdminLoading, clearLogs }) {
    const handleClear = () => {
      if (window.confirm("Clear all API request logs? This cannot be undone.")) {
        clearLogs();
      }
    };

    return (
      <div className="space-y-4">
        {/* Polling notice + clear */}
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-2 text-[11px] font-semibold ${
              darkMode ? "text-slate-500" : "text-slate-400"
            }`}
          >
            <span className="relative flex w-2 h-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full w-2 h-2 bg-emerald-500" />
            </span>
            Live — auto-refreshes every 10s
          </span>
          <button
            onClick={handleClear}
            disabled={isAdminLoading || logs.length === 0}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-40 ${
              darkMode
                ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                : "bg-red-50 text-red-600 hover:bg-red-100"
            }`}
          >
            <TrashIcon className="w-3.5 h-3.5" />
            Clear Logs
          </button>
        </div>

        {!isAdminLoading && logs.length === 0 ? (
          <div
            className={`rounded-2xl border px-6 py-14 flex flex-col items-center justify-center text-center ${
              darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-300/80"
            }`}
          >
            <div className={`mb-4 ${darkMode ? "text-slate-600" : "text-slate-300"}`}>
              <ServerIcon className="w-12 h-12" strokeWidth={1.5} />
            </div>
            <p className={`text-sm font-bold ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
              No API activity yet
            </p>
            <p className={`mt-1 text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
              Requests will appear here as they hit the API.
            </p>
          </div>
        ) : (
          <div
            className={`rounded-2xl border overflow-hidden ${
              darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-300/80"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[760px]">
                <thead>
                  <tr
                    className={`text-[10px] uppercase tracking-widest font-bold border-b ${
                      darkMode ? "text-slate-500 border-slate-800" : "text-slate-400 border-slate-200"
                    }`}
                  >
                    <th className="px-5 py-3.5">Time</th>
                    <th className="px-5 py-3.5">Method</th>
                    <th className="px-5 py-3.5">Path</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">User</th>
                    <th className="px-5 py-3.5">IP</th>
                    <th className="px-5 py-3.5 text-right">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {logs.map((log) => {
                    const methodStyle = METHOD_STYLES[log.method] || METHOD_STYLES.GET;
                    return (
                      <tr
                        key={log.id}
                        className={`transition-colors ${
                          darkMode
                            ? "divide-slate-800/70 hover:bg-slate-800/40"
                            : "divide-slate-100 hover:bg-slate-50"
                        }`}
                      >
                        <td
                          className={`px-5 py-3 text-xs tabular-nums whitespace-nowrap ${
                            darkMode ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          {formatTime(log.createdAt)}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wide ${
                              darkMode ? methodStyle.dark : methodStyle.light
                            }`}
                          >
                            {log.method || "—"}
                          </span>
                        </td>
                        <td
                          className={`px-5 py-3 text-xs font-mono max-w-[280px] truncate ${
                            darkMode ? "text-slate-300" : "text-slate-600"
                          }`}
                          title={log.path || ""}
                        >
                          {log.path || "—"}
                        </td>
                        <td
                          className={`px-5 py-3 text-xs font-extrabold tabular-nums ${
                            statusStyle(log.status, darkMode)
                          }`}
                        >
                          {log.status ?? "—"}
                        </td>
                        <td
                          className={`px-5 py-3 text-xs ${
                            darkMode ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          {log.username || "—"}
                        </td>
                        <td
                          className={`px-5 py-3 text-xs font-mono ${
                            darkMode ? "text-slate-500" : "text-slate-400"
                          }`}
                        >
                          {log.ip || "—"}
                        </td>
                        <td
                          className={`px-5 py-3 text-right text-xs tabular-nums ${
                            darkMode ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          {formatDuration(log.durationMs)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default AdminLogsTab;
