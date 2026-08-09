"use client";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import Header, { LogoMark } from "./Header";
import OrnamentalDivider from "./OrnamentalDivider";
import Footer from "./Footer";
import SuccessModal from "./SuccessModal";
import ForgotPasswordModal from "./ForgotPasswordModal";
import AuthInput from "./AuthInput";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import SocialButtons from "./SocialButtons";
import Button from "../common/Button";
// Retina 2× upscale of the original illustration (see scripts: sharp lanczos3).
import loginArt from "../../assets/login-view.jpg";
import { getPasswordStrength } from "../../utils/passwordStrength";
import { ArrowRightIcon, LogInIcon, XIcon, CheckIcon } from "../common/Icons";

/**
 * FinVue login page — matches the sign-in mockup: a white split layout with
 * the dashboard image on the left (FinVue logo in the top-left corner only)
 * and the centered white sign-in / sign-up form on the right. The logo mark
 * is intentionally NOT repeated inside the form card.
 */
const AuthView = ({ setUser, onClose }) => {
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const usernameRef = useRef(null);

  const markTouched = (field) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  useEffect(() => {
    const timer = setTimeout(() => usernameRef.current?.focus(), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setTimeout(() => usernameRef.current?.focus(), 300);
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setTouched({});
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // ─── Derived, per-field validation ───
  const trimmedUsername = username.trim();
  const trimmedEmail = email.trim();

  const usernameError =
    mode === "register" && trimmedUsername && trimmedUsername.length < 3
      ? "Username must be at least 3 characters"
      : "";
  const emailError =
    trimmedEmail && !validateEmail(trimmedEmail)
      ? "Enter a valid email address"
      : "";
  const confirmError =
    confirmPassword && password !== confirmPassword
      ? "Passwords do not match"
      : "";

  const isLoginValid = Boolean(trimmedUsername && password);
  const isRegisterValid =
    trimmedUsername.length >= 3 &&
    validateEmail(trimmedEmail) &&
    getPasswordStrength(password).score >= 2 &&
    password.length >= 8 &&
    password === confirmPassword &&
    agreeTerms;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Please enter your username");
      return;
    }
    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Welcome back!");
        setUser(data.user);
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch {
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }
    if (username.trim().length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    if (!validateEmail(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!password) {
      toast.error("Please enter a password");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error("Password must include at least one uppercase letter");
      return;
    }
    if (!/[a-z]/.test(password)) {
      toast.error("Password must include at least one lowercase letter");
      return;
    }
    if (!/\d/.test(password)) {
      toast.error("Password must include at least one number");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!agreeTerms) {
      toast.error("Please accept the privacy policy & terms");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCreatedUser(data.user);
        setShowSuccess(true);
      } else {
        toast.error(data.error || "Registration failed");
      }
    } catch {
      toast.error("An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    setShowSuccess(false);
    if (createdUser) {
      // Log the user in after successful registration (JWT already set by API)
      setUser(createdUser);
    }
  };

  const checkboxClass = (checked) =>
    `w-4 h-4 rounded border flex items-center justify-center transition-colors duration-200 ${
      checked
        ? "bg-violet-400 border-violet-400"
        : "bg-white border-slate-300 hover:border-violet-300"
    }`;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-white lg:bg-[#F5F4FB]">
        {/* Centered shell — constrains the split into a single elevated card
            so the image and the form sit close together in the middle of the
            viewport instead of hugging the far edges (desktop only). */}
        <div className="relative min-h-full lg:flex lg:items-center lg:justify-center lg:p-6 xl:p-10">
          <div className="relative w-full lg:grid lg:grid-cols-2 lg:max-w-5xl lg:overflow-hidden lg:rounded-3xl lg:bg-white lg:ring-1 lg:ring-slate-900/5 lg:shadow-[0_24px_80px_-24px_rgba(76,29,149,0.25)]">
          {/* Mobile brand bar (back button is in-flow so it never overlaps
              the logo) */}
          <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 bg-white/90 backdrop-blur px-4 py-3 border-b border-slate-100">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 hover:border-violet-300 hover:text-violet-600"
              >
                <XIcon className="w-3.5 h-3.5" />
                Back
              </button>
            )}
            <LogoMark />
            <span className="text-lg font-extrabold tracking-tight text-[#0F172A]">
              FinVue
            </span>
          </div>

          {/* ── Left: dashboard image with the logo in the top-left corner
                 only (desktop). object-contain keeps the full illustration
                 visible and responsive at every screen size — no cropping. ── */}
          <section className="relative hidden lg:block lg:h-full lg:min-h-[480px] overflow-hidden bg-white">
            <Image
              src={loginArt}
              alt="FinVue dashboard illustration"
              priority
              quality={100}
              sizes="(min-width: 1280px) 50vw, (min-width: 1024px) 50vw, 100vw"
              fill
              className="object-contain select-none pointer-events-none"
            />

            {/* FinVue logo — top-left corner only (no border/pill) */}
            <div className="absolute top-8 left-8 z-10 inline-flex items-center gap-3">
              <LogoMark />
              <span className="text-xl font-extrabold tracking-tight text-[#0F172A] drop-shadow-sm">
                FinVue
              </span>
            </div>

            {/* Back-to-app button (guest browsing mode) — top-right, in-flow
                so it never floats over the brand mark */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="absolute top-8 right-8 z-10 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 bg-white/90 border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600 backdrop-blur"
              >
                <XIcon className="w-4 h-4" />
                Back to app
              </button>
            )}
          </section>

          {/* ── Divider line — a very thin straight vertical line separating
                 the dashboard image from the sign-in form, light purple
                 (desktop only). Height is ~half the form content, centered. ── */}
          {/* <div className="hidden lg:block absolute top-[5%] bottom-[5%] left-1/2 -translate-x-1/2 z-10 w-16 pointer-events-none select-none">
            <OrnamentalDivider className="h-full w-full text-violet-400 drop-shadow-[0_0_18px_rgba(167,139,250,0.45)]" />
          </div> */}

          {/* ── Right: centered white sign-in / sign-up card ── */}
          <section className="flex items-center justify-center bg-white px-4 sm:px-8 py-10">
            <div className="w-full max-w-md">
              <Header mode={mode} />

              <div className="mt-8">
                {/* ─── Login Form ─── */}
                {mode === "login" && (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <AuthInput
                      label="Username"
                      inputRef={usernameRef}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      autoComplete="username"
                      disabled={isLoading}
                    />

                    <AuthInput
                      label="Password"
                      isPassword
                      detectCapsLock
                      showPassword={showPassword}
                      onToggleShow={() => setShowPassword(!showPassword)}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={isLoading}
                    />

                    {/* Remember me + forgot password */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={rememberMe}
                          onClick={() => setRememberMe((v) => !v)}
                          className={checkboxClass(rememberMe)}
                        >
                          {rememberMe && (
                            <CheckIcon
                              className="w-3 h-3 text-white"
                              strokeWidth={3.5}
                            />
                          )}
                        </button>
                        Remember Me
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-xs font-semibold text-violet-500 hover:text-violet-600 transition-colors"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <div className="pt-1">
                      <Button
                        type="submit"
                        variant="lightPurple"
                        cyber={false}
                        loading={isLoading}
                        disabled={!isLoginValid}
                        icon={
                          <LogInIcon className="w-5 h-5" strokeWidth={2.5} />
                        }
                      >
                        {isLoading ? "Signing in…" : "Login"}
                      </Button>
                    </div>

                    <p className="text-center text-sm text-slate-500">
                      Don&apos;t have an account?{" "}
                      <button
                        type="button"
                        onClick={() => mode !== "register" && toggleMode()}
                        className="font-bold text-violet-500 hover:text-violet-600 transition-colors"
                      >
                        Sign up here
                      </button>
                    </p>

                    {/* Divider */}
                    <div className="flex items-center gap-3 py-1">
                      <span className="flex-1 border-t border-slate-200" />
                      <span className="text-xs text-slate-400 font-medium">
                        Or Continue With
                      </span>
                      <span className="flex-1 border-t border-slate-200" />
                    </div>

                    <SocialButtons
                      disabled={isLoading}
                      text="Login with Google"
                    />
                  </form>
                )}

                {/* ─── Register Form ─── */}
                {mode === "register" && (
                  <form onSubmit={handleRegister} className="space-y-4">
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
                      onToggleShow={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      showSuccessIcon={
                        Boolean(confirmPassword) && password === confirmPassword
                      }
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
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={agreeTerms}
                        onClick={() => setAgreeTerms((v) => !v)}
                        className={`mt-px ${checkboxClass(agreeTerms)}`}
                      >
                        {agreeTerms && (
                          <CheckIcon
                            className="w-3 h-3 text-white"
                            strokeWidth={3.5}
                          />
                        )}
                      </button>
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
                        icon={
                          <ArrowRightIcon
                            className="w-4 h-4"
                            strokeWidth={2.5}
                          />
                        }
                      >
                        {isLoading ? "Creating account…" : "Sign up"}
                      </Button>
                    </div>

                    <p className="text-center text-sm text-slate-500">
                      Have an account?{" "}
                      <button
                        type="button"
                        onClick={() => mode !== "login" && toggleMode()}
                        className="font-bold text-violet-500 hover:text-violet-600 transition-colors"
                      >
                        Sign in here
                      </button>
                    </p>

                    {/* Divider */}
                    <div className="flex items-center gap-3 py-1">
                      <span className="flex-1 border-t border-slate-200" />
                      <span className="text-xs text-slate-400 font-medium">
                        Or Continue With
                      </span>
                      <span className="flex-1 border-t border-slate-200" />
                    </div>

                    <SocialButtons
                      disabled={isLoading}
                      text="Sign up with Google"
                    />
                  </form>
                )}
              </div>

              <Footer />
            </div>
          </section>
          </div>
        </div>
      </div>

      {showSuccess && createdUser && (
        <SuccessModal
          username={createdUser.username}
          onContinue={handleContinue}
        />
      )}

      {showForgotPassword && (
        <ForgotPasswordModal
          onClose={() => setShowForgotPassword(false)}
          onLoginAfterReset={(username) => {
            setShowForgotPassword(false);
            setMode("login");
            setUsername(username || "");
            setPassword("");
          }}
        />
      )}
    </>
  );
};

export default AuthView;
