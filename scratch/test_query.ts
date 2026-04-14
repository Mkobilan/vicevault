import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fsmiouicarklqkkltrlw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzbWlvdWljYXJrbHFra2x0cmx3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTc5MzA5NCwiZXhwIjoyMDkxMzY5MDk0fQ.fRI0wKQIjDaYCCN8pKP1CToytemdfcO7C7V0uAnzOfU'
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data, error } = await supabase
      .from('chat_messages')
      .select('*, profiles!sender_id(username, avatar_url, display_name)')
      .is('receiver_id', null)
      .limit(1)
  console.log("Fetch 1 ERROR:", error)
  console.log("Fetch 1 DATA:", data)
}

test()
