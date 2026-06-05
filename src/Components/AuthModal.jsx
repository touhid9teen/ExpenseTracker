import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FinVueLogoIcon, SpinnerIcon } from './Icons';

const AuthModal = ({ setUser, darkMode }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username.trim() || !password) {
            toast.error('Username and password are required');
            return;
        }

        setIsLoading(true);
        setError('');

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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className={`w-full max-w-md rounded-2xl p-8 shadow-2xl ${darkMode ? 'bg-slate-900 border border-slate-800 shadow-black/40' : 'bg-white border border-slate-200 shadow-slate-200/40'}`}>
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <FinVueLogoIcon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className={`text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Welcome to FinVue</h2>
                    <p className={`mt-2 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Enter your username and password to access your ledger</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="username" className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                                darkMode 
                                ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:bg-slate-700' 
                                : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white border'
                            }`}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                                darkMode 
                                ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:bg-slate-700' 
                                : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white border'
                            }`}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3.5 px-4 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center ${
                            isLoading 
                            ? 'bg-emerald-500/70 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-emerald-500/30'
                        }`}
                    >
                        {isLoading ? (
                            <SpinnerIcon className="-ml-1 mr-3 h-5 w-5 text-white" />
                        ) : 'Enter Your Ledger'}
                    </button>
                </form>
                
                <p className={`text-center mt-6 text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    If the username doesn't exist, a new account will be created automatically.
                </p>
            </div>
        </div>
    );
};

export default AuthModal;
