"use client";
import { memo } from "react";
import {
  UsersGroupIcon,
  ClipboardListIcon,
  ActivityIcon,
  RefreshIcon,
  ShieldCheckIcon,
} from "../common/Icons";
import AdminUsersTab from "./AdminUsersTab";
import AdminExpensesTab from "./AdminExpensesTab";
import AdminLogsTab from "./AdminLogsTab";

const AdminView = memo(function AdminView(props) {
  const {
    darkMode,
    adminTab,
    setAdminTab,
    users,
    allExpenses,
    logs,
    isAdminLoading,
    refreshAdmin,
    lastRefresh,
  } = props;

  const tabs = [
    { id: "users", label: "Users", icon: UsersGroupIcon, count: users.length },
    { id: "expenses", label: "Expenses", icon: ClipboardListIcon, count: allExpenses.length },
    { id: "logs", label: "Live Logs", icon: ActivityIcon, count: logs.length },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-3 border ${
              darkMode
                ? "bg-amber-500/10 text-amber-400 border-amber-500/25"
                : "bg-amber-100 text-amber-700 border-amber-200"
            }`}
          >
            <ShieldCheckIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
            Admin Console
          </div>
          <h1
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Platform Administration
          </h1>
          <p
            className={`mt-1.5 text-sm ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Manage users, review every expense, and monitor live API activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {lastRefresh && (
            <span
              className={`text-[11px] font-medium hidden sm:inline ${
                darkMode ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Updated {lastRefresh.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={refreshAdmin}
            disabled={isAdminLoading}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 disabled:opacity-60 ${
              darkMode
                ? "bg-slate-800 border border-slate-700 text-amber-400 hover:bg-slate-700"
                : "bg-white border border-slate-300 text-amber-600 hover:bg-slate-50"
            }`}
          >
            <RefreshIcon
              className={`w-4 h-4 ${isAdminLoading ? "animate-spin" : ""}`}
              strokeWidth={2.5}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div
        className={`inline-flex p-1 rounded-xl border gap-1 ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-300"
        }`}
      >
        {tabs.map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            onClick={() => setAdminTab(id)}
            className={`px-3 sm:px-4 py-2 rounded-lg text-[11px] sm:text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
              adminTab === id
                ? darkMode
                  ? "bg-slate-800 text-amber-400 shadow-sm shadow-black/5"
                  : "bg-white text-amber-600 shadow-sm shadow-slate-200/20"
                : darkMode
                ? "text-slate-400 hover:text-slate-200"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
            {label}
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold leading-none ${
                adminTab === id
                  ? darkMode
                    ? "bg-amber-500/15 text-amber-400"
                    : "bg-amber-100 text-amber-600"
                  : darkMode
                  ? "bg-slate-800 text-slate-500"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      {adminTab === "users" && <AdminUsersTab {...props} />}
      {adminTab === "expenses" && <AdminExpensesTab {...props} />}
      {adminTab === "logs" && <AdminLogsTab {...props} />}
    </div>
  );
});

export default AdminView;
