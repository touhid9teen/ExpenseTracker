"use client";
import { memo } from "react";
import { UsersGroupIcon, CrownIcon, ShieldCheckIcon, TrashIcon } from "../common/Icons";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const AdminUsersTab = memo(
  function AdminUsersTab({ darkMode, users, isAdminLoading, toggleUserAdmin, deleteUser }) {
    const handleDelete = (user) => {
      if (
        window.confirm(
          `Delete user "${user.username}"? All of their expenses will be permanently removed. This cannot be undone.`
        )
      ) {
        deleteUser(user.id, user.username);
      }
    };

    const handleToggle = (user) => {
      const action = user.isAdmin ? "revoke" : "grant";
      if (
        window.confirm(
          `${action === "grant" ? "Grant" : "Revoke"} admin privileges ${action === "grant" ? "to" : "from"} "${user.username}"?`
        )
      ) {
        toggleUserAdmin(user.id, !user.isAdmin);
      }
    };

    if (!isAdminLoading && users.length === 0) {
      return (
        <EmptyState
          darkMode={darkMode}
          icon={<UsersGroupIcon className="w-12 h-12" strokeWidth={1.5} />}
          title="No users yet"
          hint="Registered users will appear here."
        />
      );
    }

    return (
      <div
        className={`rounded-2xl border overflow-hidden ${
          darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-300/80"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[640px]">
            <thead>
              <tr
                className={`text-[10px] uppercase tracking-widest font-bold border-b ${
                  darkMode ? "text-slate-500 border-slate-800" : "text-slate-400 border-slate-200"
                }`}
              >
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Expenses</th>
                <th className="px-5 py-3.5">Joined</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className={`transition-colors ${
                    darkMode
                      ? "divide-slate-800/70 hover:bg-slate-800/40"
                      : "divide-slate-100 hover:bg-slate-50"
                  }`}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center font-extrabold text-xs ${
                          user.isAdmin
                            ? darkMode
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-amber-100 text-amber-700"
                            : darkMode
                            ? "bg-slate-800 text-slate-300"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`text-sm font-bold truncate flex items-center gap-1.5 ${
                            darkMode ? "text-slate-200" : "text-slate-800"
                          }`}
                        >
                          {user.username}
                          {user.isAdmin && (
                            <CrownIcon className="w-3.5 h-3.5 text-amber-500" strokeWidth={2.5} />
                          )}
                        </p>
                        <p
                          className={`text-xs truncate ${
                            darkMode ? "text-slate-500" : "text-slate-400"
                          }`}
                        >
                          {user.email || "no email"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                        user.isAdmin
                          ? darkMode
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/25"
                            : "bg-amber-100 text-amber-700 border border-amber-200"
                          : darkMode
                          ? "bg-slate-800 text-slate-400 border border-slate-700"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      <ShieldCheckIcon className="w-3 h-3" strokeWidth={2.5} />
                      {user.isAdmin ? "Admin" : "Member"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-xs font-extrabold ${
                        darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {user.expenseCount}
                    </span>
                  </td>
                  <td
                    className={`px-5 py-3.5 text-xs ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggle(user)}
                        disabled={isAdminLoading}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 ${
                          user.isAdmin
                            ? darkMode
                              ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                              : "bg-red-50 text-red-600 hover:bg-red-100"
                            : darkMode
                            ? "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        }`}
                      >
                        {user.isAdmin ? "Revoke" : "Grant"}
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        disabled={isAdminLoading}
                        aria-label={`Delete ${user.username}`}
                        className={`p-1.5 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 ${
                          darkMode
                            ? "text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                            : "text-slate-400 hover:text-red-600 hover:bg-red-50"
                        }`}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
);

const EmptyState = ({ darkMode, icon, title, hint }) => (
  <div
    className={`rounded-2xl border px-6 py-14 flex flex-col items-center justify-center text-center ${
      darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-300/80"
    }`}
  >
    <div
      className={`mb-4 ${darkMode ? "text-slate-600" : "text-slate-300"}`}
    >
      {icon}
    </div>
    <p
      className={`text-sm font-bold ${darkMode ? "text-slate-300" : "text-slate-600"}`}
    >
      {title}
    </p>
    <p className={`mt-1 text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>{hint}</p>
  </div>
);

export default AdminUsersTab;
