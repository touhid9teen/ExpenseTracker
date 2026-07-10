"use client";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { XIcon, CheckIcon, ArrowRightIcon, LockIcon } from "../common/Icons";
import Button from "../common/Button";

const STEPS = {
  USERNAME: 1,
  QUESTION: 2,
  RESET: 3,
  DONE: 4,
};

const ForgotPasswordModal = ({ onClose }) => {
  const [step, setStep] = useState(STEPS.USERNAME);
  const [username, setUsername] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, [step]);

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Please enter your username");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/auth/recover?username=${encodeURIComponent(username.trim())}`
      );
      const data = await res.json();
      if (res.ok) {
        setQuestion(data.question);
        setStep(STEPS.QUESTION);
      } else {
        toast.error(data.error || "User not found");
      }
    } catch {
      toast.error("Failed to look up account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!answer.trim()) {
      toast.error("Please answer the security question");
      return;
    }
    if (!newPassword.trim()) {
      toast.error("Please enter a new password");
      return;
    }
    if (newPassword.length < 3) {
      toast.error("Password must be at least 3 characters");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          answer: answer.trim(),
          newPassword: newPassword.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep(STEPS.DONE);
        toast.success("Password reset successfully!");
      } else {
        toast.error(data.error || "Failed to reset password");
      }
    } catch {
      toast.error("Failed to reset password");
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

          {/* Step 1: Enter username */}
          {step === STEPS.USERNAME && (
            <>
              <h3 className="text-xl font-bold text-white mb-2">
                Forgot Password?
              </h3>
              <p className="text-sm text-slate-400 mb-6">
                Enter your username to look up your account.
              </p>
              <form onSubmit={handleLookup}>
                <input
                  ref={inputRef}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border-2 border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                />
                <div className="mt-5">
                  <Button
                    type="submit"
                    loading={isLoading}
                    icon={
                      <ArrowRightIcon className="w-4 h-4" strokeWidth={2.5} />
                    }
                  >
                    Look up
                  </Button>
                </div>
              </form>
            </>
          )}

          {/* Step 2: Answer security question */}
          {step === STEPS.QUESTION && (
            <>
              <h3 className="text-xl font-bold text-white mb-2">
                Security Question
              </h3>
              <p className="text-sm text-slate-400 mb-6">
                Answer the question below to reset your password.
              </p>
              <form onSubmit={handleReset}>
                <div className="mb-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <p className="text-sm text-slate-300 font-medium">
                    {question}
                  </p>
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Your answer"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border-2 border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 mb-3"
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border-2 border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                />
                <div className="mt-5">
                  <Button
                    type="submit"
                    loading={isLoading}
                    icon={<LockIcon className="w-4 h-4" strokeWidth={2.5} />}
                  >
                    Reset Password
                  </Button>
                </div>
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
                Your password has been updated. You can now sign in with your
                new password.
              </p>
              <Button onClick={onClose}>Sign In</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
