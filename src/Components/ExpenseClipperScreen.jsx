import { Toaster } from "react-hot-toast";
import { ChartPieIcon, PlusIcon, ClipboardListIcon, InfoCircleIcon } from "./Icons";
import AppHeader from "./AppHeader";
import AuthModal from "./AuthModal";
import {
  DailyExpenseModal,
  DeleteExpenseModal,
  EditExpenseModal,
} from "./ExpenseModals";
import LedgerView from "./LedgerView";
import StatisticsView from "./StatisticsView";
import AboutView from "./AboutView";
import ChatBot from "./ChatBot";

const ExpenseClipperScreen = (props) => {
  const toaster = (
    <Toaster
      position="top-center"
      containerStyle={{ zIndex: 99999 }}
      toastOptions={{
        duration: 5000,
        style: {
          background: props.darkMode ? "#1e293b" : "#ffffff",
          color: props.darkMode ? "#f1f5f9" : "#1e293b",
          border: props.darkMode ? "1px solid #334155" : "1px solid #e2e8f0",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
          padding: "12px 16px",
          fontSize: "14px",
          fontWeight: "500",
          borderRadius: "12px",
        },
        success: {
          iconTheme: {
            primary: "#10b981",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
        },
      }}
    />
  );

  if (props.isAuthLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${props.darkMode ? "bg-[#0b0f19]" : "bg-[#f8fafc]"}`}
      >
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        {toaster}
      </div>
    );
  }

  if (!props.user) {
    return (
      <>
        <AuthModal setUser={props.setUser} darkMode={props.darkMode} />
        {toaster}
      </>
    );
  }

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 pb-20 sm:pb-0 ${props.darkMode ? "bg-[#0b0f19] text-slate-100" : "bg-[#f8fafc] text-slate-800"}`}
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
        <StatisticsView {...props} />
        <LedgerView {...props} />
        {props.activeTab === "about" && (
          <AboutView darkMode={props.darkMode} setActiveTab={props.setActiveTab} />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div
        className={`sm:hidden fixed bottom-0 left-0 right-0 z-40 px-6 py-2 flex justify-around items-center border-t backdrop-blur-lg shadow-lg ${props.darkMode ? "bg-slate-950/90 border-slate-800/80 text-slate-400" : "bg-white/85 border-slate-300/80 text-slate-500"}`}
      >
        <button
          onClick={() => props.setActiveTab("statistics")}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${props.activeTab === "statistics" ? (props.darkMode ? "text-emerald-400" : "text-emerald-600") : ""}`}
        >
          <ChartPieIcon className="w-5 h-5" strokeWidth={2.5} />
          <span className="text-[10px] font-bold">Analytics</span>
        </button>

        {/* Floating Action Button (FAB) for Quick Add */}
        <button
          onClick={() => {
            props.setActiveTab("ledger");
            props.setShowQuickAdd(true);
            setTimeout(() => {
              const form = document.querySelector("form");
              if (form)
                form.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 100);
          }}
          className="relative -top-4 w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-450 text-white flex items-center justify-center shadow-lg shadow-emerald-500/35 hover:scale-105 active:scale-95 transition-all"
        >
          <PlusIcon className="w-6 h-6" strokeWidth={3} />
        </button>

        <button
          onClick={() => props.setActiveTab("ledger")}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${props.activeTab === "ledger" ? (props.darkMode ? "text-emerald-400" : "text-emerald-600") : ""}`}
        >
          <ClipboardListIcon className="w-5 h-5" strokeWidth={2.5} />
          <span className="text-[10px] font-bold">Ledger</span>
        </button>

        {/* About Nav Button */}
        <button
          onClick={() => props.setActiveTab("about")}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${props.activeTab === "about" ? (props.darkMode ? "text-emerald-400" : "text-emerald-600") : ""}`}
        >
          <InfoCircleIcon className="w-5 h-5" strokeWidth={2.5} />
          <span className="text-[10px] font-bold">About</span>
        </button>
      </div>

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
      />
      {toaster}
    </div>
  );
};

export default ExpenseClipperScreen;
