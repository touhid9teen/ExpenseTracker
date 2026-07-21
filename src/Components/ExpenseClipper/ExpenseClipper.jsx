"use client";

import { useEffect } from "react";
import ToastProvider from "../common/ToastProvider";
import InstallPWAPrompt from "../common/InstallPWAPrompt";
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
            <InstallPWAPrompt darkMode={clipper.darkMode} />
        </>
    );
};

export default ExpenseClipper;
