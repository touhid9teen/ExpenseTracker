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
 *  - The content column has a sticky AppHeader (title + theme/login/logout)
 *    and the CommandCenter nav-cards row at the top of the content.
 *  - Sections (chat / dashboard / table / statistics / about / admin) render
 *    below the CommandCenter.
 *  - Guests can browse the app; adding an expense (or logging in) opens the
 *    AuthView as an overlay instead of replacing the whole page.
 */
const ExpenseClipperScreen = (props) => {
  const [showAuth, setShowAuth] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [newChatSignal, setNewChatSignal] = useState(0);

  if (props.isAuthLoading) {
    return <AppLoader darkMode={props.darkMode} />;
  }

  const { activeTab } = props;
  const isOverview = activeTab === "overview";
  const isChat = activeTab === "chat";
  const isLoading =
    props.isExpensesLoading && (isOverview || activeTab === "statistics" || activeTab === "ledger");

  // Close the auth overlay as soon as a session is established.
  const handleSetUser = (user) => {
    props.setUser(user);
    if (user) setShowAuth(false);
  };

  // Logging out returns the user to the home (chat) view.
  const handleLogout = () => {
    props.handleLogout();
    props.setActiveTab("chat");
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
          : "bg-[#f5f7fc] text-slate-800"
      }`}
    >
      {/* Ambient aurora + grid backdrop */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-0 ${props.darkMode ? "aurora-bg" : "aurora-bg-light"}`}
      >
        <div className="absolute -top-24 -left-24 w-[34rem] h-[34rem] rounded-full bg-cyan-500/10 blur-[110px] aurora-blob" />
        <div className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] rounded-full bg-violet-500/10 blur-[110px] aurora-blob" style={{ animationDelay: "-7s" }} />
        <div className="absolute -bottom-32 left-1/4 w-[28rem] h-[28rem] rounded-full bg-indigo-500/10 blur-[110px] aurora-blob" style={{ animationDelay: "-14s" }} />
        <div className={`absolute inset-0 cyber-grid ${props.darkMode ? "opacity-70" : "opacity-40"}`} />
      </div>

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
        />

        {/* ── Main content column (scrolls internally, scrollbar hidden) ── */}
        <div className="flex-1 min-w-0 lg:overflow-y-auto no-scrollbar">
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
          />

          {/* Tight gap next to the sidebar, matching the mockup */}
          <div className="px-4 sm:px-6 lg:px-6 py-6 xl:flex xl:gap-6 xl:items-start">
            <main className="min-w-0 xl:flex-1">
            {/* Nav cards row — only on the Command Center tab (desktop);
                on small screens it stays as the primary navigation */}
            {isOverview ? (
              <CommandCenter {...commandCenterProps} />
            ) : (
              <div className="lg:hidden">
                <CommandCenter {...commandCenterProps} />
              </div>
            )}

            <div className="mt-6 space-y-8 sm:space-y-10">
            {isLoading && (isOverview || activeTab === "statistics") && (
              <StatisticsSkeleton darkMode={props.darkMode} />
            )}
            {isLoading && (isOverview || activeTab === "ledger") && (
              <LedgerSkeleton darkMode={props.darkMode} />
            )}

            {/* Always mounted (CSS-hidden when inactive) so chart state survives
                section switches. Overview stacks stats + ledger on one page. */}
            <StatisticsView
              {...props}
              visible={!props.isExpensesLoading && (isOverview || activeTab === "statistics")}
            />

            {!props.isExpensesLoading && isOverview && (
              <LedgerView {...props} visible />
            )}
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

            {/* Full-page AI assistant (kept mounted so the conversation persists) */}
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
              visible={isChat}
            />
            </div>
            </main>

            {/* AI Insights rail — real derived insights + recent queries,
                visible on every tab from xl up (hidden in fullscreen chat). */}
            {!(isChat && chatExpanded) && (
              <aside className="hidden xl:block w-80 shrink-0 sticky top-24">
                <InsightsRail
                  darkMode={props.darkMode}
                  expenses={props.expenses}
                  recentQueries={props.recentQueries}
                  setActiveTab={props.setActiveTab}
                  setPendingAction={props.setPendingAction}
                />
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
