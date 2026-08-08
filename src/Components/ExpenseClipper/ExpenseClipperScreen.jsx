"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import AppLoader from "../common/AppLoader";
import StatisticsSkeleton from "../Skeleton/StatisticsSkeleton/StatisticsSkeleton";
import LedgerSkeleton from "../Skeleton/LedgerSkeleton/LedgerSkeleton";
import AuthView from "../AuthView/AuthView";
import GoToTopButton from "../common/GoToTopButton";
import CommandCenter from "../CommandCenter/CommandCenter";
import Sidebar from "../common/Sidebar";
import AppHeader from "../common/AppHeader";
import {
  DailyExpenseModal,
  DeleteExpenseModal,
  EditExpenseModal,
  AddExpenseModal,
} from "./ExpenseModals/ExpenseModals";
import LedgerView from "../LedgerView/LedgerView";
import dynamic from "next/dynamic";
const StatisticsView = dynamic(() => import("../StatisticsView/StatisticsView"), {
    loading: () => <StatisticsSkeleton darkMode={true} />
});
import AboutView from "../AboutView/AboutView";
import AdminView from "../AdminView/AdminView";
import AIAssistant from "../AIAssistant/AIAssistant";
import InsightsRail from "../AIAssistant/InsightsRail";

/**
 * ExpenseClipperScreen – the single-page shell.
 *
 * Layout (dashboard mockup style):
 *  - A fixed left Sidebar holds the logo, nav links, premium card, dark-mode
 *    toggle and the user profile (hidden on small screens).
 *  - The content column has a sticky AppHeader (title + theme/login/logout).
 *  - The CommandCenter nav-cards row lives on the Command Center tab only;
 *    on small screens it stays as the primary navigation on every tab.
 *  - The Command Center tab shows the command buttons + AI chat; the other
 *    sections (statistics / table / about / admin) render on their own tabs.
 *  - Guests can browse the app; adding an expense (or logging in) opens the
 *    AuthView as an overlay instead of replacing the whole page.
 */
const ExpenseClipperScreen = (props) => {
  const [showAuth, setShowAuth] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [newChatSignal, setNewChatSignal] = useState(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (props.isAuthLoading) {
    return <AppLoader darkMode={props.darkMode} />;
  }

  const { activeTab } = props;
  const isOverview = activeTab === "overview";
  const isChat = activeTab === "chat";
  const isLoading =
    props.isExpensesLoading && (activeTab === "statistics" || activeTab === "ledger");

  // Close the auth overlay as soon as a session is established.
  const handleSetUser = (user) => {
    props.setUser(user);
    if (user) setShowAuth(false);
  };

  // Logging out returns the user to the home (chat) view.
  const handleLogout = () => {
    props.handleLogout();
    props.setActiveTab("chat");
    setMobileSidebarOpen(false);
  };

  // Guests can browse (AI chat + layout) but must log in to mutate data.
  const guardedSetShowQuickAdd = (next) => {
    if (next && !props.user) {
      toast.error("Please log in to add expenses.");
      setShowAuth(true);
      return;
    }
    props.setShowQuickAdd(next);
  };

  const commandCenterProps = {
    darkMode: props.darkMode,
    activeTab,
    setActiveTab: props.setActiveTab,
    setShowQuickAdd: guardedSetShowQuickAdd,
    setPendingAction: props.setPendingAction,
    isAdmin: !!props.user?.isAdmin,
  };

  return (
    <div
      className={`relative min-h-screen lg:h-screen font-sans transition-colors duration-300 pb-16 lg:pb-0 overflow-x-clip lg:overflow-hidden ${
        props.darkMode
          ? "bg-[#0b0f19] text-slate-100"
          : "bg-[#F9FAFC] text-slate-800"
      }`}
    >
      {/* Ambient aurora + grid backdrop (dark mode only — light mode stays a
          clean flat background like the mockup so white cards read as white) */}
      {props.darkMode && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 aurora-bg"
        >
          <div className="absolute -top-24 -left-24 w-[34rem] h-[34rem] rounded-full bg-cyan-500/10 blur-[110px] aurora-blob" />
          <div className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] rounded-full bg-violet-500/10 blur-[110px] aurora-blob" style={{ animationDelay: "-7s" }} />
          <div className="absolute -bottom-32 left-1/4 w-[28rem] h-[28rem] rounded-full bg-indigo-500/10 blur-[110px] aurora-blob" style={{ animationDelay: "-14s" }} />
          <div className="absolute inset-0 cyber-grid opacity-70" />
        </div>
      )}

      <div className="relative z-10 lg:flex lg:h-screen">
        {/* ── Left sidebar navigation ── */}
        <Sidebar
          darkMode={props.darkMode}
          toggleTheme={props.toggleTheme}
          user={props.user}
          activeTab={activeTab}
          setActiveTab={props.setActiveTab}
          setShowQuickAdd={guardedSetShowQuickAdd}
          setPendingAction={props.setPendingAction}
          isAdmin={!!props.user?.isAdmin}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* ── Main content column (scrolls internally, scrollbar hidden).
            On the Command Center tab it's a fixed dashboard: header stays
            put, command row + chat fill the viewport and only the chat /
            insights scroll. ── */}
        <div
          className={`flex-1 min-w-0 ${
            isOverview
              ? "lg:overflow-hidden lg:flex lg:flex-col"
              : activeTab === "ledger" || activeTab === "statistics"
                ? "lg:overflow-hidden"
                : "lg:overflow-y-auto no-scrollbar"
          }`}
        >
          <AppHeader
            darkMode={props.darkMode}
            toggleTheme={props.toggleTheme}
            user={props.user}
            handleLogout={handleLogout}
            onLogin={() => setShowAuth(true)}
            activeTab={activeTab}
            isChat={isChat}
            chatExpanded={chatExpanded}
            onToggleExpanded={() => setChatExpanded((v) => !v)}
            onNewChat={() => setNewChatSignal((n) => n + 1)}
            onToggleSidebar={() => setMobileSidebarOpen((v) => !v)}
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
            {/* Nav cards row — Command Center tab only, desktop only.
                On small screens navigation lives in the collapsible sidebar. */}
            {isOverview && (
              <div className="hidden lg:block shrink-0">
                <CommandCenter {...commandCenterProps} />
              </div>
            )}

            <div className={`mt-6 space-y-8 sm:space-y-10 ${
              isOverview ? "lg:flex-1 lg:min-h-0" : ""
            }`}>
            {/* The Command Center tab shows the command buttons + AI chat only;
                the analysis & transaction table live on their own tabs. */}
            {isLoading && activeTab === "statistics" && (
              <StatisticsSkeleton darkMode={props.darkMode} />
            )}
            {isLoading && activeTab === "ledger" && (
              <LedgerSkeleton darkMode={props.darkMode} />
            )}

            {/* Always mounted (CSS-hidden when inactive) so chart state survives
                section switches. */}
            <StatisticsView
              {...props}
              visible={!props.isExpensesLoading && activeTab === "statistics"}
            />

            {!props.isExpensesLoading && activeTab === "ledger" && (
              <LedgerView {...props} />
            )}

            {activeTab === "about" && (
              <AboutView
                darkMode={props.darkMode}
                setActiveTab={props.setActiveTab}
              />
            )}
            {!!props.user?.isAdmin && activeTab === "admin" && (
              <AdminView {...props} />
            )}

            {/* AI assistant — full page on the chat tab, and kept on the
                Command Center tab below the command buttons (kept mounted so
                the conversation persists). */}
            <AIAssistant
              darkMode={props.darkMode}
              user={props.user}
              expenses={props.expenses}
              addExpenseDirect={props.addExpenseDirect}
              updateExpenseDirect={props.updateExpenseDirect}
              deleteExpenseDirect={props.deleteExpenseDirect}
              setActiveTab={props.setActiveTab}
              pendingAction={props.pendingAction}
              setPendingAction={props.setPendingAction}
              pushRecentQuery={props.pushRecentQuery}
              resetSignal={newChatSignal}
              visible={isChat || isOverview}
              compact={isOverview}
            />
            </div>
            </main>

            {/* AI Insights rail — real derived insights + recent queries,
                visible on every tab from xl up (hidden in fullscreen chat). */}
            {!(isChat && chatExpanded) && (
              <aside
                className={`hidden xl:block w-80 shrink-0 ${
                  isOverview ? "lg:min-h-0" : "sticky top-24"
                }`}
              >
                {/* On the Command Center tab the rail stays fixed with its
                    own internal scroll */}
                <div className={isOverview ? "h-full overflow-y-auto no-scrollbar" : ""}>
                  <InsightsRail
                    darkMode={props.darkMode}
                    expenses={props.expenses}
                    recentQueries={props.recentQueries}
                    setActiveTab={props.setActiveTab}
                    setPendingAction={props.setPendingAction}
                  />
                </div>
              </aside>
            )}
          </div>
        </div>

        {/* Floating controls hidden while chatting so they never overlap
            the composer */}
        {!isChat && <GoToTopButton darkMode={props.darkMode} />}

        <AddExpenseModal
          showQuickAdd={props.showQuickAdd}
          setShowQuickAdd={props.setShowQuickAdd}
          closeAddModal={props.closeAddModal}
          darkMode={props.darkMode}
          CATEGORIES={props.CATEGORIES}
          getCategoryStyles={props.getCategoryStylesForTheme}
          addStep={props.addStep}
          selectCategory={props.selectCategory}
          goToCategoryStep={props.goToCategoryStep}
          goToAmountStep={props.goToAmountStep}
          addCategory={props.addCategory}
          addDescription={props.addDescription}
          setAddDescription={props.setAddDescription}
          addAmount={props.addAmount}
          setAddAmount={props.setAddAmount}
          addDate={props.addDate}
          setAddDate={props.setAddDate}
          handleAddExpense={props.handleAddExpense}
          isAddingExpense={props.isAddingExpense}
        />
        <DailyExpenseModal
          selectedDailyDate={props.selectedDailyDate}
          dailyModalDetails={props.dailyModalDetails}
          darkMode={props.darkMode}
          formatDate={props.formatDate}
          getCategoryStyles={props.getCategoryStylesForTheme}
          setSelectedDailyDate={props.setSelectedDailyDate}
        />
        <EditExpenseModal
          editingExpense={props.editingExpense}
          setEditingExpense={props.setEditingExpense}
          darkMode={props.darkMode}
          handleSaveEdit={props.handleSaveEdit}
          CATEGORIES={props.CATEGORIES}
        />
        <DeleteExpenseModal
          deletingExpense={props.deletingExpense}
          setDeletingExpense={props.setDeletingExpense}
          darkMode={props.darkMode}
          handleConfirmDelete={props.handleConfirmDelete}
        />
      </div>

      {/* Auth overlay (guest browsing — click Login / Add while logged out) */}
      {showAuth && (
        <AuthView setUser={handleSetUser} onClose={() => setShowAuth(false)} />
      )}
    </div>
  );
};

export default ExpenseClipperScreen;
