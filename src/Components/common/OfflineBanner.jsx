"use client";

import { useEffect, useState } from "react";
import { WarningTriangleIcon, SpinnerIcon, CheckIcon } from "./Icons";

/**
 * Fixed banner communicating connectivity state:
 *  - offline  → persistent "You're offline" notice
 *  - back online with queued changes → transient "Syncing N change(s)…"
 *  - queue drained just after being offline → brief "All changes synced"
 * Styling mirrors InstallPWAPrompt (amber/slate, darkMode-aware).
 */
const OfflineBanner = ({ isOnline = true, pendingSyncCount = 0, darkMode = true }) => {
    const [showSynced, setShowSynced] = useState(false);

    // Briefly confirm success when a pending queue finishes draining online.
    useEffect(() => {
        if (isOnline && pendingSyncCount === 0 && showSynced) {
            const t = setTimeout(() => setShowSynced(false), 2500);
            return () => clearTimeout(t);
        }
    }, [isOnline, pendingSyncCount, showSynced]);

    useEffect(() => {
        if (pendingSyncCount > 0) setShowSynced(true);
    }, [pendingSyncCount]);

    const syncing = isOnline && pendingSyncCount > 0;
    const synced = isOnline && pendingSyncCount === 0 && showSynced;

    if (isOnline && !syncing && !synced) return null;

    let icon;
    let text;
    let tone;

    if (!isOnline) {
        icon = <WarningTriangleIcon className="w-4 h-4" />;
        text =
            pendingSyncCount > 0
                ? `Offline — ${pendingSyncCount} change${pendingSyncCount > 1 ? "s" : ""} will sync when you reconnect`
                : "You're offline — changes are saved on this device";
        tone = "offline";
    } else if (syncing) {
        icon = <SpinnerIcon className="w-4 h-4 animate-spin" />;
        text = `Syncing ${pendingSyncCount} change${pendingSyncCount > 1 ? "s" : ""}…`;
        tone = "syncing";
    } else {
        icon = <CheckIcon className="w-4 h-4" />;
        text = "All changes synced";
        tone = "synced";
    }

    const toneClasses = {
        offline: darkMode
            ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
            : "bg-amber-50 border-amber-300 text-amber-700",
        syncing: darkMode
            ? "bg-slate-800 border-slate-700 text-slate-200"
            : "bg-white border-slate-200 text-slate-700",
        synced: darkMode
            ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
            : "bg-emerald-50 border-emerald-300 text-emerald-700"
    };

    return (
        <div
            className="fixed top-3 inset-x-0 z-[75] flex justify-center px-4 pointer-events-none"
            style={{ animation: "fadeSlideUp 0.3s ease-out" }}
        >
            <div
                className={`pointer-events-auto flex items-center gap-2 rounded-full border shadow-lg px-4 py-2 text-xs font-semibold backdrop-blur ${toneClasses[tone]}`}
                role="status"
                aria-live="polite"
            >
                {icon}
                <span>{text}</span>
            </div>
        </div>
    );
};

export default OfflineBanner;
