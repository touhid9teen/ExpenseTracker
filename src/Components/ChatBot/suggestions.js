import React from "react";

/**
 * Quick-action suggestion chips shown in the ChatBot popover.
 * Each entry has a label, subtitle, SVG icon, icon background class,
 * action type ("send" = auto-send, "type" = prefill input), and text.
 */
const SUGGESTIONS = [
  {
    label: "Summary",
    sub: "Today's overview",
    icon: (
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    iconBg: "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-500",
    action: "type",
    text: "Show my expense summary for today.",
  },
  {
    label: "Add expense",
    sub: "Log a new item",
    icon: (
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
    iconBg: "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-500",
    action: "type",
    text: "Add expense: ",
  },
  {
    label: "Edit item",
    sub: "Update a record",
    icon: (
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    ),
    iconBg: "bg-amber-50 dark:bg-amber-900/40 text-amber-500",
    action: "type",
    text: "Edit expense: ",
  },
  {
    label: "Delete item",
    sub: "Remove a record",
    icon: (
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    ),
    iconBg: "bg-rose-50 dark:bg-rose-900/40 text-rose-500",
    action: "type",
    text: "Delete expense: ",
  },
];

export default SUGGESTIONS;
