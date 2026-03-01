import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log("=== FIREBASE TEST API ===");
  
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    tests: {},
  };

  // Test 1: Check if db is initialized
  try {
    results.tests = {
      ...results.tests as object,
      dbInitialized: !!db,
    };
    console.log("DB initialized:", !!db);
  } catch (error) {
    results.tests = {
      ...results.tests as object,
      dbInitialized: false,
      dbError: error instanceof Error ? error.message : String(error),
    };
  }

  // Test 2: Try to read from quizzes collection
  try {
    const quizzesRef = collection(db, "quizzes");
    const snapshot = await getDocs(quizzesRef);
    results.tests = {
      ...results.tests as object,
      readQuizzes: true,
      quizCount: snapshot.size,
    };
    console.log("Read quizzes success, count:", snapshot.size);
  } catch (error) {
    results.tests = {
      ...results.tests as object,
      readQuizzes: false,
      readError: error instanceof Error ? error.message : String(error),
    };
    console.error("Read quizzes error:", error);
  }

  // Test 3: Try to write a test document
  let testDocId: string | null = null;
  try {
    const testRef = collection(db, "test_connection");
    const docRef = await addDoc(testRef, {
      test: true,
      created_at: Timestamp.now(),
    });
    testDocId = docRef.id;
    results.tests = {
      ...results.tests as object,
      writeTest: true,
      testDocId: docRef.id,
    };
    console.log("Write test success, doc ID:", docRef.id);
  } catch (error) {
    results.tests = {
      ...results.tests as object,
      writeTest: false,
      writeError: error instanceof Error ? error.message : String(error),
    };
    console.error("Write test error:", error);
  }

  // Test 4: Clean up test document
  if (testDocId) {
    try {
      await deleteDoc(doc(db, "test_connection", testDocId));
      results.tests = {
        ...results.tests as object,
        deleteTest: true,
      };
      console.log("Delete test success");
    } catch (error) {
      results.tests = {
        ...results.tests as object,
        deleteTest: false,
        deleteError: error instanceof Error ? error.message : String(error),
      };
      console.error("Delete test error:", error);
    }
  }

  return NextResponse.json(results);
}
