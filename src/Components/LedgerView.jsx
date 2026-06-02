import { normalizeExpenseAmount } from "../utils/expenseCalculations";
import { LedgerHeaderActions } from "./LedgerView/LedgerHeaderActions";
import { QuickAddExpenseForm } from "./LedgerView/QuickAddExpenseForm";
import { LedgerFilters } from "./LedgerView/LedgerFilters";
import { ExpenseTable } from "./LedgerView/ExpenseTable";
import { PaginationBar } from "./LedgerView/PaginationBar";

const LedgerView = (props) => {
    const filteredExpenses = props.filteredExpenses ?? [];
    const currentTableTotal = filteredExpenses.reduce((sum, expense) => sum + normalizeExpenseAmount(expense.amount), 0);

    return props.activeTab === "ledger" ? (
        <div className="space-y-6 animate-fadeIn">
            <LedgerHeaderActions
                darkMode={props.darkMode ?? true}
                setActiveTab={props.setActiveTab}
                showQuickAdd={props.showQuickAdd}
                setShowQuickAdd={props.setShowQuickAdd}
            />
            <QuickAddExpenseForm {...props} />
            <LedgerFilters {...props} />
            <ExpenseTable {...props} />
            <PaginationBar
                darkMode={props.darkMode ?? true}
                filteredExpenses={filteredExpenses}
                currentPage={props.currentPage ?? 1}
                setCurrentPage={props.setCurrentPage}
                itemsPerPage={props.itemsPerPage ?? 8}
                totalPages={props.totalPages ?? 1}
                currentTableTotal={currentTableTotal}
            />
        </div>
    ) : null;
};

export default LedgerView;
