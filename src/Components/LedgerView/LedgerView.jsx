"use client";
import { useState } from "react";
import { normalizeExpenseAmount } from "../../utils/expenseCalculations";
import { exportExpensesToCSV } from "../../utils/exportUtils";
import { LedgerHeaderActions } from "./LedgerHeaderActions";
import { LedgerSummaryCards } from "./LedgerSummaryCards";
import { LedgerFilters } from "./LedgerFilters";
import { ExpenseTable } from "./ExpenseTable";
import { PaginationBar } from "./PaginationBar";

const LedgerView = (props) => {
    const [showFilters, setShowFilters] = useState(true);

    const filteredExpenses = props.filteredExpenses ?? [];
    const currentTableTotal = filteredExpenses.reduce((sum, expense) => sum + normalizeExpenseAmount(expense.amount), 0);
    const getCategoryStyles = props.getCategoryStyles ?? props.getCategoryStylesForTheme ?? (() => ({ bg: "bg-slate-100", bullet: "bg-slate-400", color: "bg-slate-400" }));

    // Explicit override lets the overview page stack the ledger under stats.
    const show = props.visible !== undefined ? props.visible : props.activeTab === "ledger";
    if (!show) return null;

    return (
        <div className="space-y-3 animate-fadeIn">
            <LedgerHeaderActions
                darkMode={props.darkMode ?? true}
                setShowQuickAdd={props.setShowQuickAdd}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                onExport={() => exportExpensesToCSV(filteredExpenses)}
            />
            <LedgerSummaryCards darkMode={props.darkMode ?? true} expenses={filteredExpenses} />
            {showFilters && <LedgerFilters {...props} />}
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
    );
};

export default LedgerView;
