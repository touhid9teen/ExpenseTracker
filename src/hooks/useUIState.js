import { useEffect, useState } from "react";

/**
 * Owns UI chrome state: active tab, modals, open menus, and the chatbot overlay.
 * Also handles the global click-outside listener for dismissable menus.
 */
export const useUIState = () => {
    // Single-page command-driven app: sections swap below the command bar.
    // The app now opens on the AI chat home view (hero Add button + chat).
    const [activeTab, setActiveTab] = useState("chat");
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [selectedDailyDate, setSelectedDailyDate] = useState(null);
    const [editingExpense, setEditingExpense] = useState(null);
    const [deletingExpense, setDeletingExpense] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [pendingAction, setPendingAction] = useState(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target?.closest?.('[data-menu-area]')) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return {
        activeTab,
        setActiveTab,
        showQuickAdd,
        setShowQuickAdd,
        selectedDailyDate,
        setSelectedDailyDate,
        editingExpense,
        setEditingExpense,
        deletingExpense,
        setDeletingExpense,
        openMenuId,
        setOpenMenuId,
        pendingAction,
        setPendingAction
    };
};
