import React from "react";
import { ChartBarIcon, CalendarIcon, PlusIcon, EditPencilIcon, TrashIcon, ArrowUpIcon, LightbulbIcon } from "../common/Icons";

const iconClass = "w-4 h-4";

const SUGGESTIONS = [
  {
    label: "Monthly summary",
    sub: "Review spending",
    text: "Give me a summary of my expenses this month.",
    action: "send",
    iconBg: "bg-emerald-100 text-emerald-600",
    icon: <ChartBarIcon className={iconClass} />,
  },
  {
    label: "Today's summary",
    sub: "Daily overview",
    text: "Give me a summary of my expenses today.",
    action: "send",
    iconBg: "bg-sky-100 text-sky-600",
    icon: <CalendarIcon className={iconClass} />,
  },
  {
    label: "Add expense",
    sub: "Create a record",
    text: "Add an expense for ",
    action: "fill",
    iconBg: "bg-indigo-100 text-indigo-600",
    icon: <PlusIcon className={iconClass} />,
  },
  {
    label: "Edit expense",
    sub: "Update a record",
    text: "Edit my expense for ",
    action: "fill",
    iconBg: "bg-violet-100 text-violet-600",
    icon: <EditPencilIcon className={iconClass} />,
  },
  {
    label: "Delete expense",
    sub: "Remove a record",
    text: "Delete my expense for ",
    action: "fill",
    iconBg: "bg-red-100 text-red-600",
    icon: <TrashIcon className={iconClass} />,
  },
  {
    label: "Find largest",
    sub: "Spot high costs",
    text: "What are my largest expenses?",
    action: "send",
    iconBg: "bg-amber-100 text-amber-600",
    icon: <ArrowUpIcon className={iconClass} />,
  },
  {
    label: "Budget tips",
    sub: "Get advice",
    text: "Suggest ways I can reduce my spending based on my expenses.",
    action: "send",
    iconBg: "bg-rose-100 text-rose-600",
    icon: <LightbulbIcon className={iconClass} />,
  },
];
export default SUGGESTIONS;
