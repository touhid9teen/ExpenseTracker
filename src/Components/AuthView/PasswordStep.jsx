import { forwardRef, useState } from "react";
import {
  ChevronLeftIcon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  LogInIcon,
} from "../common/Icons";
import Button from "../common/Button";

const PasswordStep = (
  {
    password,
    setPassword,
    onSubmit,
    onBack,
    username,
    visible,
    isLoading,
    isExistingUser,
    onForgotPassword,
  },
  ref
) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className={`transition-all duration-300 ${
        visible
          ? "opacity-100 scale-100"
          : "opacity-0 scale-95 absolute inset-x-8 sm:inset-x-10 pointer-events-none"
      }`}
    >
      <form onSubmit={onSubmit} className={visible ? "" : "hidden"}>
        <div className="flex items-center gap-2 mb-5 px-1">
          <button
            type="button"
            onClick={onBack}
            className="text-slate-400 hover:text-white transition-colors p-1 -ml-1"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-1.5">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center">
              <CheckIcon className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm text-slate-300">{username}</span>
          </div>
        </div>

        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            className="w-full px-5 py-4 rounded-xl bg-slate-800 border-2 border-slate-500/50 text-white placeholder-slate-300 hover:border-slate-400/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-slate-700/80 transition-all duration-200 text-base pr-12"
          />
          {password && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          )}
        </div>

        {isExistingUser ? (
          <button
            type="button"
            onClick={onForgotPassword}
            className="block mx-auto mt-3 text-xs text-slate-500 hover:text-emerald-400 transition-colors"
          >
            Forgot password?
          </button>
        ) : (
          <p className="mt-3 text-xs text-slate-500 text-center leading-relaxed px-2">
            Remember this password — you&apos;ll need it to sign in later.
          </p>
        )}

        <div className="mt-3">
          <Button
            type="submit"
            loading={isLoading}
            icon={<LogInIcon className="w-5 h-5" strokeWidth={2.5} />}
          >
            Sign In
          </Button>
        </div>
      </form>
    </div>
  );
};

export default forwardRef(PasswordStep);
