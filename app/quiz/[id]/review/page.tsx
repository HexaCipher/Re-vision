"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import QuizReviewClient from "@/components/quiz/QuizReviewClient";
import { Loader2 } from "lucide-react";

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

      // Fetch latest attempt
      const attemptsRes = await fetch(`/api/quizzes/${quizId}/attempts`);
      if (attemptsRes.ok) {
        const attempts = await attemptsRes.json();
        if (attempts.length > 0) {
          setUserAnswers(attempts[0].answers || {});
        }
      }
    } catch (e) {
      setError("Failed to load review data");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-slate-400">Loading review...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || "Quiz not found"}</p>
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
    <QuizReviewClient
      quiz={quiz}
      userAnswers={userAnswers}
    />
  );
}
