import { useCallback, useEffect, useState } from "react";

/**
 * Owns UI chrome state: active tab, modals, open menus, and the chatbot overlay.
 * Also handles the global click-outside listener for dismissable menus.
 */
export const useUIState = () => {
    // Single-page command-driven app: sections swap below the command bar.
    // The app opens on the Command Center (overview) view so first-time
    // sign-ins land there with the tab auto-selected in the sidebar.
    const [activeTab, setActiveTab] = useState("overview");
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [selectedDailyDate, setSelectedDailyDate] = useState(null);
    const [editingExpense, setEditingExpense] = useState(null);
    const [deletingExpense, setDeletingExpense] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [pendingAction, setPendingAction] = useState(null);
    // Last few AI prompts the user sent — powers the "Recent Queries" rail.
    const [recentQueries, setRecentQueries] = useState([]);

    // Keep the 5 most recent, de-duplicated, newest first.
    const pushRecentQuery = useCallback((text) => {
        const clean = (text || "").trim();
        if (!clean) return;
        setRecentQueries((prev) => [clean, ...prev.filter((q) => q !== clean)].slice(0, 5));
    }, []);

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
        setPendingAction,
        recentQueries,
        pushRecentQuery
    };
};
