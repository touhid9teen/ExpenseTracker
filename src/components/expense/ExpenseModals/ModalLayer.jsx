"use client";
import {
  AddExpenseModal,
  DailyExpenseModal,
  DeleteExpenseModal,
  EditExpenseModal,
} from "./ExpenseModals";

/**
 * ModalLayer – renders all four expense modals in one place so the screen
 * shell stays a readable composition of page-level pieces.
 */
const ModalLayer = ({
  showQuickAdd,
  setShowQuickAdd,
  closeAddModal,
  darkMode,
  CATEGORIES,
  getCategoryStylesForTheme,
  addStep,
  selectCategory,
  goToCategoryStep,
  goToAmountStep,
  addCategory,
  addDescription,
  setAddDescription,
  addAmount,
  setAddAmount,
  addDate,
  setAddDate,
  handleAddExpense,
  isAddingExpense,
  selectedDailyDate,
  dailyModalDetails,
  formatDate,
  setSelectedDailyDate,
  editingExpense,
  setEditingExpense,
  handleSaveEdit,
  deletingExpense,
  setDeletingExpense,
  handleConfirmDelete,
}) => (
  <>
    <AddExpenseModal
      showQuickAdd={showQuickAdd}
      setShowQuickAdd={setShowQuickAdd}
      closeAddModal={closeAddModal}
      darkMode={darkMode}
      CATEGORIES={CATEGORIES}
      getCategoryStyles={getCategoryStylesForTheme}
      addStep={addStep}
      selectCategory={selectCategory}
      goToCategoryStep={goToCategoryStep}
      goToAmountStep={goToAmountStep}
      addCategory={addCategory}
      addDescription={addDescription}
      setAddDescription={setAddDescription}
      addAmount={addAmount}
      setAddAmount={setAddAmount}
      addDate={addDate}
      setAddDate={setAddDate}
      handleAddExpense={handleAddExpense}
      isAddingExpense={isAddingExpense}
    />
    <DailyExpenseModal
      selectedDailyDate={selectedDailyDate}
      dailyModalDetails={dailyModalDetails}
      darkMode={darkMode}
      formatDate={formatDate}
      getCategoryStyles={getCategoryStylesForTheme}
      setSelectedDailyDate={setSelectedDailyDate}
    />
    <EditExpenseModal
      editingExpense={editingExpense}
      setEditingExpense={setEditingExpense}
      darkMode={darkMode}
      handleSaveEdit={handleSaveEdit}
      CATEGORIES={CATEGORIES}
    />
    <DeleteExpenseModal
      deletingExpense={deletingExpense}
      setDeletingExpense={setDeletingExpense}
      darkMode={darkMode}
      handleConfirmDelete={handleConfirmDelete}
    />
  </>
);

export default ModalLayer;
