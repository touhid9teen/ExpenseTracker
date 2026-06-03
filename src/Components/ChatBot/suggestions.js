import React from "react";

const iconClass = "w-4 h-4";

const SUGGESTIONS = [
  {
    label: "Monthly summary",
    sub: "Review spending",
    text: "Give me a summary of my expenses this month.",
    action: "send",
    iconBg: "bg-emerald-100 text-emerald-600",
    icon: (
      <svg
        className={iconClass}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 17v-6m4 6V7m4 10v-4M5 19h14"
        />
      </svg>
    ),
  },
  {
    label: "Today's summary",
    sub: "Daily overview",
    text: "Give me a summary of my expenses today.",
    action: "send",
    iconBg: "bg-sky-100 text-sky-600",
    icon: (
      <svg
        className={iconClass}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    label: "Add expense",
    sub: "Create a record",
    text: "Add an expense for ",
    action: "fill",
    iconBg: "bg-indigo-100 text-indigo-600",
    icon: (
      <svg
        className={iconClass}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
      </svg>
    ),
  },
  {
    label: "Edit expense",
    sub: "Update a record",
    text: "Edit my expense for ",
    action: "fill",
    iconBg: "bg-violet-100 text-violet-600",
    icon: (
      <svg
        className={iconClass}
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
  },
  {
    label: "Delete expense",
    sub: "Remove a record",
    text: "Delete my expense for ",
    action: "fill",
    iconBg: "bg-red-100 text-red-600",
    icon: (
      <svg
        className={iconClass}
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
  },
  {
    label: "Find largest",
    sub: "Spot high costs",
    text: "What are my largest expenses?",
    action: "send",
    iconBg: "bg-amber-100 text-amber-600",
    icon: (
      <svg
        className={iconClass}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 7h6m0 0v6m0-6L5 21"
        />
      </svg>
    ),
  },
  {
    label: "Budget tips",
    sub: "Get advice",
    text: "Suggest ways I can reduce my spending based on my expenses.",
    action: "send",
    iconBg: "bg-rose-100 text-rose-600",
    icon: (
      <svg
        className={iconClass}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v2m0 14v2m9-9h-2M5 12H3m14.95-6.95-1.41 1.41M7.46 16.54l-1.41 1.41m0-12.9 1.41 1.41m9.08 9.08 1.41 1.41"
        />
      </svg>
    ),
  },
];
export default SUGGESTIONS;
