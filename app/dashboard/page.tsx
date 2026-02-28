import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { getQuizzesByUser, getUserStats } from "@/lib/db";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch user's quizzes and stats with error handling
  let quizzes: Array<{
    id: string;
    title: string;
    subject: string;
    created_at?: string;
    questions: any;
  }> = [];
  let stats = { totalQuizzes: 0, totalAttempts: 0, bestScore: 0 };

  try {
    const dbQuizzes = await getQuizzesByUser(user.id);
    quizzes = dbQuizzes.map((q) => ({
      id: q.id,
      title: q.title,
      subject: q.subject,
      created_at: q.created_at,
      questions: q.questions,
    }));
    stats = await getUserStats(user.id);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    // Continue with empty data rather than crashing
  }

  return (
    <DashboardClient
      user={{
        id: user.id,
        name: user.firstName || "Student",
        email: user.emailAddresses[0]?.emailAddress || "",
        imageUrl: user.imageUrl,
      }}
      quizzes={quizzes}
      stats={stats}
    />
  );
}
