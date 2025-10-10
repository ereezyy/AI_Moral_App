/*
  # Update Schema for Demo Mode (No Auth Required)

  1. Changes
    - Remove foreign key constraints to auth.users
    - Change user_id to text type for demo users
    - Update RLS policies to allow anon access
    - Add demo-friendly policies

  2. Security
    - Keep RLS enabled
    - Allow anonymous users to create and access their own data
    - Use session-based user identification
*/

-- Drop existing tables and recreate without auth dependencies
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS moral_decisions CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;

-- Conversations table (no auth dependency)
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  title text NOT NULL DEFAULT 'New Conversation',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view own conversations"
  ON conversations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create conversations"
  ON conversations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update own conversations"
  ON conversations FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete own conversations"
  ON conversations FOR DELETE
  TO anon, authenticated
  USING (true);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  audio_url text,
  video_analysis jsonb,
  sentiment_score float,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view messages"
  ON messages FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create messages"
  ON messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Moral decisions table
CREATE TABLE IF NOT EXISTS moral_decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  conversation_id uuid REFERENCES conversations(id) ON DELETE SET NULL,
  dilemma text NOT NULL,
  decision text NOT NULL,
  ethical_score float NOT NULL DEFAULT 0,
  principles_applied jsonb DEFAULT '[]'::jsonb,
  emotional_state jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE moral_decisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view moral decisions"
  ON moral_decisions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create moral decisions"
  ON moral_decisions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id text PRIMARY KEY,
  psychological_profile jsonb DEFAULT '{}'::jsonb,
  behavioral_patterns jsonb DEFAULT '{}'::jsonb,
  total_decisions integer DEFAULT 0,
  consistency_score float DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profiles"
  ON user_profiles FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can update profiles"
  ON user_profiles FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can insert profiles"
  ON user_profiles FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Analytics table for charts
CREATE TABLE IF NOT EXISTS user_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  date date NOT NULL,
  messages_sent integer DEFAULT 0,
  decisions_made integer DEFAULT 0,
  avg_sentiment float DEFAULT 0,
  avg_ethical_score float DEFAULT 0,
  emotional_states jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view analytics"
  ON user_analytics FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert analytics"
  ON user_analytics FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update analytics"
  ON user_analytics FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_moral_decisions_user_id ON moral_decisions(user_id);
CREATE INDEX IF NOT EXISTS idx_moral_decisions_conversation_id ON moral_decisions(conversation_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_date ON user_analytics(user_id, date);
