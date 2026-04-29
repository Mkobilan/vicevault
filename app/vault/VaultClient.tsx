'use client'

import { useState, useEffect } from 'react'
import { intervalToDuration, isBefore, type Duration } from 'date-fns'
import { Map, Sparkles, LayoutDashboard, Share2, Timer } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { FeedPostCard } from '@/components/feed/FeedPostCard'
import { createClient } from '@/lib/supabase/client'
import { useStore } from '@/store/useStore'

const LAUNCH_DATE = new Date('2026-11-19T00:00:00')

export function VaultClient() {
  const [duration, setDuration] = useState<Duration | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      if (isBefore(new Date(), LAUNCH_DATE)) {
        setDuration(intervalToDuration({
          start: new Date(),
          end: LAUNCH_DATE
        }))
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex flex-col items-center justify-center overflow-hidden bg-[url('/meme_gen/vice_city_08.webp')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="relative z-10 text-center px-4">
          <p className="text-primary font-bold tracking-[0.4em] text-xs animate-pulse">UPDATING VAULT GPS...</p>
          <h2 className="text-primary font-black uppercase tracking-[0.3em] text-sm mb-4 drop-shadow-[0_0_10px_rgba(255,0,255,0.8)]">
            Welcome to the Vault
          </h2>
          <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter mb-8 drop-shadow-2xl">
            VICE <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">VAULT</span>
          </h1>

          {/* Countdown Wrapper */}
          <div className="flex gap-4 md:gap-8 justify-center items-center backdrop-blur-md bg-black/40 p-6 rounded-3xl border border-primary/20 shadow-[0_0_30px_rgba(255,0,255,0.1)]">
            {duration ? (
              <>
                <CountdownItem label="Total Days" value={Math.floor((LAUNCH_DATE.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} />
                <CountdownItem label="Hrs" value={duration.hours || 0} />
                <CountdownItem label="Min" value={duration.minutes || 0} />
                <CountdownItem label="Sec" value={duration.seconds || 0} />
              </>
            ) : (
              <div className="flex items-center gap-2 text-primary font-bold animate-pulse">
                <Timer className="w-5 h-5" />
                LOADING HYPE...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Nav Cards */}
      <section className="px-6 -mt-10 relative z-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
        <QuickNavCard 
          title="Interactive Map" 
          description="Explore Leonida with community-sourced markers. Built by @xlazefps."
          href="https://map.stateofleonida.net"
          icon={Map}
          color="text-secondary"
          external
        />
        <QuickNavCard 
          title="The Wire" 
          description="A feed of the latest GTA 6 news from reddit and community posts."
          href="/feed"
          icon={LayoutDashboard}
          color="text-primary"
        />
        <QuickNavCard 
          title="Fan Tools" 
          description="Create memes, polls, and your own GTA 6 story."
          href="/hype"
          icon={Sparkles}
          color="text-accent"
        />
      </section>

      {/* Featured Community Content */}
      <section className="p-12 mt-12 max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            COMMUNITY HIGHLIGHTS
          </h3>
          <Button variant="ghost" className="text-primary hover:bg-primary/10">VIEW ALL</Button>
        </div>
        
        <CommunityHighlights />
      </section>
    </div>
  )
}

function CountdownItem({ label, value }: { label: string, value: number }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-3xl md:text-5xl font-black text-foreground">{value.toString().padStart(2, '0')}</span>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{label}</span>
    </div>
  )
}

function QuickNavCard({ title, description, href, icon: Icon, color, external }: any) {
  const content = (
    <Card className="bg-black/80 border-primary/10 hover:border-primary/40 hover:bg-black transition-all duration-300 group overflow-hidden h-full">
      <CardContent className="p-8">
        <div className={cn("p-3 rounded-2xl bg-muted w-fit mb-6 group-hover:scale-110 transition-transform", color)}>
          <Icon className="w-6 h-6" />
        </div>
        <h4 className="text-xl font-bold mb-2">{title}</h4>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    )
  }

  return (
    <Link href={href}>
      {content}
    </Link>
  )
}

function CommunityHighlights() {
  const [highlights, setHighlights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useStore()
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    const fetchHighlights = async () => {
      const supabase = createClient()
      
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (data) setUserProfile(data)
      }

      const fetchType = async (type: string) => {
        const { data } = await supabase.from('feed_posts').select('*, profiles(*)').eq('type', type).order('created_at', { ascending: false }).limit(1)
        return data?.[0]
      }

      const [poll, story, reg, image] = await Promise.all([
        fetchType('poll_share'),
        fetchType('story'),
        fetchType('text'),
        fetchType('image')
      ])
      
      setHighlights([poll, story, reg, image].filter(Boolean))
      setLoading(false)
    }
    fetchHighlights()
  }, [user])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse bg-black/40 h-[400px] rounded-xl border border-white/5" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
      {highlights.map((post) => (
        <FeedPostCard 
          key={post.id} 
          post={post} 
          currentUserId={user?.id} 
          currentUserProfile={userProfile} 
        />
      ))}
    </div>
  )
}
