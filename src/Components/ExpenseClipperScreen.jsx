import AppHeader from "./AppHeader";
import FilterAlert from "./FilterAlert";
import StatisticsView from "./StatisticsView";
import LedgerView from "./LedgerView";
import { DailyExpenseModal, EditExpenseModal, DeleteExpenseModal } from "./ExpenseModals";
import AuthModal from "./AuthModal";
import { Toaster } from 'react-hot-toast';

const ExpenseClipperScreen = (props) => {
    if (props.isAuthLoading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${props.darkMode ? 'bg-[#0b0f19]' : 'bg-[#f8fafc]'}`}>
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!props.user) {
        return <AuthModal setUser={props.setUser} darkMode={props.darkMode} />;
    }
    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${props.darkMode ? "bg-[#0b0f19] text-slate-100" : "bg-[#f8fafc] text-slate-800"}`}>
            <AppHeader darkMode={props.darkMode} activeTab={props.activeTab} setActiveTab={props.setActiveTab} toggleTheme={props.toggleTheme} user={props.user} handleLogout={props.handleLogout} />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <FilterAlert searchQuery={props.searchQuery} categoryFilter={props.categoryFilter} activeDateFilter={props.activeDateFilter} darkMode={props.darkMode} handleResetFilters={props.handleResetFilters} />
                <StatisticsView {...props} />
                <LedgerView {...props} />
            </main>
            <DailyExpenseModal selectedDailyDate={props.selectedDailyDate} dailyModalDetails={props.dailyModalDetails} darkMode={props.darkMode} formatDate={props.formatDate} getCategoryStyles={props.getCategoryStylesForTheme} setSelectedDailyDate={props.setSelectedDailyDate} />
            <EditExpenseModal editingExpense={props.editingExpense} setEditingExpense={props.setEditingExpense} darkMode={props.darkMode} handleSaveEdit={props.handleSaveEdit} CATEGORIES={props.CATEGORIES} />
            <DeleteExpenseModal deletingExpense={props.deletingExpense} setDeletingExpense={props.setDeletingExpense} darkMode={props.darkMode} handleConfirmDelete={props.handleConfirmDelete} />
            <Toaster 
                position="bottom-right" 
                toastOptions={{
                    style: {
                        background: props.darkMode ? '#1e293b' : '#fff',
                        color: props.darkMode ? '#fff' : '#1e293b',
                    }
                }} 
            />
        </div>
    );
};

export default ExpenseClipperScreen;
