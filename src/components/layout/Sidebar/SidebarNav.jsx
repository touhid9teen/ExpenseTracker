"use client";

import {
  HomeIcon,
  PlusCircleIcon,
  TableCellsIcon,
  ChartBarSquareIcon,
  LightbulbIcon,
  InfoCircleIcon,
  ShieldCheckIcon,
  LogInIcon,
  LogoutIcon,
} from "../../ui/Icons";

/**
 * SidebarNav – the navigation links (Command Center / Add Expense / Table /
 * Statistics / Budget Tips, then a divider, About / Admin, and a final
 * divider with Login / Logout).
 */
const SidebarNav = ({
  darkMode,
  activeTab,
  isAdmin = false,
  onNavigate,
  user,
  handleLogout,
  onLogin,
}) => {
  const navItems = [
    { key: "overview", label: "Command Center", icon: HomeIcon },
    { key: "add", label: "Add Expense", icon: PlusCircleIcon, action: "modal" },
    { key: "ledger", label: "Table", icon: TableCellsIcon },
    { key: "statistics", label: "Statistics", icon: ChartBarSquareIcon },
    { key: "tips", label: "Budget Tips", icon: LightbulbIcon, action: "tips" },
  ];

  const itemClasses = (active) =>
    `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
      active
        ? darkMode
          ? "bg-violet-500/25 text-white font-semibold"
          : "bg-[#EFEFFB] text-violet-700 font-semibold"
        : darkMode
          ? "text-slate-300 hover:bg-slate-800/70 hover:text-white font-medium"
          : "text-[#3D3A5C] hover:bg-[#F5F5FA] hover:text-[#1E1B4B] font-medium"
    }`;

  const renderItem = (item) => {
    const Icon = item.icon;
    return (
      <button
        key={item.key}
        onClick={() => onNavigate(item)}
        className={itemClasses(!item.action && item.key === activeTab)}
      >
        <Icon className="w-5 h-5 shrink-0" strokeWidth={2} />
        {item.label}
      </button>
    );
  };

  const renderLink = (key, label, Icon, active) => (
    <button
      key={key}
      onClick={() => onNavigate({ key })}
      className={itemClasses(active)}
    >
      <Icon className="w-5 h-5 shrink-0" strokeWidth={2} />
      {label}
    </button>
  );

  return (
    <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
      {navItems.map(renderItem)}

      <div className={`h-px my-3 ${darkMode ? "bg-slate-800" : "bg-[#EBEBEC]"}`} />

      {renderLink("about", "About", InfoCircleIcon, activeTab === "about")}
      {isAdmin &&
        renderLink("admin", "Admin", ShieldCheckIcon, activeTab === "admin")}

      <div className={`h-px my-3 ${darkMode ? "bg-slate-800" : "bg-[#EBEBEC]"}`} />

      {user ? (
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            darkMode
              ? "text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
              : "text-rose-500 hover:bg-rose-50 hover:text-rose-600"
          }`}
        >
          <LogoutIcon className="w-5 h-5 shrink-0" strokeWidth={2} />
          Logout
        </button>
      ) : (
        <button
          onClick={onLogin}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            darkMode
              ? "text-violet-300 hover:bg-violet-500/10 hover:text-violet-200"
              : "text-violet-600 hover:bg-violet-50 hover:text-violet-700"
          }`}
        >
          <LogInIcon className="w-5 h-5 shrink-0" strokeWidth={2} />
          Login
        </button>
      )}
    </nav>
  );
};

export default SidebarNav;
