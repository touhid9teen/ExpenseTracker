import { useEffect, useState, useRef } from "react";
import { LockIcon, EyeIcon, EyeOffIcon } from "../../../common/Icons";
import Button from "../../../common/Button";

const inputClass =
  "cyber-input w-full px-1 py-3.5 text-sm text-slate-800 placeholder-slate-400 border-b-2 border-slate-200 focus:border-b-violet-400 focus:shadow-[0_12px_20px_-16px_rgba(139,92,246,0.45)]";

/**
 * CodeStep – step 2 of password recovery: enter the emailed reset code and
 * choose a new password (with show/hide toggle on the new-password field).
 */
const CodeStep = ({
  resetCode,
  setResetCode,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  devToken,
  devMode,
  isLoading,
  onResetPassword,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef(null);

  // Autofocus shortly after the step mounts (matches the original modal).
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <h3 className="text-xl font-bold text-slate-900 mb-2">Reset Password</h3>
      <p className="text-sm text-slate-500 mb-6">
        Enter the reset code sent to your email and create a new password.
      </p>
      <form onSubmit={onResetPassword}>
        {/* Code input */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-slate-500 mb-1.5 ml-1">
            Reset Code
          </label>
          <input
            ref={inputRef}
            type="text"
            value={resetCode}
            onChange={(e) => setResetCode(e.target.value)}
            placeholder={devToken ? `Dev code: ${devToken}` : "Enter reset code"}
            className={inputClass}
          />
          {devMode && (
            <p className="text-xs text-violet-500/80 mt-1.5 ml-1">
              ⚡ Dev mode: code is <span className="font-mono font-bold text-violet-600">{devToken}</span>
            </p>
          )}
        </div>

        {/* New password */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-slate-500 mb-1.5 ml-1">
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
              className="cyber-input w-full pl-9 pr-12 py-3.5 text-sm text-slate-800 placeholder-slate-400 border-b-2 border-slate-200 focus:border-b-violet-400 focus:shadow-[0_12px_20px_-16px_rgba(139,92,246,0.45)]"
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
          <label className="block text-xs font-medium text-slate-500 mb-1.5 ml-1">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            autoComplete="new-password"
            className={inputClass}
          />
        </div>

        <Button type="submit" loading={isLoading} icon={<LockIcon className="w-4 h-4" strokeWidth={2.5} />}>
          Reset Password
        </Button>
      </form>
    </>
  );
};

export default CodeStep;
