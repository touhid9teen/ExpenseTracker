// Client-side CSV export for the expense ledger. Builds a CSV string from the
// given rows and triggers a browser download — no server round-trip.
import { normalizeExpenseAmount } from "./expenseCalculations";

const escapeCsv = (value) => {
    const str = String(value ?? "");
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

export const exportExpensesToCSV = (expenses = [], filename = "finvue-expenses.csv") => {
    if (typeof window === "undefined") return;

    const headers = ["Date", "Category", "Description", "Amount"];
    const rows = expenses.map((exp) => [
        exp.date,
        exp.category,
        exp.item ?? exp.description ?? "",
        normalizeExpenseAmount(exp.amount),
    ]);

    const csv = [headers, ...rows]
        .map((row) => row.map(escapeCsv).join(","))
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
