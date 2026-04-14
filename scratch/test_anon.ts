import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fsmiouicarklqkkltrlw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzbWlvdWljYXJrbHFra2x0cmx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3OTMwOTQsImV4cCI6MjA5MTM2OTA5NH0.gOn-ldTw4Ump8nDdhFmJVNHcNFoZs4BRYHdHXsITfJI'
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data, error } = await supabase
      .from('chat_messages')
      .select('*, profiles!sender_id(username, avatar_url, display_name)')
      .is('receiver_id', null)
      .limit(1)
  console.log("Fetch ANON ERROR:", error)
  console.log("Fetch ANON DATA:", data)
}

test()
