"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
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
        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
          <Brain className="w-8 h-8 text-slate-400" />
        </div>

        <h1
          className="text-6xl sm:text-7xl font-bold text-white mb-4"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          404
        </h1>

        <p className="text-lg text-slate-400 mb-8">
          This page doesn&apos;t exist. It might have been moved or deleted.
        </p>

        <Link href="/dashboard">
          <Button className="bg-white text-slate-950 hover:bg-slate-100 h-12 sm:h-14 rounded-xl font-semibold px-8">
            Back to Dashboard
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
