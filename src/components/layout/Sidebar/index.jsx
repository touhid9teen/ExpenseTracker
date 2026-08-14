"use client";

import { memo } from "react";
import SidebarLogo from "./SidebarLogo";
import SidebarNav from "./SidebarNav";
import PremiumCard from "./PremiumCard";
import ThemeToggle from "./ThemeToggle";
import UserProfile from "./UserProfile";
import VersionFooter from "./VersionFooter";

const TIP_PROMPT =
  "Suggest ways I can reduce my spending based on my expenses. Give me 3 practical tips with the ৳ amounts involved.";

/**
 * Sidebar – the left navigation panel (matches the dashboard mockup).
 * Composition only: layout shells for the mobile drawer and desktop panel,
 * with the pieces (logo, nav, premium card, theme toggle, user profile)
 * living in sibling child components.
 *
 * On `lg` screens it's a fixed sticky panel; below `lg` it collapses into an
 * off-canvas drawer opened by the menu button in the mobile BottomNav.
 */
const Sidebar = memo(function Sidebar({
  darkMode,
  toggleTheme,
  user,
  activeTab,
  setActiveTab,
  setShowQuickAdd,
  setPendingAction,
  handleLogout,
  onLogin,
  isAdmin = false,
  mobileOpen = false,
  onCloseMobile,
}) {
  const handleClick = (item) => {
    onCloseMobile?.();
    if (item.action === "modal") {
      setShowQuickAdd(true);
      return;
    }
    if (item.action === "tips") {
      setPendingAction({ action: "send", text: TIP_PROMPT });
      setActiveTab("chat");
    } else {
      setActiveTab(item.key);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderBody = (withClose) => (
    <>
      <SidebarLogo darkMode={darkMode} withClose={withClose} onCloseMobile={onCloseMobile} />
      <SidebarNav
        darkMode={darkMode}
        activeTab={activeTab}
        isAdmin={isAdmin}
        onNavigate={handleClick}
        user={user}
        handleLogout={handleLogout}
        onLogin={onLogin}
      />
      <PremiumCard darkMode={darkMode} />
      <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
      {user && <UserProfile darkMode={darkMode} user={user} />}
      <VersionFooter darkMode={darkMode} />
    </>
  );

  const panelClasses = (mobile) =>
    mobile
      ? "fixed inset-y-0 left-0 z-50 w-72 lg:hidden flex flex-col transform transition-transform duration-300"
      : "hidden lg:flex lg:flex-col lg:w-64 shrink-0 lg:sticky lg:top-0 lg:h-screen border-r transition-colors duration-300";

  const surfaceClasses = darkMode
    ? "bg-[#0d1326] border-slate-800"
    : "bg-white border-[#EBEBEC]";

  return (
    <>
      {/* Mobile off-canvas backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black/60 backdrop-blur-sm"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer (collapsible via the AppHeader hamburger) */}
      <aside
        className={`${panelClasses(true)} ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${surfaceClasses} border-r`}
      >
        {renderBody(true)}
      </aside>

      {/* Desktop sidebar */}
      <aside className={`${panelClasses(false)} ${surfaceClasses}`}>
        {renderBody(false)}
      </aside>
    </>
  );
});

export default Sidebar;
