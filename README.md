# Re-vision

**Transform your study notes into interactive quizzes — powered by AI.**

Re-vision is a full-stack web application that lets students upload or paste their notes and instantly generate personalized, exam-style quizzes using Google Gemini. Built for active recall and spaced repetition, it turns passive reading into an engaging learning loop.

---

## Features

- **AI Quiz Generation** — paste text or upload a PDF, DOCX, or TXT file; Gemini 2.5 Flash produces targeted questions in under 10 seconds
- **Multiple Question Types** — multiple choice, true/false, and fill-in-the-blank
- **Difficulty Levels** — easy, medium, or hard
- **Timer Modes** — no timer, per-quiz countdown, or per-question countdown
- **Instant Feedback** — correct/incorrect with explanations on the review page
- **Attempt History** — score tracking across retakes with personal best detection
- **Shareable Quizzes** — generate a share code so anyone can take your quiz as a guest
- **Dashboard** — manage all your quizzes, view difficulty badges, delete with confirmation
- **Authentication** — secure sign-up/sign-in via Clerk
- **Confetti** — fires on scores ≥ 70% because students deserve it

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 + Shadcn/ui |
| Animation | Framer Motion v12 |
| Auth | Clerk |
| Database | Firebase Firestore (client SDK) |
| AI | Google Gemini 2.5 Flash (`@google/generative-ai`) |
| File parsing | `unpdf` (PDF), `mammoth` (DOCX) |
| Notifications | Sonner |
| Fonts | Playfair Display (headings), Inter (body) |

---

## Prerequisites

- Node.js 18 or later
- A [Clerk](https://clerk.com) account (free tier works)
- A [Firebase](https://console.firebase.google.com) project with Firestore enabled
- A [Google AI Studio](https://aistudio.google.com) API key for Gemini

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
│   │   ├── generate-quiz/       # Gemini quiz generation
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

---

## License

MIT
