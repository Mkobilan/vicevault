-- Create user_pins table
CREATE TABLE user_pins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Realtime for user_pins
ALTER PUBLICATION supabase_realtime ADD TABLE user_pins;

-- Create fan_posts table
CREATE TABLE fan_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  type TEXT CHECK (type IN ('theory', 'art', 'news')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create polls and poll_votes
CREATE TABLE polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE poll_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  option_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(poll_id, user_id)
);

-- RLS Policies
ALTER TABLE user_pins ENABLE ROW LEVEL SECURITY;
ALTER TABLE fan_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;

-- Public read for everything
CREATE POLICY "Public read pins" ON user_pins FOR SELECT USING (true);
CREATE POLICY "Public read posts" ON fan_posts FOR SELECT USING (true);
CREATE POLICY "Public read polls" ON polls FOR SELECT USING (true);
CREATE POLICY "Public read votes" ON poll_votes FOR SELECT USING (true);

-- Authenticated write for pins/posts/votes
CREATE POLICY "Auth insert pins" ON user_pins FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update pins" ON user_pins FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Auth delete pins" ON user_pins FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Auth insert posts" ON fan_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update posts" ON fan_posts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Auth insert votes" ON poll_votes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
