"use client";

import AuthView from "../auth/AuthView";
import GoToTopButton from "../layout/GoToTopButton";
import BottomNav from "../layout/BottomNav";
import Sidebar from "../layout/Sidebar/index";
import AmbientBackground from "../layout/AmbientBackground";
import ModalLayer from "./ExpenseModals/ModalLayer";
import MainContentView from "./MainContentView";
import useClipperScreen from "../../hooks/useClipperScreen";

const ExpenseClipperScreen = (props) => {
  const screen = useClipperScreen(props);

  return (
    <div
      className={`relative min-h-screen lg:h-screen font-sans transition-colors duration-300 pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-0 overflow-x-clip lg:overflow-hidden ${
        props.darkMode
          ? "bg-[#0b0f19] text-slate-100"
          : "bg-white text-slate-800"
      }`}
    >
      <AmbientBackground darkMode={props.darkMode} />

      <div className="relative z-10 lg:flex lg:h-screen">
        {/* ── Left sidebar navigation ── */}
        <Sidebar
          darkMode={props.darkMode}
          toggleTheme={props.toggleTheme}
          user={props.user}
          activeTab={screen.activeTab}
          setActiveTab={props.setActiveTab}
          setShowQuickAdd={screen.guardedSetShowQuickAdd}
          setPendingAction={props.setPendingAction}
          handleLogout={screen.handleLogout}
          onLogin={() => screen.setShowAuth(true)}
          isAdmin={!!props.user?.isAdmin}
          mobileOpen={screen.mobileSidebarOpen}
          onCloseMobile={() => screen.setMobileSidebarOpen(false)}
        />

        <MainContentView
          props={props}
          screen={screen}
          onLogin={() => screen.setShowAuth(true)}
        />

        {/* Mobile bottom navigation — replaces the AppHeader below `lg` */}
        <BottomNav
          darkMode={props.darkMode}
          activeTab={screen.activeTab}
          setActiveTab={props.setActiveTab}
          setShowQuickAdd={screen.guardedSetShowQuickAdd}
          onToggleSidebar={() => screen.setMobileSidebarOpen((v) => !v)}
        />

        {/* Floating controls hidden while chatting so they never overlap
            the composer */}
        {!screen.isChat && <GoToTopButton darkMode={props.darkMode} />}

        <ModalLayer {...props} />
      </div>

      {/* Auth overlay (guest browsing — click Login / Add while logged out) */}
      {screen.showAuth && (
        <AuthView
          setUser={screen.handleSetUser}
          onClose={() => screen.setShowAuth(false)}
        />
      )}
    </div>
  );
};

export default ExpenseClipperScreen;
