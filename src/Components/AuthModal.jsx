import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FinVueLogoIcon, SpinnerIcon } from './Icons';

const AuthModal = ({ setUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username.trim() || !password) {
            toast.error('Username and password are required');
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username.trim(), password })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                toast.success('Successfully logged in!');
                setUser(data.user);
            } else {
                toast.error(data.error || 'Login failed');
            }
        } catch (err) {
            toast.error('An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    const isFloating = (field) => focusedField === field || (field === 'username' ? username : password);

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            {/* Animated gradient orbs background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
            </div>

            <div className="absolute inset-0 auth-pattern" />
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

            {/* Card */}
            <div className={`relative w-full max-w-md transform transition-all duration-500 ${mounted ? 'translate-y-0 scale-100' : 'translate-y-8 scale-[0.97]'}`}>
                <div className="relative rounded-2xl p-8 sm:p-10 bg-slate-900/90 border border-slate-800/80 shadow-2xl shadow-black/40 transition-all duration-300">
                    {/* Glow top edge */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="relative w-16 h-16 mx-auto mb-5">
                            <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-xl animate-pulse" style={{ animationDuration: '3s' }} />
                            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <FinVueLogoIcon className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Welcome to FinVue</h2>
                        <p className="mt-2 text-sm text-slate-400">Enter your username and password to access your ledger</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Username */}
                        <div className="relative">
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onFocus={() => setFocusedField('username')}
                                onBlur={() => setFocusedField(null)}
                                onChange={(e) => setUsername(e.target.value)}
                                className="relative w-full px-4 pt-6 pb-2 rounded-xl bg-slate-800 border text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-slate-700 transition-all duration-200 peer"
                                style={{ borderColor: focusedField === 'username' ? 'rgb(52, 211, 153)' : 'rgb(51, 65, 85)' }}
                            />
                            <label
                                htmlFor="username"
                                onClick={() => document.getElementById('username')?.focus()}
                                className={`absolute left-4 cursor-text transition-all duration-200 select-none ${
                                    isFloating('username')
                                        ? 'top-1.5 text-xs text-slate-300'
                                        : 'top-3.5 text-sm text-slate-400'
                                }`}
                            >
                                Username
                            </label>
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onFocus={() => setFocusedField('password')}
                                onBlur={() => setFocusedField(null)}
                                onChange={(e) => setPassword(e.target.value)}
                                className="relative w-full px-4 pt-6 pb-2 rounded-xl bg-slate-800 border text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-slate-700 transition-all duration-200 peer"
                                style={{ borderColor: focusedField === 'password' ? 'rgb(52, 211, 153)' : 'rgb(51, 65, 85)' }}
                            />
                            <label
                                htmlFor="password"
                                onClick={() => document.getElementById('password')?.focus()}
                                className={`absolute left-4 cursor-text transition-all duration-200 select-none ${
                                    isFloating('password')
                                        ? 'top-1.5 text-xs text-slate-300'
                                        : 'top-3.5 text-sm text-slate-400'
                                }`}
                            >
                                Password
                            </label>
                            {/* Toggle password visibility */}
                            {password && (
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="relative w-full py-3.5 px-4 rounded-xl font-bold text-white overflow-hidden group transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.98]"
                        >
                            <div className={`absolute inset-0 transition-opacity duration-300 ${
                                isLoading
                                    ? 'bg-emerald-500/70'
                                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:from-emerald-400 group-hover:to-teal-400'
                            }`} />
                            {!isLoading && (
                                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            )}
                            {!isLoading && (
                                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            )}
                            <span className="relative flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30">
                                {isLoading ? (
                                    <>
                                        <SpinnerIcon className="w-5 h-5" />
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                        <span>Enter Your Ledger</span>
                                    </>
                                )}
                            </span>
                        </button>
                    </form>

                    <p className="text-center mt-6 text-xs text-slate-500">
                        If the username doesn't exist, a new account will be created automatically.
                    </p>
                    <p className="text-center mt-4 text-[10px]">
                        <Link href="/terms" className="hover:underline transition-colors text-slate-500 hover:text-emerald-400">
                            Terms &amp; Conditions
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
