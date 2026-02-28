"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight, Brain, Upload, Sparkles, Trophy,
  CheckCircle2, Circle, BookOpen, Zap, Target, Clock, TrendingUp, FileText,
} from "lucide-react";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────
const steps = [
  {
    icon: Upload,
    number: "01",
    title: "Upload your notes",
    body: "Paste text or drop a PDF, DOCX, or TXT file. Any subject, any length — from a single page to entire textbooks.",
  },
  {
    icon: Sparkles,
    number: "02",
    title: "AI generates your quiz",
    body: "Gemini analyzes your content and creates targeted, challenging questions that test real understanding in under 10 seconds.",
  },
  {
    icon: Brain,
    number: "03",
    title: "Take the quiz & learn",
    body: "Answer questions with instant feedback. See what you know, identify gaps, and build lasting memory through active recall.",
  },
  {
    icon: Trophy,
    number: "04",
    title: "Track & master",
    body: "Review your results, retake quizzes, and watch your scores climb. Spaced repetition meets AI-powered learning.",
  },
];

const mockQuestions = [
  {
    q: "What is active recall?",
    options: ["Re-reading notes", "Testing yourself on material", "Highlighting text", "Making summaries"],
    correct: 1,
  },
  {
    q: "Which method improves retention most?",
    options: ["Passive reading", "Flashcards", "Active recall testing", "Mind mapping"],
    correct: 2,
  },
  {
    q: "How long does AI quiz generation take?",
    options: ["5 minutes", "1 minute", "30 seconds", "Under 10 seconds"],
    correct: 3,
  },
];

// ─── Animated counter ────────────────────────────────────────────────────────
function AnimatedNumber({ value, suffix = "", duration = 2 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const increment = value / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, value, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── Animated quiz widget (hero right) ───────────────────────────────────────
function QuizWidget() {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const current = mockQuestions[qIndex];

  useEffect(() => {
    if (!answered) return;
    const t = setTimeout(() => {
      setQIndex((q) => (q + 1) % mockQuestions.length);
      setSelected(null);
      setAnswered(false);
    }, 2000);
    return () => clearTimeout(t);
  }, [answered]);

  useEffect(() => {
    const t = setTimeout(() => {
      setSelected(current.correct);
      setTimeout(() => {
        setAnswered(true);
        setScore((s) => Math.min(s + 1, mockQuestions.length));
      }, 700);
    }, 1400);
    return () => clearTimeout(t);
  }, [qIndex, current.correct]);

  const progress = ((qIndex + 1) / mockQuestions.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: 56, y: 16 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.9, ease: "easeOut", delay: 0.5 }}
      className="relative w-full max-w-[480px]"
    >
      <div className="absolute inset-0 -z-10 rounded-3xl blur-3xl bg-indigo-500/12 scale-110" />

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl overflow-hidden shadow-2xl">
        <div className="px-7 py-5 border-b border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Brain className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <p className="text-base font-semibold text-white">Biology — Cell Division</p>
              <p className="text-sm text-slate-500">AI Generated Quiz</p>
            </div>
          </div>
          <span className="text-base text-slate-500 font-mono bg-white/5 px-4 py-1.5 rounded-full">
            {qIndex + 1}/{mockQuestions.length}
          </span>
        </div>

        <div className="h-1.5 bg-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>

        <div className="px-7 pt-7 pb-6">
          <motion.p
            key={qIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-lg font-semibold text-white leading-snug mb-6"
          >
            {current.q}
          </motion.p>

          <div className="space-y-3">
            {current.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = i === current.correct;
              const showResult = answered;

              let border = "border-white/8";
              let bg = "bg-white/[0.02]";
              let text = "text-slate-400";

              if (showResult && isCorrect) {
                border = "border-emerald-500/50";
                bg = "bg-emerald-500/10";
                text = "text-emerald-300";
              } else if (showResult && isSelected && !isCorrect) {
                border = "border-red-500/40";
                bg = "bg-red-500/8";
                text = "text-red-300";
              } else if (isSelected && !showResult) {
                border = "border-indigo-400/50";
                bg = "bg-indigo-500/10";
                text = "text-indigo-200";
              }

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 + 0.1, duration: 0.3 }}
                  className={`flex items-center gap-4 px-5 py-4 rounded-xl border ${border} ${bg} transition-all duration-300`}
                >
                  {showResult && isCorrect
                    ? <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    : <Circle className={`w-5 h-5 flex-shrink-0 ${isSelected ? "text-indigo-400" : "text-slate-600"}`} />
                  }
                  <span className={`text-base font-medium ${text} transition-colors duration-300`}>{opt}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="px-7 py-5 border-t border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="text-base text-slate-400">
              Score: <span className="text-white font-bold">{score}/{mockQuestions.length}</span>
            </span>
          </div>
          <motion.span
            key={answered ? "correct" : "pending"}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`text-base font-semibold ${answered ? "text-emerald-400" : "text-slate-500"}`}
          >
            {answered ? "Correct!" : "Thinking…"}
          </motion.span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute -top-4 -right-4 flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/8 border border-white/12 backdrop-blur text-sm text-slate-300 font-medium shadow-xl"
      >
        <Sparkles className="w-4 h-4 text-indigo-300" />
        Generated in 8s
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        className="absolute -bottom-4 -left-4 flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/8 border border-white/12 backdrop-blur text-sm text-slate-300 font-medium shadow-xl"
      >
        <Upload className="w-4 h-4 text-slate-400" />
        biology_notes.pdf
      </motion.div>
    </motion.div>
  );
}

// ─── Score result widget (CTA right) ─────────────────────────────────────────
function ResultWidget() {
  const [count, setCount] = useState(0);
  const target = 8;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setCount(i);
      if (i >= target) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, [inView]);

  const subjects = [
    { name: "Biology", score: 92, color: "bg-emerald-500" },
    { name: "History", score: 78, color: "bg-indigo-500" },
    { name: "Chemistry", score: 85, color: "bg-violet-500" },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 48 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      className="relative w-full max-w-[440px]"
    >
      <div className="absolute inset-0 -z-10 rounded-3xl blur-3xl bg-emerald-500/10 scale-110" />

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl overflow-hidden shadow-2xl">
        <div className="px-8 py-7 border-b border-white/8">
          <p className="text-base text-slate-400 mb-2">Quiz complete</p>
          <div className="flex items-end gap-3">
            <span className="text-7xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
              {count}
            </span>
            <span className="text-3xl text-slate-500 mb-3">/ 10</span>
          </div>
          <div className="mt-4 h-3 bg-white/8 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: `${(target / 10) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
            />
          </div>
          <p className="text-base text-emerald-400 font-semibold mt-3">Great work — 80% correct!</p>
        </div>

        <div className="px-8 py-6 space-y-5">
          <p className="text-sm text-slate-500 uppercase tracking-widest font-semibold">Your subjects</p>
          {subjects.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 + 0.3 }}
              className="flex items-center gap-5"
            >
              <span className="text-base text-slate-300 w-24">{s.name}</span>
              <div className="flex-1 h-2.5 bg-white/8 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${s.color} rounded-full`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.score}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 + 0.6 }}
                />
              </div>
              <span className="text-base font-bold text-white w-12 text-right">{s.score}%</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fadeUpProps(delay = 0) {
  return {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" } as const,
    transition: { duration: 0.7, ease: "easeOut" as const, delay },
  };
}

function Rule() {
  return <hr className="border-white/6 w-full" />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ fontFamily: "var(--font-inter), sans-serif" }}>

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-10 py-5 border-b border-white/5 bg-black/40 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
            <Brain className="w-5 h-5 text-slate-950" />
          </div>
          <span className="text-white font-bold tracking-tight text-xl">Re-vision</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-4"
        >
          <Link href="/sign-in">
            <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 text-base font-medium h-11 px-6">
              Sign in
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="bg-white text-slate-950 hover:bg-slate-100 text-base font-semibold h-11 px-7 rounded-xl">
              Get started
            </Button>
          </Link>
        </motion.div>
      </nav>

      {/* ════════════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden px-10 md:px-16 lg:px-24"
      >
        <div className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, transparent 50%, rgba(16,185,129,0.06) 100%)" }}
        />
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.02]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center pt-32 pb-20"
        >
          <div className="flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-slate-400 text-sm font-semibold tracking-widest uppercase mb-10"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              AI-powered study tool
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-6xl md:text-7xl lg:text-[5.5rem] font-bold leading-[1.02] tracking-tight text-white mb-8"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Turn notes
              <br />
              <span className="text-slate-400">into mastery.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="text-xl md:text-2xl text-slate-400 font-light max-w-lg mb-12 leading-relaxed"
            >
              Upload your study notes. Get a quiz in 10 seconds.
              Stop re-reading — start recalling.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-start gap-5"
            >
              <Link href="/sign-up">
                <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-100 font-bold text-lg px-10 h-14 rounded-2xl group">
                  Start for free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 text-lg h-14 px-10 rounded-2xl">
                  See how it works
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="mt-16 flex items-center gap-12 border-t border-white/8 pt-10"
            >
              {[
                { value: "10s", label: "Quiz generation" },
                { value: "50%", label: "Better retention" },
                { value: "∞", label: "Subjects" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-4xl font-bold text-white">{stat.value}</span>
                  <span className="text-base text-slate-500 mt-1">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="flex items-center justify-center lg:justify-end">
            <QuizWidget />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <div className="w-px h-20 bg-gradient-to-b from-white/25 to-transparent" />
        </motion.div>
      </section>

      <Rule />

      {/* ════════════════════════════════════════════════════════════════════
          WHY — Bento grid with large feature card
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center px-10 md:px-16 lg:px-24 py-32 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "linear-gradient(160deg, rgba(251,191,36,0.06) 0%, transparent 40%, rgba(99,102,241,0.08) 100%)" }}
        />

        {/* Section header */}
        <motion.div {...fadeUpProps(0)} className="text-center mb-20 max-w-4xl mx-auto">
          <p className="text-base text-indigo-400 font-semibold tracking-widest uppercase mb-6">Why Re-vision</p>
          <h2
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Study smarter with
            <span className="text-slate-500"> science-backed learning</span>
          </h2>
        </motion.div>

        {/* Bento grid */}
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Large feature card — spans 2 cols */}
          <motion.div
            {...fadeUpProps(0.1)}
            className="lg:col-span-2 relative rounded-[2rem] border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.08] to-transparent p-10 md:p-12 overflow-hidden group"
          >
            <div className="pointer-events-none absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-8">
                <Clock className="w-8 h-8 text-amber-400" />
              </div>
              
              <div className="flex items-end gap-4 mb-4">
                <span className="text-7xl md:text-8xl font-bold text-amber-400" style={{ fontFamily: "var(--font-playfair)" }}>
                  <AnimatedNumber value={10} />
                </span>
                <span className="text-3xl text-amber-400/70 mb-3 font-medium">seconds</span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">From notes to quiz</h3>
              <p className="text-lg text-slate-400 leading-relaxed max-w-lg">
                No manual question writing. Just paste your notes and the quiz is ready before you finish your coffee. 
                AI does the heavy lifting so you can focus on learning.
              </p>
            </div>
          </motion.div>

          {/* Two stacked cards */}
          <div className="flex flex-col gap-6">
            <motion.div
              {...fadeUpProps(0.2)}
              className="relative flex-1 rounded-[2rem] border border-indigo-500/20 bg-gradient-to-br from-indigo-500/[0.08] to-transparent p-8 overflow-hidden group"
            >
              <div className="pointer-events-none absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-[60px]" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mb-6">
                  <TrendingUp className="w-7 h-7 text-indigo-400" />
                </div>
                
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-5xl font-bold text-indigo-400" style={{ fontFamily: "var(--font-playfair)" }}>
                    <AnimatedNumber value={50} suffix="%" />
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">Better retention</h3>
                <p className="text-base text-slate-400 leading-relaxed">
                  Active recall beats re-reading. Science proves it.
                </p>
              </div>
            </motion.div>

            <motion.div
              {...fadeUpProps(0.3)}
              className="relative flex-1 rounded-[2rem] border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.08] to-transparent p-8 overflow-hidden group"
            >
              <div className="pointer-events-none absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-[60px]" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-6">
                  <BookOpen className="w-7 h-7 text-emerald-400" />
                </div>
                
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-5xl font-bold text-emerald-400" style={{ fontFamily: "var(--font-playfair)" }}>
                    Any
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">Subject supported</h3>
                <p className="text-base text-slate-400 leading-relaxed">
                  History, biology, code, law — AI understands it all.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Rule />

      {/* ════════════════════════════════════════════════════════════════════
          HOW IT WORKS — Vertical timeline
      ════════════════════════════════════════════════════════════════════ */}
      <section
        id="how-it-works"
        className="relative min-h-screen flex flex-col justify-center px-10 md:px-16 lg:px-24 py-32 overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "linear-gradient(200deg, rgba(139,92,246,0.08) 0%, transparent 40%, rgba(99,102,241,0.06) 100%)" }}
        />

        {/* Section header */}
        <motion.div {...fadeUpProps(0)} className="text-center mb-24 max-w-4xl mx-auto">
          <p className="text-base text-violet-400 font-semibold tracking-widest uppercase mb-6">How it works</p>
          <h2
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Four steps to
            <span className="text-slate-500"> mastering anything</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-5xl mx-auto w-full relative">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/50 via-indigo-500/50 to-emerald-500/50 -translate-x-1/2 hidden md:block" />

          <div className="space-y-16 md:space-y-0">
            {steps.map((step, i) => {
              const isLeft = i % 2 === 0;
              const colors = [
                { bg: "bg-violet-500/20", border: "border-violet-500/30", text: "text-violet-400", glow: "bg-violet-500/20" },
                { bg: "bg-indigo-500/20", border: "border-indigo-500/30", text: "text-indigo-400", glow: "bg-indigo-500/20" },
                { bg: "bg-sky-500/20", border: "border-sky-500/30", text: "text-sky-400", glow: "bg-sky-500/20" },
                { bg: "bg-emerald-500/20", border: "border-emerald-500/30", text: "text-emerald-400", glow: "bg-emerald-500/20" },
              ][i];

              return (
                <motion.div
                  key={i}
                  {...fadeUpProps(i * 0.15)}
                  className={`relative flex flex-col md:flex-row items-center gap-8 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  {/* Content card */}
                  <div className={`w-full md:w-[calc(50%-3rem)] ${isLeft ? "md:text-right" : "md:text-left"}`}>
                    <div className={`relative rounded-[2rem] border ${colors.border} bg-gradient-to-br from-white/[0.04] to-transparent p-8 md:p-10 overflow-hidden group hover:border-white/20 transition-colors duration-500`}>
                      {/* Glow */}
                      <div className={`pointer-events-none absolute ${isLeft ? "-right-20 -top-20" : "-left-20 -top-20"} w-40 h-40 ${colors.glow} rounded-full blur-[80px] opacity-60`} />
                      
                      <div className={`relative z-10 flex flex-col ${isLeft ? "md:items-end" : "md:items-start"}`}>
                        {/* Number badge */}
                        <div className={`inline-flex items-center gap-3 mb-6`}>
                          <span className={`text-6xl font-bold ${colors.text} opacity-30 font-mono`}>{step.number}</span>
                        </div>
                        
                        {/* Icon */}
                        <div className={`w-16 h-16 rounded-2xl ${colors.bg} border ${colors.border} flex items-center justify-center mb-6`}>
                          <step.icon className={`w-8 h-8 ${colors.text}`} />
                        </div>
                        
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{step.title}</h3>
                        <p className="text-lg text-slate-400 leading-relaxed">{step.body}</p>
                      </div>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-950 border-2 border-white/20 items-center justify-center z-10">
                    <div className={`w-2.5 h-2.5 rounded-full ${colors.bg.replace('/20', '')}`} />
                  </div>

                  {/* Spacer for the other side */}
                  <div className="hidden md:block w-[calc(50%-3rem)]" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Rule />

      {/* ════════════════════════════════════════════════════════════════════
          CTA
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center px-10 md:px-16 lg:px-24 py-32 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "linear-gradient(140deg, rgba(16,185,129,0.08) 0%, transparent 50%, rgba(99,102,241,0.06) 100%)" }}
        />

        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div {...fadeUpProps(0)} className="flex flex-col items-start">
            <p className="text-base text-emerald-400 font-semibold tracking-widest uppercase mb-8">Get started today</p>
            <h2
              className="text-6xl md:text-7xl lg:text-[5.5rem] font-bold text-white leading-[1.02] mb-8"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Study smarter.
              <br />
              <span className="text-slate-400">Not longer.</span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-400 font-light mb-14 leading-relaxed max-w-lg">
              Join students who use Re-vision to convert passive notes into active knowledge — and actually remember what they study.
            </p>
            <Link href="/sign-up">
              <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-100 font-bold text-lg px-12 h-16 rounded-2xl group">
                Create your first quiz — free
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          <div className="flex items-center justify-center lg:justify-end">
            <ResultWidget />
          </div>
        </div>
      </section>

      <Rule />

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="py-12 px-10 flex items-center justify-between text-base text-slate-500">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
            <Brain className="w-4 h-4 text-slate-400" />
          </div>
          <span className="font-semibold">Re-vision</span>
        </div>
        <span>Built for students who want to learn better.</span>
      </footer>
    </div>
  );
}
