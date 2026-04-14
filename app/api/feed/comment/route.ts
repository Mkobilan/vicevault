import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const postId = searchParams.get('postId')

  if (!postId) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: comments, error } = await supabase
    .from('post_comments')
    .select(`
      *,
      profiles (
        username,
        display_name,
        avatar_url
      )
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ comments })
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { postId, content } = await req.json()

  if (!postId || !content) {
    return NextResponse.json({ error: 'Post ID and content are required' }, { status: 400 })
  }

  const { data: comment, error } = await supabase
    .from('post_comments')
    .insert({
      post_id: postId,
      user_id: user.id,
      content
    })
    .select(`
      *,
      profiles (
        username,
        display_name,
        avatar_url
      )
    `)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ comment })
}
