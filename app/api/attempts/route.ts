import { NextRequest, NextResponse } from "next/server";
import { createAttempt } from "@/lib/db";

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
