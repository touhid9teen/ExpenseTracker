"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import AppLoader from "../common/AppLoader";
import StatisticsSkeleton from "../Skeleton/StatisticsSkeleton/StatisticsSkeleton";
import LedgerSkeleton from "../Skeleton/LedgerSkeleton/LedgerSkeleton";
import AuthView from "../AuthView/AuthView";
import GoToTopButton from "../common/GoToTopButton";
import CommandCenter from "../CommandCenter/CommandCenter";
import FloatingControls from "../common/FloatingControls";
import { PlusIcon } from "../common/Icons";
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

/**
 * ExpenseClipperScreen – the single-page shell.
 *
 * Layout (no header — everything is a button):
 *  - FloatingControls pins the theme toggle + login/logout to the corners.
 *  - The home (chat) view shows only a hero "Add Expense" button with the
 *    AI chat below it. The nav CommandCenter drops below the chat.
 *  - Other sections (dashboard / table / statistics / about / admin) appear
 *    when navigated to, with the CommandCenter on top.
 *  - Guests can browse the app; adding an expense (or logging in) opens the
 *    AuthView as an overlay instead of replacing the whole page.
 */
const ExpenseClipperScreen = (props) => {
  const [showAuth, setShowAuth] = useState(false);

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
  const openAdd = () => {
    if (!props.user) {
      toast.error("Please log in to add expenses.");
      setShowAuth(true);
      return;
    }
    props.setShowQuickAdd(true);
  };

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
      className={`relative min-h-screen font-sans transition-colors duration-300 pb-28 sm:pb-32 overflow-x-clip ${
        props.darkMode
          ? "bg-[#060a16] text-slate-100"
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

      <div className="relative z-10">
        {/* Floating action buttons — the header is gone, everything is a button */}
        <FloatingControls
          darkMode={props.darkMode}
          toggleTheme={props.toggleTheme}
          user={props.user}
          handleLogout={handleLogout}
          onLogin={() => setShowAuth(true)}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
          {/* Home view: a single Add button above the AI chat */}
          {isChat ? (
            <section className="relative">
              <div
                className={`relative cyber-cut-lg border-2 cyber-3d cyber-inner-edge cyber-shine overflow-hidden ${
                  props.darkMode
                    ? "bg-slate-900/80 border-cyan-900/50"
                    : "bg-white/90 border-cyan-300/70"
                }`}
              >
                <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 opacity-80 pointer-events-none" />
                <div className="flex flex-col sm:flex-row items-center justify-between gap-5 px-5 sm:px-8 py-7 sm:py-8">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-14 h-14 shrink-0 cyber-cut bg-gradient-to-tr from-cyan-500 via-sky-500 to-violet-500 flex items-center justify-center cyber-3d-sm [--glow-3d-2:var(--violet-glow)]">
                      <PlusIcon
                        className="w-7 h-7 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
                        strokeWidth={2.5}
                      />
                    </div>
                    <div className="min-w-0">
                      <h2
                        className={`text-xl sm:text-2xl font-black tracking-tight ${
                          props.darkMode ? "text-white" : "text-slate-800"
                        }`}
                      >
                        Track an expense
                      </h2>
                      <p
                        className={`text-xs sm:text-sm mt-0.5 ${
                          props.darkMode ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        Tap to log it manually — or just ask FinVue AI below.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={openAdd}
                    className="group relative inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 cyber-cut-sm text-sm sm:text-base font-black text-white cyber-btn-accent transition-all duration-200 hover:scale-[1.03] active:scale-95"
                  >
                    <PlusIcon
                      className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90"
                      strokeWidth={3}
                    />
                    Add Expense
                  </button>
                </div>
              </div>
            </section>
          ) : (
            <CommandCenter {...commandCenterProps} />
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
              visible={isChat}
            />
          </div>

          {/* Nav buttons move below the chat on the home view */}
          {isChat && (
            <div className="mt-6">
              <CommandCenter {...commandCenterProps} />
            </div>
          )}
        </main>

        <GoToTopButton darkMode={props.darkMode} />

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
