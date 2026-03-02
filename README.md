# Re-vision

**Transform your study notes into interactive quizzes — powered by AI.**

Re-vision is a full-stack web application that lets students upload or paste their notes and instantly generate personalized, exam-style quizzes using Google Gemini. Built for active recall and spaced repetition, it turns passive reading into an engaging learning loop.

---

## Features

- **AI Quiz Generation** — paste text, upload a PDF/DOCX/TXT file, or drop a YouTube link; AI produces targeted questions in under 10 seconds
- **YouTube Transcript Extraction** — paste any YouTube URL (watch, shorts, live, embed) and the transcript is fetched automatically with video thumbnail and title preview
- **Dual AI Providers** — Gemini 2.5 Flash (primary) with automatic Groq Llama 3.3 70B fallback when rate-limited. Users never see a "rate limited" error
- **Multiple Question Types** — multiple choice, true/false, and fill-in-the-blank
- **Difficulty Levels** — easy, medium, or hard
- **Timer Modes** — no timer, per-quiz countdown, or per-question countdown
- **Instant Feedback** — correct/incorrect with explanations on the review page
- **Attempt History** — score tracking across retakes with personal best detection
- **Shareable Quizzes** — generate a share code so anyone can take your quiz as a guest
- **Dashboard** — manage all your quizzes, view difficulty badges, delete with confirmation
- **Authentication** — secure sign-up/sign-in via Clerk
- **Confetti** — fires on scores 70%+ because students deserve it

---

## Tech Stack

### Core Framework

| Technology | Role | Why |
|---|---|---|
| **Next.js 16** (App Router) | Full-stack React framework | Server-side rendering, API routes, file-based routing, and middleware — all in one. The App Router enables streaming, server components, and parallel route loading for a fast user experience. |
| **TypeScript** | Type-safe JavaScript | Catches bugs at compile time, provides IntelliSense, and makes the codebase self-documenting. Essential for a multi-file project with shared types across frontend and API routes. |
| **React 19** | UI library | Latest React with server components support, improved hydration, and concurrent features. Powers the interactive quiz-taking experience and real-time state management. |

### Styling & UI

| Technology | Role | Why |
|---|---|---|
| **Tailwind CSS v4** | Utility-first CSS framework | Rapid UI development with zero-runtime CSS. v4 brings native CSS layers, automatic content detection, and smaller bundle sizes compared to v3. |
| **Shadcn/ui** | Pre-built UI components | High-quality, accessible, and customisable components (buttons, dialogs, inputs, cards) built on Radix UI primitives. Not a dependency — components are copied into the project for full control. |
| **Radix UI** | Headless UI primitives | Provides unstyled, accessible primitives (dropdowns, modals, radio groups) that Shadcn/ui builds on. Handles focus management, keyboard navigation, and ARIA attributes correctly. |
| **Framer Motion v12** | Animation library | Declarative, physics-based animations for page transitions, card reveals, and micro-interactions. Adds polish without complex CSS keyframes. |
| **Lucide React** | Icon library | Consistent, lightweight SVG icons. Tree-shakeable so only imported icons are bundled. |
| **Playfair Display + Inter** | Typography (Google Fonts) | Playfair Display for elegant serif headings, Inter for clean sans-serif body text. Pairing creates visual hierarchy and a premium feel. |

### Authentication

| Technology | Role | Why |
|---|---|---|
| **Clerk** | Authentication & user management | Drop-in auth with sign-up, sign-in, OAuth providers, and session management. Handles JWT tokens, middleware protection, and user metadata. Zero custom auth code needed — more secure than rolling our own. |
| **@clerk/nextjs** | Next.js integration | Provides `<ClerkProvider>`, `auth()` helper, and middleware for protecting routes. Seamless integration with App Router. |
| **@clerk/themes** | Clerk UI theming | Matches Clerk's pre-built sign-in/sign-up components to our dark charcoal design system. |

### Database

| Technology | Role | Why |
|---|---|---|
| **Firebase Firestore** | NoSQL cloud database | Real-time, serverless document database. No backend to manage — reads/writes happen directly from the client SDK. Scales automatically, generous free tier (1GB storage, 50K reads/day). Perfect for storing quizzes, attempts, and share codes. |

### AI / LLM

| Technology | Role | Why |
|---|---|---|
| **Google Gemini 2.5 Flash** | Primary AI model for quiz generation | Fast, accurate, and cost-effective. Supports structured JSON output via `responseMimeType: "application/json"`, eliminating the need for output parsing. Generates high-quality questions with explanations. |
| **Groq (Llama 3.3 70B)** | Fallback AI model | Automatic fallback when Gemini hits rate limits (20 req/day on free tier). Groq offers 1,000 req/day free with the fastest inference speeds available. Ensures users never see a "rate limited" error. |
| **@google/generative-ai** | Gemini SDK | Official Google AI SDK for Node.js. Handles API communication, token counting, and response streaming. |
| **groq-sdk** | Groq SDK | Official Groq SDK. Provides OpenAI-compatible chat completions interface for Llama 3.3 70B. |

### YouTube Transcript Pipeline

| Technology | Role | Why |
|---|---|---|
| **YouTube Innertube API** | Primary transcript fetcher | Direct access to YouTube's internal API using the ANDROID client. Returns caption URLs without the `exp=xpe` parameter that causes empty responses. Works from residential IPs (local dev) — free, no API key required. |
| **Supadata** (@supadata/js) | Fallback transcript fetcher | Reliable YouTube transcript extraction that works from datacenter IPs (Vercel). Automatically engaged when innertube is blocked. Free tier: 100 transcripts/month. Solves the critical Vercel deployment blocker. |

### File Parsing

| Technology | Role | Why |
|---|---|---|
| **unpdf** | PDF text extraction | Lightweight PDF parser that extracts text content from uploaded PDF files. Works in Node.js serverless functions without native dependencies (unlike `pdf-parse`). |
| **mammoth** | DOCX text extraction | Converts `.docx` files to plain text. Handles complex Word documents with formatting, tables, and embedded content. |

### UX Enhancements

| Technology | Role | Why |
|---|---|---|
| **Sonner** | Toast notifications | Beautiful, stackable toast notifications for success/error/warning feedback. Minimal API: `toast.success("Quiz created!")`. |
| **canvas-confetti** | Celebration animation | Fires confetti particles when a student scores 70%+. Small reward that makes studying feel more satisfying. |
| **next-themes** | Theme management | Handles dark/light mode switching with SSR support. Prevents flash of unstyled content on page load. |

### Development Tools

| Technology | Role | Why |
|---|---|---|
| **ESLint** | Code linting | Catches code quality issues and enforces consistent style across the codebase. |
| **Turbopack** | Dev server bundler | Next.js's Rust-based bundler for development. 10x faster hot module replacement compared to webpack. |
| **PostCSS** | CSS processing | Required by Tailwind CSS v4 for processing utility classes into optimised CSS. |
| **tw-animate-css** | Tailwind animation utilities | Adds animation utility classes (fade-in, slide-up, etc.) for Tailwind CSS. Used by Shadcn/ui components. |

### Deployment

| Technology | Role | Why |
|---|---|---|
| **Vercel** | Hosting & deployment | Purpose-built for Next.js. Automatic builds on git push, edge network CDN, serverless functions for API routes, and environment variable management. Zero-config deployment. |

---

## Prerequisites

- Node.js 18 or later
- A [Clerk](https://clerk.com) account (free tier works)
- A [Firebase](https://console.firebase.google.com) project with Firestore enabled
- A [Google AI Studio](https://aistudio.google.com) API key for Gemini
- A [Groq](https://console.groq.com) API key (free — 1,000 req/day)
- A [Supadata](https://supadata.ai) API key (free — 100 transcripts/month, needed for YouTube on Vercel)

---

## Local Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd re-vision
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root and fill in all values:

```env
# Clerk — https://dashboard.clerk.com → your app → API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Firebase — https://console.firebase.google.com → Project settings → Your apps
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Google Gemini — https://aistudio.google.com/app/apikey
GEMINI_API_KEY=

# Groq (AI fallback) — https://console.groq.com/keys
GROQ_API_KEY=

# Supadata (YouTube transcripts on Vercel) — https://supadata.ai
SUPADATA_API_KEY=
```

### 4. Set up Firebase Firestore

1. Go to [Firebase Console](https://console.firebase.google.com) and create a project (or use an existing one)
2. Enable **Firestore Database** (start in production mode)
3. Add the following **Firestore Security Rules** so only authenticated users can read/write their own data:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /quizzes/{quizId} {
      allow read: if resource.data.shareCode != null
                  || request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null
                            && request.auth.uid == resource.data.userId;
    }
    match /attempts/{attemptId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

4. Copy your Firebase config values into `.env.local` (Project settings → General → Your apps → Firebase SDK snippet → Config)

### 5. Set up Clerk

1. Create an application at [clerk.com](https://clerk.com)
2. Copy the **Publishable Key** and **Secret Key** from the Clerk dashboard into `.env.local`
3. In the Clerk dashboard, add `http://localhost:3000` to **Allowed redirect URLs**

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
re-vision/
├── app/
│   ├── api/                     # API route handlers
│   │   ├── generate-quiz/       # Gemini → Groq fallback quiz generation
│   │   ├── fetch-transcript/    # YouTube transcript (innertube → Supadata)
│   │   ├── quizzes/[id]/        # CRUD for individual quizzes
│   │   ├── attempts/            # Attempt recording
│   │   ├── shared/              # Guest share flow
│   │   └── upload/document/     # PDF/DOCX text extraction
│   ├── dashboard/               # Authenticated dashboard + create flow
│   ├── quiz/[id]/               # Take, results, review pages
│   ├── quiz/share/[code]/       # Guest quiz flow
│   ├── sign-in/ & sign-up/      # Clerk auth pages (custom styled)
│   └── page.tsx                 # Landing page
├── components/
│   ├── ui/                      # Shared UI (Navbar, AppLogo, QuizLoader, …)
│   ├── dashboard/               # Dashboard-specific components
│   └── quiz/                    # Quiz taking, results, review clients
├── lib/
│   ├── db.ts                    # Firestore helpers
│   └── firebase.ts              # Firebase initialisation
├── types/
│   └── index.ts                 # Shared TypeScript types
└── public/                      # Static assets (SVG icons, OG image)
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Create optimised production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Deployment

The recommended platform is [Vercel](https://vercel.com):

1. Push your repository to GitHub
2. Import the project in the Vercel dashboard
3. Add all environment variables from `.env.local` in **Project → Settings → Environment Variables**
4. Deploy — Vercel auto-detects Next.js and configures everything

> **Note:** Clerk's "Development instance" banner is only visible in dev mode. It disappears automatically when you deploy with production Clerk keys on a real domain.

---

## Environment Variables Reference

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk dashboard → API Keys |
| `CLERK_SECRET_KEY` | Clerk dashboard → API Keys |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase console → Project settings |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase console → Project settings |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase console → Project settings |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase console → Project settings |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase console → Project settings |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase console → Project settings |
| `GEMINI_API_KEY` | Google AI Studio → Get API key |
| `GROQ_API_KEY` | Groq Console → API Keys |
| `SUPADATA_API_KEY` | Supadata dashboard → API key |

---

## License

MIT
