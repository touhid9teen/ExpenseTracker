import {
  ClipboardListIcon,
  ChartPieIcon,
  ChatBubbleIcon,
  SettingsSlidersIcon,
  ShieldCheckIcon,
  MoonIcon,
  PlusIcon,
  FilterFunnelIcon,
  EditPencilIcon,
  ChartBarIcon,
} from "../common/Icons";

export const features = [
  {
    icon: <ClipboardListIcon className="w-6 h-6" />,
    title: "Transaction Ledger",
    description:
      "View, filter, sort, and manage all your expenses in a clean, paginated table with powerful search and category filtering.",
  },
  {
    icon: <ChartPieIcon className="w-6 h-6" />,
    title: "Analytics & Insights",
    description:
      "Track spending patterns with summary cards, daily trends, category breakdowns, and quick stats — all updated in real time.",
  },
  {
    icon: <ChatBubbleIcon className="w-6 h-6" />,
    title: "AI-Powered Chat",
    description:
      "Manage expenses using natural language. Add, edit, delete, or query your finances by simply chatting with the FinVue AI assistant.",
  },
  {
    icon: <SettingsSlidersIcon className="w-6 h-6" />,
    title: "Customizable Filters",
    description:
      "Filter by category, date range, search keywords, and sort by amount or date to quickly find exactly what you need.",
  },
  {
    icon: <ShieldCheckIcon className="w-6 h-6" />,
    title: "Secure Authentication",
    description:
      "Your financial data is protected with JWT-based authentication. Register, log in, and access your data securely from anywhere.",
  },
  {
    icon: <MoonIcon className="w-6 h-6" />,
    title: "Dark & Light Themes",
    description:
      "Switch between dark and light modes with a single click. Choose the theme that's easiest on your eyes, day or night.",
  },
];

export const manualSteps = [
  {
    step: 1,
    title: "Add an Expense",
    description:
      'Go to the Transactions Ledger tab. Click the "Add Expense" button to open the quick-add form. Enter the amount, category, date, and description, then hit save.',
    icon: <PlusIcon className="w-5 h-5" strokeWidth={2.5} />,
  },
  {
    step: 2,
    title: "Browse & Filter",
    description:
      "Use the search bar to find expenses by description, filter by category or date range, and sort by amount or date. Every change updates your view instantly.",
    icon: <FilterFunnelIcon className="w-5 h-5" strokeWidth={2.5} />,
  },
  {
    step: 3,
    title: "Edit or Delete",
    description:
      "Click the three-dot menu on any expense row to edit or delete it. The Statistics Hub automatically reflects your changes.",
    icon: <EditPencilIcon className="w-5 h-5" strokeWidth={2.5} />,
  },
  {
    step: 4,
    title: "Track Your Stats",
    description:
      "Switch to the Statistics Hub to see summary cards, category breakdowns, daily spending trends, and quick stats at a glance.",
    icon: <ChartBarIcon className="w-5 h-5" strokeWidth={2.5} />,
  },
];

export const chatExamples = [
  {
    text: '"Add a coffee expense of $4.50 for today"',
    action: "Automatically creates a new expense entry",
  },
  {
    text: '"Show me my total spending this month"',
    action: "Calculates and summarizes your monthly spending",
  },
  {
    text: '"Edit my lunch expense from yesterday to $12"',
    action: "Finds and updates the matching expense",
  },
  {
    text: '"Delete all grocery expenses from last week"',
    action: "Removes the specified expense records",
  },
];
