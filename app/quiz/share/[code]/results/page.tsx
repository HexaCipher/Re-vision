"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Trophy, Target, Clock, Home, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import confetti from "canvas-confetti";
import { PageTransition, FadeIn, ScaleIn } from "@/components/ui/PageTransition";

interface ResultData {
  score: number;
  totalQuestions: number;
  answers: Record<string, string>;
  guestName: string;
  timeElapsed: number;
  completedAt: string;
}

export default function SharedQuizResultsPage() {
  const params = useParams();
  const router = useRouter();
  const shareCode = params.code as string;

  const [result, setResult] = useState<ResultData | null>(null);
  const [quizTitle, setQuizTitle] = useState("");
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    // Get results from sessionStorage
    const storedResult = sessionStorage.getItem(`shared-result-${shareCode}`);
    const storedQuiz = sessionStorage.getItem(`shared-quiz-${shareCode}`);

    if (!storedResult) {
      router.push(`/quiz/share/${shareCode}`);
      return;
    }

    const resultData = JSON.parse(storedResult);
    setResult(resultData);

    if (storedQuiz) {
      const quizData = JSON.parse(storedQuiz);
      setQuizTitle(quizData.title);
    }

    // Trigger confetti if score is good
    const percentage = (resultData.score / resultData.totalQuestions) * 100;
    if (percentage >= 70) {
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }, 500);
    }
  }, [shareCode, router]);

  // Animate score counting
  useEffect(() => {
    if (!result) return;
    
    const duration = 2000;
    const steps = 50;
    const increment = result.score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= result.score) {
        setDisplayScore(result.score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [result]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!result) {
    return null;
  }

  const percentage = Math.round((result.score / result.totalQuestions) * 100);
  
  const getPerformanceMessage = () => {
    if (percentage >= 90) return { text: "Outstanding!", color: "text-amber-400" };
    if (percentage >= 70) return { text: "Great Job!", color: "text-emerald-400" };
    if (percentage >= 50) return { text: "Good Effort!", color: "text-indigo-400" };
    return { text: "Keep Practicing!", color: "text-violet-400" };
  };

  const performance = getPerformanceMessage();

  const handleRetake = () => {
    // Clear previous results
    sessionStorage.removeItem(`shared-result-${shareCode}`);
    router.push(`/quiz/share/${shareCode}`);
  };

  return (
    <PageTransition className="min-h-screen" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
      <div 
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.08) 0%, transparent 50%, rgba(99,102,241,0.06) 100%)" }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 sm:py-4 border-b border-white/5 bg-black/40 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white flex items-center justify-center group-hover:bg-slate-100 transition-colors">
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
            </div>
            <span className="text-white font-bold tracking-tight text-lg sm:text-xl">Re-vision</span>
          </Link>
        </motion.div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-8 sm:pb-12">
        <div className="max-w-2xl mx-auto">
          {/* Score Card */}
          <ScaleIn>
            <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden mb-6 sm:mb-8 p-6 sm:p-12 text-center relative">
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-500/10 via-transparent to-emerald-500/10" />

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-2xl shadow-indigo-500/20"
              >
                <Trophy className="w-10 h-10 sm:w-14 sm:h-14 text-white" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={`text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 ${performance.color}`}
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {performance.text}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mb-4 sm:mb-6"
              >
                <p className="text-slate-400 mb-2 text-sm sm:text-base">
                  Great effort, <span className="text-indigo-400 font-medium">{result.guestName}</span>!
                </p>
                <div className="text-5xl sm:text-8xl font-bold text-white mb-1 sm:mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                  {displayScore}/{result.totalQuestions}
                </div>
                <div className="text-xl sm:text-3xl text-slate-400">
                  {percentage}% Correct
                </div>
              </motion.div>

              {quizTitle && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <Badge className="bg-indigo-500/15 text-indigo-400 border-indigo-500/25 text-sm sm:text-lg px-3 sm:px-5 py-1.5 sm:py-2 font-medium">
                    {quizTitle}
                  </Badge>
                </motion.div>
              )}
            </div>
          </ScaleIn>

          {/* Stats */}
          <FadeIn delay={0.3} className="grid grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-3 sm:p-6 text-center">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-emerald-500/15 rounded-xl sm:rounded-2xl flex items-center justify-center border border-emerald-500/20 mx-auto mb-2 sm:mb-3">
                <Target className="w-5 h-5 sm:w-7 sm:h-7 text-emerald-400" />
              </div>
              <p className="text-xl sm:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>{result.score}</p>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">Correct</p>
            </div>

            <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-3 sm:p-6 text-center">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-indigo-500/15 rounded-xl sm:rounded-2xl flex items-center justify-center border border-indigo-500/20 mx-auto mb-2 sm:mb-3">
                <Trophy className="w-5 h-5 sm:w-7 sm:h-7 text-indigo-400" />
              </div>
              <p className="text-xl sm:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>{percentage}%</p>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">Accuracy</p>
            </div>

            <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-3 sm:p-6 text-center">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-violet-500/15 rounded-xl sm:rounded-2xl flex items-center justify-center border border-violet-500/20 mx-auto mb-2 sm:mb-3">
                <Clock className="w-5 h-5 sm:w-7 sm:h-7 text-violet-400" />
              </div>
              <p className="text-xl sm:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>{formatTime(result.timeElapsed)}</p>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">Time</p>
            </div>
          </FadeIn>

          {/* Actions */}
          <FadeIn delay={0.4} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              onClick={handleRetake}
              variant="outline"
              className="flex-1 h-12 sm:h-14 rounded-xl text-sm sm:text-base border-white/10 hover:bg-white/5 hover:border-white/20"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Try Again
            </Button>
            <Link href="/" className="flex-1">
              <Button className="w-full h-12 sm:h-14 rounded-xl bg-white text-slate-950 hover:bg-slate-100 text-sm sm:text-base font-semibold">
                <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Go Home
              </Button>
            </Link>
          </FadeIn>

          {/* CTA */}
          <FadeIn delay={0.5} className="mt-6 sm:mt-8">
            <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 backdrop-blur-xl p-5 sm:p-8 text-center">
              <p className="text-slate-300 mb-3 text-sm sm:text-base">Want to create your own quizzes?</p>
              <Link href="/sign-up">
                <Button variant="outline" className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 h-10 sm:h-11 rounded-xl text-sm sm:text-base">
                  Sign up for free
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </PageTransition>
  );
}
