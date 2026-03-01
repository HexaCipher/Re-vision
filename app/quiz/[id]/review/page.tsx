"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import QuizReviewClient from "@/components/quiz/QuizReviewClient";
import { QuizLoader } from "@/components/ui/QuizLoader";

interface Quiz {
  id: string;
  title: string;
  subject: string;
  questions: any[];
}

export default function QuizReviewPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const quizId = params.id as string;

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
          const attemptData = JSON.parse(storedAttempt);
          setUserAnswers(attemptData.answers || {});
          setLoading(false);
        } catch (e) {
          setError("Failed to load review data");
          setLoading(false);
        }
      } else {
        setError("Quiz not found. Please take the quiz first.");
        setLoading(false);
      }
    } else {
      // Fetch from database for non-local quizzes
      fetchFromDB();
    }
  }, [quizId, user, isLoaded, router]);

  const fetchFromDB = async () => {
    try {
      // Fetch quiz
      const quizRes = await fetch(`/api/quizzes/${quizId}`);
      if (!quizRes.ok) throw new Error("Quiz not found");
      const quizData = await quizRes.json();
      setQuiz(quizData);

      // Fetch latest attempt — try sessionStorage first, then API
      const storedAttempt = sessionStorage.getItem(`attempt-${quizId}`);
      if (storedAttempt) {
        try {
          const attemptData = JSON.parse(storedAttempt);
          setUserAnswers(attemptData.answers || {});
        } catch {
          // fall through to API
        }
      } else {
        const attemptsRes = await fetch(`/api/attempts?quizId=${quizId}`);
        if (attemptsRes.ok) {
          const attempts = await attemptsRes.json();
          if (attempts.length > 0) {
            setUserAnswers(attempts[0].answers || {});
          }
        }
      }
    } catch (e) {
      setError("Failed to load review data");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !isLoaded) {
    return <QuizLoader message="Loading your review..." />;
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, transparent 50%, rgba(139,92,246,0.06) 100%)" }}>
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || "Quiz not found"}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-white text-slate-950 rounded-xl hover:bg-slate-100 transition-colors font-semibold"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <QuizReviewClient
      quiz={quiz}
      userAnswers={userAnswers}
    />
  );
}
