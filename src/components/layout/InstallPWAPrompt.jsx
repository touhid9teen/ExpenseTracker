"use client";
import { useEffect } from "react";

const DISMISS_KEY = "finvue-pwa-dismissed";

/**
 * InstallPWAPrompt – silently triggers the browser's native PWA install dialog
 * as soon as the `beforeinstallprompt` event fires. No banner or alert is shown.
 */
const InstallPWAPrompt = () => {
  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    if (standalone) return;

    if (localStorage.getItem(DISMISS_KEY) === "1") return;

    const handler = (e) => {
      e.preventDefault();
      e.prompt();
      e.userChoice.then(() => {
        localStorage.setItem(DISMISS_KEY, "1");
      });
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  return null;
};

export default InstallPWAPrompt;
