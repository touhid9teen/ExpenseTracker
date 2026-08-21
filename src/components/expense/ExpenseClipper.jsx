"use client";

import { useEffect } from "react";
import ToastProvider from "../layout/ToastProvider";
import InstallPWAPrompt from "../layout/InstallPWAPrompt";
import ExpenseClipperScreen from "./ExpenseClipperScreen";
import { useExpenseClipper } from "../../hooks/useExpenseClipper";

const ExpenseClipper = () => {
    const clipper = useExpenseClipper();

    // Register the service worker so the browser can offer PWA installation.
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/sw.js").catch(() => {});
        }
    }, []);

    return (
        <>
            <ToastProvider darkMode={clipper.darkMode} />
            <ExpenseClipperScreen {...clipper} />
            <InstallPWAPrompt />
        </>
    );
};

export default ExpenseClipper;
