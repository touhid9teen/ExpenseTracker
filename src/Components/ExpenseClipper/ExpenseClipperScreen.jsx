"use client";

import AppLoader from "../common/AppLoader";
import StatisticsSkeleton from "../Skeleton/StatisticsSkeleton/StatisticsSkeleton";
import LedgerSkeleton from "../Skeleton/LedgerSkeleton/LedgerSkeleton";
import MobileBottomNav from "../common/MobileBottomNav";
import AppHeader from "../common/AppHeader";
import AuthView from "../AuthView/AuthView";
import {
  DailyExpenseModal,
  DeleteExpenseModal,
  EditExpenseModal,
} from "./ExpenseModals/ExpenseModals";
import LedgerView from "../LedgerView/LedgerView";
import dynamic from "next/dynamic";
const StatisticsView = dynamic(() => import("../StatisticsView/StatisticsView"), {
    loading: () => <StatisticsSkeleton darkMode={true} />
});
import AboutView from "../AboutView/AboutView";
import ChatBot from "../ChatBot/ChatBot";

const ExpenseClipperScreen = (props) => {
  if (props.isAuthLoading) {
    return <AppLoader darkMode={props.darkMode} />;
  }

  if (!props.user) {
    return (
      <>
        <AuthView setUser={props.setUser} darkMode={props.darkMode} />
      </>
    );
  }

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 pb-20 sm:pb-0 ${
        props.darkMode
          ? "bg-[#0b0f19] text-slate-100"
          : "bg-[#f8fafc] text-slate-800"
      }`}
    >
      <AppHeader
        darkMode={props.darkMode}
        activeTab={props.activeTab}
        setActiveTab={props.setActiveTab}
        toggleTheme={props.toggleTheme}
        user={props.user}
        handleLogout={props.handleLogout}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* <FilterAlert searchQuery={props.searchQuery} categoryFilter={props.categoryFilter} activeDateFilter={props.activeDateFilter} darkMode={props.darkMode} handleResetFilters={props.handleResetFilters} /> */}
        {props.isExpensesLoading && props.activeTab === "statistics" && (
          <StatisticsSkeleton darkMode={props.darkMode} />
        )}
        {props.isExpensesLoading && props.activeTab === "ledger" && (
          <LedgerSkeleton darkMode={props.darkMode} />
        )}
        {!props.isExpensesLoading && <StatisticsView {...props} />}
        {!props.isExpensesLoading && <LedgerView {...props} />}
        {props.activeTab === "about" && (
          <AboutView
            darkMode={props.darkMode}
            setActiveTab={props.setActiveTab}
          />
        )}
      </main>

      <MobileBottomNav
        darkMode={props.darkMode}
        activeTab={props.activeTab}
        setActiveTab={props.setActiveTab}
        showQuickAdd={props.showQuickAdd}
        setShowQuickAdd={props.setShowQuickAdd}
        showQuickActionsNav={props.showQuickActionsNav}
        setShowQuickActionsNav={props.setShowQuickActionsNav}
        quickActionSuggestions={props.quickActionSuggestions}
        setPendingAction={props.setPendingAction}
        setChatOpen={props.setChatOpen}
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
      <ChatBot
        darkMode={props.darkMode}
        user={props.user}
        expenses={props.expenses}
        addExpenseDirect={props.addExpenseDirect}
        updateExpenseDirect={props.updateExpenseDirect}
        deleteExpenseDirect={props.deleteExpenseDirect}
        setActiveTab={props.setActiveTab}
        chatOpen={props.chatOpen}
        setChatOpen={props.setChatOpen}
        pendingAction={props.pendingAction}
        setPendingAction={props.setPendingAction}
      />
    </div>
  );
};

export default ExpenseClipperScreen;
