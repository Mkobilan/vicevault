import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function debug() {
  console.log('Testing POST /api/feed query style...')
  const { data, error } = await supabase
    .from('feed_posts')
    .select(`
      *,
      profiles (
        username,
        display_name,
        avatar_url
      )
    `)
    .limit(1)
  
  if (error) {
    console.error('GET Error:', error)
  } else {
    console.log('GET Success:', data)
  }

  console.log('\nTesting counts query style...')
  const { data: data2, error: error2 } = await supabase
    .from('feed_posts')
    .select(`
      *,
      post_comments (count)
    `)
    .limit(1)

  if (error2) {
    console.error('Count Error:', error2)
  } else {
    console.log('Count Success:', data2)
  }
}

debug()
