"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { XIcon } from "../../../common/Icons";
import EmailStep from "./EmailStep";
import CodeStep from "./CodeStep";
import DoneStep from "./DoneStep";

const STEPS = {
  EMAIL: 1,
  CODE: 2,
  DONE: 3,
};

/**
 * ForgotPasswordModal – three-step password recovery flow:
 *   1. EmailStep – request a reset code
 *   2. CodeStep  – verify the code and set a new password
 *   3. DoneStep  – success + sign-in
 *
 * Step bodies live in the sibling step components; this file owns the
 * step state and the API calls.
 */
const ForgotPasswordModal = ({ onClose, onLoginAfterReset }) => {
  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [devToken, setDevToken] = useState("");
  const [devMode, setDevMode] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.devMode && data.devToken) {
          setDevToken(data.devToken);
          setDevMode(true);
        }
        setStep(STEPS.CODE);
        toast.success("Reset code sent! Check your email.");
      } else {
        toast.error(data.error || "Failed to send reset code");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const code = resetCode.trim() || devToken;
    if (!code) {
      toast.error("Please enter the reset code");
      return;
    }
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    if (newPassword.length < 3) {
      toast.error("Password must be at least 3 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/recover", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          token: code,
          newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStep(STEPS.DONE);
        toast.success("Password reset successfully!");
      } else {
        toast.error(data.error || "Failed to reset password");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const stepProps = { email, setEmail, isLoading };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={onClose} />
      <div className="relative w-full max-w-sm transition-all duration-300">
        <div className="relative rounded-2xl p-6 sm:p-8 bg-white border border-slate-200 shadow-2xl">
          <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 opacity-70 pointer-events-none" />
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors p-1"
          >
            <XIcon className="w-5 h-5" />
          </button>

          {step === STEPS.EMAIL && (
            <EmailStep {...stepProps} onSendCode={handleSendCode} />
          )}

          {step === STEPS.CODE && (
            <CodeStep
              {...stepProps}
              resetCode={resetCode}
              setResetCode={setResetCode}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              devToken={devToken}
              devMode={devMode}
              onResetPassword={handleResetPassword}
            />
          )}

          {step === STEPS.DONE && (
            <DoneStep
              onSignIn={() => {
                if (onLoginAfterReset) {
                  onLoginAfterReset("");
                } else {
                  onClose();
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
