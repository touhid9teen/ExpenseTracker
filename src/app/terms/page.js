'use client';

import { useState } from 'react';
import Link from 'next/link';

const TermsPage = () => {
  const [darkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  return (
    <div className={`relative min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
      {/* Ambient aurora backdrop */}
      <div aria-hidden="true" className={`pointer-events-none fixed inset-0 z-0 ${darkMode ? 'aurora-bg' : 'aurora-bg-light'}`}>
        <div className="absolute -top-24 -left-24 w-[30rem] h-[30rem] rounded-full bg-cyan-500/10 blur-[110px] aurora-blob" />
        <div className="absolute -bottom-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-violet-500/10 blur-[110px] aurora-blob" style={{ animationDelay: '-10s' }} />
      </div>
      {/* Header */}
      <header className={`sticky top-0 z-30 border-b-2 backdrop-blur-md ${darkMode ? 'bg-slate-950/90 border-cyan-900/40' : 'bg-white/95 border-cyan-200/60'}`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className={`inline-flex items-center gap-2 text-sm font-bold transition-colors ${darkMode ? 'text-slate-200 hover:text-cyan-400' : 'text-slate-600 hover:text-cyan-600'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to Login
          </Link>
          <span className={`text-sm font-bold ${darkMode ? "text-gradient-aurora" : "text-gradient-aurora-deep"}`}>FinVue</span>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className={`rounded-2xl border p-8 sm:p-10 cyber-3d cyber-inner-edge relative overflow-hidden ${darkMode ? 'bg-slate-900/70 border-slate-800/80' : 'bg-white border-slate-200'}`}>
          <span className="absolute top-0 left-0 w-32 h-[3px] bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500" />
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Terms &amp; Conditions
          </h1>
          <p className={`text-sm mb-8 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Last updated: June 6, 2026
          </p>

          <div className={`space-y-6 leading-relaxed text-sm sm:text-base ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            <section>
              <h2 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>1. Acceptance of Terms</h2>
              <p>
                By accessing or using FinVue (&quot;the Application&quot;), you agree to be bound by these Terms &amp; Conditions. 
                If you do not agree with any part of these terms, you must not use the Application.
              </p>
            </section>

            <section>
              <h2 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>2. Description of Service</h2>
              <p>
                FinVue is a personal expense tracking application that allows users to record, organize, and visualize 
                their financial transactions. The Application is provided for personal, non-commercial use only.
              </p>
            </section>

            <section>
              <h2 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>3. User Responsibilities</h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                <li>You agree to provide accurate and complete information when using the Application.</li>
                <li>You are solely responsible for all activity that occurs under your account.</li>
                <li>You must not use the Application for any unlawful purpose or in violation of any applicable laws.</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>4. Data &amp; Privacy</h2>
              <p>
                Your financial data is stored securely and is only accessible to you. We do not share, sell, or 
                distribute your personal information to third parties. By using the Application, you consent to 
                the storage and processing of your data as described. For full details, please refer to our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>5. Limitation of Liability</h2>
              <p>
                FinVue is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind, either 
                express or implied. We shall not be liable for any direct, indirect, incidental, or consequential 
                damages arising from your use of the Application.
              </p>
            </section>

            <section>
              <h2 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>6. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms &amp; Conditions at any time. Changes will be effective 
                immediately upon posting. Your continued use of the Application after any modifications constitutes 
                acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>7. Contact</h2>
              <p>
                If you have any questions about these Terms &amp; Conditions, please contact the application 
                administrator.
              </p>
            </section>
          </div>

          <div className={`mt-10 pt-6 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white cyber-btn-accent hover:from-cyan-600 hover:to-sky-600 transition-all shadow-lg shadow-cyan-500/20"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Back to Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsPage;
