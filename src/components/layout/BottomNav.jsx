"use client";

import { memo } from "react";
import {
  MenuHamburgerIcon,
  HomeIcon,
  TableCellsIcon,
  ChartBarSquareIcon,
  PlusIcon,
} from "../ui/Icons";

/**
 * BottomNav – mobile-only bottom navigation bar (replaces the AppHeader on
 * small screens, `lg:hidden`). Five slots keep the raised Add button
 * dead-centre: Menu, Home | Add | Table, Statistics. Everything else —
 * Budget Tips, About, Admin, theme toggle, user profile and login/logout —
 * lives in the off-canvas sidebar opened by the menu button.
 */
const BottomNav = memo(function BottomNav({
  darkMode,
  activeTab = "overview",
  setActiveTab,
  setShowQuickAdd,
  onToggleSidebar,
}) {
  const navigate = (key) => {
    setActiveTab(key);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const items = [
    { key: "overview", label: "Home", icon: HomeIcon },
    { key: "ledger", label: "Table", icon: TableCellsIcon },
    { key: "statistics", label: "Statistics", icon: ChartBarSquareIcon },
  ];

  const surface = darkMode
    ? "bg-[#0d1326]/95 border-slate-800"
    : "bg-white/95 border-[#EBEBEC]";
  const idle = darkMode ? "text-slate-400" : "text-slate-500";
  const active = darkMode ? "text-violet-400" : "text-violet-600";

  const itemClass = (isActive) =>
    `flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition-colors duration-200 ${
      isActive ? active : idle
    }`;

  const renderTab = (item) => {
    const Icon = item.icon;
    const isActive = item.key === activeTab;
    return (
      <button
        key={item.key}
        onClick={() => navigate(item.key)}
        aria-current={isActive ? "page" : undefined}
        className={itemClass(isActive)}
      >
        <span
          className={`flex items-center justify-center w-9 h-7 rounded-full transition-colors duration-200 ${
            isActive ? (darkMode ? "bg-violet-500/20" : "bg-violet-100") : ""
          }`}
        >
          <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
        </span>
        <span className="text-[10px] font-semibold">{item.label}</span>
      </button>
    );
  };

  return (
    <nav
      aria-label="Primary navigation"
      className={`fixed bottom-0 inset-x-0 z-40 lg:hidden border-t backdrop-blur-xl pb-[env(safe-area-inset-bottom)] transition-colors duration-300 ${surface}`}
    >
      <div className="grid grid-cols-5 items-stretch px-1 pt-1.5">
        {/* Menu — opens the off-canvas sidebar with the remaining options */}
        <button
          onClick={onToggleSidebar}
          aria-label="Open navigation menu"
          className={itemClass(false)}
        >
          <MenuHamburgerIcon className="w-6 h-6" strokeWidth={2} />
          <span className="text-[10px] font-semibold">Menu</span>
        </button>

        {renderTab(items[0])}

        {/* Add — raised gradient action, dead-centre */}
        <button
          onClick={() => setShowQuickAdd?.(true)}
          aria-label="Add expense"
          className="flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl"
        >
          <span
            className={`-mt-6 w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-violet-500/40 transition-transform duration-200 hover:scale-105 active:scale-95 ring-4 ${
              darkMode ? "ring-[#0d1326]" : "ring-white"
            }`}
          >
            <PlusIcon className="w-6 h-6" strokeWidth={2.5} />
          </span>
          <span className={`text-[10px] font-bold ${active}`}>Add</span>
        </button>

        {items.slice(1).map(renderTab)}
      </div>
    </nav>
  );
});

export default BottomNav;
