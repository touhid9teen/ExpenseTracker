"use client";
import Button from "../../common/Button";
import { LogInIcon } from "../../common/Icons";
import AuthCheckbox from "./AuthCheckbox";
import AuthInput from "./AuthInput";
import OrDivider from "./OrDivider";
import SocialButtons from "./SocialButtons";

/**
 * LoginForm – the sign-in form: username + password, "Remember Me",
 * "Forgot Password?" link, submit button and social sign-in.
 *
 * All field values come grouped in a single `form` object; setters are the
 * parent's own state setters so the form stays fully controlled.
 */
const LoginForm = ({
  form: {
    username,
    password,
    showPassword,
    rememberMe,
    isLoading,
    isLoginValid,
  },
  usernameRef,
  setUsername,
  setPassword,
  setShowPassword,
  setRememberMe,
  onForgotPassword,
  onSwitchToRegister,
  onSubmit,
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
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
        <AuthCheckbox checked={rememberMe} onChange={setRememberMe} />
        Remember Me
      </label>
      <button
        type="button"
        onClick={onForgotPassword}
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
        icon={<LogInIcon className="w-5 h-5" strokeWidth={2.5} />}
      >
        {isLoading ? "Signing in…" : "Login"}
      </Button>
    </div>

    <p className="text-center text-sm text-slate-500">
      Don&apos;t have an account?{" "}
      <button
        type="button"
        onClick={onSwitchToRegister}
        className="font-bold text-violet-500 hover:text-violet-600 transition-colors"
      >
        Sign up here
      </button>
    </p>

    <OrDivider />

    <SocialButtons disabled={isLoading} text="Login with Google" />
  </form>
);

export default LoginForm;
