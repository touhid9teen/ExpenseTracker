"use client";
import { CheckIcon } from "../../common/Icons";

/**
 * AuthCheckbox – custom accessible checkbox (a role="checkbox" button) used
 * by the auth forms for "Remember Me" and the terms agreement.
 */
const AuthCheckbox = ({ checked, onChange, className = "" }) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors duration-200 ${
      checked
        ? "bg-violet-400 border-violet-400"
        : "bg-white border-slate-300 hover:border-violet-300"
    } ${className}`}
  >
    {checked && <CheckIcon className="w-3 h-3 text-white" strokeWidth={3.5} />}
  </button>
);

export default AuthCheckbox;
