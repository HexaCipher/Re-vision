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

    // Check if this is a local quiz
    if (quizId.startsWith("local-")) {
      const storedQuiz = sessionStorage.getItem(`quiz-${quizId}`);
      const storedAttempt = sessionStorage.getItem(`attempt-${quizId}`);
      
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
      // Fetch from database for non-local quizzes
      fetchFromDB();
    }
  }, [quizId, attemptId, user, isLoaded, router]);

  const fetchFromDB = async () => {
    try {
      // Fetch quiz
      const quizRes = await fetch(`/api/quizzes/${quizId}`);
      if (!quizRes.ok) throw new Error("Quiz not found");
      const quizData = await quizRes.json();
      setQuiz(quizData);

      // Fetch attempt
      if (attemptId) {
        const attemptRes = await fetch(`/api/attempts/${attemptId}`);
        if (attemptRes.ok) {
          const attemptData = await attemptRes.json();
          setAttempt(attemptData);
        }
      }
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
