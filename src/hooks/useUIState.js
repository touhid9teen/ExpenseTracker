import { useEffect, useState } from "react";

/**
 * Owns UI chrome state: active tab, modals, open menus, and the chatbot overlay.
 * Also handles the global click-outside listener for dismissable menus.
 */
export const useUIState = () => {
    const [activeTab, setActiveTab] = useState("statistics");
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [selectedDailyDate, setSelectedDailyDate] = useState(null);
    const [editingExpense, setEditingExpense] = useState(null);
    const [deletingExpense, setDeletingExpense] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [showQuickActionsNav, setShowQuickActionsNav] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target?.closest?.('[data-menu-area]')) {
                setOpenMenuId(null);
            }
            if (!e.target?.closest?.('[data-quick-actions-nav]')) {
                setShowQuickActionsNav(false);
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
        showQuickActionsNav,
        setShowQuickActionsNav,
        chatOpen,
        setChatOpen,
        pendingAction,
        setPendingAction
    };
};
