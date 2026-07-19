"use client";
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import Background from './Background';
import Header from './Header';
import Footer from './Footer';
import SuccessModal from './SuccessModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import AuthInput from './AuthInput';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import Button from '../common/Button';
import { getPasswordStrength } from '../../utils/passwordStrength';
import {
  ArrowRightIcon,
  LogInIcon,
  MailIcon,
  UserIcon,
  LockIcon,
} from '../common/Icons';

const AuthView = ({ setUser }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const usernameRef = useRef(null);

  const markTouched = (field) => setTouched((prev) => ({ ...prev, [field]: true }));

  useEffect(() => {
    setMounted(true);
    setTimeout(() => usernameRef.current?.focus(), 600);
  }, []);

  useEffect(() => {
    setTimeout(() => usernameRef.current?.focus(), 300);
  }, [mode]);

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setTouched({});
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // ─── Derived, per-field validation ───
  const trimmedUsername = username.trim();
  const trimmedEmail = email.trim();

  const usernameError =
    mode === 'register' && trimmedUsername && trimmedUsername.length < 3
      ? 'Username must be at least 3 characters'
      : '';
  const emailError =
    trimmedEmail && !validateEmail(trimmedEmail)
      ? 'Enter a valid email address'
      : '';
  const confirmError =
    confirmPassword && password !== confirmPassword
      ? 'Passwords do not match'
      : '';

  const isLoginValid = Boolean(trimmedUsername && password);
  const isRegisterValid =
    trimmedUsername.length >= 3 &&
    validateEmail(trimmedEmail) &&
    getPasswordStrength(password).score >= 2 &&
    password === confirmPassword;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error('Please enter your username');
      return;
    }
    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Welcome back!');
        setUser(data.user);
      } else {
        toast.error(data.error || 'Login failed');
      }
    } catch {
      toast.error('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error('Please enter a username');
      return;
    }
    if (username.trim().length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    if (!validateEmail(email.trim())) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!password) {
      toast.error('Please enter a password');
      return;
    }
    if (password.length < 3) {
      toast.error('Password must be at least 3 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        toast.error(data.error || 'Registration failed');
      }
    } catch {
      toast.error('An error occurred during registration');
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

  return (
    <>
      <div
        className={`fixed inset-0 z-50 overflow-y-auto transition-opacity duration-700 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="fixed inset-0">
          <Background />
        </div>
        <div className="relative min-h-full flex items-center justify-center p-3 py-6 sm:p-4 sm:py-8">
          <div
            className={`relative w-full max-w-[26rem] transform transition-all duration-500 ${
              mounted ? 'translate-y-0 scale-100' : 'translate-y-8 scale-[0.97]'
            }`}
          >
            <div className="relative rounded-2xl p-5 sm:p-8 bg-slate-900/90 border border-slate-800/80 shadow-[0_0_60px_rgba(0,0,0,0.6)] transition-all duration-300">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
              <Header mode={mode} />

              {/* Mode toggle pills */}
              <div className="flex mt-5 sm:mt-6 bg-slate-800/60 rounded-xl p-1 border border-slate-700/50">
                <button
                  type="button"
                  onClick={() => mode !== 'login' && toggleMode()}
                  className={`flex-1 py-2 sm:py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    mode === 'login'
                      ? 'bg-emerald-500/20 text-emerald-300 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => mode !== 'register' && toggleMode()}
                  className={`flex-1 py-2 sm:py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    mode === 'register'
                      ? 'bg-emerald-500/20 text-emerald-300 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <div className="pt-4 sm:pt-5">
                {/* ─── Login Form ─── */}
                {mode === 'login' && (
                  <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
                    <AuthInput
                      label="Username"
                      icon={UserIcon}
                      inputRef={usernameRef}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Your username"
                      autoComplete="username"
                      disabled={isLoading}
                    />

                    <AuthInput
                      label="Password"
                      icon={LockIcon}
                      isPassword
                      detectCapsLock
                      showPassword={showPassword}
                      onToggleShow={() => setShowPassword(!showPassword)}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your password"
                      autoComplete="current-password"
                      disabled={isLoading}
                    />

                    {/* Forgot password link */}
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="block text-xs text-slate-500 hover:text-emerald-400 transition-colors ml-1"
                    >
                      Forgot password?
                    </button>

                    <div className="pt-1 sm:pt-2">
                      <Button
                        type="submit"
                        loading={isLoading}
                        disabled={!isLoginValid}
                        icon={<LogInIcon className="w-5 h-5" strokeWidth={2.5} />}
                      >
                        {isLoading ? 'Signing in…' : 'Sign In'}
                      </Button>
                    </div>
                  </form>
                )}

                {/* ─── Register Form ─── */}
                {mode === 'register' && (
                  <form onSubmit={handleRegister} className="space-y-3 sm:space-y-4">
                    <AuthInput
                      label="Username"
                      icon={UserIcon}
                      inputRef={usernameRef}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onBlur={() => markTouched('username')}
                      error={touched.username ? usernameError : ''}
                      placeholder="Choose a username"
                      autoComplete="username"
                      disabled={isLoading}
                    />

                    <AuthInput
                      label="Email"
                      icon={MailIcon}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => markTouched('email')}
                      error={touched.email ? emailError : ''}
                      placeholder="your@email.com"
                      autoComplete="email"
                      disabled={isLoading}
                    />

                    <div>
                      <AuthInput
                        label="Password"
                        icon={LockIcon}
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
                      icon={LockIcon}
                      isPassword
                      detectCapsLock
                      showPassword={showConfirmPassword}
                      onToggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
                      showSuccessIcon={Boolean(confirmPassword) && password === confirmPassword}
                      error={touched.confirmPassword ? confirmError : ''}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => markTouched('confirmPassword')}
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      disabled={isLoading}
                    />

                    <div className="pt-1 sm:pt-2">
                      <Button
                        type="submit"
                        loading={isLoading}
                        disabled={!isRegisterValid}
                        icon={<ArrowRightIcon className="w-4 h-4" strokeWidth={2.5} />}
                      >
                        {isLoading ? 'Creating account…' : 'Create Account'}
                      </Button>
                    </div>
                  </form>
                )}

                <Footer />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSuccess && createdUser && (
        <SuccessModal username={createdUser.username} onContinue={handleContinue} />
      )}

      {showForgotPassword && (
        <ForgotPasswordModal
          onClose={() => setShowForgotPassword(false)}
          onLoginAfterReset={(username) => {
            setShowForgotPassword(false);
            setMode('login');
            setUsername(username || '');
            setPassword('');
          }}
        />
      )}
    </>
  );
};

export default AuthView;
