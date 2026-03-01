"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import QuizTakingClient from "@/components/quiz/QuizTakingClient";
import { QuizLoader } from "@/components/ui/QuizLoader";

interface Quiz {
  id: string;
  title: string;
  subject: string;
  questions: any[];
  timerMode?: "none" | "quiz" | "question";
  timeLimit?: number;
}

export default function QuizTakePage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
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
      if (storedQuiz) {
        try {
          const quizData = JSON.parse(storedQuiz);
          setQuiz(quizData);
          setLoading(false);
        } catch (e) {
          setError("Failed to load quiz data");
          setLoading(false);
        }
      } else {
        setError("Quiz not found. Please create a new quiz.");
        setLoading(false);
      }
    } else {
      // Fetch from API/database for non-local quizzes
      fetchQuizFromDB(quizId);
    }
  }, [quizId, user, isLoaded, router]);

  const fetchQuizFromDB = async (id: string) => {
    try {
      const response = await fetch(`/api/quizzes/${id}`);
      if (!response.ok) {
        throw new Error("Quiz not found");
      }
      const data = await response.json();
      setQuiz(data);
    } catch (e) {
      setError("Failed to load quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !isLoaded) {
    return <QuizLoader />;
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
    <QuizTakingClient
      quiz={{
        id: quiz.id,
        title: quiz.title,
        subject: quiz.subject,
        questions: quiz.questions,
        timerMode: quiz.timerMode,
        timeLimit: quiz.timeLimit,
      }}
      userId={user?.id || ""}
    />
  );
}
