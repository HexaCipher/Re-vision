"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Brain, Clock, ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import { PageTransition } from "@/components/ui/PageTransition";
import { QuizLoader } from "@/components/ui/QuizLoader";

interface Question {
  id: string;
  question: string;
  type: "mcq" | "true_false" | "fill_blank";
  options?: string[];
  correctAnswer: string;
}

interface Quiz {
  id: string;
  title: string;
  subject: string;
  questions: Question[];
}

export default function SharedQuizTakePage() {
  const params = useParams();
  const router = useRouter();
  const shareCode = params.code as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestId, setGuestId] = useState("");

  useEffect(() => {
    // Get guest info
    const storedGuestId = sessionStorage.getItem("guestId");
    const storedGuestName = sessionStorage.getItem("guestName");
    
    if (!storedGuestId || !storedGuestName) {
      router.push(`/quiz/share/${shareCode}`);
      return;
    }

    setGuestId(storedGuestId);
    setGuestName(storedGuestName);

    // Get quiz data
    const storedQuiz = sessionStorage.getItem(`shared-quiz-${shareCode}`);
    if (storedQuiz) {
      const quizData = JSON.parse(storedQuiz);
      // Fetch full quiz with questions
      fetchFullQuiz(quizData.id);
    } else {
      fetchQuizByCode();
    }
  }, [shareCode]);

  const fetchFullQuiz = async (quizId: string) => {
    try {
      const response = await fetch(`/api/shared/${shareCode}`);
      const data = await response.json();
      if (response.ok) {
        setQuiz(data);
      }
    } catch (err) {
      console.error("Failed to fetch quiz:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizByCode = async () => {
    try {
      const response = await fetch(`/api/shared/${shareCode}`);
      const data = await response.json();
      if (response.ok) {
        setQuiz(data);
      } else {
        router.push(`/quiz/share/${shareCode}`);
      }
    } catch (err) {
      router.push(`/quiz/share/${shareCode}`);
    } finally {
      setLoading(false);
    }
  };

  // Timer
  useEffect(() => {
    if (!quiz) return;
    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [quiz]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading || !quiz) {
    return <QuizLoader />;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleAnswerChange = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    });
  };

  const handleNext = () => {
    if (!answers[currentQuestion.id]) {
      toast.error("Please select an answer before continuing");
      return;
    }

    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!answers[currentQuestion.id]) {
      toast.error("Please answer the current question before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate score
      let score = 0;
      quiz.questions.forEach((question) => {
        if (answers[question.id]?.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()) {
          score++;
        }
      });

      // Save attempt to database
      try {
        await fetch("/api/shared/attempts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quizId: quiz.id,
            guestId,
            guestName,
            score,
            totalQuestions: quiz.questions.length,
            answers,
          }),
        });
      } catch (err) {
        console.error("Failed to save attempt:", err);
      }

      // Store results in sessionStorage
      const resultData = {
        score,
        totalQuestions: quiz.questions.length,
        answers,
        guestName,
        timeElapsed,
        completedAt: new Date().toISOString(),
      };
      sessionStorage.setItem(`shared-result-${shareCode}`, JSON.stringify(resultData));

      router.push(`/quiz/share/${shareCode}/results`);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("Failed to submit quiz");
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition className="min-h-screen" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
      <div 
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, transparent 50%, rgba(139,92,246,0.06) 100%)" }}
      />

      {/* Header */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 sm:py-4 border-b border-white/5 bg-black/40 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1"
        >
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white flex items-center justify-center group-hover:bg-slate-100 transition-colors">
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
            </div>
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm sm:text-lg font-bold text-white truncate">{quiz.title}</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-indigo-500/15 text-indigo-400 border-indigo-500/25 font-medium text-xs">
                {quiz.subject}
              </Badge>
              <span className="text-xs sm:text-sm text-slate-500 hidden xs:inline">Playing as {guestName}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 sm:gap-4 flex-shrink-0"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 text-slate-400 bg-white/5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-white/10">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-mono text-sm sm:text-lg font-medium">{formatTime(timeElapsed)}</span>
          </div>
        </motion.div>
      </nav>

      {/* Progress Bar */}
      <div className="fixed top-[57px] sm:top-[65px] lg:top-[73px] inset-x-0 z-40 px-4 sm:px-6 lg:px-10 py-2 sm:py-3 bg-black/20 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between text-xs sm:text-sm text-slate-400 mb-1.5 sm:mb-2">
            <span className="font-medium">Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-1.5 sm:h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 pt-28 sm:pt-32 lg:pt-40 pb-8 sm:pb-12">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden">
                <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6">
                  <div className="flex items-start gap-3 sm:gap-5 mb-6 sm:mb-8">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-indigo-500/15 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 border border-indigo-500/20">
                      <span className="text-lg sm:text-2xl font-bold text-indigo-400" style={{ fontFamily: "var(--font-playfair)" }}>
                        {currentQuestionIndex + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg sm:text-2xl font-bold text-white leading-relaxed">
                        {currentQuestion.question}
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {currentQuestion.type === "mcq" && currentQuestion.options && (
                      <RadioGroup
                        value={answers[currentQuestion.id] || ""}
                        onValueChange={handleAnswerChange}
                      >
                        {currentQuestion.options.map((option, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 }}
                          >
                            <Label
                              htmlFor={`option-${index}`}
                              className={`flex items-center gap-3 sm:gap-4 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                                answers[currentQuestion.id] === option
                                  ? "border-indigo-500/50 bg-indigo-500/10"
                                  : "border-white/10 hover:border-white/20 bg-white/[0.02]"
                              }`}
                            >
                              <RadioGroupItem
                                value={option}
                                id={`option-${index}`}
                                className="text-indigo-500 border-white/20 flex-shrink-0"
                              />
                              <span className="text-base sm:text-lg text-white flex-1">{option}</span>
                            </Label>
                          </motion.div>
                        ))}
                      </RadioGroup>
                    )}

                    {currentQuestion.type === "true_false" && (
                      <RadioGroup
                        value={answers[currentQuestion.id] || ""}
                        onValueChange={handleAnswerChange}
                      >
                        {["True", "False"].map((option, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 }}
                          >
                            <Label
                              htmlFor={`option-${index}`}
                              className={`flex items-center gap-3 sm:gap-4 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                                answers[currentQuestion.id] === option
                                  ? "border-indigo-500/50 bg-indigo-500/10"
                                  : "border-white/10 hover:border-white/20 bg-white/[0.02]"
                              }`}
                            >
                              <RadioGroupItem
                                value={option}
                                id={`option-${index}`}
                                className="text-indigo-500 border-white/20 flex-shrink-0"
                              />
                              <span className="text-base sm:text-lg text-white flex-1">{option}</span>
                            </Label>
                          </motion.div>
                        ))}
                      </RadioGroup>
                    )}

                    {currentQuestion.type === "fill_blank" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Input
                          value={answers[currentQuestion.id] || ""}
                          onChange={(e) => handleAnswerChange(e.target.value)}
                          placeholder="Type your answer here..."
                          className="text-base sm:text-lg p-4 sm:p-6 bg-white/[0.02] border-white/10 text-white rounded-xl sm:rounded-2xl placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                        />
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="px-4 sm:px-8 py-4 sm:py-6 border-t border-white/5 flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    variant="outline"
                    className="w-full sm:flex-1 h-12 sm:h-14 rounded-xl border-white/10 hover:bg-white/5 hover:border-white/20 text-sm sm:text-base font-medium order-2 sm:order-1"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="w-full sm:flex-1 h-12 sm:h-14 rounded-xl bg-white text-slate-950 hover:bg-slate-100 text-sm sm:text-base font-semibold order-1 sm:order-2"
                  >
                    {isSubmitting ? (
                      "Submitting..."
                    ) : isLastQuestion ? (
                      "Submit Quiz"
                    ) : (
                      <>
                        Next
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-6 sm:mt-8 justify-center px-2">
                {quiz.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-200 ${
                      index === currentQuestionIndex
                        ? "bg-white text-slate-950"
                        : answers[quiz.questions[index].id]
                        ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                        : "bg-white/5 text-slate-500 hover:bg-white/10 border border-white/10"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
