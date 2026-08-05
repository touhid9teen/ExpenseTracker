import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

// Small fetch helper that throws on non-OK responses with the server's error
// message, so admin actions can surface real feedback via toast.
const fetchJSON = async (url, options) => {
    const res = await fetch(url, options);
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
    return data;
};

/**
 * Owns all admin-console state: the users list, every user's expenses, and the
 * live API request log. Only active when the signed-in user is an admin.
 *
 * Data loads once on login and refreshes every time the admin tab is opened
 * (so it stays fresh). The Logs tab additionally polls every 10s while it is
 * the active view ("Live Logs"). All mutations (role toggle, deletes, clear)
 * update local state immediately after the server confirms.
 */
export const useAdmin = ({ user, isOnline = true, activeTab = "" }) => {
    const isAdminUser = !!user?.isAdmin;

    const [adminTab, setAdminTab] = useState("users");
    const [users, setUsers] = useState([]);
    const [allExpenses, setAllExpenses] = useState([]);
    const [logs, setLogs] = useState([]);
    const [isAdminLoading, setIsAdminLoading] = useState(false);
    const [lastRefresh, setLastRefresh] = useState(null);
    const fetchInFlightRef = useRef(false);

    const fetchAdminData = useCallback(
        async ({ logsOnly = false } = {}) => {
            if (!isAdminUser || !isOnline || !navigator.onLine || fetchInFlightRef.current) return;
            fetchInFlightRef.current = true;
            if (!logsOnly) setIsAdminLoading(true);
            try {
                if (logsOnly) {
                    const logsData = await fetchJSON("/api/admin/logs?limit=150");
                    setLogs(Array.isArray(logsData) ? logsData : []);
                } else {
                    const [usersData, expensesData, logsData] = await Promise.all([
                        fetchJSON("/api/admin/users"),
                        fetchJSON("/api/admin/expenses?limit=500"),
                        fetchJSON("/api/admin/logs?limit=150"),
                    ]);
                    setUsers(Array.isArray(usersData) ? usersData : []);
                    setAllExpenses(Array.isArray(expensesData) ? expensesData : []);
                    setLogs(Array.isArray(logsData) ? logsData : []);
                }
                setLastRefresh(new Date());
            } catch (error) {
                console.error("Failed to load admin data:", error);
                if (!logsOnly) toast.error("Failed to load admin data.");
            } finally {
                setIsAdminLoading(false);
                fetchInFlightRef.current = false;
            }
        },
        [isAdminUser, isOnline]
    );

    // Initial load as soon as an admin session exists and we're online.
    useEffect(() => {
        if (isAdminUser && isOnline) fetchAdminData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdminUser, isOnline]);

    // Re-fetch whenever the user opens the admin tab (keeps data fresh).
    useEffect(() => {
        if (isAdminUser && activeTab === "admin" && isOnline) fetchAdminData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, isAdminUser, isOnline]);

    // Live Logs: poll every 10 seconds while the Logs tab is the active view.
    useEffect(() => {
        if (!isAdminUser || activeTab !== "admin" || adminTab !== "logs" || !isOnline) return;
        const timer = setInterval(() => fetchAdminData({ logsOnly: true }), 10000);
        return () => clearInterval(timer);
    }, [isAdminUser, activeTab, adminTab, isOnline, fetchAdminData]);

    // Clear admin data when the session ends (logout / user switch).
    useEffect(() => {
        if (!user) {
            setUsers([]);
            setAllExpenses([]);
            setLogs([]);
            setAdminTab("users");
            setLastRefresh(null);
        }
    }, [user]);

    const toggleUserAdmin = async (id, makeAdmin) => {
        try {
            const updated = await fetchJSON("/api/admin/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, isAdmin: makeAdmin }),
            });
            setUsers((current) =>
                current.map((u) => (u.id === id ? { ...u, ...updated } : u))
            );
            toast.success(
                `Admin role ${makeAdmin ? "granted to" : "revoked from"} ${updated.username || "user"}.`
            );
        } catch (error) {
            toast.error(error.message || "Failed to update role.");
        }
    };

    const deleteUser = async (id, username) => {
        try {
            await fetchJSON("/api/admin/users", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            setUsers((current) => current.filter((u) => u.id !== id));
            setAllExpenses((current) => current.filter((e) => e.userId !== id));
            toast.success(`User ${username || ""} and their expenses were deleted.`);
        } catch (error) {
            toast.error(error.message || "Failed to delete user.");
        }
    };

    const deleteExpense = async (id) => {
        try {
            await fetchJSON("/api/admin/expenses", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            setAllExpenses((current) => current.filter((e) => e.id !== id));
            toast.success("Expense deleted.");
        } catch (error) {
            toast.error(error.message || "Failed to delete expense.");
        }
    };

    const clearLogs = async () => {
        try {
            await fetchJSON("/api/admin/logs", { method: "DELETE" });
            setLogs([]);
            toast.success("Logs cleared.");
        } catch (error) {
            toast.error(error.message || "Failed to clear logs.");
        }
    };

    return {
        // Admin console state
        adminTab,
        setAdminTab,
        users,
        allExpenses,
        logs,
        isAdminLoading,
        lastRefresh,
        refreshAdmin: () => fetchAdminData(),

        // Admin actions
        toggleUserAdmin,
        deleteUser,
        deleteExpense,
        clearLogs,
    };
};
