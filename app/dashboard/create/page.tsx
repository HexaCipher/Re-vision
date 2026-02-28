"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Brain, FileText, Upload, Sparkles, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export default function CreateQuizPage() {
  const router = useRouter();
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [inputType, setInputType] = useState<"text" | "pdf">("text");
  const [isGenerating, setIsGenerating] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    content: "",
    questionCount: 10,
    questionTypes: ["mcq"] as string[],
  });

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (inputType === "text" && !formData.content.trim()) {
        toast.error("Please enter your notes");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!formData.title.trim()) {
        toast.error("Please enter a quiz title");
        return;
      }
      if (!formData.subject.trim()) {
        toast.error("Please select a subject");
        return;
      }
      handleGenerateQuiz();
    }
  };

  const handleGenerateQuiz = async () => {
    if (!user) {
      toast.error("Please sign in to generate a quiz");
      return;
    }

    setIsGenerating(true);
    try {
      console.log("Sending quiz generation request...", {
        userId: user.id,
        title: formData.title,
        subject: formData.subject,
        contentLength: formData.content.length,
        questionCount: formData.questionCount,
        questionTypes: formData.questionTypes,
      });
      
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          title: formData.title,
          subject: formData.subject,
          content: formData.content,
          questionCount: formData.questionCount,
          questionTypes: formData.questionTypes,
        }),
      });

      console.log("Response status:", response.status);
      
      const data = await response.json();
      console.log("Response data:", data);
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate quiz");
      }

      toast.success("Quiz generated successfully!");
      
      // Store quiz data for the take page
      const quizData = {
        id: data.quizId,
        title: formData.title,
        subject: formData.subject,
        questions: data.questions,
        createdAt: new Date().toISOString(),
      };
      
      // Store in sessionStorage for the take page
      sessionStorage.setItem(`quiz-${data.quizId}`, JSON.stringify(quizData));
      
      // Also store in localStorage for the dashboard to display
      const existingQuizzes = JSON.parse(localStorage.getItem('local-quizzes') || '[]');
      existingQuizzes.unshift(quizData);
      localStorage.setItem('local-quizzes', JSON.stringify(existingQuizzes));
      
      router.push(`/quiz/${data.quizId}/take`);
    } catch (error: any) {
      console.error("Quiz generation error:", error);
      toast.error(error.message || "Failed to generate quiz");
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800/50 backdrop-blur-xl bg-slate-950/50">
        <div className="container mx-auto px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
            <span className="text-slate-400 hover:text-white transition-colors">
              Back to Dashboard
            </span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-bold text-white mb-2"
            >
              Create New Quiz
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400"
            >
              Step {step} of 3
            </motion.p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-all ${
                    i <= step
                      ? "bg-gradient-to-r from-purple-600 to-blue-600"
                      : "bg-slate-800"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="p-8 bg-slate-900/50 border-slate-800/50 backdrop-blur">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Choose Input Method
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setInputType("text")}
                      className={`p-6 rounded-xl border-2 transition-all text-left ${
                        inputType === "text"
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-slate-700 hover:border-slate-600"
                      }`}
                    >
                      <FileText
                        className={`w-8 h-8 mb-3 ${
                          inputType === "text" ? "text-purple-400" : "text-slate-400"
                        }`}
                      />
                      <h3 className="text-lg font-bold text-white mb-2">
                        Paste Text
                      </h3>
                      <p className="text-sm text-slate-400">
                        Copy and paste your notes directly
                      </p>
                    </button>

                    <button
                      onClick={() => setInputType("pdf")}
                      className={`p-6 rounded-xl border-2 transition-all text-left ${
                        inputType === "pdf"
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-slate-700 hover:border-slate-600"
                      }`}
                    >
                      <Upload
                        className={`w-8 h-8 mb-3 ${
                          inputType === "pdf" ? "text-purple-400" : "text-slate-400"
                        }`}
                      />
                      <h3 className="text-lg font-bold text-white mb-2">
                        Upload PDF
                      </h3>
                      <p className="text-sm text-slate-400">
                        Upload a PDF of your study notes
                      </p>
                      <Badge className="mt-2 bg-blue-500/20 text-blue-400 border-blue-500/30">
                        Coming Soon
                      </Badge>
                    </button>
                  </div>

                  <Button
                    onClick={handleNext}
                    disabled={inputType === "pdf"}
                    className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    Continue
                  </Button>
                </Card>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="p-8 bg-slate-900/50 border-slate-800/50 backdrop-blur">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Enter Your Notes
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="content" className="text-slate-300">
                        Paste your study notes here
                      </Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) =>
                          setFormData({ ...formData, content: e.target.value })
                        }
                        placeholder="Paste your notes, lecture content, or any text you want to learn from..."
                        className="mt-2 min-h-[300px] bg-slate-800/50 border-slate-700 text-white"
                      />
                      <p className="text-sm text-slate-400 mt-2">
                        {formData.content.length} characters
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <Button
                      onClick={() => setStep(1)}
                      variant="outline"
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleNext}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      Continue
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="p-8 bg-slate-900/50 border-slate-800/50 backdrop-blur">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Configure Your Quiz
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="title" className="text-slate-300">
                        Quiz Title
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="e.g., Chapter 5: Data Structures"
                        className="mt-2 bg-slate-800/50 border-slate-700 text-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-slate-300">
                        Subject
                      </Label>
                      <Select
                        value={formData.subject}
                        onValueChange={(value) =>
                          setFormData({ ...formData, subject: value })
                        }
                      >
                        <SelectTrigger className="mt-2 bg-slate-800/50 border-slate-700 text-white">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Computer Science">Computer Science</SelectItem>
                          <SelectItem value="Mathematics">Mathematics</SelectItem>
                          <SelectItem value="Physics">Physics</SelectItem>
                          <SelectItem value="Chemistry">Chemistry</SelectItem>
                          <SelectItem value="Biology">Biology</SelectItem>
                          <SelectItem value="History">History</SelectItem>
                          <SelectItem value="Literature">Literature</SelectItem>
                          <SelectItem value="Economics">Economics</SelectItem>
                          <SelectItem value="Law">Law</SelectItem>
                          <SelectItem value="Medicine">Medicine</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="questionCount" className="text-slate-300">
                        Number of Questions
                      </Label>
                      <Select
                        value={formData.questionCount.toString()}
                        onValueChange={(value) =>
                          setFormData({ ...formData, questionCount: parseInt(value) })
                        }
                      >
                        <SelectTrigger className="mt-2 bg-slate-800/50 border-slate-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 questions</SelectItem>
                          <SelectItem value="10">10 questions</SelectItem>
                          <SelectItem value="15">15 questions</SelectItem>
                          <SelectItem value="20">20 questions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-slate-300 mb-2 block">
                        Question Type
                      </Label>
                      <Select
                        value={formData.questionTypes[0]}
                        onValueChange={(value) =>
                          setFormData({ ...formData, questionTypes: [value] })
                        }
                      >
                        <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mcq">Multiple Choice</SelectItem>
                          <SelectItem value="true_false">True/False</SelectItem>
                          <SelectItem value="fill_blank">Fill in the Blanks</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <Button
                      onClick={() => setStep(2)}
                      variant="outline"
                      className="flex-1"
                      disabled={isGenerating}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={isGenerating}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Quiz
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading State */}
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8"
            >
              <Card className="p-8 bg-gradient-to-br from-purple-900/20 to-slate-900/20 border-purple-500/20 backdrop-blur text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Sparkles className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  AI is Reading Your Notes...
                </h3>
                <p className="text-slate-400">
                  Generating personalized questions. This takes about 10 seconds.
                </p>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
