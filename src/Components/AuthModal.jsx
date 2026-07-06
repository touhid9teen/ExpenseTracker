"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FinVueLogoIcon, ArrowRightIcon, ChevronLeftIcon, CheckIcon, EyeIcon, EyeOffIcon, LogInIcon } from './Icons';
import Button from './Button';

const AuthModal = ({ setUser }) => {
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [animating, setAnimating] = useState(false);
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    useEffect(() => {
        setMounted(true);
        setTimeout(() => usernameRef.current?.focus(), 600);
    }, []);

    useEffect(() => {
        if (step === 2) {
            setTimeout(() => passwordRef.current?.focus(), 400);
        }
    }, [step]);

    const handleUsernameSubmit = (e) => {
        e.preventDefault();
        if (!username.trim()) {
            toast.error('Please enter your username');
            return;
        }
        setAnimating(true);
        setTimeout(() => {
            setStep(2);
            setAnimating(false);
        }, 300);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!password) {
            toast.error('Please enter your password');
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
                toast.success('Welcome back!');
                setUser(data.user);
            } else {
                toast.error(data.error || 'Login failed');
                setIsLoading(false);
            }
        } catch (err) {
            toast.error('An error occurred during login');
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        setAnimating(true);
        setTimeout(() => {
            setStep(1);
            setPassword('');
            setShowPassword(false);
            setAnimating(false);
            setTimeout(() => usernameRef.current?.focus(), 100);
        }, 300);
    };

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
                        <p className="mt-2 text-sm text-slate-400">
                            {step === 1 ? 'Enter your username to get started' : `Welcome back, ${username}`}
                        </p>
                    </div>

                    {/* Step 1: Username */}
                    <div className={`transition-all duration-300 ${step === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute inset-x-8 sm:inset-x-10 pointer-events-none'}`}>
                        <form onSubmit={handleUsernameSubmit} className={step === 1 ? '' : 'hidden'}>
                            <div className="relative">
                                <input
                                    ref={usernameRef}
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    autoComplete="username"
                                    className="w-full px-4 py-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-slate-700 transition-all duration-200 text-base"
                                />
                            </div>

                            <div className="mt-5">
                                <Button
                                    type="submit"
                                    icon={<ArrowRightIcon className="w-4 h-4" strokeWidth={2.5} />}
                                >
                                    Continue
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Step 2: Password */}
                    <div className={`transition-all duration-300 ${step === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute inset-x-8 sm:inset-x-10 pointer-events-none'}`}>
                        <form onSubmit={handleLogin} className={step === 2 ? '' : 'hidden'}>
                            {/* Username display */}
                            <div className="flex items-center gap-2 mb-5 px-1">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="text-slate-400 hover:text-white transition-colors p-1 -ml-1"
                                >
                                    <ChevronLeftIcon className="w-5 h-5" />
                                </button>
                                <div className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-1.5">
                                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center">
                                        <CheckIcon className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-sm text-slate-300">{username}</span>
                                </div>
                            </div>

                            <div className="relative">
                                <input
                                    ref={passwordRef}
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    className="w-full px-4 py-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-slate-700 transition-all duration-200 text-base pr-12"
                                />
                                {password && (
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                                    >
                                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                    </button>
                                )}
                            </div>

                            <div className="mt-5">
                                <Button
                                    type="submit"
                                    loading={isLoading}
                                    icon={<LogInIcon className="w-5 h-5" strokeWidth={2.5} />}
                                >
                                    Sign In
                                </Button>
                            </div>
                        </form>
                    </div>

                    <p className="text-center mt-6 text-xs text-slate-500">
                        {step === 1
                            ? "If the username doesn't exist, a new account will be created automatically."
                            : "New here? Enter any password to create your account."
                        }
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
