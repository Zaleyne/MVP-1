        # AGENTS.md — Career Coach MVP

## Project overview
- Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 3
- Single-page client-side state (no database, no auth, no routing between steps)
- OpenRouter as LLM provider (OpenAI-compatible, uses `openai` npm package with custom `baseURL`)
- All text/UI in Spanish

## Setup
- `.env.local` requires `OPENROUTER_API_KEY` (sk-or-v1-...) and `OPENROUTER_MODEL`
- Default model: `openai/gpt-4o-mini`. Change via `OPENROUTER_MODEL` env var.
- No database, no build artifacts, no migrations

## Commands
```
npm run dev      # development server
npm run build    # production build + typecheck
npm run start    # start production build
npm run lint     # next lint (no custom config)
```
Build order: nothing special, `npm run build` compiles + checks types.

## Architecture
- `src/app/page.tsx` — Landing page (hero, CTA to /interview)
- `src/app/interview/page.tsx` — Single client component that manages all steps via `useState`
- `src/components/` — 7 components for individual UI steps
- `src/lib/openrouter.ts` — OpenRouter client config + exported `MODEL` var
- `src/lib/prompts.ts` — System prompts for interview + generation (Spanish, JSON output format)
- `src/lib/types.ts` — Shared types + experience option config

## API routes
- `POST /api/interview` — Sends conversation history, returns AI question or completion signal
- `POST /api/generate` — Sends full interview transcript, returns `{ cvBullets, starAnswer, explanation }`
- Both routes parse AI JSON response with regex fallback for malformed output
- Model name injected via `MODEL` export from `src/lib/openrouter.ts`

## User flow
1. Confidence before (1-5) → 2. Experience selector → 3. AI interview (up to 7 questions) → 4. Confidence after → 5. Results (CV bullets + STAR answer)

## Key conventions
- System prompts enforce single-question-at-a-time and strict JSON format
- Interview questions reference `totalQuestions: 7` (hardcoded in prompt + component)
- Experience types are Spanish labels in `EXPERIENCE_OPTIONS` array
- All styled with Tailwind `slate-*` and `primary-*` (blue) palette
- No streaming, no server actions, no ISR

## Metrics
- Console-logged with `[METRIC]` prefix for validation (no analytics service)
