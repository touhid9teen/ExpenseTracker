// Lightweight password strength estimator for the auth forms.
// Returns a score 0-4 and a human-readable label/color.
// Strength thresholds align with server-side validation (≥8 chars, upper+lower+number).

const LEVELS = [
  { label: 'Too weak', color: 'bg-red-500', text: 'text-red-400' },
  { label: 'Weak', color: 'bg-orange-500', text: 'text-orange-400' },
  { label: 'Fair', color: 'bg-yellow-500', text: 'text-yellow-400' },
  { label: 'Good', color: 'bg-lime-500', text: 'text-lime-400' },
  { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-400' },
];

export const REQUIREMENTS = {
  minLength: 8,
  hasUpper: /[A-Z]/,
  hasLower: /[a-z]/,
  hasNumber: /\d/,
  hasSymbol: /[^A-Za-z0-9]/,
};

export const getPasswordStrength = (password = '') => {
  if (!password) {
    return { score: 0, label: '', color: '', text: '', hint: '', checks: {} };
  }

  const checks = {
    length: password.length >= REQUIREMENTS.minLength,
    lower: REQUIREMENTS.hasLower.test(password),
    upper: REQUIREMENTS.hasUpper.test(password),
    number: REQUIREMENTS.hasNumber.test(password),
    symbol: REQUIREMENTS.hasSymbol.test(password),
  };

  let score = 0;
  if (checks.length) score += 1;
  if (checks.lower && checks.upper) score += 1;
  if (checks.number) score += 1;
  if (checks.symbol) score += 1;

  // Very short passwords are always "too weak" regardless of variety.
  if (password.length < REQUIREMENTS.minLength) score = 0;

  const level = LEVELS[Math.min(score, LEVELS.length - 1)];

  const missing = [];
  if (!checks.length) missing.push(`${REQUIREMENTS.minLength}+ characters`);
  if (!(checks.lower && checks.upper)) missing.push('upper & lower case');
  if (!checks.number) missing.push('a number');
  if (!checks.symbol) missing.push('a symbol');

  const hint = missing.length ? `Add ${missing.join(', ')}` : 'Great password!';

  return { score, ...level, hint, checks };
};

export default getPasswordStrength;
