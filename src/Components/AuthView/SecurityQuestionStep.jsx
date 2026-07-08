"use client";
import { forwardRef } from "react";
import { ChevronLeftIcon, ShieldCheckIcon, XIcon } from "../Icons";
import Button from "../common/Button";

const SecurityQuestionStep = (
  {
    visible,
    question,
    setQuestion,
    answer,
    setAnswer,
    customQuestion,
    setCustomQuestion,
    useCustom,
    setUseCustom,
    questions,
    onSave,
    onSkip,
    onBack,
    isLoading,
  },
  ref
) => (
  <div
    className={`transition-all duration-300 ${
      visible
        ? "opacity-100 scale-100"
        : "opacity-0 scale-95 absolute inset-x-8 sm:inset-x-10 pointer-events-none"
    }`}
  >
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
      className={visible ? "" : "hidden"}
    >
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="text-slate-400 hover:text-white transition-colors p-1 -ml-1 mb-4"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheckIcon className="w-5 h-5 text-emerald-400" />
        <p className="text-sm font-medium text-slate-300">
          Set a security question for password recovery
        </p>
      </div>

      {/* Question selector */}
      {!useCustom ? (
        <select
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-slate-800 border-2 border-slate-600/50 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 mb-2 appearance-none cursor-pointer"
        >
          {questions.map((q) => (
            <option key={q} value={q}>
              {q}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          value={customQuestion}
          onChange={(e) => setCustomQuestion(e.target.value)}
          placeholder="Type your custom security question"
          className="w-full px-4 py-3 rounded-xl bg-slate-800 border-2 border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 mb-2"
        />
      )}

      {/* Toggle custom question */}
      <button
        type="button"
        onClick={() => setUseCustom(!useCustom)}
        className="text-xs text-slate-500 hover:text-emerald-400 transition-colors mb-4"
      >
        {useCustom
          ? "Choose from predefined questions"
          : "Write my own question"}
      </button>

      {/* Answer */}
      <input
        ref={ref}
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Your answer"
        className="w-full px-4 py-3 rounded-xl bg-slate-800 border-2 border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
      />

      <div className="mt-5 space-y-2">
        <Button
          type="submit"
          loading={isLoading}
          icon={<ShieldCheckIcon className="w-5 h-5" strokeWidth={2.5} />}
        >
          Save & Continue
        </Button>
        <button
          type="button"
          onClick={onSkip}
          className="block w-full text-center text-xs text-slate-500 hover:text-slate-300 transition-colors py-2"
        >
          Skip — I&apos;ll set this up later
        </button>
      </div>
    </form>
  </div>
);

export default forwardRef(SecurityQuestionStep);
