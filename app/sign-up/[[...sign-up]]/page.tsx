import { SignUp } from "@clerk/nextjs";
import { AppIcon } from "@/components/ui/AppLogo";

export default function SignUpPage() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-8"
      style={{
        background:
          "linear-gradient(135deg, #0a0a0f 0%, #0f1117 40%, #111827 70%, #0c1020 100%)",
      }}
    >
      {/* Subtle background accent */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(99,102,241,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <AppIcon size="lg" />
          </div>
          <h1
            className="text-3xl font-bold text-white mb-2"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Create your account
          </h1>
          <p className="text-slate-400 text-sm">
            Start transforming your notes into quizzes
          </p>
        </div>

        {/* Clerk SignUp */}
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto w-full",
              cardBox: "w-full shadow-none",
              card: "bg-white/[0.02] backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40 rounded-2xl sm:rounded-3xl w-full",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              footer: "bg-transparent",
            },
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          redirectUrl="/dashboard"
        />
      </div>
    </div>
  );
}
