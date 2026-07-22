import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { getTodayInputValue } from "../utils/dateUtils";
import { normalizeExpenseRecord } from "../utils/expenseCalculations";
import {
    loadCachedExpenses,
    saveCachedExpenses,
    loadQueue,
    saveQueue,
    enqueueMutation,
    getQueueLength
} from "../utils/offlineStore";

const generateExpenseId = () =>
    `exp-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

/**
 * Owns the expense list with offline-first CRUD.
 *
 * Reads hydrate instantly from a per-user localStorage cache, then refresh
 * from the API when online. Writes apply optimistically to state + cache, then
 * either hit the API (online) or enqueue a mutation to replay on reconnect
 * (offline / network failure). The `quiet` flag switches toast copy for
 * chatbot-triggered ("automatic") actions.
 */
export const useExpenses = (user, isOnline = true) => {
    const [expenses, setExpensesState] = useState([]);
    const [isExpensesLoading, setIsExpensesLoading] = useState(false);
    const [pendingSyncCount, setPendingSyncCount] = useState(0);

    const userId = user?.id ?? null;
    // Avoid concurrent drains (e.g. reconnect effect + refresh racing).
    const syncingRef = useRef(false);

    const refreshPendingCount = useCallback(() => {
        setPendingSyncCount(userId ? getQueueLength(userId) : 0);
    }, [userId]);

    // State setter that also persists to the per-user cache.
    const setExpenses = useCallback(
        (updater) => {
            setExpensesState((current) => {
                const next =
                    typeof updater === "function" ? updater(current) : updater;
                if (userId) saveCachedExpenses(userId, next);
                return next;
            });
        },
        [userId]
    );

    /**
     * Replay queued mutations in order. Stops at the first network error and
     * keeps the remaining ops for the next reconnect. Returns true if the queue
     * fully drained.
     */
    const syncQueue = useCallback(async () => {
        if (!userId || syncingRef.current) return false;
        let queue = loadQueue(userId);
        if (queue.length === 0) return true;

        syncingRef.current = true;
        try {
            while (queue.length > 0) {
                const op = queue[0];
                let res;
                if (op.type === "add") {
                    res = await fetch("/api/expenses", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(op.payload)
                    });
                } else if (op.type === "update") {
                    res = await fetch(`/api/expenses/${op.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(op.payload)
                    });
                } else {
                    res = await fetch(`/api/expenses/${op.id}`, {
                        method: "DELETE"
                    });
                }

                // A 404 on update/delete means the row is already gone server
                // side — treat as done. Other non-OK statuses: drop the op so a
                // single bad record can't wedge the queue forever.
                if (!res.ok && res.status >= 500) {
                    throw new Error(`Sync failed with ${res.status}`);
                }

                queue = queue.slice(1);
                saveQueue(userId, queue);
                refreshPendingCount();
            }
            return true;
        } catch (error) {
            console.error("Queue sync interrupted:", error);
            return false;
        } finally {
            syncingRef.current = false;
        }
    }, [userId, refreshPendingCount]);

    // Hydrate from cache immediately, then refresh from the API when online.
    useEffect(() => {
        if (!user) {
            setExpensesState([]);
            setPendingSyncCount(0);
            return;
        }

        const cached = loadCachedExpenses(user.id);
        setExpensesState(cached);
        refreshPendingCount();

        const load = async () => {
            if (!navigator.onLine) return; // stay on cached data, no error toast

            setIsExpensesLoading(true);
            try {
                await syncQueue();

                const response = await fetch("/api/expenses");
                if (response.ok) {
                    const data = await response.json();
                    const formattedData = Array.isArray(data)
                        ? data.map((exp) =>
                              normalizeExpenseRecord({
                                  ...exp,
                                  date: exp.date ? String(exp.date).split("T")[0] : ""
                              })
                          )
                        : [];
                    setExpenses(formattedData);
                }
            } catch (error) {
                // Offline / network blip: keep cached data silently.
                console.error("Failed to fetch expenses:", error);
                if (navigator.onLine) toast.error("Failed to load expenses.");
            } finally {
                setIsExpensesLoading(false);
                refreshPendingCount();
            }
        };

        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // When connectivity returns, drain the queue then reconcile from server.
    useEffect(() => {
        if (!user || !isOnline) return;
        let cancelled = false;
        (async () => {
            const drained = await syncQueue();
            if (drained && !cancelled) {
                try {
                    const response = await fetch("/api/expenses");
                    if (response.ok) {
                        const data = await response.json();
                        const formatted = Array.isArray(data)
                            ? data.map((exp) =>
                                  normalizeExpenseRecord({
                                      ...exp,
                                      date: exp.date ? String(exp.date).split("T")[0] : ""
                                  })
                              )
                            : [];
                        if (!cancelled) setExpenses(formatted);
                    }
                } catch {
                    // ignore — will retry on next reconnect
                }
            }
            refreshPendingCount();
        })();
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOnline, user]);

    const addExpense = async (expenseData, { quiet = false } = {}) => {
        const newExpense = {
            id: generateExpenseId(),
            description: expenseData.description.trim(),
            amount: parseFloat(expenseData.amount),
            date: expenseData.date || getTodayInputValue(),
            category: expenseData.category || "Other"
        };
        const optimistic = normalizeExpenseRecord(newExpense);

        // Optimistic insert.
        setExpenses((current) => [optimistic, ...current]);

        if (!navigator.onLine) {
            enqueueMutation(userId, { type: "add", id: newExpense.id, payload: newExpense });
            refreshPendingCount();
            toast.success("Saved offline — will sync when you reconnect.");
            return optimistic;
        }

        try {
            const res = await fetch("/api/expenses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newExpense)
            });
            if (res.ok) {
                const savedExpense = normalizeExpenseRecord(await res.json());
                setExpenses((current) =>
                    current.map((exp) => (exp.id === savedExpense.id ? savedExpense : exp))
                );
                toast.success(quiet ? "Expense added automatically!" : "Expense added successfully!");
                return savedExpense;
            }
            toast.error("Failed to add expense.");
            setExpenses((current) => current.filter((exp) => exp.id !== newExpense.id));
        } catch (error) {
            // Network dropped mid-request — keep it and queue for replay.
            console.error("Failed to add expense", error);
            enqueueMutation(userId, { type: "add", id: newExpense.id, payload: newExpense });
            refreshPendingCount();
            toast.success("Saved offline — will sync when you reconnect.");
            return optimistic;
        }
        return null;
    };

    const updateExpense = async (expenseData, { quiet = false } = {}) => {
        const expenseToUpdate = {
            ...expenseData,
            description: expenseData.description?.trim(),
            amount: parseFloat(expenseData.amount)
        };
        const normalized = normalizeExpenseRecord(expenseToUpdate);

        // Optimistic update.
        setExpenses((current) =>
            current.map((exp) => (exp.id === normalized.id ? normalized : exp))
        );

        const payload = {
            description: expenseToUpdate.description,
            amount: expenseToUpdate.amount,
            date: expenseToUpdate.date,
            category: expenseToUpdate.category
        };

        if (!navigator.onLine) {
            enqueueMutation(userId, { type: "update", id: normalized.id, payload });
            refreshPendingCount();
            toast.success("Saved offline — will sync when you reconnect.");
            return normalized;
        }

        try {
            const res = await fetch(`/api/expenses/${normalized.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                const updatedExpense = normalizeExpenseRecord(await res.json());
                setExpenses((current) =>
                    current.map((exp) => (exp.id === updatedExpense.id ? updatedExpense : exp))
                );
                toast.success(quiet ? "Expense updated automatically!" : "Expense updated successfully!");
                return updatedExpense;
            }
            toast.error("Failed to update expense.");
        } catch (error) {
            console.error("Failed to update expense", error);
            enqueueMutation(userId, { type: "update", id: normalized.id, payload });
            refreshPendingCount();
            toast.success("Saved offline — will sync when you reconnect.");
            return normalized;
        }
        return null;
    };

    const deleteExpense = async (id, { quiet = false } = {}) => {
        // Optimistic remove.
        setExpenses((current) => current.filter((exp) => exp.id !== id));

        if (!navigator.onLine) {
            enqueueMutation(userId, { type: "delete", id });
            refreshPendingCount();
            toast.success("Deleted offline — will sync when you reconnect.");
            return true;
        }

        try {
            const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
            if (res.ok || res.status === 404) {
                toast.success(quiet ? "Expense deleted automatically!" : "Expense deleted successfully!");
                return true;
            }
            toast.error("Failed to delete expense.");
        } catch (error) {
            console.error("Failed to delete expense", error);
            enqueueMutation(userId, { type: "delete", id });
            refreshPendingCount();
            toast.success("Deleted offline — will sync when you reconnect.");
            return true;
        }
        return false;
    };

    return {
        expenses,
        setExpenses,
        isExpensesLoading,
        pendingSyncCount,
        addExpense,
        updateExpense,
        deleteExpense
    };
};
