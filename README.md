# AnixPro — Antigravity OS: AI Life Dashboard

> Production-grade AI-powered personal dashboard. Dark, glassmorphic, fast.

Joy Maa Durga

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS + Framer Motion |
| Backend | Next.js API Routes |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase (Google OAuth) |
| AI | API routes (cached) |
| Deployment | Vercel |

## Project Control Files
| File | Purpose |
|---|---|
| `AGENTS.md` | Master coding rules for AI agents |
| `DATABASE.md` | Full PostgreSQL schema |
| `API_SPEC.md` | All API endpoint definitions |
| `UI_DESIGN.md` | Visual design system |

## Sprint Plan
- **Sprint 1** → Next.js setup + Supabase + Google Auth + DB schema
- **Sprint 2** → Habit Tracker + Journal System
- **Sprint 3** → Dashboard (smart summary + widgets)
- **Sprint 4** → Tasks + Projects + Bucket List
- **Sprint 5** → Notes + AI features
- **Sprint 6** → Public Schedule + Polish + Deploy

## Folder Structure (Target)
```
AnixPro/
├── app/
│   ├── (auth)/login/
│   ├── (dashboard)/
│   │   ├── page.tsx           # Overview
│   │   ├── habits/
│   │   ├── journal/
│   │   ├── tasks/
│   │   ├── projects/
│   │   ├── bucket/
│   │   ├── notes/
│   │   └── schedule/
│   ├── api/
│   │   ├── habits/
│   │   ├── journal/
│   │   ├── tasks/
│   │   ├── projects/
│   │   ├── notes/
│   │   ├── bucket/
│   │   ├── ai/
│   │   └── public/
│   └── u/[username]/schedule/ # Public profile
├── components/
│   ├── ui/                    # Card, Button, Input, etc.
│   ├── sidebar/
│   ├── dashboard/
│   └── charts/
├── lib/
│   ├── supabase/
│   └── ai/
├── hooks/
├── types/
├── AGENTS.md
├── DATABASE.md
├── API_SPEC.md
└── UI_DESIGN.md
```
