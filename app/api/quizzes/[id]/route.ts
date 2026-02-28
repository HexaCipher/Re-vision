import { NextRequest, NextResponse } from "next/server";
import { deleteQuiz, getQuizById } from "@/lib/db";

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
    });
  } catch (error: any) {
    console.error("Error fetching quiz:", error);
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

    await deleteQuiz(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting quiz:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete quiz" },
      { status: 500 }
    );
  }
}
