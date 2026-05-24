# Antigravity OS — AI Development Rules

## Stack
- Next.js 14 (App Router)
- Tailwind CSS
- Supabase (PostgreSQL + Auth)
- Framer Motion (animations)
- Vercel (deployment)

## Architecture
- Use Next.js for both frontend and backend
- API routes live inside `/app/api/`
- No separate backend server
- Server Components where possible; Client Components only when needed

## Coding Rules
- Use `async/await` — no `.then()` chains
- Modular, single-responsibility components
- Clean folder structure: `components/`, `lib/`, `hooks/`, `types/`
- Avoid duplicate logic — abstract into shared utilities in `lib/`
- TypeScript strict mode
- Use `zod` for input validation on all API routes

## UI Rules
- Dark theme ONLY — background: `#0f172a`
- Glassmorphism: `backdrop-blur`, `bg-white/5`, `border border-white/10`
- Cards: `rounded-2xl`, `shadow-xl`
- Accent: neon gold/amber gradients
- Animations: Framer Motion — fade-in, slide-up, hover-lift
- Font: Inter (Google Fonts)
- No plain colors — use curated HSL/gradient palettes

## Data Rules
- Every table MUST include `user_id` (uuid, foreign key → `auth.users`)
- Use Row Level Security (RLS) on ALL tables
- Normalize schema — no denormalization without reason
- Use `created_at` timestamps on all tables

## AI Rules
- All AI calls go through `/app/api/ai/` routes only
- Cache responses where possible (Redis or in-memory)
- Never call AI APIs directly from client components
- Rate-limit AI endpoints

## Security
- Enable Supabase RLS on every table — no exceptions
- Never expose `service_role` key on the client
- Validate and sanitize all user inputs
- Use environment variables for all secrets

## Performance
- Use `React.lazy` / dynamic imports for heavy components
- Paginate all list endpoints (default: 20 items)
- Use `SWR` or `React Query` for client-side data fetching

## Goal
Build a clean, scalable, production-ready AI life dashboard that is
visually stunning, fast, and secure.
