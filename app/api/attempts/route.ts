import { NextRequest, NextResponse } from "next/server";
import { createAttempt, getAttemptsByQuiz } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const quizId = request.nextUrl.searchParams.get("quizId");

    if (!quizId) {
      return NextResponse.json(
        { error: "Missing quizId parameter" },
        { status: 400 }
      );
    }

    const attempts = await getAttemptsByQuiz(quizId);
    return NextResponse.json(attempts);
  } catch (error: any) {
    console.error("Error fetching attempts:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch attempts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quizId, userId, score, totalQuestions, answers } = body;

    if (!quizId || !userId || score === undefined || !totalQuestions || !answers) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const attempt = await createAttempt({
      quizId,
      userId,
      score,
      totalQuestions,
      answers,
    });

    return NextResponse.json({ attemptId: attempt.id, success: true });
  } catch (error: any) {
    console.error("Error creating attempt:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save attempt" },
      { status: 500 }
    );
  }
}
