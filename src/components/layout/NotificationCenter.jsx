"use client";

import { memo, useEffect, useRef, useState } from "react";
import { BellIcon, CheckIcon } from "../ui/Icons";

const timeAgo = (iso) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const Item = ({ n, darkMode, onClick }) => {
  const isAlert = n.type === "alert";
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 transition-colors border-b last:border-0 ${
        darkMode
          ? "border-slate-800 hover:bg-slate-800/50"
          : "border-slate-100 hover:bg-slate-50"
      } ${!n.is_read ? (darkMode ? "bg-slate-800/30" : "bg-violet-50/50") : ""}`}
    >
      <div className="flex items-start gap-2.5">
        <span
          className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
            n.is_read ? "bg-slate-300" : "bg-violet-500"
          }`}
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <p
            className={`flex items-center gap-2 text-[13px] font-bold truncate ${
              isAlert
                ? darkMode
                  ? "text-rose-400"
                  : "text-rose-600"
                : darkMode
                ? "text-slate-100"
                : "text-slate-800"
            }`}
          >
            {n.title}
            {isAlert && (
              <span
                className={`text-[9px] uppercase font-extrabold tracking-wide px-1.5 py-0.5 rounded-md shrink-0 ${
                  darkMode
                    ? "bg-rose-500/15 text-rose-300"
                    : "bg-rose-100 text-rose-600"
                }`}
              >
                Alert
              </span>
            )}
          </p>
          <p
            className={`mt-0.5 text-xs leading-relaxed ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {n.message}
          </p>
          <p
            className={`mt-1 text-[10px] font-medium uppercase tracking-wide ${
              darkMode ? "text-slate-500" : "text-slate-400"
            }`}
          >
            {n.period} · {timeAgo(n.created_at)}
          </p>
        </div>
      </div>
    </button>
  );
};

/**
 * NotificationCenter – bell button with an unread badge that opens a dropdown
 * panel of the user's spending notifications. Used in the desktop AppHeader
 * and as a floating mobile bell. State lives in the shared `useNotifications`
 * hook (wired in useExpenseClipper), so both mount points stay in sync.
 */
const NotificationCenter = memo(function NotificationCenter({
  darkMode,
  user,
  notifications,
  unreadCount,
  markAllRead,
  markRead,
  floating = false,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDocClick = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) return null;

  const bellClass = `relative p-2.5 rounded-xl border transition-all duration-200 active:scale-95 ${
    floating ? "backdrop-blur-xl shadow-lg" : ""
  } ${
    darkMode
      ? "bg-slate-900 border-slate-700 text-slate-300 hover:border-violet-500/60 hover:text-violet-300"
      : "bg-white border-slate-200 text-slate-500 hover:border-violet-300 hover:text-violet-600 shadow-sm"
  }`;

  return (
    <div className={`relative ${floating ? "" : ""}`} ref={rootRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${unreadCount ? ` (${unreadCount} unread)` : ""}`}
        aria-expanded={open}
        className={bellClass}
      >
        <BellIcon className="w-5 h-5" strokeWidth={2.25} />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-[#0b0f19]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className={`absolute right-0 top-full mt-2 w-[22rem] max-w-[calc(100vw-2rem)] rounded-2xl border shadow-2xl overflow-hidden z-50 ${
            darkMode
              ? "bg-slate-900 border-slate-700/70 shadow-black/40"
              : "bg-white border-slate-200 shadow-slate-300/40"
          }`}
        >
          {/* Panel header */}
          <div
            className={`flex items-center justify-between px-4 py-3 border-b ${
              darkMode ? "border-slate-800" : "border-slate-100"
            }`}
          >
            <p
              className={`text-sm font-extrabold ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Notifications
            </p>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className={`inline-flex items-center gap-1 text-[11px] font-bold transition-colors ${
                  darkMode
                    ? "text-violet-400 hover:text-violet-300"
                    : "text-violet-600 hover:text-violet-500"
                }`}
              >
                <CheckIcon className="w-3 h-3" strokeWidth={3} />
                Mark all read
              </button>
            )}
          </div>

          {/* List / empty state */}
          <div className="max-h-[60vh] overflow-y-auto no-scrollbar">
            {notifications.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <BellIcon
                  className={`w-8 h-8 mx-auto mb-2 ${
                    darkMode ? "text-slate-600" : "text-slate-300"
                  }`}
                />
                <p
                  className={`text-sm font-semibold ${
                    darkMode ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  No notifications yet
                </p>
                <p
                  className={`mt-1 text-xs ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  We&apos;ll send you a daily, weekly, monthly and yearly
                  spending summary.
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <Item
                  key={n.id}
                  n={n}
                  darkMode={darkMode}
                  onClick={() => !n.is_read && markRead(n.id)}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default NotificationCenter;
