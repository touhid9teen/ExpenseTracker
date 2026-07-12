"use client";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { XIcon, CheckIcon, ArrowRightIcon, LockIcon, MailIcon, EyeIcon, EyeOffIcon } from "../common/Icons";
import Button from "../common/Button";

const STEPS = {
  EMAIL: 1,
  CODE: 2,
  DONE: 3,
};

const ForgotPasswordModal = ({ onClose, onLoginAfterReset }) => {
  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [devToken, setDevToken] = useState("");
  const [devMode, setDevMode] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, [step]);

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

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm transition-all duration-300">
        <div className="rounded-2xl p-8 bg-slate-900 border border-slate-800/80 shadow-2xl shadow-black/40">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors p-1"
          >
            <XIcon className="w-5 h-5" />
          </button>

          {/* Step 1: Enter email */}
          {step === STEPS.EMAIL && (
            <>
              <h3 className="text-xl font-bold text-white mb-2">
                Forgot Password?
              </h3>
              <p className="text-sm text-slate-400 mb-6">
                Enter your email address and we&apos;ll send you a reset code.
              </p>
              <form onSubmit={handleSendCode}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MailIcon className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    ref={inputRef}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    autoComplete="email"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-800 border-2 border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm"
                  />
                </div>
                <div className="mt-5">
                  <Button
                    type="submit"
                    loading={isLoading}
                    icon={<MailIcon className="w-4 h-4" strokeWidth={2.5} />}
                  >
                    Send Reset Code
                  </Button>
                </div>
              </form>
            </>
          )}

          {/* Step 2: Enter reset code and new password */}
          {step === STEPS.CODE && (
            <>
              <h3 className="text-xl font-bold text-white mb-2">
                Reset Password
              </h3>
              <p className="text-sm text-slate-400 mb-6">
                Enter the reset code sent to your email and create a new password.
              </p>
              <form onSubmit={handleResetPassword}>
                {/* Code input */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">
                    Reset Code
                  </label>
                  <input
                    ref={inputRef}
                    type="text"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder={devToken ? `Dev code: ${devToken}` : "Enter reset code"}
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-800 border-2 border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm"
                  />
                  {devMode && (
                    <p className="text-xs text-emerald-400/70 mt-1.5 ml-1">
                      ⚡ Dev mode: code is <span className="font-mono font-bold text-emerald-300">{devToken}</span>
                    </p>
                  )}
                </div>

                {/* New password */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <LockIcon className="w-4 h-4 text-slate-500" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password"
                      autoComplete="new-password"
                      className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-slate-800 border-2 border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm"
                    />
                    {newPassword && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                      >
                        {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Confirm password */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-800 border-2 border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm"
                  />
                </div>

                <Button
                  type="submit"
                  loading={isLoading}
                  icon={<LockIcon className="w-4 h-4" strokeWidth={2.5} />}
                >
                  Reset Password
                </Button>
              </form>
            </>
          )}

          {/* Step 3: Done */}
          {step === STEPS.DONE && (
            <div className="text-center py-4">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl" />
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center mx-auto">
                  <CheckIcon className="w-8 h-8 text-white" strokeWidth={3} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Password Reset!
              </h3>
              <p className="text-sm text-slate-400 mb-6">
                Your password has been updated successfully. You can now sign in.
              </p>
              <Button
                onClick={() => {
                  if (onLoginAfterReset) {
                    onLoginAfterReset("");
                  } else {
                    onClose();
                  }
                }}
              >
                Sign In
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
