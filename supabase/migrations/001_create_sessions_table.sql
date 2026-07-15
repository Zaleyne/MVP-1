-- ================================================
-- Career Coach MVP — Sessions table + RLS
-- Run this in Supabase SQL Editor (Dashboard → SQL)
-- ================================================

-- Drop existing table if it was created without policies
DROP TABLE IF EXISTS sessions CASCADE;

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  started_at TIMESTAMPTZ,

  confidence_before SMALLINT NOT NULL CHECK (confidence_before BETWEEN 1 AND 5),
  confidence_after SMALLINT NOT NULL CHECK (confidence_after BETWEEN 0 AND 5),

  experience_type TEXT NOT NULL,
  custom_experience TEXT,

  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  question_count SMALLINT NOT NULL DEFAULT 0,

  cv_bullets TEXT NOT NULL DEFAULT '',
  star_answer TEXT NOT NULL DEFAULT '',
  explanation TEXT NOT NULL DEFAULT '',

  completed BOOLEAN NOT NULL DEFAULT false,
  abandoned_at_step TEXT,

  feedback_perception TEXT,
  feedback_valuable TEXT,
  feedback_use_again TEXT
);

-- Row Level Security
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Allow anon inserts (app uses anon key for POST /api/session)
CREATE POLICY "Allow anonymous inserts" ON sessions
  FOR INSERT TO anon WITH CHECK (true);

-- Allow anon updates (app uses anon key for PUT /api/session feedback)
CREATE POLICY "Allow anonymous updates" ON sessions
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Allow anon reads (needed for .select().single() after insert/update)
CREATE POLICY "Allow anonymous reads" ON sessions
  FOR SELECT TO anon USING (true);

-- Allow authenticated reads (future admin dashboard)
CREATE POLICY "Allow authenticated reads" ON sessions
  FOR SELECT TO authenticated USING (true);

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_experience_type ON sessions (experience_type);
CREATE INDEX IF NOT EXISTS idx_sessions_completed ON sessions (completed);
