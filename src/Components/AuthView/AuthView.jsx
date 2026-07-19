"use client";
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Header from './Header';
import Footer from './Footer';
import SuccessModal from './SuccessModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import AuthInput from './AuthInput';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import SocialButtons from './SocialButtons';
import Button from '../common/Button';
import loginArt from '../../assets/login-view.jpg';
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
        className={`fixed inset-0 z-50 overflow-y-auto bg-white transition-opacity duration-700 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="relative min-h-full flex items-center justify-center gap-8 xl:gap-16 px-4 py-6 sm:px-8">
          {/* ─── Illustration ─── */}
          <div
            className={`hidden lg:block w-[22rem] xl:w-[26rem] aspect-[4/3] shrink-0 transition-all duration-700 ${
              mounted ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
            }`}
          >
            <div className="relative w-full h-full">
              <Image
                src={loginArt}
                alt="FinVue expense tracking illustration"
                fill
                priority
                sizes="(max-width: 1024px) 0px, (max-width: 1280px) 22rem, 26rem"
                className="object-contain select-none pointer-events-none"
              />
            </div>
          </div>

          {/* ─── Form ─── */}
          <div className="flex items-center justify-center">
            <div
              className={`relative w-full max-w-md transform transition-all duration-500 ${
                mounted ? 'translate-y-0 scale-100' : 'translate-y-8 scale-[0.97]'
              }`}
            >
              <div className="relative px-2 sm:px-4">
                <Header mode={mode} />

                <div className="pt-4">
                  {/* ─── Login Form ─── */}
                  {mode === 'login' && (
                    <form onSubmit={handleLogin} className="space-y-3">
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
                        className="block text-xs font-medium text-slate-500 hover:text-amber-600 transition-colors ml-1"
                      >
                        Having trouble signing in?
                      </button>

                      <div className="pt-1">
                        <Button
                          type="submit"
                          variant="amber"
                          loading={isLoading}
                          disabled={!isLoginValid}
                          icon={<LogInIcon className="w-5 h-5" strokeWidth={2.5} />}
                        >
                          {isLoading ? 'Signing in…' : 'Sign In'}
                        </Button>
                      </div>

                      {/* Divider */}
                      <div className="flex items-center gap-3 py-1">
                        <span className="h-px flex-1 bg-slate-200" />
                        <span className="text-xs font-medium text-slate-400">Or sign in with</span>
                        <span className="h-px flex-1 bg-slate-200" />
                      </div>

                      <SocialButtons disabled={isLoading} />

                      <p className="text-center text-sm text-slate-500">
                        Don&apos;t have an account?{' '}
                        <button
                          type="button"
                          onClick={() => mode !== 'register' && toggleMode()}
                          className="font-bold text-slate-900 hover:text-amber-600 transition-colors"
                        >
                          Register Now
                        </button>
                      </p>
                    </form>
                  )}

                {/* ─── Register Form ─── */}
                {mode === 'register' && (
                  <form onSubmit={handleRegister} className="space-y-3">
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

                    <div className="pt-1">
                      <Button
                        type="submit"
                        variant="amber"
                        loading={isLoading}
                        disabled={!isRegisterValid}
                        icon={<ArrowRightIcon className="w-4 h-4" strokeWidth={2.5} />}
                      >
                        {isLoading ? 'Creating account…' : 'Create Account'}
                      </Button>
                    </div>

                    <p className="text-center text-sm text-slate-500">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => mode !== 'login' && toggleMode()}
                        className="font-bold text-slate-900 hover:text-amber-600 transition-colors"
                      >
                        Login
                      </button>
                    </p>
                  </form>
                  )}
                </div>

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
