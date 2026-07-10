import { normalizeExpenseAmount } from "../../utils/expenseCalculations";
import { LedgerHeaderActions } from "./LedgerHeaderActions";
import { QuickAddExpenseForm } from "./QuickAddExpenseForm";
import { LedgerFilters } from "./LedgerFilters";
import { ExpenseTable } from "./ExpenseTable";
import { PaginationBar } from "./PaginationBar";

const LedgerView = (props) => {
    const filteredExpenses = props.filteredExpenses ?? [];
    const currentTableTotal = filteredExpenses.reduce((sum, expense) => sum + normalizeExpenseAmount(expense.amount), 0);
    const getCategoryStyles = props.getCategoryStyles ?? props.getCategoryStylesForTheme ?? (() => ({ bg: "bg-slate-100", bullet: "bg-slate-400" }));

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
            <ExpenseTable {...props} getCategoryStyles={getCategoryStyles} />
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
