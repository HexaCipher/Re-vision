"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Brain, Clock, ChevronRight, ChevronLeft, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Question } from "@/types";
import { toast } from "sonner";
import Link from "next/link";

interface QuizTakingClientProps {
  quiz: {
    id: string;
    title: string;
    subject: string;
    questions: Question[];
    timerMode?: "none" | "quiz" | "question";
    timeLimit?: number; // minutes for quiz mode, seconds for question mode
  };
  userId: string;
}

export default function QuizTakingClient({ quiz, userId }: QuizTakingClientProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Timer state
  const timerMode = quiz.timerMode || "none";
  const timeLimit = quiz.timeLimit || 10;
  const [timeRemaining, setTimeRemaining] = useState(() => {
    if (timerMode === "quiz") return timeLimit * 60; // Convert minutes to seconds
    if (timerMode === "question") return timeLimit; // Already in seconds
    return 0;
  });
  const hasAutoSubmittedRef = useRef(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  // Calculate warning thresholds
  const getWarningThreshold = () => {
    if (timerMode === "quiz") return 60; // 1 minute warning for quiz mode
    if (timerMode === "question") return Math.min(10, timeLimit * 0.3); // 10 seconds or 30% of time
    return 0;
  };
  const warningThreshold = getWarningThreshold();
  const isTimeWarning = timerMode !== "none" && timeRemaining <= warningThreshold && timeRemaining > 0;
  const isTimeUp = timerMode !== "none" && timeRemaining <= 0;

  // Timer for "none" mode (elapsed time counter)
  useEffect(() => {
    if (timerMode !== "none") return;
    
    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerMode]);

  // Timer for countdown modes (quiz/question)
  useEffect(() => {
    if (timerMode === "none" || isSubmitting) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerMode, isSubmitting]);

  // Reset question timer when changing questions in "question" mode
  useEffect(() => {
    if (timerMode === "question") {
      setTimeRemaining(timeLimit);
    }
  }, [currentQuestionIndex, timerMode, timeLimit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatCountdown = (seconds: number) => {
    if (seconds <= 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    });
  };

  // Auto-advance for question mode when time runs out
  const handleQuestionTimeUp = useCallback(() => {
    if (isLastQuestion) {
      // Submit the quiz when time runs out on the last question
      handleForceSubmit();
    } else {
      toast.error("Time's up! Moving to the next question.");
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [isLastQuestion]);

  // Effect to handle time up scenarios
  useEffect(() => {
    if (isTimeUp && !isSubmitting && !hasAutoSubmittedRef.current) {
      if (timerMode === "quiz") {
        hasAutoSubmittedRef.current = true;
        toast.error("Time's up! Submitting your quiz...");
        handleForceSubmit();
      } else if (timerMode === "question") {
        handleQuestionTimeUp();
      }
    }
  }, [isTimeUp, timerMode, isSubmitting, handleQuestionTimeUp]);

  const handleNext = () => {
    if (!answers[currentQuestion.id]) {
      toast.error("Please select an answer before continuing");
      return;
    }

    if (isLastQuestion) {
      handleForceSubmit();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Force submit (used by auto-submit when time runs out)
  const handleForceSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Calculate score
      let score = 0;
      quiz.questions.forEach((question) => {
        if (answers[question.id]?.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()) {
          score++;
        }
      });

      const attemptData = {
        score,
        totalQuestions: quiz.questions.length,
        answers,
        completedAt: new Date().toISOString(),
      };

      // Always save attempt to sessionStorage for reliable access on results page
      sessionStorage.setItem(`attempt-${quiz.id}`, JSON.stringify(attemptData));

      // For local quizzes, just redirect
      if (quiz.id.startsWith('local-')) {
        router.push(`/quiz/${quiz.id}/results`);
        return;
      }

      // Try to save attempt to database (but don't block on it)
      try {
        const response = await fetch("/api/attempts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quizId: quiz.id,
            userId,
            score,
            totalQuestions: quiz.questions.length,
            answers,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          router.push(`/quiz/${quiz.id}/results?attemptId=${data.attemptId}`);
          return;
        }
      } catch (dbError) {
        console.error("Failed to save to database:", dbError);
      }

      // If DB save failed, still redirect (sessionStorage has the data)
      router.push(`/quiz/${quiz.id}/results`);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      // On any error, try to save locally and continue
      const attemptData = {
        score: quiz.questions.filter(q => 
          answers[q.id]?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()
        ).length,
        totalQuestions: quiz.questions.length,
        answers,
        completedAt: new Date().toISOString(),
      };
      sessionStorage.setItem(`attempt-${quiz.id}`, JSON.stringify(attemptData));
      router.push(`/quiz/${quiz.id}/results`);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-800/50 backdrop-blur-xl bg-slate-950/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </Link>
              <div>
                <h1 className="text-lg font-bold text-white">{quiz.title}</h1>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  {quiz.subject}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Timer Display */}
              {timerMode === "none" ? (
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-5 h-5" />
                  <span className="font-mono text-lg">{formatTime(timeElapsed)}</span>
                </div>
              ) : (
                <motion.div
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isTimeWarning
                      ? "bg-red-500/20 text-red-400"
                      : "bg-slate-800/50 text-slate-300"
                  }`}
                  animate={isTimeWarning ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ repeat: isTimeWarning ? Infinity : 0, duration: 1 }}
                >
                  {isTimeWarning && <AlertTriangle className="w-5 h-5" />}
                  <Clock className={`w-5 h-5 ${isTimeWarning ? "text-red-400" : ""}`} />
                  <span className={`font-mono text-lg font-bold ${isTimeWarning ? "text-red-400" : ""}`}>
                    {formatCountdown(timeRemaining)}
                  </span>
                  {timerMode === "question" && (
                    <span className="text-xs text-slate-500 ml-1">/ question</span>
                  )}
                </motion.div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 bg-slate-900/50 border-slate-800/50 backdrop-blur">
                {/* Question Timer Progress (for question mode) */}
                {timerMode === "question" && (
                  <div className="mb-6">
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full transition-colors ${
                          isTimeWarning ? "bg-red-500" : "bg-gradient-to-r from-purple-500 to-blue-500"
                        }`}
                        initial={{ width: "100%" }}
                        animate={{ width: `${(timeRemaining / timeLimit) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className={`text-xs mt-1 text-right ${isTimeWarning ? "text-red-400" : "text-slate-500"}`}>
                      {timeRemaining} seconds remaining
                    </p>
                  </div>
                )}

                {/* Question */}
                <div className="mb-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-purple-400">
                        {currentQuestionIndex + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white leading-relaxed">
                        {currentQuestion.question}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Answer Options */}
                <div className="space-y-4 mb-8">
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
                          transition={{ delay: index * 0.1 }}
                        >
                          <Label
                            htmlFor={`option-${index}`}
                            className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              answers[currentQuestion.id] === option
                                ? "border-purple-500 bg-purple-500/10"
                                : "border-slate-700 hover:border-slate-600"
                            }`}
                          >
                            <RadioGroupItem
                              value={option}
                              id={`option-${index}`}
                              className="text-purple-500"
                            />
                            <span className="text-lg text-white flex-1">{option}</span>
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
                          transition={{ delay: index * 0.1 }}
                        >
                          <Label
                            htmlFor={`option-${index}`}
                            className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              answers[currentQuestion.id] === option
                                ? "border-purple-500 bg-purple-500/10"
                                : "border-slate-700 hover:border-slate-600"
                            }`}
                          >
                            <RadioGroupItem
                              value={option}
                              id={`option-${index}`}
                              className="text-purple-500"
                            />
                            <span className="text-lg text-white flex-1">{option}</span>
                          </Label>
                        </motion.div>
                      ))}
                    </RadioGroup>
                  )}

                  {currentQuestion.type === "fill_blank" && (
                    <div>
                      <Input
                        value={answers[currentQuestion.id] || ""}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                        placeholder="Type your answer here..."
                        className="text-lg p-6 bg-slate-800/50 border-slate-700 text-white"
                      />
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-4">
                  <Button
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    variant="outline"
                    className="flex-1"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {isSubmitting ? (
                      "Submitting..."
                    ) : isLastQuestion ? (
                      "Submit Quiz"
                    ) : (
                      <>
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </Card>

              {/* Question Indicators */}
              <div className="flex flex-wrap gap-2 mt-6 justify-center">
                {quiz.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                      index === currentQuestionIndex
                        ? "bg-purple-600 text-white"
                        : answers[quiz.questions[index].id]
                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
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
    </div>
  );
}
