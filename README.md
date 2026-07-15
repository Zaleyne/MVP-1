# MVP 1 — AI Career Coach

An AI-powered career coaching application that helps professionals practice behavioral interviews and generate compelling CV content using the STAR method.

## The Problem

Job seekers struggle to articulate their experiences effectively. They either undersell their achievements or fail to structure their stories using frameworks like STAR. Traditional career coaching is expensive and time-consuming.

## Target User

- **Primary:** Professionals preparing for job interviews (mid-level to senior)
- **Secondary:** Career changers transitioning to new industries
- **Use case:** Quick practice sessions before actual interviews

## Value Proposition

> **"From interview anxiety to interview confidence in 5 minutes."**

MVP 1 transforms your raw experience into polished, structured responses. No scheduling, no expensive coaches — just instant AI-powered feedback.

## How It Works

1. **Rate Confidence** — User rates their current confidence level (1-5)
2. **Select Experience Type** — Choose relevant experience category
3. **AI Interview** — 7 targeted questions extract your best stories
4. **Generate Outputs** — Instantly create:
   - CV bullet points
   - STAR-structured answer
   - Explanation of improvements
5. **Track Progress** — Compare confidence before/after

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| AI Engine | OpenRouter (GPT-4o-mini) |
| Charts | Recharts |
| Hosting | Vercel (recommended) |

## Architecture

```
┌─────────────────────────────────────────────────┐
│                    Frontend                      │
│              Next.js App Router                  │
├─────────────────────────────────────────────────┤
│                   API Routes                     │
│  /api/interview    /api/generate    /api/session │
├─────────────────────────────────────────────────┤
│              External Services                   │
│    OpenRouter (AI)         Supabase (Database)   │
└─────────────────────────────────────────────────┘
```

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20)
- [Supabase](https://supabase.com) account
- [OpenRouter](https://openrouter.ai) API key

### Installation

```bash
# Clone the repository
git clone https://github.com/Zaleyne/MVP-1.git
cd MVP-1

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENROUTER_API_KEY` | Your OpenRouter API key | Yes |
| `OPENROUTER_MODEL` | Model to use (default: `openai/gpt-4o-mini`) | No |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |

### Database Setup

1. Create a new Supabase project
2. Go to SQL Editor
3. Run the migration from `supabase/migrations/001_create_sessions_table.sql`

## Project Structure

```
MVP-1/
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── interview/     # Main interview page
│   │   └── page.tsx       # Landing page
│   ├── components/        # React components
│   └── lib/               # Utilities & config
├── supabase/
│   └── migrations/        # Database migrations
└── public/                # Static assets
```

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run linter
```

## Roadmap

### Phase 1 — MVP (Current)
- [x] AI-powered interview simulation
- [x] CV bullet generation
- [x] STAR answer formatting
- [x] Session tracking
- [x] Confidence metrics

### Phase 2 — Growth
- [ ] User authentication
- [ ] Interview history dashboard
- [ ] PDF export of generated content
- [ ] Email follow-ups with tips

### Phase 3 — Monetization
- [ ] Subscription model
- [ ] Premium AI models
- [ ] Team/enterprise features
- [ ] Integration with job boards

## Metrics (Internal)

The app logs key metrics with `[METRIC]` prefix for validation:
- Interview completion rate
- Average questions per session
- Confidence score changes
- Feature usage patterns

## License

MIT

## Author

**Zaleyne** — [GitHub](https://github.com/Zaleyne)
