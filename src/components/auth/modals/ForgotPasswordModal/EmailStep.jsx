import { useEffect, useRef } from "react";
import { MailIcon } from "../../../ui/Icons";
import Button from "../../../ui/Button";

/**
 * EmailStep – step 1 of password recovery: enter the account email and
 * request a reset code.
 */
const EmailStep = ({ email, setEmail, isLoading, onSendCode }) => {
  const inputRef = useRef(null);

  // Autofocus shortly after the step mounts (matches the original modal).
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <h3 className="text-xl font-bold text-slate-900 mb-2">Forgot Password?</h3>
      <p className="text-sm text-slate-500 mb-6">
        Enter your email address and we&apos;ll send you a reset code.
      </p>
      <form onSubmit={onSendCode}>
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
            className="cyber-input w-full pl-9 pr-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 border-b-2 border-slate-200 focus:border-b-violet-400 focus:shadow-[0_12px_20px_-16px_rgba(139,92,246,0.45)]"
          />
        </div>
        <div className="mt-5">
          <Button type="submit" loading={isLoading} icon={<MailIcon className="w-4 h-4" strokeWidth={2.5} />}>
            Send Reset Code
          </Button>
        </div>
      </form>
    </>
  );
};

export default EmailStep;
