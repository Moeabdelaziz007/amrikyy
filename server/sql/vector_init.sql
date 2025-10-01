CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS ai_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id text,
  meta jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id uuid REFERENCES ai_sessions(id) ON DELETE CASCADE,
  role text CHECK (role IN ('user','assistant','system')),
  content text NOT NULL,
  embedding vector(768),
  ts timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  source text,
  metadata jsonb DEFAULT '{}'::jsonb,
  chunk text NOT NULL,
  embedding vector(768),
  ts timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_session_ts ON messages(session_id, ts DESC);
CREATE INDEX IF NOT EXISTS idx_documents_source ON documents(source);


