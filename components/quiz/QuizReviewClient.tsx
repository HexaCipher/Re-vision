"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, CheckCircle, XCircle, Home, RotateCcw } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Question } from "@/types";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/PageTransition";

interface QuizReviewClientProps {
  quiz: {
    id: string;
    title: string;
    subject: string;
    questions: Question[];
  };
  userAnswers: Record<string, string>;
}

export default function QuizReviewClient({
  quiz,
  userAnswers,
}: QuizReviewClientProps) {
  const isCorrect = (question: Question) => {
    const userAnswer = userAnswers[question.id]?.toLowerCase().trim();
    const correctAnswer = question.correctAnswer.toLowerCase().trim();
    return userAnswer === correctAnswer;
  };

  const correctCount = quiz.questions.filter(q => isCorrect(q)).length;
  const percentage = Math.round((correctCount / quiz.questions.length) * 100);

  return (
    <PageTransition className="min-h-screen" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
      <div 
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, transparent 50%, rgba(139,92,246,0.06) 100%)" }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 lg:px-10 py-4 border-b border-white/5 bg-black/40 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center group-hover:bg-slate-100 transition-colors">
              <Brain className="w-5 h-5 text-slate-950" />
            </div>
            <span className="text-white font-bold tracking-tight text-xl">Re-vision</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link href="/dashboard">
            <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 h-11 px-6 rounded-xl">
              <Home className="w-5 h-5 mr-2" />
              Dashboard
            </Button>
          </Link>
        </motion.div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 pt-28 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <FadeIn className="mb-10">
            <p className="text-base text-indigo-400 font-semibold tracking-widest uppercase mb-4">Answer Review</p>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1
                  className="text-4xl md:text-5xl font-bold text-white mb-3"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  {quiz.title}
                </h1>
                <div className="flex items-center gap-3">
                  <Badge className="bg-indigo-500/15 text-indigo-400 border-indigo-500/25 font-medium">
                    {quiz.subject}
                  </Badge>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{quiz.questions.length} questions</span>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/[0.02] border border-white/10">
                <span className="text-slate-400">Score:</span>
                <span className={`text-2xl font-bold ${percentage >= 70 ? 'text-emerald-400' : percentage >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                  {correctCount}/{quiz.questions.length}
                </span>
                <span className="text-slate-500">({percentage}%)</span>
              </div>
            </div>
          </FadeIn>

          {/* Questions */}
          <StaggerContainer className="space-y-6">
            {quiz.questions.map((question, index) => {
              const correct = isCorrect(question);
              const userAnswer = userAnswers[question.id];

              return (
                <StaggerItem key={question.id}>
                  <div
                    className={`rounded-3xl border backdrop-blur-xl overflow-hidden ${
                      correct
                        ? "bg-emerald-500/[0.03] border-emerald-500/20"
                        : "bg-red-500/[0.03] border-red-500/20"
                    }`}
                  >
                    {/* Question Header */}
                    <div className="p-6 md:p-8">
                      <div className="flex items-start gap-5">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border ${
                            correct 
                              ? "bg-emerald-500/15 border-emerald-500/25" 
                              : "bg-red-500/15 border-red-500/25"
                          }`}
                        >
                          {correct ? (
                            <CheckCircle className="w-7 h-7 text-emerald-400" />
                          ) : (
                            <XCircle className="w-7 h-7 text-red-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-sm text-slate-500 font-medium">
                              Question {index + 1}
                            </span>
                            <Badge
                              className={
                                correct
                                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                                  : "bg-red-500/15 text-red-400 border-red-500/25"
                              }
                            >
                              {correct ? "Correct" : "Incorrect"}
                            </Badge>
                          </div>
                          <h3 className="text-xl font-bold text-white leading-relaxed">
                            {question.question}
                          </h3>
                        </div>
                      </div>

                      {/* Answers */}
                      <div className="space-y-4 mt-6 ml-0 md:ml-[76px]">
                        {/* User's Answer */}
                        <div>
                          <p className="text-sm text-slate-500 mb-2 font-medium">Your Answer</p>
                          <div
                            className={`p-4 rounded-xl border ${
                              correct
                                ? "bg-emerald-500/10 border-emerald-500/25"
                                : "bg-red-500/10 border-red-500/25"
                            }`}
                          >
                            <p
                              className={`font-semibold ${
                                correct ? "text-emerald-400" : "text-red-400"
                              }`}
                            >
                              {userAnswer || "No answer provided"}
                            </p>
                          </div>
                        </div>

                        {/* Correct Answer (if wrong) */}
                        {!correct && (
                          <div>
                            <p className="text-sm text-slate-500 mb-2 font-medium">
                              Correct Answer
                            </p>
                            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                              <p className="font-semibold text-emerald-400">
                                {question.correctAnswer}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Explanation */}
                        {question.explanation && (
                          <div>
                            <p className="text-sm text-slate-500 mb-2 font-medium">
                              Explanation
                            </p>
                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                              <p className="text-slate-300 leading-relaxed">{question.explanation}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          {/* Actions */}
          <FadeIn delay={0.3} className="flex gap-4 mt-10">
            <Link href={`/quiz/${quiz.id}/take`} className="flex-1">
              <Button className="w-full bg-white text-slate-950 hover:bg-slate-100 h-14 rounded-xl text-base font-semibold">
                <RotateCcw className="w-5 h-5 mr-2" />
                Retry Quiz
              </Button>
            </Link>
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" className="w-full h-14 rounded-xl text-base border-white/10 hover:bg-white/5 hover:border-white/20">
                <Home className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </FadeIn>
        </div>
      </div>
    </PageTransition>
  );
}
