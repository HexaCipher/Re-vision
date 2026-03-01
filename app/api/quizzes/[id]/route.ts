import { NextRequest, NextResponse } from "next/server";
import { deleteQuiz, getQuizById } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Quiz ID is required" },
        { status: 400 }
      );
    }

    const quiz = await getQuizById(id);
    
    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: quiz.id,
      title: quiz.title,
      subject: quiz.subject,
      questions: quiz.questions,
      difficulty: quiz.difficulty,
      timerMode: quiz.timer_mode || 'none',
      timeLimit: quiz.time_limit ?? 10,
      userId: quiz.user_id,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch quiz" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Quiz ID is required" },
        { status: 400 }
      );
    }

    // Auth check: verify the requesting user owns this quiz
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const quiz = await getQuizById(id);
    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz not found" },
        { status: 404 }
      );
    }

    if (quiz.user_id !== userId) {
      return NextResponse.json(
        { error: "You do not have permission to delete this quiz" },
        { status: 403 }
      );
    }

    await deleteQuiz(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete quiz" },
      { status: 500 }
    );
  }
}
