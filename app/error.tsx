"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log to an error reporting service
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        fontFamily: "var(--font-inter), sans-serif",
        background:
          "linear-gradient(135deg, #0a0a0f 0%, #0f1117 40%, #111827 70%, #0c1020 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>

        <h1
          className="text-3xl sm:text-4xl font-bold text-white mb-3"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          Something went wrong
        </h1>

        <p className="text-base text-slate-400 mb-8">
          An unexpected error occurred. You can try again or go back to the
          dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            className="bg-white text-slate-950 hover:bg-slate-100 h-12 rounded-xl font-semibold px-6"
          >
            Try Again
          </Button>
          <Button
            onClick={() => (window.location.href = "/dashboard")}
            variant="outline"
            className="h-12 rounded-xl font-semibold px-6 border-white/10 text-white hover:bg-white/5"
          >
            Go to Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
