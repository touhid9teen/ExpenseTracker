"use client";
import AppHeader from "../layout/AppHeader";
import InsightsRailSide from "../chat/InsightsRailSide";
import TabContent from "./TabContent";

/**
 * MainContentView – the content column next to the sidebar: AppHeader on
 * top, then the active tab's content and the AI insights rail. On the
 * Command Center tab it's a fixed dashboard — header stays put, the command
 * row + chat fill the viewport and only chat / insights scroll.
 */
const MainContentView = ({ props, screen, onLogin }) => {
  const {
    activeTab,
    isOverview,
    isChat,
    chatExpanded,
    setChatExpanded,
    newChatSignal,
    setNewChatSignal,
    showPageSkeleton,
    pageSkeleton,
    handleLogout,
    commandCenterProps,
  } = screen;

  return (
    <div
      className={`flex-1 min-w-0 ${
        isOverview
          ? "lg:overflow-hidden lg:flex lg:flex-col"
          : "lg:overflow-y-auto no-scrollbar"
      }`}
    >
      <AppHeader
        darkMode={props.darkMode}
        toggleTheme={props.toggleTheme}
        user={props.user}
        handleLogout={handleLogout}
        onLogin={onLogin}
        authLoading={props.isAuthLoading}
        activeTab={activeTab}
        isChat={isChat}
        chatExpanded={chatExpanded}
        onToggleExpanded={() => setChatExpanded((v) => !v)}
        onNewChat={() => setNewChatSignal((n) => n + 1)}
        notifications={props.notifications}
        unreadCount={props.unreadCount}
        markAllRead={props.markAllRead}
        markRead={props.markRead}
      />

      {/* Tight gap next to the sidebar, matching the mockup — almost no
          gap below the header so the command row sits right under it */}
      <div
        className={`px-4 sm:px-6 lg:px-6 pt-2 pb-6 flex-1 min-h-0 ${
          isOverview
            ? "lg:flex lg:flex-col xl:flex-row xl:gap-6"
            : "xl:flex xl:gap-6 xl:items-start"
        }`}
      >
        <main
          className={`min-w-0 flex-1 min-h-0 ${
            isOverview ? "lg:flex lg:flex-col" : "xl:flex-1"
          }`}
        >
          <TabContent
            props={props}
            isOverview={isOverview}
            isChat={isChat}
            showPageSkeleton={showPageSkeleton}
            pageSkeleton={pageSkeleton}
            newChatSignal={newChatSignal}
            commandCenterProps={commandCenterProps}
          />
        </main>

        <InsightsRailSide
          props={props}
          isOverview={isOverview}
          isChat={isChat}
          chatExpanded={chatExpanded}
        />
      </div>
    </div>
  );
};

export default MainContentView;
