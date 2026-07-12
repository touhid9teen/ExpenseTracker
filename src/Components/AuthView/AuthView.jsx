"use client";
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import Background from './Background';
import Header from './Header';
import Footer from './Footer';
import SuccessModal from './SuccessModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import Button from '../common/Button';
import {
  ArrowRightIcon,
  LogInIcon,
  EyeIcon,
  EyeOffIcon,
  MailIcon,
  UserIcon,
  LockIcon,
  CheckIcon,
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
  const usernameRef = useRef(null);

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
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

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
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden transition-opacity duration-700 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Background />
        <div
          className={`relative w-full max-w-md transform transition-all duration-500 ${
            mounted ? 'translate-y-0 scale-100' : 'translate-y-8 scale-[0.97]'
          }`}
        >
          <div className="relative rounded-2xl p-8 sm:p-10 bg-slate-900/90 border border-slate-800/80 shadow-[0_0_60px_rgba(0,0,0,0.6)] transition-all duration-300">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
            <Header mode={mode} />

            {/* Mode toggle pills */}
            <div className="flex mt-8 bg-slate-800/60 rounded-xl p-1 border border-slate-700/50">
              <button
                type="button"
                onClick={() => mode !== 'login' && toggleMode()}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
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
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  mode === 'register'
                    ? 'bg-emerald-500/20 text-emerald-300 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign Up
              </button>
            </div>

            <div className="pt-6">
              {/* ─── Login Form ─── */}
              {mode === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <UserIcon className="w-4 h-4 text-slate-500" />
                      </div>
                      <input
                        ref={usernameRef}
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Your username"
                        autoComplete="username"
                        disabled={isLoading}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-800 border-2 border-slate-600/50 text-white placeholder-slate-400 hover:border-slate-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-slate-700/80 transition-all duration-200 text-sm disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <LockIcon className="w-4 h-4 text-slate-500" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Your password"
                        autoComplete="current-password"
                        disabled={isLoading}
                        className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-slate-800 border-2 border-slate-600/50 text-white placeholder-slate-400 hover:border-slate-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-slate-700/80 transition-all duration-200 text-sm disabled:opacity-50"
                      />
                      {password && (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
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

                  {/* Forgot password link */}
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="block text-xs text-slate-500 hover:text-emerald-400 transition-colors ml-1"
                  >
                    Forgot password?
                  </button>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      loading={isLoading}
                      icon={<LogInIcon className="w-5 h-5" strokeWidth={2.5} />}
                    >
                      Sign In
                    </Button>
                  </div>
                </form>
              )}

              {/* ─── Register Form ─── */}
              {mode === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <UserIcon className="w-4 h-4 text-slate-500" />
                      </div>
                      <input
                        ref={usernameRef}
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Choose a username"
                        autoComplete="username"
                        disabled={isLoading}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-800 border-2 border-slate-600/50 text-white placeholder-slate-400 hover:border-slate-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-slate-700/80 transition-all duration-200 text-sm disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MailIcon className="w-4 h-4 text-slate-500" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        autoComplete="email"
                        disabled={isLoading}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-800 border-2 border-slate-600/50 text-white placeholder-slate-400 hover:border-slate-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-slate-700/80 transition-all duration-200 text-sm disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <LockIcon className="w-4 h-4 text-slate-500" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password"
                        autoComplete="new-password"
                        disabled={isLoading}
                        className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-slate-800 border-2 border-slate-600/50 text-white placeholder-slate-400 hover:border-slate-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-slate-700/80 transition-all duration-200 text-sm disabled:opacity-50"
                      />
                      {password && (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
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

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        {confirmPassword && password === confirmPassword ? (
                          <CheckIcon className="w-4 h-4 text-emerald-400" strokeWidth={3} />
                        ) : (
                          <LockIcon className="w-4 h-4 text-slate-500" />
                        )}
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                        disabled={isLoading}
                        className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-slate-800 border-2 border-slate-600/50 text-white placeholder-slate-400 hover:border-slate-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-slate-700/80 transition-all duration-200 text-sm disabled:opacity-50"
                      />
                      {confirmPassword && (
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                        >
                          {showConfirmPassword ? (
                            <EyeOffIcon className="w-4 h-4" />
                          ) : (
                            <EyeIcon className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      loading={isLoading}
                      icon={<ArrowRightIcon className="w-4 h-4" strokeWidth={2.5} />}
                    >
                      Create Account
                    </Button>
                  </div>
                </form>
              )}

              <Footer />
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
