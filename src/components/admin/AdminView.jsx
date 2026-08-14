"use client";
import { memo } from "react";
import {
  UsersGroupIcon,
  ClipboardListIcon,
  ActivityIcon,
  RefreshIcon,
  ShieldCheckIcon,
} from "../ui/Icons";
import { chipClass } from "../statistics/panelStyles";
import { SegmentedToggle } from "../ui/SegmentedToggle";
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

  const ghostBtn = darkMode
    ? "bg-slate-900 border-slate-700/70 text-slate-200 hover:border-violet-500/50 hover:text-violet-300"
    : "bg-white border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600";

  const summaryCards = [
    { label: "Users", value: users.length, icon: UsersGroupIcon, chip: "violet" },
    { label: "Admins", value: users.filter((u) => u.isAdmin).length, icon: ShieldCheckIcon, chip: "indigo" },
    { label: "Expenses", value: allExpenses.length, icon: ClipboardListIcon, chip: "sky" },
    { label: "Live Logs", value: logs.length, icon: ActivityIcon, chip: "emerald" },
  ];

  return (
    <div className="space-y-3 animate-fadeIn">
      {/* ── Header (matches the Transactions header flow) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1
            className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Admin Console
          </h1>
          <p
            className={`text-xs mt-0.5 ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Manage users, review expenses, and monitor live API activity
          </p>
        </div>

        <div className="flex items-center gap-2.5">
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
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition-all duration-200 active:scale-95 disabled:opacity-60 ${ghostBtn}`}
          >
            <RefreshIcon
              className={`w-4 h-4 ${isAdminLoading ? "animate-spin" : ""}`}
              strokeWidth={2.25}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Summary cards (matches the Ledger summary flow) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {summaryCards.map(({ label, value, icon: Icon, chip }) => (
          <div
            key={label}
            className={`rounded-xl p-3 border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
              darkMode
                ? "bg-slate-900 border-slate-700/70 hover:border-violet-500/50 hover:shadow-violet-500/10"
                : "bg-white border-slate-200 hover:border-violet-300 hover:shadow-violet-500/10"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${chipClass(chip, darkMode)}`}>
                <Icon className="w-4 h-4" strokeWidth={2.25} />
              </div>
              <div className="min-w-0">
                <p className={`text-[11px] font-semibold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{label}</p>
                <p className={`text-base font-black tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
                  {value.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tab bar (segmented toggle, same as the statistics charts) ── */}
      <div className="flex">
        <SegmentedToggle
          options={[
            { key: "users", label: `Users (${users.length})` },
            { key: "expenses", label: `Expenses (${allExpenses.length})` },
            { key: "logs", label: `Logs (${logs.length})` },
          ]}
          value={adminTab}
          onChange={setAdminTab}
          darkMode={darkMode}
          ariaLabel="Admin sections"
        />
      </div>

      {/* ── Tab Content ── */}
      {adminTab === "users" && <AdminUsersTab {...props} />}
      {adminTab === "expenses" && <AdminExpensesTab {...props} />}
      {adminTab === "logs" && <AdminLogsTab {...props} />}
    </div>
  );
});

export default AdminView;
