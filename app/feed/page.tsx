'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { MessageSquare, Heart, Share, ExternalLink, RefreshCw, Radio } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { FeedPostCard } from '@/components/feed/FeedPostCard'
import { PostComposer } from '@/components/feed/PostComposer'
import { cn } from '@/lib/utils'
import { useStore } from '@/store/useStore'

export default function FeedPage() {
  const { user } = useStore()
  const [wirePosts, setWirePosts] = useState<any[]>([])
  const [redditPosts, setRedditPosts] = useState<any[]>([])
  const [loadingWire, setLoadingWire] = useState(true)
  const [loadingReddit, setLoadingReddit] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchWire()
    fetchReddit()
    if (user) fetchUserProfile()

    // Real-time subscription for the Wire
    const channel = supabase
      .channel('wire-updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'feed_posts' }, (payload) => {
        // We'll refetch to get enriched data with profiles
        fetchWire()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user])

  const fetchUserProfile = async () => {
    if (!user) return
    const res = await fetch(`/api/profile?userId=${user.id}`)
    const data = await res.json()
    if (data.profile) setUserProfile(data.profile)
  }

  const fetchWire = async () => {
    setLoadingWire(true)
    try {
      const res = await fetch('/api/feed')
      const data = await res.json()
      if (data.posts) setWirePosts(data.posts)
    } catch (err) {
      console.error('Error fetching wire:', err)
    } finally {
      setLoadingWire(false)
    }
  }

  const fetchReddit = async () => {
    setLoadingReddit(true)
    try {
      const redditRes = await fetch('https://www.reddit.com/r/GTA6/new.json?limit=15')
      const redditData = await redditRes.json()
      const formattedReddit = redditData.data.children.map((child: any) => {
        const d = child.data
        let image = null
        if (d.preview?.images?.[0]?.source?.url) {
          image = d.preview.images[0].source.url.replaceAll('&amp;', '&')
        } else if (d.thumbnail && d.thumbnail.startsWith('http')) {
          image = d.thumbnail
        }
        return {
          id: d.id,
          source: 'reddit',
          author: d.author,
          title: d.title,
          content: d.selftext,
          url: `https://reddit.com${d.permalink}`,
          score: d.score,
          comments: d.num_comments,
          timestamp: d.created_utc * 1000,
          thumbnail: image
        }
      })
      setRedditPosts(formattedReddit)
    } catch (err) {
      console.error('Error fetching reddit:', err)
    } finally {
      setLoadingReddit(false)
    }
  }

  return (
    <div className="p-4 md:p-12 max-w-4xl mx-auto min-h-screen">
      <header className="flex justify-between items-end mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Radio className="w-4 h-4 text-primary animate-pulse" />
            <h2 className="text-primary font-bold uppercase tracking-[0.3em] text-[10px]">Live Frequency</h2>
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase whitespace-nowrap">
            THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">WIRE</span>
          </h1>
        </div>
        <button 
          onClick={() => { fetchWire(); fetchReddit(); }}
          className="p-3 rounded-full bg-muted/50 hover:bg-primary/20 transition-all border border-white/5 active:scale-95"
          disabled={loadingWire || loadingReddit}
        >
          <RefreshCw className={cn("w-5 h-5 text-primary", (loadingWire || loadingReddit) && "animate-spin")} />
        </button>
      </header>

      <Tabs defaultValue="wire" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-black/40 p-1.5 rounded-2xl border border-white/5 mb-8 backdrop-blur-xl">
          <TabsTrigger value="wire" className="rounded-xl font-black italic tracking-widest text-xs data-[state=active]:bg-primary data-[state=active]:text-white transition-all uppercase">THE WIRE</TabsTrigger>
          <TabsTrigger value="external" className="rounded-xl font-black italic tracking-widest text-xs data-[state=active]:bg-secondary data-[state=active]:text-black transition-all uppercase">INTEL FEED</TabsTrigger>
        </TabsList>

        <TabsContent value="wire" className="space-y-6 animate-in fade-in duration-500">
          <PostComposer 
            currentUserProfile={userProfile} 
            onPostCreated={(newPost) => setWirePosts([newPost, ...wirePosts])} 
          />
          
          <div className="space-y-6">
            {loadingWire ? <FeedSkeleton /> : wirePosts.length === 0 ? (
              <div className="text-center py-20 opacity-30">
                <p className="font-black italic text-2xl tracking-tighter">THE WIRE IS SILENT...</p>
                <p className="text-xs uppercase font-bold tracking-widest mt-2">Be the first to break the news</p>
              </div>
            ) : (
              wirePosts.map(post => (
                <FeedPostCard 
                  key={post.id} 
                  post={post} 
                  currentUserId={user?.id}
                  currentUserProfile={userProfile}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="external" className="space-y-6 animate-in fade-in duration-500">
           <div className="grid gap-6">
             {loadingReddit ? <FeedSkeleton /> : redditPosts.map(post => (
               <ExternalFeedCard key={post.id} post={post} />
             ))}
           </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ExternalFeedCard({ post }: { post: any }) {
  return (
    <Card className="bg-black/40 border-white/5 hover:border-secondary/30 transition-all duration-300 overflow-hidden group backdrop-blur-sm grayscale-[0.5] hover:grayscale-0">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted border border-white/10 flex items-center justify-center font-black italic text-xs">
              {post.author?.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold flex items-center gap-2">
                u/{post.author}
                <Badge variant="outline" className="text-[8px] h-4 px-1 leading-none border-[#FF4500] text-[#FF4500] uppercase tracking-tighter">REDDIT</Badge>
              </p>
              <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                {formatDistanceToNow(post.timestamp)} ago
              </p>
            </div>
          </div>
          <a href={post.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-secondary transition-colors" />
          </a>
        </div>

        {post.title && <h3 className="text-lg font-bold mb-3 leading-tight group-hover:text-secondary transition-colors italic">{post.title}</h3>}
        
        {post.content && (
          <p className="text-sm text-foreground/70 leading-relaxed mb-6 line-clamp-3 whitespace-pre-wrap font-medium">
            {post.content}
          </p>
        )}

        {post.thumbnail && (
          <div className="relative aspect-video mb-6 rounded-xl overflow-hidden border border-white/5 bg-muted">
             <img src={post.thumbnail} className="w-full h-full object-contain" alt="thumbnail" />
          </div>
        )}

        <div className="flex items-center gap-6 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold">
            <Heart className="w-4 h-4" />
            {post.score || 0}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold">
            <MessageSquare className="w-4 h-4" />
            {post.comments || 0}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function FeedSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map(i => (
        <Card key={i} className="bg-black/40 border-white/5 overflow-hidden">
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="w-24 h-3 rounded" />
                <Skeleton className="w-16 h-2 rounded" />
              </div>
            </div>
            <Skeleton className="w-full h-4 rounded" />
            <Skeleton className="w-3/4 h-4 rounded" />
            <Skeleton className="w-full h-48 rounded-xl" />
          </div>
        </Card>
      ))}
    </div>
  )
}
