export const normalizeExpenseAmount = (amount) => {
    if (typeof amount === "number" && Number.isFinite(amount)) return amount;

    const parsedAmount = Number.parseFloat(amount);
    return Number.isFinite(parsedAmount) ? parsedAmount : 0;
};

export const normalizeExpenseRecord = (expense) => ({
    ...expense,
    item: expense.item ?? expense.description ?? "",
    amount: normalizeExpenseAmount(expense.amount)
});
