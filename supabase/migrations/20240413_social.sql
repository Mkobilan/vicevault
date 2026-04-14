-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Auth update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Auth insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create feed_posts table
CREATE TABLE feed_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('story', 'poll_share', 'text', 'image')),
  content TEXT,
  image_url TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for feed_posts
ALTER TABLE feed_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read feed" ON feed_posts FOR SELECT USING (true);
CREATE POLICY "Auth insert posts" ON feed_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update own posts" ON feed_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Auth delete own posts" ON feed_posts FOR DELETE USING (auth.uid() = user_id);

-- Create post_likes table
CREATE TABLE post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES feed_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Enable RLS for post_likes
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read likes" ON post_likes FOR SELECT USING (true);
CREATE POLICY "Auth insert likes" ON post_likes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth delete likes" ON post_likes FOR DELETE USING (auth.uid() = user_id);

-- Create post_comments table
CREATE TABLE post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES feed_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for post_comments
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read comments" ON post_comments FOR SELECT USING (true);
CREATE POLICY "Auth insert comments" ON post_comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth delete comments" ON post_comments FOR DELETE USING (auth.uid() = user_id);

-- Modify polls table to track creator
ALTER TABLE polls ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'username', 'citizen_' || substr(new.id::text, 1, 8)), 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Vault Citizen'), 
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable Realtime for social tables
ALTER PUBLICATION supabase_realtime ADD TABLE feed_posts, post_likes, post_comments;

-- Create storage buckets for social content
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true), ('feed', 'feed', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars and feed
CREATE POLICY "Public Read Access" ON storage.objects FOR SELECT USING (bucket_id IN ('avatars', 'feed'));
CREATE POLICY "Auth Upload Access" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('avatars', 'feed') AND auth.role() = 'authenticated');
CREATE POLICY "Owner Delete Access" ON storage.objects FOR DELETE USING (bucket_id IN ('avatars', 'feed') AND auth.uid() = owner);
