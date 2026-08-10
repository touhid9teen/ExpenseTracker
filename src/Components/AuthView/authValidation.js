import { getPasswordStrength } from "../../utils/passwordStrength";

/**
 * Validation helpers shared by the login and register forms.
 * Each error helper returns a user-facing message string, or "" when valid.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email) => EMAIL_REGEX.test(email);

// ── Login ──

export const getLoginError = (username, password) => {
  if (!username.trim()) return "Please enter your username";
  if (!password) return "Please enter your password";
  return "";
};

export const isLoginValid = (username, password) =>
  Boolean(username.trim() && password);

// ── Register ──

/** Field-level error shown after a field is touched. */
export const getUsernameError = (mode, username) =>
  mode === "register" && username.trim() && username.trim().length < 3
    ? "Username must be at least 3 characters"
    : "";

export const getEmailError = (email) =>
  email.trim() && !validateEmail(email.trim())
    ? "Enter a valid email address"
    : "";

export const getConfirmError = (password, confirmPassword) =>
  confirmPassword && password !== confirmPassword
    ? "Passwords do not match"
    : "";

/** First failing rule on submit, or "" when the form is valid. */
export const getRegisterError = ({
  username,
  email,
  password,
  confirmPassword,
  agreeTerms,
}) => {
  const name = username.trim();
  const mail = email.trim();

  if (!name) return "Please enter a username";
  if (name.length < 3) return "Username must be at least 3 characters";
  if (!mail) return "Please enter your email";
  if (!validateEmail(mail)) return "Please enter a valid email address";
  if (!password) return "Please enter a password";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password))
    return "Password must include at least one uppercase letter";
  if (!/[a-z]/.test(password))
    return "Password must include at least one lowercase letter";
  if (!/\d/.test(password))
    return "Password must include at least one number";
  if (password !== confirmPassword) return "Passwords do not match";
  if (!agreeTerms) return "Please accept the privacy policy & terms";
  return "";
};

export const isRegisterValid = ({
  username,
  email,
  password,
  confirmPassword,
  agreeTerms,
}) =>
  username.trim().length >= 3 &&
  validateEmail(email.trim()) &&
  getPasswordStrength(password).score >= 2 &&
  password.length >= 8 &&
  password === confirmPassword &&
  agreeTerms;
