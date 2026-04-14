-- Create chat_messages table (run this if you haven't applied the migration yet, or drop the table first)
DROP TABLE IF EXISTS chat_messages CASCADE;

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- NULL for global chat
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE
);

-- Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Public chat visible to all authenticated
CREATE POLICY "Global chat visible" ON chat_messages FOR SELECT USING (receiver_id IS NULL AND auth.role() = 'authenticated');

-- DMs visible only to sender and receiver
CREATE POLICY "DMs visible to participants" ON chat_messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Anyone authenticated can insert
CREATE POLICY "Auth insert chat" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Receiver can mark read
CREATE POLICY "Receiver can update read status" ON chat_messages FOR UPDATE USING (auth.uid() = receiver_id);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
