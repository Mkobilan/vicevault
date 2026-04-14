import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { count: pollsCount } = await supabase
    .from('polls')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  const { count: votesCount } = await supabase
    .from('poll_votes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  return NextResponse.json({ 
    profile, 
    stats: {
      polls: pollsCount || 0,
      votes: votesCount || 0
    }
  })
}

export async function PUT(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { username, display_name, bio } = await req.json()

  // Validate username uniqueness if changed
  if (username) {
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .neq('id', user.id)
      .maybeSingle()

    if (existingUser) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 400 })
    }
  }

  const { data: updatedProfile, error } = await supabase
    .from('profiles')
    .update({
      username,
      display_name,
      bio,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)
    .select()
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ profile: updatedProfile })
}
