# API Endpoints — Antigravity OS

All routes live inside `/app/api/`.
All routes require authentication via Supabase session cookie unless marked [PUBLIC].
All POST routes validate input with `zod`.

---

## Authentication
Handled by Supabase Auth — no custom routes needed.
- Google OAuth: configured in Supabase dashboard
- Session: managed via `@supabase/ssr` cookies

---

## Habits

### `POST /api/habits/create`
Create a new habit.
**Body:** `{ title: string, frequency: 'daily' | 'weekly', color?: string, icon?: string }`
**Returns:** `{ habit: Habit }`

### `GET /api/habits/list`
List all habits for the authenticated user.
**Returns:** `{ habits: Habit[] }`

### `POST /api/habits/log`
Mark a habit as complete for a given date.
**Body:** `{ habit_id: string, date: string (YYYY-MM-DD), completed: boolean }`
**Returns:** `{ log: HabitLog }`

### `GET /api/habits/streaks`
Get streak data for all habits.
**Returns:** `{ streaks: { habit_id: string, current_streak: number, longest_streak: number }[] }`

---

## Journal

### `POST /api/journal/create`
Create a journal entry. Triggers AI summary generation.
**Body:** `{ content: string, mood: string }`
**Returns:** `{ entry: JournalEntry }`

### `GET /api/journal/list`
List journal entries (paginated).
**Query:** `?page=1&limit=20`
**Returns:** `{ entries: JournalEntry[], total: number }`

---

## Tasks

### `POST /api/tasks/create`
**Body:** `{ title: string, project_id?: string, deadline?: string, priority: string }`
**Returns:** `{ task: Task }`

### `GET /api/tasks/today`
Tasks due today or overdue.
**Returns:** `{ tasks: Task[] }`

### `GET /api/tasks/list`
All tasks with optional filters.
**Query:** `?status=todo&project_id=xxx`
**Returns:** `{ tasks: Task[] }`

### `PATCH /api/tasks/update`
**Body:** `{ id: string, status?: string, title?: string, deadline?: string }`
**Returns:** `{ task: Task }`

---

## Projects

### `POST /api/projects/create`
**Body:** `{ title: string, description?: string }`
**Returns:** `{ project: Project }`

### `GET /api/projects/list`
**Returns:** `{ projects: Project[] }`

---

## Notes

### `POST /api/notes/create`
**Body:** `{ title: string, content: string }`
**Returns:** `{ note: Note }`

### `GET /api/notes/list`
**Returns:** `{ notes: Note[] }`

---

## Bucket List

### `POST /api/bucket/create`
**Body:** `{ goal: string }`
**Returns:** `{ item: BucketListItem }`

### `GET /api/bucket/list`
**Returns:** `{ items: BucketListItem[] }`

### `PATCH /api/bucket/update`
**Body:** `{ id: string, status: string }`
**Returns:** `{ item: BucketListItem }`

---

## AI

### `POST /api/ai/summary`
Generate a summary for a note or journal entry.
**Body:** `{ content: string, type: 'note' | 'journal' }`
**Returns:** `{ summary: string }`

### `POST /api/ai/journal-analysis`
Analyse mood and sentiment of a journal entry.
**Body:** `{ content: string }`
**Returns:** `{ mood: string, sentiment: string, summary: string }`

### `POST /api/ai/dashboard-summary`
Generate today's AI insight for the dashboard.
**Body:** `{ tasks: Task[], habits: HabitLog[], journal?: JournalEntry }`
**Returns:** `{ insight: string }`

---

## Public [PUBLIC]

### `GET /api/public/[username]`
Returns public schedule/profile for a user.
**Returns:** `{ profile: PublicProfile, tasks?: Task[], habits?: Habit[] }`
No authentication required. Respects `public_settings.is_public`.
