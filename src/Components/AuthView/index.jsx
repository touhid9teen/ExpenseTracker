"use client";
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import Background from './Background';
import Header from './Header';
import UsernameStep from './UsernameStep';
import PasswordStep from './PasswordStep';
import Footer from './Footer';
import SuccessModal from './SuccessModal';

const AuthView = ({ setUser }) => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    setTimeout(() => usernameRef.current?.focus(), 600);
  }, []);

  useEffect(() => {
    if (step === 2) setTimeout(() => passwordRef.current?.focus(), 400);
  }, [step]);

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error('Please enter your username');
      return;
    }
    setAnimating(true);
    setTimeout(() => { setStep(2); setAnimating(false); }, 300);
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
        if (data.isNewUser) {
          setPendingUser(data.user);
          setShowSuccess(true);
          setIsLoading(false);
        } else {
          toast.success('Welcome back!');
          setUser(data.user);
        }
      } else {
        toast.error(data.error || 'Login failed');
        setIsLoading(false);
      }
    } catch {
      toast.error('An error occurred during login');
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    setShowSuccess(false);
    if (pendingUser) {
      setUser(pendingUser);
    }
  };

  const handleBack = () => {
    setAnimating(true);
    setTimeout(() => {
      setStep(1);
      setPassword('');
      setAnimating(false);
      setTimeout(() => usernameRef.current?.focus(), 100);
    }, 300);
  };

  return (
    <>
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <Background />
        <div className={`relative w-full max-w-md transform transition-all duration-500 ${mounted ? 'translate-y-0 scale-100' : 'translate-y-8 scale-[0.97]'}`}>
          <div className="relative rounded-2xl p-8 sm:p-10 bg-slate-900/90 border border-slate-800/80 shadow-[0_0_60px_rgba(0,0,0,0.6)] transition-all duration-300">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
            <Header step={step} />
            <div className="pt-8">
              <UsernameStep
                ref={usernameRef}
                username={username}
                setUsername={setUsername}
                onSubmit={handleUsernameSubmit}
                visible={step === 1}
              />
              <PasswordStep
                ref={passwordRef}
                password={password}
                setPassword={setPassword}
                onSubmit={handleLogin}
                onBack={handleBack}
                username={username}
                visible={step === 2}
                isLoading={isLoading}
              />
              <Footer />
            </div>
          </div>
        </div>
      </div>
      {showSuccess && (
        <SuccessModal username={username} onContinue={handleContinue} />
      )}
    </>
  );
};

export default AuthView;
