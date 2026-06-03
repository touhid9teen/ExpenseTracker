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
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 5v14m7-7H5"
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
