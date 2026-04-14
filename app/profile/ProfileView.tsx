'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Settings, 
  MapPin, 
  Image as ImageIcon, 
  MessageSquare, 
  Shield, 
  Calendar, 
  Share2, 
  Plus,
  BarChart3,
  History,
  User as UserIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { FeedPostCard } from '@/components/feed/FeedPostCard'
import { PostComposer } from '@/components/feed/PostComposer'
import { format } from 'date-fns'
import Link from 'next/link'

interface ProfileViewProps {
  user: any
  targetUserId?: string
  onLogout?: () => void
}

export function ProfileView({ user, targetUserId, onLogout }: ProfileViewProps) {
  const isOwnProfile = !targetUserId || targetUserId === user?.id
  const profileIdToFetch = targetUserId || user?.id

  const [profile, setProfile] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [stats, setStats] = useState({
    stories: 0,
    polls: 0,
    votes: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [user])

  const fetchData = async () => {
    setLoading(true)
    try {
      // 1. Fetch Profile
      const profileRes = await fetch(`/api/profile?userId=${profileIdToFetch}`)
      const profileData = await profileRes.json()
      if (profileData.profile) setProfile(profileData.profile)

      // 2. Fetch User's Posts
      const postsRes = await fetch(`/api/feed?userId=${profileIdToFetch}`)
      const postsData = await postsRes.json()
      if (postsData.posts) setPosts(postsData.posts)

      // 3. Fetch Stats (In a real app these would be separate counts or a single stats endpoint)
      // For now we'll estimate from the feed or just use placeholders
      const storiesCount = postsData.posts?.filter((p: any) => p.type === 'story').length || 0
      setStats({
        stories: storiesCount,
        polls: profileData.stats?.polls || 0,
        votes: profileData.stats?.votes || 0
      })
    } catch (err) {
      console.error('Error fetching profile data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-12 animate-pulse flex flex-col items-center justify-center min-h-[50vh] text-primary font-black italic uppercase tracking-widest">Accessing Vault Profile...</div>

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Premium Header Wrapper */}
      <div className="relative rounded-3xl overflow-hidden border border-white/5 bg-black/40 shadow-2xl">
        {/* Cover Image */}
        <div 
          className="h-48 md:h-64 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${profile?.banner_url || 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2000&auto=format&fit=crop'})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </div>

        <div className="p-6 md:p-8 relative -mt-16 md:-mt-20">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
            <div className="flex items-end gap-6">
              <div className="relative group">
                <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-black ring-4 ring-primary/20 p-1 bg-black">
                  <AvatarImage src={profile?.avatar_url || (isOwnProfile ? user.user_metadata?.avatar_url : undefined)} />
                  <AvatarFallback className="bg-muted text-4xl font-black italic">{(profile?.display_name || profile?.username || 'U')?.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                {isOwnProfile && (
                  <Link href="/settings" className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full border-4 border-transparent">
                     <Plus className="w-8 h-8 text-primary animate-pulse" />
                  </Link>
                )}
              </div>
              <div className="pb-2">
                <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-white mb-1">
                  {profile?.display_name || profile?.username || (isOwnProfile ? user.email?.split('@')[0] : 'CITIZEN')}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-primary font-black italic tracking-widest text-[10px] uppercase">@{profile?.username}</span>
                  <Badge className="bg-primary/20 text-primary border-primary/30 h-5 px-2 text-[8px] font-black italic">VAULT CITIZEN</Badge>
                  <div className="flex items-center gap-1 text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                    <Calendar className="w-3 h-3" />
                    JOINED {format(new Date(profile?.created_at || user.created_at || new Date()), 'MMM yyyy').toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              {isOwnProfile ? (
                <>
                  <Button asChild variant="outline" className="flex-1 md:flex-none h-12 rounded-xl border-white/5 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 font-bold italic">
                    <Link href="/dm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      INBOX
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1 md:flex-none h-12 rounded-xl border-white/5 bg-white/5 hover:bg-white/10 font-bold italic">
                    <Link href="/settings">
                      <Settings className="w-4 h-4 mr-2" />
                      SETTINGS
                    </Link>
                  </Button>
                  <Button onClick={onLogout} variant="destructive" className="flex-1 md:flex-none h-12 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 font-bold italic">
                    LOGOUT
                  </Button>
                </>
              ) : (
                <Button asChild variant="default" className="flex-1 md:flex-none h-12 rounded-xl font-black italic bg-primary text-white hover:bg-primary/80 transition-all">
                  <Link href={`/dm/${profileIdToFetch}`}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    SEND DM
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {profile?.bio && (
            <p className="max-w-2xl text-foreground/80 font-medium italic mb-8 leading-relaxed">
              "{profile.bio}"
            </p>
          )}

          {/* Post Composer (Only shown on own profile) */}
          {isOwnProfile && (
            <div className="mb-10 max-w-2xl">
              <PostComposer 
                currentUserProfile={profile} 
                onPostCreated={(newPost) => setPosts([newPost, ...posts])} 
              />
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-white/5">
            <StatBox icon={History} label="Stories Generated" value={stats.stories} color="text-primary" />
            <StatBox icon={BarChart3} label="Polls Created" value={stats.polls} color="text-secondary" />
            <StatBox icon={MessageSquare} label="Polls Voted" value={stats.votes} color="text-accent" />
            <StatBox icon={MapPin} label="Markers Placed" value="0" color="text-orange-500" />
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-8">
        <div className="flex justify-between items-center bg-black/40 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl">
          <TabsList className="bg-transparent border-none">
            <TabsTrigger value="all" className="rounded-xl px-4 md:px-8 font-black italic tracking-widest text-[10px] uppercase">THE WIRE</TabsTrigger>
            <TabsTrigger value="stories" className="rounded-xl px-4 md:px-8 font-black italic tracking-widest text-[10px] uppercase">STORIES</TabsTrigger>
          </TabsList>
          
          <Button size="sm" variant="ghost" className="text-[10px] font-black italic text-muted-foreground hover:text-primary gap-2">
            <Share2 className="w-3 h-3" />
            SHARE PROFILE
          </Button>
        </div>

        <TabsContent value="all" className="space-y-6">
          {posts.length === 0 ? (
            <div className="py-20 text-center opacity-30 border-2 border-dashed border-white/5 rounded-3xl">
              <p className="font-black italic text-xl">NO INTEL SHARED YET</p>
              {isOwnProfile && (
                <Button asChild variant="ghost" className="mt-4 text-xs font-black italic uppercase">
                  <Link href="/feed">GO TO THE WIRE</Link>
                </Button>
              )}
            </div>
          ) : (
            posts.map(post => (
              <FeedPostCard key={post.id} post={{...post, profiles: profile}} currentUserId={user?.id} currentUserProfile={profile} />
            ))
          )}
        </TabsContent>

        <TabsContent value="stories" className="space-y-6">
          {posts.filter(p => p.type === 'story').map(post => (
            <FeedPostCard key={post.id} post={{...post, profiles: profile}} currentUserId={user?.id} />
          ))}
          {posts.filter(p => p.type === 'story').length === 0 && (
             <div className="py-20 text-center opacity-30 border-2 border-dashed border-white/5 rounded-3xl">
                <p className="font-black italic text-xl">NO STORIES WRITTEN</p>
                {isOwnProfile && (
                  <Button asChild variant="ghost" className="mt-4 text-xs font-black italic uppercase">
                    <Link href="/hype">START THE STORY</Link>
                  </Button>
                )}
             </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatBox({ icon: Icon, label, value, color }: any) {
  return (
    <div className="flex flex-col gap-1 group">
      <div className="flex items-center gap-2">
        <div className={cn("p-1.5 rounded-lg bg-black/40 border border-white/5", color)}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <span className="text-[10px] font-black italic tracking-widest uppercase text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
      </div>
      <span className="text-2xl font-black italic tracking-tighter text-white ml-9">{value}</span>
    </div>
  )
}
