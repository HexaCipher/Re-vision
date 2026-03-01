"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Brain,
  Target,
  TrendingUp,
  Calendar,
  Trash2,
  Play,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import ShareModal from "@/components/quiz/ShareModal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Navbar } from "@/components/ui/Navbar";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/PageTransition";

interface Quiz {
  id: string;
  title: string;
  subject: string;
  created_at?: string;
  createdAt?: string;
  questions: any;
}

interface DashboardClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
  };
  quizzes: Quiz[];
  stats: {
    totalQuizzes: number;
    totalAttempts: number;
    bestScore: number;
  };
}

export default function DashboardClient({
  user,
  quizzes: serverQuizzes,
  stats: serverStats,
}: DashboardClientProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>(serverQuizzes);
  const [stats, setStats] = useState(serverStats);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedQuizForShare, setSelectedQuizForShare] = useState<Quiz | null>(null);

  const handleShareQuiz = (quiz: Quiz) => {
    setSelectedQuizForShare(quiz);
    setShareModalOpen(true);
  };

  // Sync with server data when it changes
  useEffect(() => {
    setAllQuizzes(serverQuizzes);
    setStats(serverStats);
  }, [serverQuizzes, serverStats]);

  const handleDeleteQuiz = async (quizId: string) => {
    setIsDeleting(quizId);
    try {
      const response = await fetch(`/api/quizzes/${quizId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete quiz");

      // Remove from state immediately for instant UI update
      setAllQuizzes(prev => prev.filter(q => q.id !== quizId));
      setStats(prev => ({ ...prev, totalQuizzes: Math.max(0, prev.totalQuizzes - 1) }));
      
      // Clear any session/local data for this quiz
      sessionStorage.removeItem(`quiz-${quizId}`);
      sessionStorage.removeItem(`attempt-${quizId}`);
      localStorage.removeItem(`quiz-history-${quizId}`);
      
      toast.success("Quiz deleted successfully");
    } catch (error) {
      toast.error("Failed to delete quiz");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <PageTransition className="min-h-screen" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
      {/* Navigation */}
      <Navbar user={user} />

      {/* Background gradient */}
      <div 
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, transparent 50%, rgba(16,185,129,0.04) 100%)" }}
      />

      {/* Main Content */}
      <div className="container mx-auto px-6 lg:px-10 pt-28 pb-12">
        {/* Header */}
        <FadeIn className="mb-12">
          <p className="text-base text-indigo-400 font-semibold tracking-widest uppercase mb-4">Dashboard</p>
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-3"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Welcome back, {user.name.split(' ')[0]}
          </h1>
          <p className="text-lg text-slate-400">
            Ready to master your subjects?
          </p>
        </FadeIn>

        {/* Stats Cards */}
        <FadeIn delay={0.1} className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SpotlightCard className="p-6 bg-white/[0.02] border-indigo-500/20 backdrop-blur-md rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-500/15 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                  <Brain className="w-7 h-7 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Total Quizzes</p>
                  <p className="text-4xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>{stats.totalQuizzes}</p>
                </div>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-6 bg-white/[0.02] border-emerald-500/20 backdrop-blur-md rounded-2xl" spotlightColor="rgba(16, 185, 129, 0.12)">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-500/15 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                  <Target className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Total Attempts</p>
                  <p className="text-4xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>{stats.totalAttempts}</p>
                </div>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-6 bg-white/[0.02] border-amber-500/20 backdrop-blur-md rounded-2xl" spotlightColor="rgba(245, 158, 11, 0.12)">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-amber-500/15 rounded-2xl flex items-center justify-center border border-amber-500/20">
                  <TrendingUp className="w-7 h-7 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Best Score</p>
                  <p className="text-4xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>{stats.bestScore}%</p>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </FadeIn>

        {/* Quizzes Section */}
        <FadeIn delay={0.2}>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>Your Quizzes</h2>
            <Link href="/dashboard/create">
              <Button className="bg-white text-slate-950 hover:bg-slate-100 font-semibold h-12 px-6 rounded-xl">
                <Plus className="w-5 h-5 mr-2" />
                Create Quiz
              </Button>
            </Link>
          </div>

          {/* Empty State */}
          {allQuizzes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <SpotlightCard className="p-12 text-center bg-white/[0.02] border-white/10 backdrop-blur-md rounded-3xl">
                <div className="w-20 h-20 bg-indigo-500/15 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
                  <Brain className="w-10 h-10 text-indigo-400" />
                </div>
                <h3 
                  className="text-3xl font-bold text-white mb-3"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  No quizzes yet
                </h3>
                <p className="text-slate-400 mb-8 max-w-md mx-auto text-lg">
                  Upload your first notes to generate an AI-powered quiz and start mastering your subject.
                </p>
                <Link href="/dashboard/create">
                  <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-100 font-bold text-base px-8 h-14 rounded-xl">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your First Quiz
                  </Button>
                </Link>
              </SpotlightCard>
            </motion.div>
          ) : (
            /* Quiz Grid */
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allQuizzes.map((quiz) => (
                <StaggerItem key={quiz.id} className="h-full">
                  <SpotlightCard className="p-6 h-full backdrop-blur-md bg-white/[0.02] border-white/10 rounded-2xl hover:border-white/20 transition-colors duration-300">
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                        <Badge className="bg-indigo-500/15 text-indigo-400 border-indigo-500/25 hover:bg-indigo-500/20 font-medium">
                          {quiz.subject}
                        </Badge>
                        <div className="flex gap-1">
                          {/* Share button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl h-9 w-9"
                            onClick={() => handleShareQuiz(quiz)}
                            title="Share quiz"
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl h-9 w-9"
                            onClick={() => handleDeleteQuiz(quiz.id)}
                            disabled={isDeleting === quiz.id}
                            title="Delete quiz"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 flex-grow">
                        {quiz.title}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(quiz.created_at || quiz.createdAt || Date.now()).toLocaleDateString()}
                      </div>

                      <div className="text-sm text-slate-500 mb-6">
                        {Array.isArray(quiz.questions) ? quiz.questions.length : 0} questions
                      </div>

                      <Link href={`/quiz/${quiz.id}/take`} className="mt-auto">
                        <Button className="w-full bg-white text-slate-950 hover:bg-slate-100 font-semibold h-12 rounded-xl">
                          <Play className="w-4 h-4 mr-2" />
                          Start Quiz
                        </Button>
                      </Link>
                    </div>
                  </SpotlightCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </FadeIn>
      </div>

      {/* Share Modal */}
      {selectedQuizForShare && (
        <ShareModal
          isOpen={shareModalOpen}
          onClose={() => {
            setShareModalOpen(false);
            setSelectedQuizForShare(null);
          }}
          quizId={selectedQuizForShare.id}
          quizTitle={selectedQuizForShare.title}
        />
      )}
    </PageTransition>
  );
}
