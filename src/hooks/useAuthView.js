import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  getConfirmError,
  getEmailError,
  getLoginError,
  getRegisterError,
  getUsernameError,
  isLoginValid,
  isRegisterValid,
} from "../components/auth/authValidation";

/**
 * useAuthView – owns every piece of auth state (fields, mode, loading,
 * modals, touched flags) plus the submit handlers, so AuthView.jsx stays a
 * thin composition of presentational components. Colocated with the view,
 * following the useAdminPagination pattern in AdminView/.
 */
const useAuthView = ({ setUser }) => {
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

  // Focus the username field on mount and whenever the mode switches.
  useEffect(() => {
    const timer = setTimeout(() => usernameRef.current?.focus(), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setTimeout(() => usernameRef.current?.focus(), 300);
  }, [mode]);

  // ─── Derived validation (see authValidation.js) ───
  const loginForm = {
    username,
    password,
    showPassword,
    rememberMe,
    isLoading,
    isLoginValid: isLoginValid(username, password),
  };

  const registerForm = {
    username,
    email,
    password,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    agreeTerms,
    touched,
    usernameError: getUsernameError(mode, username),
    emailError: getEmailError(email),
    confirmError: getConfirmError(password, confirmPassword),
    isLoading,
    isRegisterValid: isRegisterValid({
      username,
      email,
      password,
      confirmPassword,
      agreeTerms,
    }),
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setTouched({});
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const error = getLoginError(username, password);
    if (error) {
      toast.error(error);
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

    const error = getRegisterError({
      username,
      email,
      password,
      confirmPassword,
      agreeTerms,
    });
    if (error) {
      toast.error(error);
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

  const handleLoginAfterReset = (username) => {
    setShowForgotPassword(false);
    setMode("login");
    setUsername(username || "");
    setPassword("");
  };

  return {
    mode,
    showSuccess,
    createdUser,
    showForgotPassword,
    loginForm,
    registerForm,
    usernameRef,
    setUsername,
    setEmail,
    setPassword,
    setConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    setAgreeTerms,
    setRememberMe,
    markTouched,
    toggleMode,
    handleLogin,
    handleRegister,
    handleContinue,
    openForgotPassword: () => setShowForgotPassword(true),
    closeForgotPassword: () => setShowForgotPassword(false),
    handleLoginAfterReset,
  };
};

export default useAuthView;
