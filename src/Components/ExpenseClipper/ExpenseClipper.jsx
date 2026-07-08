"use client";

import ToastProvider from "./ToastProvider/ToastProvider";
import ExpenseClipperScreen from "./ExpenseClipperScreen/ExpenseClipperScreen";
import { useExpenseClipper } from "../hooks/useExpenseClipper";

const ExpenseClipper = () => {
    const clipper = useExpenseClipper();

    return (
        <>
            <ToastProvider darkMode={clipper.darkMode} />
            <ExpenseClipperScreen {...clipper} />
        </>
    );
};

export default ExpenseClipper;
