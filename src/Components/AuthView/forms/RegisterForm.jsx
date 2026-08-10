"use client";
import Link from "next/link";
import Button from "../../common/Button";
import { ArrowRightIcon } from "../../common/Icons";
import AuthCheckbox from "./AuthCheckbox";
import AuthInput from "./AuthInput";
import OrDivider from "./OrDivider";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import SocialButtons from "./SocialButtons";

/**
 * RegisterForm – the sign-up form: username, email, password (with strength
 * meter), confirm password, terms agreement, submit button and social sign-in.
 *
 * All field values come grouped in a single `form` object; setters are the
 * parent's own state setters so the form stays fully controlled.
 */
const RegisterForm = ({
  form: {
    username,
    email,
    password,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    agreeTerms,
    touched,
    usernameError,
    emailError,
    confirmError,
    isLoading,
    isRegisterValid,
  },
  usernameRef,
  setUsername,
  setEmail,
  setPassword,
  setConfirmPassword,
  setShowPassword,
  setShowConfirmPassword,
  setAgreeTerms,
  markTouched,
  onSwitchToLogin,
  onSubmit,
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <AuthInput
      label="Username"
      inputRef={usernameRef}
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      onBlur={() => markTouched("username")}
      error={touched.username ? usernameError : ""}
      placeholder="Choose a username"
      autoComplete="username"
      disabled={isLoading}
    />

    <AuthInput
      label="Email Address"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      onBlur={() => markTouched("email")}
      error={touched.email ? emailError : ""}
      placeholder="info@example.com"
      autoComplete="email"
      disabled={isLoading}
    />

    <div>
      <AuthInput
        label="Password"
        isPassword
        detectCapsLock
        showPassword={showPassword}
        onToggleShow={() => setShowPassword(!showPassword)}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Create a password"
        autoComplete="new-password"
        disabled={isLoading}
      />
      <PasswordStrengthMeter password={password} />
    </div>

    <AuthInput
      label="Confirm Password"
      isPassword
      detectCapsLock
      showPassword={showConfirmPassword}
      onToggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
      showSuccessIcon={Boolean(confirmPassword) && password === confirmPassword}
      error={touched.confirmPassword ? confirmError : ""}
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      onBlur={() => markTouched("confirmPassword")}
      placeholder="Confirm your password"
      autoComplete="new-password"
      disabled={isLoading}
    />

    {/* Terms agreement */}
    <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer select-none pt-0.5">
      <AuthCheckbox checked={agreeTerms} onChange={setAgreeTerms} className="mt-px" />
      <span>
        I agree to{" "}
        <Link
          href="/terms"
          className="text-violet-500 hover:text-violet-600 underline underline-offset-2 transition-colors"
        >
          privacy policy &amp; terms
        </Link>
      </span>
    </label>

    <div className="pt-1">
      <Button
        type="submit"
        variant="lightPurple"
        cyber={false}
        loading={isLoading}
        disabled={!isRegisterValid}
        icon={<ArrowRightIcon className="w-4 h-4" strokeWidth={2.5} />}
      >
        {isLoading ? "Creating account…" : "Sign up"}
      </Button>
    </div>

    <p className="text-center text-sm text-slate-500">
      Have an account?{" "}
      <button
        type="button"
        onClick={onSwitchToLogin}
        className="font-bold text-violet-500 hover:text-violet-600 transition-colors"
      >
        Sign in here
      </button>
    </p>

    <OrDivider />

    <SocialButtons disabled={isLoading} text="Sign up with Google" />
  </form>
);

export default RegisterForm;
