"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Brain } from "lucide-react";
import { useState, useEffect } from "react";

const NOTE_LINES = [
  { width: "w-32", delay: 0 },
  { width: "w-24", delay: 0.1 },
  { width: "w-28", delay: 0.2 },
  { width: "w-20", delay: 0.3 },
  { width: "w-26", delay: 0.4 },
];

const QUIZ_LINES = [
  { width: "w-28", delay: 0.6 },
  { width: "w-16", delay: 0.7 },
  { width: "w-20", delay: 0.8 },
  { width: "w-14", delay: 0.9 },
];

const MESSAGES = [
  "Preparing your quiz...",
  "Analysing your notes...",
  "Generating questions...",
  "Almost ready...",
];

interface QuizLoaderProps {
  message?: string;
}

export function QuizLoader({ message }: QuizLoaderProps) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* Subtle background glow */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99,102,241,0.10) 0%, transparent 70%)",
        }}
      />

      {/* Main animation card */}
      <div className="flex flex-col items-center gap-10">

        {/* Notes → Brain → Quiz animation row */}
        <div className="flex items-center gap-6 sm:gap-10">

          {/* Notes block */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col gap-2 items-start"
          >
            <p className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold mb-1">
              Notes
            </p>
            {NOTE_LINES.map((line, i) => (
              <motion.div
                key={i}
                className={`h-2 ${line.width} rounded-full bg-white/10`}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{
                  delay: line.delay,
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                style={{ originX: 0 }}
              >
                {/* shimmer sweep */}
                <motion.div
                  className="h-full w-full rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    delay: line.delay + 0.5,
                    ease: "linear",
                  }}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Arrow particles flowing left → right */}
          <div className="relative flex flex-col gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-indigo-500"
                initial={{ x: -24, opacity: 0 }}
                animate={{ x: 24, opacity: [0, 1, 0] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Brain — the AI core */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 18 }}
            className="relative flex-shrink-0"
          >
            {/* outer ring pulse */}
            <motion.div
              className="absolute inset-0 rounded-2xl border border-indigo-500/40"
              animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* second ring */}
            <motion.div
              className="absolute inset-0 rounded-2xl border border-indigo-400/20"
              animate={{ scale: [1, 1.32, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            />

            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center backdrop-blur-xl relative">
              <motion.div
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Brain className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-400" />
              </motion.div>
            </div>
          </motion.div>

          {/* Arrow particles flowing right */}
          <div className="relative flex flex-col gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                initial={{ x: -24, opacity: 0 }}
                animate={{ x: 24, opacity: [0, 1, 0] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: 0.6 + i * 0.4,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Quiz block */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col gap-2.5 items-start"
          >
            <p className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold mb-1">
              Quiz
            </p>

            {/* Question bar */}
            <motion.div
              className="h-2.5 w-28 rounded-full bg-indigo-500/25 border border-indigo-500/20"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              style={{ originX: 0 }}
            />

            {/* Multiple choice options */}
            {QUIZ_LINES.map((line, i) => (
              <div key={i} className="flex items-center gap-2">
                <motion.div
                  className="w-3 h-3 rounded-full border border-white/20 flex-shrink-0"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: line.delay, type: "spring", stiffness: 300 }}
                >
                  {i === 2 && (
                    <motion.div
                      className="w-full h-full rounded-full bg-emerald-500/70"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: line.delay + 0.2, type: "spring", stiffness: 400 }}
                    />
                  )}
                </motion.div>
                <motion.div
                  className={`h-1.5 ${line.width} rounded-full bg-white/10`}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: line.delay, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{ originX: 0 }}
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Brand wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex items-center gap-2.5"
        >
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
            <Brain className="w-4 h-4 text-slate-950" />
          </div>
          <span
            className="text-white font-bold text-lg tracking-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Re-vision
          </span>
        </motion.div>

        {/* Cycling message */}
        <div className="h-5">
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="text-sm text-slate-500 text-center"
            >
              {message ?? MESSAGES[msgIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Thin indigo progress bar */}
        <motion.div className="w-48 h-px bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
}
