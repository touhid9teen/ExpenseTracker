import { Toaster } from "react-hot-toast";

const ToastProvider = ({ darkMode }) => {
  return (
    <Toaster
      position="top-center"
      containerStyle={{ zIndex: 99999 }}
      toastOptions={{
        duration: 5000,
        style: {
          background: darkMode ? "#111a30" : "#ffffff",
          color: darkMode ? "#f1f5f9" : "#1e293b",
          border: darkMode ? "1px solid #1d4ed8" : "1px solid #a5f3fc",
          boxShadow: darkMode
            ? "0 10px 30px -5px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(34, 211, 238, 0.12)"
            : "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
          padding: "12px 16px",
          fontSize: "14px",
          fontWeight: "500",
          borderRadius: "10px",
        },
        success: {
          iconTheme: {
            primary: "#10b981",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
        },
      }}
    />
  );
};

export default ToastProvider;
