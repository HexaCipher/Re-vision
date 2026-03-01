import { SignIn } from "@clerk/nextjs";
import { AppIcon } from "@/components/ui/AppLogo";

export default function SignInPage() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
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
            Welcome back
          </h1>
          <p className="text-slate-400 text-sm">
            Sign in to continue to Re-vision
          </p>
        </div>

        {/* Clerk SignIn */}
        <SignIn
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
          path="/sign-in"
          signUpUrl="/sign-up"
          redirectUrl="/dashboard"
        />
      </div>
    </div>
  );
}
