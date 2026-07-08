"use client";
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import Background from './Background';
import Header from './Header';
import UsernameStep from './UsernameStep';
import PasswordStep from './PasswordStep';
import SecurityQuestionStep from './SecurityQuestionStep';
import Footer from './Footer';
import SuccessModal from './SuccessModal';
import ForgotPasswordModal from './ForgotPasswordModal';

const SECURITY_QUESTIONS = [
  'What is your mother\'s maiden name?',
  'What was the name of your first pet?',
  'What city were you born in?',
];

const AuthView = ({ setUser }) => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isExistingUser, setIsExistingUser] = useState(null); // null = not checked, true/false
  const [securityQuestion, setSecurityQuestion] = useState(SECURITY_QUESTIONS[0]);
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [customQuestion, setCustomQuestion] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const answerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    setTimeout(() => usernameRef.current?.focus(), 600);
  }, []);

  useEffect(() => {
    if (step === 2) setTimeout(() => passwordRef.current?.focus(), 400);
    if (step === 3) setTimeout(() => answerRef.current?.focus(), 400);
  }, [step]);

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error('Please enter your username');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/auth/check?username=${encodeURIComponent(username.trim())}`);
      const data = await res.json();

      if (res.ok) {
        setIsExistingUser(data.exists);
        setStep(2);
        setTimeout(() => passwordRef.current?.focus(), 400);
      } else {
        toast.error(data.error || 'Failed to check username');
      }
    } catch {
      toast.error('Failed to check username');
    } finally {
      setIsLoading(false);
    }
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
          setStep(3);
        } else {
          toast.success('Welcome back!');
          setUser(data.user);
        }
      } else {
        toast.error(data.error || 'Login failed');
      }
    } catch {
      toast.error('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSecurityQuestion = async () => {
    const question = useCustom ? customQuestion.trim() : securityQuestion;
    const answer = securityAnswer.trim();

    if (!question) {
      toast.error('Please select or enter a security question');
      return;
    }
    if (!answer) {
      toast.error('Please enter an answer to your security question');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          securityQuestion: question,
          securityAnswer: answer,
        }),
      });

      if (res.ok) {
        setShowSuccess(true);
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to save security question');
      }
    } catch {
      toast.error('Failed to save security question');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipSecurityQuestion = () => {
    setShowSuccess(true);
  };

  const handleContinue = () => {
    setShowSuccess(false);
    if (pendingUser) {
      setUser(pendingUser);
    }
  };

  const handleBack = () => {
    if (step === 3) {
      setStep(2);
    } else {
      setStep(1);
      setPassword('');
      setIsExistingUser(null);
      setTimeout(() => usernameRef.current?.focus(), 100);
    }
  };

  return (
    <>
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <Background />
        <div className={`relative w-full max-w-md transform transition-all duration-500 ${mounted ? 'translate-y-0 scale-100' : 'translate-y-8 scale-[0.97]'}`}>
          <div className="relative rounded-2xl p-8 sm:p-10 bg-slate-900/90 border border-slate-800/80 shadow-[0_0_60px_rgba(0,0,0,0.6)] transition-all duration-300">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
            <Header step={step} isExistingUser={isExistingUser} />
            <div className="pt-8">
              <UsernameStep
                ref={usernameRef}
                username={username}
                setUsername={setUsername}
                onSubmit={handleUsernameSubmit}
                visible={step === 1}
                isLoading={isLoading}
              />
              <PasswordStep
                ref={passwordRef}
                password={password}
                setPassword={setPassword}
                onSubmit={handleLogin}
                onBack={handleBack}
                username={username}
                visible={step === 2}
                isLoading={isLoading && step === 2}
                isExistingUser={isExistingUser}
                onForgotPassword={() => setShowForgotPassword(true)}
              />
              {!isExistingUser && (
                <SecurityQuestionStep
                  ref={answerRef}
                  visible={step === 3}
                  question={securityQuestion}
                  setQuestion={setSecurityQuestion}
                  answer={securityAnswer}
                  setAnswer={setSecurityAnswer}
                  customQuestion={customQuestion}
                  setCustomQuestion={setCustomQuestion}
                  useCustom={useCustom}
                  setUseCustom={setUseCustom}
                  questions={SECURITY_QUESTIONS}
                  onSave={handleSaveSecurityQuestion}
                  onSkip={handleSkipSecurityQuestion}
                  onBack={handleBack}
                  isLoading={isLoading}
                />
              )}
              <Footer />
            </div>
          </div>
        </div>
      </div>
      {showSuccess && (
        <SuccessModal username={username} onContinue={handleContinue} />
      )}
      {showForgotPassword && (
        <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />
      )}
    </>
  );
};

export default AuthView;
