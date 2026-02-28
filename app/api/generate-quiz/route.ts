import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { createQuiz } from "@/lib/db";
import { Question } from "@/types";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  console.log("=== QUIZ GENERATION API CALLED ===");
  
  try {
    let body;
    try {
      body = await request.json();
      console.log("Request body received:", JSON.stringify(body, null, 2));
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }
    
    const { userId, title, subject, content, questionCount, questionTypes } = body;

    if (!userId || !title || !subject || !content || !questionCount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if API key exists
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set");
      return NextResponse.json(
        { error: "API configuration error" },
        { status: 500 }
      );
    }

    console.log("Starting quiz generation...");
    console.log("Content length:", content.length);

    // Determine question type
    const questionType = questionTypes[0] || "mcq";

    const prompt = generatePrompt(content, questionCount, questionType);
    
    console.log("Calling Gemini API...");
    
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log("Gemini API call successful");
    console.log("Response length:", text.length);

    // Parse JSON response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response");
    }

    const questions: Question[] = JSON.parse(jsonMatch[0]).map(
      (q: any, index: number) => ({
        id: `q${index + 1}`,
        question: q.question,
        type: questionType,
        options: q.options || undefined,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || undefined,
        orderNumber: index + 1,
      })
    );

    // Try to save to database, but don't fail if it times out
    let quizId = `local-${Date.now()}`;
    try {
      console.log("Attempting to save to database...");
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database timeout')), 5000)
      );
      
      const savePromise = createQuiz({
        userId,
        title,
        subject,
        sourceType: "text",
        sourceContent: content,
        questions,
      });
      
      const quiz = await Promise.race([savePromise, timeoutPromise]) as any;
      quizId = quiz.id;
      console.log("Quiz saved to database:", quizId);
    } catch (dbError: any) {
      console.warn("Database save failed (continuing with local quiz):", dbError.message);
      // Continue without saving - quiz will work but won't persist
    }

    return NextResponse.json({ quizId, questions });
  } catch (error: any) {
    console.error("Error generating quiz:", error);
    console.error("Error details:", {
      message: error.message,
      cause: error.cause,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: error.message || "Failed to generate quiz" },
      { status: 500 }
    );
  }
}

function generatePrompt(
  content: string,
  questionCount: number,
  questionType: string
): string {
  const basePrompt = `You are an expert quiz generator. Analyze the following study notes and generate exactly ${questionCount} high-quality questions that test understanding of the key concepts.

Study Notes:
${content}

Requirements:`;

  if (questionType === "mcq") {
    return `${basePrompt}
- Generate ${questionCount} multiple choice questions
- Each question must have exactly 4 options (A, B, C, D)
- Only ONE option should be correct
- Questions should test understanding, not just memorization
- Include a brief explanation for the correct answer

Return ONLY a JSON array in this exact format:
[
  {
    "question": "What is...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option B",
    "explanation": "This is correct because..."
  }
]`;
  } else if (questionType === "true_false") {
    return `${basePrompt}
- Generate ${questionCount} true/false questions
- Make them challenging and thought-provoking
- Include a brief explanation

Return ONLY a JSON array in this exact format:
[
  {
    "question": "Statement to evaluate...",
    "correctAnswer": "True",
    "explanation": "This is true/false because..."
  }
]`;
  } else if (questionType === "fill_blank") {
    return `${basePrompt}
- Generate ${questionCount} fill-in-the-blank questions
- Use underscores (___) to indicate the blank
- Questions should have clear, single-word or short-phrase answers
- Include a brief explanation

Return ONLY a JSON array in this exact format:
[
  {
    "question": "The ___ is responsible for...",
    "correctAnswer": "CPU",
    "explanation": "The correct answer is..."
  }
]`;
  }

  return basePrompt;
}
