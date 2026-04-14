import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId') // Filter by user if provided (for profile feed)
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from('feed_posts')
    .select(`
      *,
      profiles (
        username,
        display_name,
        avatar_url
      ),
      post_likes (user_id),
      post_comments (count)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data: posts, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Process posts to add counts and current user's like status
  const enrichedPosts = posts.map((post: any) => {
    const likes = post.post_likes || []
    const userLiked = user ? likes.some((l: any) => l.user_id === user.id) : false
    const commentsCount = post.post_comments?.[0]?.count || 0

    return {
      ...post,
      likes_count: likes.length,
      comments_count: commentsCount,
      user_liked: userLiked,
      post_likes: undefined // Remove detailed likes to keep payload light
    }
  })

  return NextResponse.json({ posts: enrichedPosts })
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { type, content, image_url, metadata } = await req.json()

  if (!type || (!content && !image_url)) {
    return NextResponse.json({ error: 'Missing content or type' }, { status: 400 })
  }

  const { data: post, error } = await supabase
    .from('feed_posts')
    .insert({
      user_id: user.id,
      type,
      content,
      image_url,
      metadata
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

  return NextResponse.json({ post })
}
