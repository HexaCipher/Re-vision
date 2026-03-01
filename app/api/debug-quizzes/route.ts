import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, limit } from "firebase/firestore";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  
  console.log("=== DEBUG QUIZZES API ===");
  console.log("Query userId:", userId);
  
  try {
    const quizzesRef = collection(db, "quizzes");
    
    // First, get ALL quizzes to see what's in the database
    const allSnapshot = await getDocs(quizzesRef);
    console.log("Total quizzes in database:", allSnapshot.size);
    
    const allQuizzes = allSnapshot.docs.map(doc => ({
      id: doc.id,
      user_id: doc.data().user_id,
      title: doc.data().title,
      subject: doc.data().subject,
      created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
    }));
    
    // If userId provided, also get filtered results
    let userQuizzes: typeof allQuizzes = [];
    if (userId) {
      const userQuery = query(quizzesRef, where('user_id', '==', userId));
      const userSnapshot = await getDocs(userQuery);
      console.log("Quizzes for user", userId, ":", userSnapshot.size);
      
      userQuizzes = userSnapshot.docs.map(doc => ({
        id: doc.id,
        user_id: doc.data().user_id,
        title: doc.data().title,
        subject: doc.data().subject,
        created_at: doc.data().created_at?.toDate?.()?.toISOString() || doc.data().created_at,
      }));
    }
    
    return NextResponse.json({
      success: true,
      totalQuizzes: allQuizzes.length,
      allQuizzes: allQuizzes.slice(0, 10), // Only show first 10
      queriedUserId: userId,
      userQuizzes: userQuizzes,
      userQuizCount: userQuizzes.length,
    });
  } catch (error) {
    console.error("Debug quizzes error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
