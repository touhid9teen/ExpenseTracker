"use client";
import {
  ClipboardListIcon,
  ChartPieIcon,
  SparklesIcon,
  ShieldCheckIcon,
} from "../ui/Icons";
import { features, manualSteps } from "./aboutData";

const AboutView = ({ darkMode, setActiveTab }) => {
  const heading = darkMode ? "text-white" : "text-slate-900";
  const muted = darkMode ? "text-slate-400" : "text-slate-500";
  const ghostBtn = darkMode
    ? "bg-slate-900 border-slate-700/70 text-slate-200 hover:border-violet-500/50 hover:text-violet-300"
    : "bg-white border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600";

  const card = darkMode
    ? "bg-slate-900 border-slate-700/70 hover:border-violet-500/50 hover:shadow-violet-500/10"
    : "bg-white border-slate-200 hover:border-violet-300 hover:shadow-violet-500/10";

  return (
    <div className="space-y-3 animate-fadeIn pb-8">
      {/* ── Header (matches the other section flow) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${heading}`}>
            About FinVue
          </h1>
          <p className={`text-xs mt-0.5 ${muted}`}>
            Your intelligent expense control center
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab("ledger")}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition-all duration-200 active:scale-95 ${ghostBtn}`}
          >
            <ClipboardListIcon className="w-4 h-4" strokeWidth={2.25} />
            Ledger
          </button>
          <button
            onClick={() => setActiveTab("statistics")}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 shadow-lg shadow-violet-500/30 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
          >
            <ChartPieIcon className="w-4 h-4" strokeWidth={2.25} />
            Analytics
          </button>
        </div>
      </div>

      {/* ── Intro panel ── */}
      <div className={`rounded-2xl border p-5 sm:p-6 ${card}`}>
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white shrink-0">
            <SparklesIcon className="w-6 h-6" strokeWidth={2.25} />
          </div>
          <div>
            <h2 className={`text-lg font-bold tracking-tight ${heading}`}>
              Track. Analyze. Take control.
            </h2>
            <p className={`mt-1.5 text-sm leading-relaxed ${muted}`}>
              FinVue combines a powerful transaction manager with AI-driven
              assistance to help you track, analyze, and take control of your
              finances — effortlessly.
            </p>
          </div>
        </div>
        <div className={`mt-4 pt-4 border-t flex flex-wrap items-center gap-2 ${darkMode ? "border-slate-800" : "border-slate-100"}`}>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-500"}`}>
            <SparklesIcon className="w-3 h-3 text-violet-400" strokeWidth={2.5} />
            AI-powered
          </span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-500"}`}>
            <ClipboardListIcon className="w-3 h-3 text-sky-400" strokeWidth={2.5} />
            Transaction Ledger
          </span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-500"}`}>
            <ShieldCheckIcon className="w-3 h-3 text-emerald-400" strokeWidth={2.5} />
            Secure &amp; Offline-first
          </span>
        </div>
      </div>

      {/* ── Key Features ── */}
      <div className="space-y-3 pt-2">
        <h2 className={`text-base sm:text-lg font-extrabold tracking-tight ${heading}`}>
          Key Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group rounded-2xl border p-4 sm:p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${card}`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                  darkMode ? "bg-violet-500/15 text-violet-300" : "bg-violet-100 text-violet-600"
                }`}
              >
                {feature.icon}
              </div>
              <h3 className={`text-sm sm:text-base font-bold ${heading}`}>{feature.title}</h3>
              <p className={`mt-1 text-xs sm:text-sm leading-relaxed ${muted}`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── How to Use ── */}
      <div className="space-y-3 pt-2">
        <h2 className={`text-base sm:text-lg font-extrabold tracking-tight ${heading}`}>
          How to Use
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {manualSteps.map((step) => (
            <div
              key={step.step}
              className={`rounded-2xl border p-4 sm:p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${card}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    darkMode ? "bg-violet-500/15 text-violet-300" : "bg-violet-100 text-violet-600"
                  }`}
                >
                  {step.icon}
                </div>
                <span className={`text-2xl font-black ${darkMode ? "text-slate-700" : "text-slate-200"}`}>
                  {step.step}
                </span>
              </div>
              <h3 className={`text-sm font-bold ${heading}`}>{step.title}</h3>
              <p className={`mt-1 text-xs leading-relaxed ${muted}`}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      {/* <div className={`text-center pt-6 pb-2 border-t ${darkMode ? "border-slate-800" : "border-slate-200"}`}>
        <p className={`text-xs sm:text-sm ${muted}`}>
          Built with Next.js, Tailwind CSS, and Neon PostgreSQL.
        </p>
        <p className={`text-xs mt-1 ${darkMode ? "text-slate-600" : "text-slate-400"}`}>
          &copy; {new Date().getFullYear()} FinVue. All rights reserved.
        </p>
      </div> */}
    </div>
  );
};

export default AboutView;
