/**
 * AppLogo — Re-vision brand mark
 *
 * Icon: open book with a spark above it, symbolising the transformation
 *       of study notes into active insight (the core purpose of the app).
 *
 * Wordmark: Playfair Display serif — academic, elegant, typographic.
 *           "Re-" in white, "vision" in slightly dimmer white so the
 *           hyphen reads as a meaningful word-break (re-seeing your notes).
 */

interface AppLogoProps {
  /** Icon container size class — defaults to "w-9 h-9 sm:w-10 sm:h-10" */
  size?: "sm" | "md" | "lg";
  /** Show/hide the wordmark next to the icon */
  showName?: boolean;
  /** Extra className on the wrapper */
  className?: string;
}

const SIZES = {
  sm: {
    box: "w-8 h-8",
    svg: 16,
    text: "text-base",
  },
  md: {
    box: "w-9 h-9 sm:w-10 sm:h-10",
    svg: 18,
    text: "text-lg sm:text-xl",
  },
  lg: {
    box: "w-14 h-14",
    svg: 26,
    text: "text-2xl sm:text-3xl",
  },
};

export function AppLogo({
  size = "md",
  showName = true,
  className = "",
}: AppLogoProps) {
  const s = SIZES[size];

  return (
    <span className={`flex items-center gap-2 sm:gap-2.5 ${className}`}>
      {/* Icon box */}
      <span
        className={`${s.box} rounded-xl bg-white flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-slate-100`}
      >
        <BookSparkIcon size={s.svg} />
      </span>

      {/* Wordmark */}
      {showName && (
        <span
          className={`${s.text} font-bold tracking-tight leading-none select-none`}
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          <span className="text-white">Re</span>
          <span className="text-white/60">-</span>
          <span className="text-white">vision</span>
        </span>
      )}
    </span>
  );
}

/**
 * Standalone icon-only variant — for places where no name is needed
 * (quiz-taking nav, 404 page, etc.)
 */
export function AppIcon({
  size = "md",
  className = "",
}: Omit<AppLogoProps, "showName">) {
  const s = SIZES[size];
  return (
    <span
      className={`${s.box} rounded-xl bg-white flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-slate-100 ${className}`}
    >
      <BookSparkIcon size={s.svg} />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* SVG: open book with a small spark/flash above the spine             */
/* ------------------------------------------------------------------ */

function BookSparkIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Left page of open book */}
      <path
        d="M12 19C12 19 5 16.5 5 10V6.5C7.5 6.5 10 7.5 12 9"
        stroke="#0a0a0f"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right page of open book */}
      <path
        d="M12 19C12 19 19 16.5 19 10V6.5C16.5 6.5 14 7.5 12 9"
        stroke="#0a0a0f"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Spine / centre line */}
      <line
        x1="12"
        y1="9"
        x2="12"
        y2="19"
        stroke="#0a0a0f"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Spark / lightning bolt above the book — represents AI insight */}
      <path
        d="M13.5 2L11 5.5H13L10.5 9"
        stroke="#0a0a0f"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
