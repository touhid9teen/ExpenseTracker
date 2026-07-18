"use client";
import { EyeIcon, EyeOffIcon, CheckIcon } from '../common/Icons';

const AuthInput = ({
  label,
  icon: Icon,
  inputRef,
  type = 'text',
  isPassword = false,
  showPassword = false,
  onToggleShow,
  showSuccessIcon = false,
  ...inputProps
}) => (
  <div>
    <label className="block text-xs font-medium text-slate-400 mb-1 ml-1">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        {showSuccessIcon ? (
          <CheckIcon className="w-4 h-4 text-emerald-400" strokeWidth={3} />
        ) : (
          <Icon className="w-4 h-4 text-slate-500" />
        )}
      </div>
      <input
        ref={inputRef}
        type={isPassword ? (showPassword ? 'text' : 'password') : type}
        className={`w-full pl-11 ${isPassword ? 'pr-12' : 'pr-4'} py-2.5 sm:py-3 rounded-xl bg-slate-800 border-2 border-slate-600/50 text-white placeholder-slate-400 hover:border-slate-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-slate-700/80 transition-all duration-200 text-sm disabled:opacity-50`}
        {...inputProps}
      />
      {isPassword && inputProps.value && (
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
        >
          {showPassword ? (
            <EyeOffIcon className="w-4 h-4" />
          ) : (
            <EyeIcon className="w-4 h-4" />
          )}
        </button>
      )}
    </div>
  </div>
);

export default AuthInput;
