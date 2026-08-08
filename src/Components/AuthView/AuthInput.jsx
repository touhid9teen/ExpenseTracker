"use client";
import { useId, useState } from 'react';
import { EyeIcon, EyeOffIcon, CheckIcon, WarningTriangleIcon } from '../common/Icons';

/**
 * AuthInput – boxed form field matching the sign-in mockup: small dark
 * label, light gray rounded input with a thin border, optional icon on the
 * left and a password visibility toggle on the right.
 */
const AuthInput = ({
  label,
  icon: Icon,
  inputRef,
  type = 'text',
  isPassword = false,
  showPassword = false,
  onToggleShow,
  showSuccessIcon = false,
  error = '',
  hint = '',
  detectCapsLock = false,
  ...inputProps
}) => {
  const reactId = useId();
  const errorId = `${reactId}-error`;
  const hintId = `${reactId}-hint`;
  const [capsOn, setCapsOn] = useState(false);

  const hasError = Boolean(error);
  const describedBy = [hasError ? errorId : null, hint ? hintId : null]
    .filter(Boolean)
    .join(' ') || undefined;

  const handleKey = (e) => {
    if (detectCapsLock && typeof e.getModifierState === 'function') {
      setCapsOn(e.getModifierState('CapsLock'));
    }
  };

  const boxClass = hasError
    ? 'bg-red-50/60 border-red-300 focus:border-red-400 focus:ring-red-500/10'
    : 'bg-white border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/15';

  // Left side shows a success/error badge, or the (optional) field icon.
  // The badge renders even without an icon so success/error stays visible.
  const showBadge = showSuccessIcon || hasError;

  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1.5">
        {label}
      </label>
      <div className="relative">
        {(Icon || showBadge) && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            {showSuccessIcon ? (
              <CheckIcon className="w-4 h-4 text-emerald-500" strokeWidth={3} />
            ) : hasError ? (
              <WarningTriangleIcon className="w-4 h-4 text-red-400" />
            ) : (
              <Icon className="w-4 h-4 text-slate-400" />
            )}
          </div>
        )}
        <input
          ref={inputRef}
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          onKeyUp={detectCapsLock ? handleKey : undefined}
          onKeyDown={detectCapsLock ? handleKey : undefined}
          className={`w-full ${Icon || showBadge ? 'pl-10' : 'pl-3.5'} ${
            isPassword ? 'pr-11' : 'pr-3.5'
          } py-3 rounded-lg border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 disabled:opacity-50 ${boxClass}`}
          {...inputProps}
        />
        {isPassword && inputProps.value && (
          <button
            type="button"
            onClick={onToggleShow}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            {showPassword ? (
              <EyeOffIcon className="w-4 h-4" />
            ) : (
              <EyeIcon className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {hasError ? (
        <p id={errorId} role="alert" className="mt-1.5 ml-1 text-xs text-red-500">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-1.5 ml-1 text-xs text-slate-400">
          {hint}
        </p>
      ) : null}

      {detectCapsLock && capsOn && !hasError && (
        <p className="mt-1.5 ml-1 text-xs text-indigo-600 flex items-center gap-1">
          <WarningTriangleIcon className="w-3 h-3" />
          Caps Lock is on
        </p>
      )}
    </div>
  );
};

export default AuthInput;
