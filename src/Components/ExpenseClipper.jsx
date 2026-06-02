"use client";

import ExpenseClipperScreen from "./ExpenseClipperScreen";
import { useExpenseClipper } from "../hooks/useExpenseClipper";

const ExpenseClipper = () => {
    const clipper = useExpenseClipper();

    return <ExpenseClipperScreen {...clipper} />;
};

export default ExpenseClipper;
