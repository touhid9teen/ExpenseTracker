"use client";
import {
  ClipboardListIcon,
  ChartPieIcon,
  ChatBubbleIcon,
  BookGuideIcon,
  SparklesIcon,
} from "../common/Icons";
import { features, manualSteps, chatExamples } from "./aboutData";

const AboutView = ({ darkMode, setActiveTab }) => {
  return (
    <div className="space-y-8 sm:space-y-12 animate-fadeIn pb-8">
      {/* ── Hero Section ── */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl">
        {/* Background gradient */}
        <div
          className={`absolute inset-0 ${
            darkMode
              ? "bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-900"
              : "bg-gradient-to-br from-amber-50 via-orange-50 to-white"
          }`}
        />

        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl" />

        <div className="relative px-6 sm:px-10 lg:px-16 py-10 sm:py-16 lg:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-6 bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Version 1.0.0
            </div>
            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Welcome to{" "}
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                FinVue
              </span>
            </h1>
            <p
              className={`mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl ${
                darkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Your intelligent expense control center. FinVue combines a
              powerful transaction manager with AI-driven assistance to help you
              track, analyze, and take control of your finances — effortlessly.
            </p>
            <div className="flex flex-wrap gap-3 mt-6 sm:mt-8">
              <button
                onClick={() => setActiveTab("ledger")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <ClipboardListIcon className="w-4 h-4" strokeWidth={2.5} />
                Go to Ledger
              </button>
              <button
                onClick={() => setActiveTab("statistics")}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm border transition-all duration-200 ${
                  darkMode
                    ? "border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                    : "border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <ChartPieIcon className="w-4 h-4" strokeWidth={2.5} />
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Key Features Section ── */}
      <div>
        <div className="text-center mb-8 sm:mb-10">
          <h2
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Key Features
          </h2>
          <p
            className={`mt-2 text-sm sm:text-base ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Everything you need to manage your expenses in one place
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative p-5 sm:p-6 rounded-xl sm:rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
                darkMode
                  ? "bg-slate-800/50 border-slate-700/60 hover:border-amber-500/30 hover:bg-slate-800/80"
                  : "bg-white border-slate-300 hover:border-amber-400/30 hover:shadow-lg hover:shadow-amber-500/5"
              }`}
            >
              {/* Top accent line */}
              <div
                className={`absolute inset-x-0 top-0 h-0.5 rounded-t-xl sm:rounded-t-2xl bg-gradient-to-r from-amber-500 to-orange-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
              />

              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
                  darkMode
                    ? "bg-amber-500/10 text-amber-400"
                    : "bg-amber-100 text-amber-600"
                }`}
              >
                {feature.icon}
              </div>
              <h3
                className={`text-base sm:text-lg font-bold mb-2 ${
                  darkMode ? "text-white" : "text-slate-800"
                }`}
              >
                {feature.title}
              </h3>
              <p
                className={`text-sm leading-relaxed ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── How to Use: Manual Way ── */}
      <div>
        <div className="text-center mb-8 sm:mb-10">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 ${
              darkMode
                ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                : "bg-sky-100 text-sky-700 border border-sky-200"
            }`}
          >
            <BookGuideIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
            Manual Mode
          </div>
          <h2
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Getting Started — Manual
          </h2>
          <p
            className={`mt-2 text-sm sm:text-base ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Follow these simple steps to manage your expenses the traditional
            way
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div
            className={`hidden sm:block absolute left-8 top-0 bottom-0 w-px ${
              darkMode ? "bg-slate-700" : "bg-slate-200"
            }`}
          />

          <div className="space-y-8 sm:space-y-0">
            {manualSteps.map((step, index) => (
              <div
                key={index}
                className={`sm:flex items-start gap-6 sm:pb-8 ${
                  index < manualSteps.length - 1 ? "" : "sm:pb-0"
                }`}
              >
                {/* Step number */}
                <div className="flex sm:flex-col items-center gap-4 sm:gap-2 sm:items-center shrink-0">
                  <div
                    className={`relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center font-extrabold text-lg border-2 transition-all duration-300 ${
                      darkMode
                        ? "bg-slate-800 border-amber-500/40 text-amber-400"
                        : "bg-white border-amber-400 text-amber-600"
                    }`}
                  >
                    <span className="sm:hidden">{step.icon}</span>
                    <span className="hidden sm:block">{step.step}</span>
                  </div>
                  {/* Mobile connector */}
                  {index < manualSteps.length - 1 && (
                    <div
                      className={`sm:hidden w-px h-6 ${
                        darkMode ? "bg-slate-700" : "bg-slate-200"
                      }`}
                    />
                  )}
                </div>

                {/* Content card */}
                <div
                  className={`flex-1 mt-2 sm:mt-0 p-5 sm:p-6 rounded-xl sm:rounded-2xl border transition-all duration-300 ${
                    darkMode
                      ? "bg-slate-800/30 border-slate-700/50 hover:border-sky-500/20"
                      : "bg-white border-slate-300 hover:border-sky-400/20 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`sm:hidden w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                        darkMode
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-amber-100 text-amber-600"
                      }`}
                    >
                      {step.step}
                    </div>
                    <h3
                      className={`text-base sm:text-lg font-bold ${
                        darkMode ? "text-white" : "text-slate-800"
                      }`}
                    >
                      {step.title}
                    </h3>
                  </div>
                  <p
                    className={`text-sm leading-relaxed ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── How to Use: AI Chat Way ── */}
      <div>
        <div className="text-center mb-8 sm:mb-10">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 ${
              darkMode
                ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                : "bg-violet-100 text-violet-700 border border-violet-200"
            }`}
          >
            <SparklesIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
            AI-Powered
          </div>
          <h2
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Using FinVue AI Chat
          </h2>
          <p
            className={`mt-2 text-sm sm:text-base ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            The fastest way to manage expenses — just type what you need
          </p>
        </div>

        <div
          className={`p-6 sm:p-8 rounded-xl sm:rounded-2xl border ${
            darkMode
              ? "bg-slate-800/40 border-slate-700/60"
              : "bg-white border-slate-300"
          }`}
        >
          {/* Chat illustration */}
          <div
            className={`flex items-start gap-4 p-4 rounded-xl mb-6 ${
              darkMode ? "bg-violet-950/40" : "bg-violet-50/80"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                darkMode
                  ? "bg-violet-500/20 text-violet-400"
                  : "bg-violet-100 text-violet-600"
              }`}
            >
              <ChatBubbleIcon className="w-5 h-5" />
            </div>
            <div>
              <h3
                className={`font-bold text-base ${
                  darkMode ? "text-white" : "text-slate-800"
                }`}
              >
                How it works
              </h3>
              <p
                className={`text-sm leading-relaxed mt-1 ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Click the chat bubble icon at the bottom-right corner to open
                the AI assistant. Type your request in natural language, and
                FinVue AI will process it instantly — adding, editing, or
                deleting expenses as you command.
              </p>
            </div>
          </div>

          <h4
            className={`text-sm font-bold uppercase tracking-wider mb-4 ${
              darkMode ? "text-slate-500" : "text-slate-400"
            }`}
          >
            Example Commands
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {chatExamples.map((example, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 ${
                  darkMode
                    ? "bg-slate-800/30 border-slate-700/50 hover:border-violet-500/20"
                    : "bg-slate-50 border-slate-300 hover:border-violet-400/20"
                }`}
              >
                <div
                  className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    darkMode
                      ? "bg-violet-500/15 text-violet-400"
                      : "bg-violet-100 text-violet-600"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <code
                    className={`block text-xs sm:text-sm font-mono font-semibold truncate ${
                      darkMode ? "text-violet-300" : "text-violet-700"
                    }`}
                  >
                    {example.text}
                  </code>
                  <p
                    className={`text-xs mt-1 ${
                      darkMode ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    {example.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── App Information Section ── */}
      {/* <div>
        <div className="text-center mb-8">
          <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
            App Information
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Version", value: "1.0.0", icon: (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            )},
            { label: "Framework", value: "Next.js 16", icon: (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            )},
            { label: "Database", value: "Neon (PostgreSQL)", icon: (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            )},
            { label: "Auth", value: "JWT + bcrypt", icon: (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )},
          ].map((item, index) => (
            <div
              key={index}
              className={`p-5 rounded-xl border text-center transition-all duration-200 hover:scale-[1.02] ${
                darkMode
                  ? "bg-slate-800/30 border-slate-700/60 hover:border-amber-500/20": "bg-white border-slate-300 hover:border-amber-400/20 hover:shadow-sm"}`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-3 ${darkMode ? "bg-amber-500/10 text-amber-400" : "bg-amber-100 text-amber-600"}`}>
                {item.icon}
              </div>
              <p className={`text-xs font-medium uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                {item.label}
              </p>
              <p className={`text-sm sm:text-base font-bold mt-1 ${darkMode ? "text-white" : "text-slate-800"}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div> */}

      {/* ── Footer ── */}
      <div
        className={`text-center py-6 border-t ${
          darkMode ? "border-slate-800" : "border-slate-300"
        }`}
      >
        <p
          className={`text-xs sm:text-sm ${
            darkMode ? "text-slate-500" : "text-slate-400"
          }`}
        >
          Built with ❤️ using Next.js, Tailwind CSS, and Neon PostgreSQL.
        </p>
        <p
          className={`text-xs mt-1 ${
            darkMode ? "text-slate-600" : "text-slate-400"
          }`}
        >
          &copy; {new Date().getFullYear()} FinVue. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AboutView;
