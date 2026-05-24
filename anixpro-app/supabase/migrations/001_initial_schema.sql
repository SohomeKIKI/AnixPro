-- ============================================================
-- AnixPro — Initial Schema Migration
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ──────────────────────────────────────────────────────────
-- 0. Extensions
-- ──────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ──────────────────────────────────────────────────────────
-- 1. PROFILES
-- Extends auth.users with app-specific data
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  name        TEXT,
  username    TEXT UNIQUE,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ──────────────────────────────────────────────────────────
-- 2. HABITS
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.habits (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  frequency   TEXT NOT NULL DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly')),
  color       TEXT DEFAULT '#f59e0b',
  icon        TEXT DEFAULT '⚡',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS habits_user_id_idx ON public.habits(user_id);

-- ──────────────────────────────────────────────────────────
-- 3. HABIT LOGS
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.habit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id    UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  completed   BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE(habit_id, date)
);

CREATE INDEX IF NOT EXISTS habit_logs_user_id_idx ON public.habit_logs(user_id);
CREATE INDEX IF NOT EXISTS habit_logs_habit_id_idx ON public.habit_logs(habit_id);
CREATE INDEX IF NOT EXISTS habit_logs_date_idx ON public.habit_logs(date);

-- ──────────────────────────────────────────────────────────
-- 4. JOURNAL
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.journal (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  mood        TEXT DEFAULT 'neutral' CHECK (mood IN ('happy', 'sad', 'neutral', 'anxious', 'excited', 'tired', 'focused')),
  summary     TEXT,
  sentiment   TEXT CHECK (sentiment IN ('positive', 'negative', 'mixed', 'neutral')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS journal_user_id_idx ON public.journal(user_id);
CREATE INDEX IF NOT EXISTS journal_created_at_idx ON public.journal(created_at DESC);

-- ──────────────────────────────────────────────────────────
-- 5. PROJECTS
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.projects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'done', 'paused')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS projects_user_id_idx ON public.projects(user_id);

-- ──────────────────────────────────────────────────────────
-- 6. TASKS
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.tasks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id  UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  title       TEXT NOT NULL,
  deadline    TIMESTAMPTZ,
  priority    TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status      TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS tasks_project_id_idx ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS tasks_status_idx ON public.tasks(status);
CREATE INDEX IF NOT EXISTS tasks_deadline_idx ON public.tasks(deadline);

-- ──────────────────────────────────────────────────────────
-- 7. BUCKET LIST
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bucket_list (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  goal        TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'done')),
  task_id     UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS bucket_list_user_id_idx ON public.bucket_list(user_id);

-- ──────────────────────────────────────────────────────────
-- 8. NOTES
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL DEFAULT 'Untitled',
  content     TEXT NOT NULL DEFAULT '',
  summary     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS notes_user_id_idx ON public.notes(user_id);
CREATE INDEX IF NOT EXISTS notes_created_at_idx ON public.notes(created_at DESC);

-- ──────────────────────────────────────────────────────────
-- 9. PUBLIC SETTINGS
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.public_settings (
  user_id       UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_public     BOOLEAN NOT NULL DEFAULT FALSE,
  show_tasks    BOOLEAN NOT NULL DEFAULT TRUE,
  show_habits   BOOLEAN NOT NULL DEFAULT TRUE
);

-- ══════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ══════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE public.profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bucket_list      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_settings  ENABLE ROW LEVEL SECURITY;

-- ── PROFILES ──
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ── HABITS ──
CREATE POLICY "habits_select_own" ON public.habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "habits_insert_own" ON public.habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "habits_update_own" ON public.habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "habits_delete_own" ON public.habits FOR DELETE USING (auth.uid() = user_id);

-- ── HABIT LOGS ──
CREATE POLICY "habit_logs_select_own" ON public.habit_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "habit_logs_insert_own" ON public.habit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "habit_logs_update_own" ON public.habit_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "habit_logs_delete_own" ON public.habit_logs FOR DELETE USING (auth.uid() = user_id);

-- ── JOURNAL ──
CREATE POLICY "journal_select_own" ON public.journal FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "journal_insert_own" ON public.journal FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "journal_update_own" ON public.journal FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "journal_delete_own" ON public.journal FOR DELETE USING (auth.uid() = user_id);

-- ── PROJECTS ──
CREATE POLICY "projects_select_own" ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "projects_insert_own" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "projects_update_own" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "projects_delete_own" ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- ── TASKS ──
CREATE POLICY "tasks_select_own" ON public.tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "tasks_insert_own" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "tasks_update_own" ON public.tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "tasks_delete_own" ON public.tasks FOR DELETE USING (auth.uid() = user_id);

-- ── BUCKET LIST ──
CREATE POLICY "bucket_select_own" ON public.bucket_list FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "bucket_insert_own" ON public.bucket_list FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bucket_update_own" ON public.bucket_list FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "bucket_delete_own" ON public.bucket_list FOR DELETE USING (auth.uid() = user_id);

-- ── NOTES ──
CREATE POLICY "notes_select_own" ON public.notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notes_insert_own" ON public.notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notes_update_own" ON public.notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notes_delete_own" ON public.notes FOR DELETE USING (auth.uid() = user_id);

-- ── PUBLIC SETTINGS ──
CREATE POLICY "ps_select_own" ON public.public_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "ps_insert_own" ON public.public_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ps_update_own" ON public.public_settings FOR UPDATE USING (auth.uid() = user_id);

-- Public read for is_public = true (for /u/[username]/schedule)
CREATE POLICY "ps_select_public" ON public.public_settings
  FOR SELECT USING (is_public = TRUE);

-- ══════════════════════════════════════════════════════════
-- DONE — All tables, indexes, triggers, and RLS created
-- ══════════════════════════════════════════════════════════
