"use client";
import { useId, useState } from 'react';
import { EyeIcon, EyeOffIcon, CheckIcon, WarningTriangleIcon } from '../common/Icons';

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

  const borderClass = hasError
    ? 'border-red-400 focus:ring-red-200 focus:border-red-400'
    : 'border-slate-200 hover:border-slate-300 focus:ring-amber-200 focus:border-amber-400';

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {showSuccessIcon ? (
            <CheckIcon className="w-4 h-4 text-emerald-500" strokeWidth={3} />
          ) : hasError ? (
            <WarningTriangleIcon className="w-4 h-4 text-red-400" />
          ) : (
            <Icon className="w-4 h-4 text-slate-400" />
          )}
        </div>
        <input
          ref={inputRef}
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          onKeyUp={detectCapsLock ? handleKey : undefined}
          onKeyDown={detectCapsLock ? handleKey : undefined}
          className={`w-full pl-11 ${isPassword ? 'pr-12' : 'pr-4'} py-3 rounded-xl bg-slate-50 border-2 ${borderClass} text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:bg-white transition-all duration-200 text-sm disabled:opacity-50`}
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
        <p id={errorId} role="alert" className="mt-1 ml-1 text-xs text-red-500">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-1 ml-1 text-xs text-slate-400">
          {hint}
        </p>
      ) : null}

      {detectCapsLock && capsOn && !hasError && (
        <p className="mt-1 ml-1 text-xs text-amber-600 flex items-center gap-1">
          <WarningTriangleIcon className="w-3 h-3" />
          Caps Lock is on
        </p>
      )}
    </div>
  );
};

export default AuthInput;
