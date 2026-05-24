# Database Schema — Antigravity OS

All tables use Supabase (PostgreSQL).
All tables enable Row Level Security (RLS).
All `user_id` columns reference `auth.users(id)`.

---

## `profiles`
Extends Supabase `auth.users` with app-specific data.

| Column       | Type        | Notes                         |
|-------------|-------------|-------------------------------|
| id          | uuid (PK)   | References auth.users(id)     |
| email       | text        | Unique                        |
| name        | text        |                               |
| username    | text        | Unique, used for public URL   |
| avatar_url  | text        | Optional                      |
| created_at  | timestamptz | Default: now()                |

---

## `habits`

| Column      | Type        | Notes                         |
|------------|-------------|-------------------------------|
| id         | uuid (PK)   | Default: gen_random_uuid()    |
| user_id    | uuid        | FK → profiles(id)             |
| title      | text        |                               |
| frequency  | text        | 'daily' or 'weekly'           |
| color      | text        | Hex color for UI              |
| icon       | text        | Emoji or icon name            |
| created_at | timestamptz | Default: now()                |

---

## `habit_logs`

| Column     | Type    | Notes                      |
|-----------|---------|----------------------------|
| id        | uuid (PK)|                            |
| habit_id  | uuid    | FK → habits(id)            |
| user_id   | uuid    | FK → profiles(id)          |
| date      | date    | Completion date            |
| completed | boolean | Default: false             |

---

## `journal`

| Column     | Type        | Notes                         |
|-----------|-------------|-------------------------------|
| id        | uuid (PK)   |                               |
| user_id   | uuid        | FK → profiles(id)             |
| content   | text        | Raw journal entry             |
| mood      | text        | 'happy','sad','neutral', etc. |
| summary   | text        | AI-generated summary          |
| sentiment | text        | 'positive','negative','mixed' |
| created_at| timestamptz | Default: now()                |

---

## `projects`

| Column      | Type        | Notes              |
|------------|-------------|--------------------|
| id         | uuid (PK)   |                    |
| user_id    | uuid        | FK → profiles(id)  |
| title      | text        |                    |
| description| text        |                    |
| status     | text        | 'active','done','paused' |
| created_at | timestamptz |                    |

---

## `tasks`

| Column      | Type        | Notes                         |
|------------|-------------|-------------------------------|
| id         | uuid (PK)   |                               |
| user_id    | uuid        | FK → profiles(id)             |
| project_id | uuid        | FK → projects(id), nullable   |
| title      | text        |                               |
| deadline   | timestamptz | Nullable                      |
| priority   | text        | 'low','medium','high'         |
| status     | text        | 'todo','in_progress','done'   |
| created_at | timestamptz |                               |

---

## `bucket_list`

| Column     | Type        | Notes                         |
|-----------|-------------|-------------------------------|
| id        | uuid (PK)   |                               |
| user_id   | uuid        | FK → profiles(id)             |
| goal      | text        |                               |
| status    | text        | 'pending','in_progress','done'|
| task_id   | uuid        | FK → tasks(id), nullable      |
| created_at| timestamptz |                               |

---

## `notes`

| Column     | Type        | Notes              |
|-----------|-------------|--------------------|
| id        | uuid (PK)   |                    |
| user_id   | uuid        | FK → profiles(id)  |
| title     | text        |                    |
| content   | text        |                    |
| summary   | text        | AI-generated       |
| created_at| timestamptz |                    |

---

## `public_settings`

| Column    | Type    | Notes                         |
|----------|---------|-------------------------------|
| user_id  | uuid (PK)| FK → profiles(id)            |
| is_public| boolean | Default: false                |
| show_tasks| boolean| Default: true                 |
| show_habits| boolean| Default: true               |

---

## RLS Policy Pattern (apply to all tables)

```sql
-- Enable RLS
ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;

-- Users can only see their own rows
CREATE POLICY "Users can view own data" ON <table_name>
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data" ON <table_name>
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data" ON <table_name>
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own data" ON <table_name>
  FOR DELETE USING (auth.uid() = user_id);
```
