import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Attempt ID is required" },
        { status: 400 }
      );
    }

    const docRef = doc(db, "attempts", id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return NextResponse.json(
        { error: "Attempt not found" },
        { status: 404 }
      );
    }

    const data = snapshot.data();
    return NextResponse.json({
      id: snapshot.id,
      quizId: data.quiz_id,
      userId: data.user_id,
      score: data.score,
      totalQuestions: data.total_questions,
      answers: data.answers,
      completedAt: data.completed_at?.toDate?.()?.toISOString() || data.completed_at,
    });
  } catch (error: any) {
    console.error("Error fetching attempt:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch attempt" },
      { status: 500 }
    );
  }
}
