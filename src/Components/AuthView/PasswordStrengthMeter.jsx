"use client";
import { getPasswordStrength } from '../../utils/passwordStrength';

const PasswordStrengthMeter = ({ password = '' }) => {
  if (!password) return null;

  const { score, label, color, text, hint } = getPasswordStrength(password);
  const segments = 4;

  return (
    <div className="mt-2 ml-1" aria-live="polite">
      <div className="flex gap-1.5">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i < score ? color : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
      <div className="mt-1 flex items-center justify-between gap-2">
        <span className={`text-xs font-medium ${text}`}>{label}</span>
        <span className="text-xs text-slate-500 truncate">{hint}</span>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
