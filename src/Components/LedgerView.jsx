import { normalizeExpenseAmount } from "../utils/expenseCalculations";
import { LedgerHeaderActions } from "./LedgerView/LedgerHeaderActions";
import { QuickAddExpenseForm } from "./LedgerView/QuickAddExpenseForm";
import { LedgerFilters } from "./LedgerView/LedgerFilters";
import { ExpenseTable } from "./LedgerView/ExpenseTable";
import { PaginationBar } from "./LedgerView/PaginationBar";

const LedgerView = (props) => {
    const currentTableTotal = props.filteredExpenses.reduce((sum, expense) => sum + normalizeExpenseAmount(expense.amount), 0);

    return props.activeTab === "ledger" ? (
        <div className="space-y-6 animate-fadeIn">
            <LedgerHeaderActions
                darkMode={props.darkMode}
                setActiveTab={props.setActiveTab}
                showQuickAdd={props.showQuickAdd}
                setShowQuickAdd={props.setShowQuickAdd}
            />
            <QuickAddExpenseForm {...props} />
            <LedgerFilters {...props} />
            <ExpenseTable {...props} />
            <PaginationBar
                darkMode={props.darkMode}
                filteredExpenses={props.filteredExpenses}
                currentPage={props.currentPage}
                setCurrentPage={props.setCurrentPage}
                itemsPerPage={props.itemsPerPage}
                totalPages={props.totalPages}
                currentTableTotal={currentTableTotal}
            />
        </div>
    ) : null;
};

export default LedgerView;
