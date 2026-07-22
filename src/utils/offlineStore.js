// Offline persistence for FinVue: caches the current user + their expenses in
// localStorage, and maintains a coalesced queue of mutations to replay on
// reconnect. All access is SSR-safe (guards `window`). Expense ids are
// client-generated, so queued ops carry their final id and replay verbatim.

const USER_KEY = "finvue-user";
const expensesKey = (userId) => `finvue-expenses-${userId}`;
const queueKey = (userId) => `finvue-queue-${userId}`;

const hasWindow = () => typeof window !== "undefined";

const readJSON = (key, fallback) => {
    if (!hasWindow()) return fallback;
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
};

const writeJSON = (key, value) => {
    if (!hasWindow()) return;
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Quota or serialization failure — ignore; in-memory state still holds.
    }
};

const removeKey = (key) => {
    if (!hasWindow()) return;
    try {
        localStorage.removeItem(key);
    } catch {
        // ignore
    }
};

/* -------------------------------- User -------------------------------- */

export const loadCachedUser = () => readJSON(USER_KEY, null);
export const saveCachedUser = (user) => writeJSON(USER_KEY, user);
export const clearCachedUser = () => removeKey(USER_KEY);

/* ------------------------------ Expenses ------------------------------ */

export const loadCachedExpenses = (userId) =>
    userId ? readJSON(expensesKey(userId), []) : [];

export const saveCachedExpenses = (userId, list) => {
    if (userId) writeJSON(expensesKey(userId), Array.isArray(list) ? list : []);
};

/* -------------------------- Mutation queue ---------------------------- */
// Op shape: { type: 'add' | 'update' | 'delete', id, payload }

export const loadQueue = (userId) =>
    userId ? readJSON(queueKey(userId), []) : [];

export const saveQueue = (userId, queue) => {
    if (userId) writeJSON(queueKey(userId), Array.isArray(queue) ? queue : []);
};

export const clearQueue = (userId) => {
    if (userId) removeKey(queueKey(userId));
};

/**
 * Append an op, coalescing against pending ops for the same id so the queue
 * stays minimal and internally consistent:
 *  - update after pending add    → merge into that add (still one INSERT)
 *  - update after pending update → replace the update payload
 *  - delete of a never-synced add → drop all pending ops (net no-op)
 *  - delete otherwise            → drop pending updates, then push delete
 * Returns the new queue.
 */
export const enqueueMutation = (userId, op) => {
    if (!userId) return [];
    const queue = loadQueue(userId);
    const pending = queue.filter((o) => o.id === op.id);
    const hasPendingAdd = pending.some((o) => o.type === "add");

    let next;
    if (op.type === "update" && hasPendingAdd) {
        next = queue.map((o) =>
            o.id === op.id && o.type === "add"
                ? { ...o, payload: { ...o.payload, ...op.payload } }
                : o
        );
    } else if (op.type === "update") {
        const withoutOldUpdates = queue.filter(
            (o) => !(o.id === op.id && o.type === "update")
        );
        next = [...withoutOldUpdates, op];
    } else if (op.type === "delete" && hasPendingAdd) {
        // The row never reached the server — forget it entirely.
        next = queue.filter((o) => o.id !== op.id);
    } else if (op.type === "delete") {
        const withoutUpdates = queue.filter(
            (o) => !(o.id === op.id && o.type === "update")
        );
        next = [...withoutUpdates, op];
    } else {
        // add
        next = [...queue, op];
    }

    saveQueue(userId, next);
    return next;
};

export const getQueueLength = (userId) => loadQueue(userId).length;

/** Wipe everything tied to a user (used on logout). */
export const clearUserOfflineData = (userId) => {
    if (!userId) return;
    removeKey(expensesKey(userId));
    removeKey(queueKey(userId));
};
