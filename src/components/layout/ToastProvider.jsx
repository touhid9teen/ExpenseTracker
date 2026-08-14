import { Toaster } from "react-hot-toast";

/**
 * ToastProvider – global toast notifications (react-hot-toast), styled to the
 * app's primary violet palette.
 *
 * Timing is tuned per type for a professional feel:
 *  - success toasts flash briefly (2.5s) — just a confirmation
 *  - default/info toasts get a comfortable 3s read
 *  - error toasts stay longer (5s) so the message can actually be read
 *  - loading toasts persist until resolved
 */
const ToastProvider = ({ darkMode }) => {
  return (
    <Toaster
      position="top-center"
      containerStyle={{ zIndex: 99999 }}
      toastOptions={{
        duration: 3000,
        style: {
          background: darkMode ? "#111a30" : "#ffffff",
          color: darkMode ? "#f1f5f9" : "#1e293b",
          border: darkMode ? "1px solid #7c3aed" : "1px solid #ddd6fe",
          boxShadow: darkMode
            ? "0 10px 30px -5px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(139, 92, 246, 0.18)"
            : "0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(139, 92, 246, 0.10)",
          padding: "12px 16px",
          fontSize: "14px",
          fontWeight: "500",
          borderRadius: "12px",
        },
        success: {
          duration: 2500,
          iconTheme: {
            primary: "#8b5cf6",
            secondary: "#fff",
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: "#f43f5e",
            secondary: "#fff",
          },
        },
      }}
    />
  );
};

export default ToastProvider;
