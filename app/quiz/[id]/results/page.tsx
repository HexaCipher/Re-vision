"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import QuizResultsClient from "@/components/quiz/QuizResultsClient";
import { Loader2 } from "lucide-react";

interface Quiz {
  id: string;
  title: string;
  subject: string;
  questions: any[];
}

interface Attempt {
  score: number;
  totalQuestions: number;
  answers: Record<string, string>;
  completedAt: string;
}

export default function QuizResultsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const quizId = params.id as string;
  const attemptId = searchParams.get("attemptId");

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push("/sign-in");
      return;
    }

    // First, always check sessionStorage for attempt data (works for both local and DB quizzes)
    const storedAttempt = sessionStorage.getItem(`attempt-${quizId}`);
    const storedQuiz = sessionStorage.getItem(`quiz-${quizId}`);
    
    // For local quizzes, use sessionStorage only
    if (quizId.startsWith("local-")) {
      if (storedQuiz && storedAttempt) {
        try {
          setQuiz(JSON.parse(storedQuiz));
          setAttempt(JSON.parse(storedAttempt));
          setLoading(false);
        } catch (e) {
          setError("Failed to load results");
          setLoading(false);
        }
      } else {
        setError("Results not found. Please take the quiz again.");
        setLoading(false);
      }
    } else {
      // For DB quizzes, fetch quiz from DB but use sessionStorage for attempt if available
      fetchData(storedAttempt);
    }
  }, [quizId, attemptId, user, isLoaded, router]);

  const fetchData = async (storedAttempt: string | null) => {
    try {
      // Fetch quiz from database
      const quizRes = await fetch(`/api/quizzes/${quizId}`);
      if (!quizRes.ok) throw new Error("Quiz not found");
      const quizData = await quizRes.json();
      setQuiz(quizData);

      // First try sessionStorage (always populated after quiz submission)
      if (storedAttempt) {
        try {
          const attemptData = JSON.parse(storedAttempt);
          setAttempt(attemptData);
          setLoading(false);
          return;
        } catch (e) {
          // Fall through to DB fetch
        }
      }

      // If no sessionStorage and we have attemptId, try fetching from DB
      if (attemptId) {
        try {
          const attemptRes = await fetch(`/api/attempts/${attemptId}`);
          if (attemptRes.ok) {
            const attemptData = await attemptRes.json();
            setAttempt({
              score: attemptData.score,
              totalQuestions: attemptData.totalQuestions,
              answers: attemptData.answers,
              completedAt: attemptData.completedAt,
            });
            setLoading(false);
            return;
          }
        } catch (e) {
          // Fall through to error
        }
      }

      // If we have quiz but no attempt data, show error
      setError("Results not found. Please take the quiz again.");
    } catch (e) {
      setError("Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-slate-400">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz || !attempt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || "Results not found"}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <QuizResultsClient
      quiz={quiz}
      attempt={attempt}
    />
  );
}
