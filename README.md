# WordAI Studio

A free, AI-powered Microsoft Word clone for students. Runs in the browser, smarter than Word.

## Features

- **Rich Text Editor** — Full Tiptap editor with Word-like toolbar (fonts, sizes, bold/italic/underline, alignment, lists, headings, tables, images, links, code blocks)
- **AI Chat** — Stream AI responses from Gemini 2.0 Flash, Groq Llama 3.3, GPT-4o, or Claude 3.5 Sonnet
- **AI Write** — Rewrite, fix grammar, improve clarity, change tone, translate, summarize, expand, and more
- **Assignment Builder** — Generate complete structured academic papers with citations in one click
- **Image Search** — Search Pexels, Unsplash, and Pixabay for free images and insert directly
- **Export** — Download as PDF (.pdf), Word (.docx), plain text (.txt), or Markdown (.md)
- **Dark Mode** — Full dark mode support
- **Auto-save** — Documents auto-save every 30 seconds
- **Keyboard Shortcuts** — Ctrl+S to save, Ctrl+B/I/U for formatting

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Editor**: Tiptap
- **AI**: Google Gemini, Groq, OpenAI, OpenRouter
- **Images**: Pexels, Unsplash, Pixabay
- **Export**: jsPDF + docx.js
- **Auth + DB**: Supabase (optional)

## Quick Start

### 1. Clone & Install

```bash
git clone <repo-url>
cd wordai-studio
npm install
```

### 2. Configure Environment

Copy `.env.local.example` to `.env.local` and fill in your API keys:

```bash
cp .env.local.example .env.local
```

### 3. Get Free API Keys

| Service | Link | Notes |
|---------|------|-------|
| Google Gemini | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) | Free, primary AI model |
| Groq | [console.groq.com/keys](https://console.groq.com/keys) | Free, fast fallback |
| Pexels | [pexels.com/api](https://www.pexels.com/api/) | Free, unlimited |
| Unsplash | [unsplash.com/developers](https://unsplash.com/developers) | Free |
| Supabase | [supabase.com](https://supabase.com) | Free tier, for auth + database |

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel (Free)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repo
4. Add environment variables
5. Deploy!

## Supabase Setup (Optional)

1. Create a project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `schema.sql`
3. Enable Row Level Security on all tables
4. Copy your project URL and anon key to `.env.local`

## Assignment Builder

1. Open the editor and click the **Write** tab
2. Scroll to **Assignment Builder**
3. Enter your topic, type, word count, level, and citation style
4. Click **Generate Full Assignment**
5. The AI generates a complete structured paper with introduction, body, conclusion, and references

## License

MIT
