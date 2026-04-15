'use client'

import { Map, Sparkles, LayoutDashboard, Shield, Zap, Globe, Users, ArrowRight, MessageSquare, Mail, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-primary/30">
      {/* Premium Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/meme_gen/Leonida_Keys_05.webp')] bg-cover bg-center scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-black" />
        
        {/* Animated Neon Grid Background */}
        <div className="absolute inset-x-0 bottom-0 h-96 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white backdrop-blur-md border border-white/20 text-primary text-[12px] font-black uppercase tracking-[0.3em] mb-8 animate-in fade-in slide-in-from-top-4 duration-1000 shadow-xl">
            <Zap className="w-3 h-3 fill-primary animate-pulse" />
            The Ultimate GTA 6 Companion
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter mb-6 leading-none animate-in fade-in slide-in-from-bottom-4 duration-700 text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
            VICE VAULT
          </h1>
          
          <p className="text-lg md:text-2xl text-black font-bold mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 drop-shadow-sm">
            Enter the next generation of Leonida. Track every GTA 6 update, explore the interactive Leonida map, and join the elite Vice City fan community in the most advanced companion ever created.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <Button asChild size="lg" className="h-14 px-8 bg-primary text-white font-black italic rounded-2xl text-lg hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,0,255,0.3)]">
              <Link href="/profile">JOIN THE VAULT <ArrowRight className="ml-2 w-5 h-5" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 border-white/10 bg-white/5 backdrop-blur-md rounded-2xl text-lg font-bold hover:bg-white/10 transition-all">
              <Link href="/vault">ENTER THE VAULT</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/meme_gen/real_dimez_02.webp')] bg-cover bg-center opacity-70 transition-all duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-sm font-black text-secondary tracking-[0.5em] uppercase">Built for the Leonida Elite</h2>
            <h3 className="text-4xl md:text-6xl font-black italic tracking-tighter">UNLEASH THE POWER</h3>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Map} 
            title="Interactive GTA 6 Map" 
            description="Our community-sourced Leonida map tracks insights, secret locations, and hidden events in real-time."
            color="text-secondary"
          />
          <FeatureCard 
            icon={LayoutDashboard} 
            title="The Wire: Intelligence Feed" 
            description="Premium aggregation of GTA VI intel and Reddit insights. Stay ahead of every rumor and verified trailer detail."
            color="text-primary"
          />
          <FeatureCard 
            icon={Sparkles} 
            title="Vice City Meme Generator" 
            description="Create and share high-quality GTA 6 styled memes with our built-in fan editor and custom templates."
            color="text-accent"
          />
          <FeatureCard 
            icon={BookOpen} 
            title="AI Story Creator" 
            description="Build your own Leonida legends. Our AI Story Creator lets you craft immersive narratives within the Vice City universe."
            color="text-secondary"
          />
          <FeatureCard 
            icon={MessageSquare} 
            title="Global Chat Hub" 
            description="Connect with thousands of fans in our real-time global chat. Discuss theories, intel, and the future of GTA VI."
            color="text-primary"
          />
          <FeatureCard 
            icon={Mail} 
            title="Direct Messaging" 
            description="Secure private communication between citizens. Coordinate map updates or share exclusive intel in DM's."
            color="text-accent"
          />
          <FeatureCard 
            icon={Users} 
            title="Community Polls" 
            description="Participate in live community voting on the hottest GTA 6 theories and shape the pulse of the Vault."
            color="text-secondary"
          />
          <FeatureCard 
            icon={Zap} 
            title="Real-time Sync" 
            description="Everything in the Vault is synced instantly. See marker updates, chat messages, and poll results as they happen."
            color="text-primary"
          />
          <FeatureCard 
            icon={Globe} 
            title="PWA Ready" 
            description="Install the Vice Vault to your home screen for a seamless mobile experience across the state of Leonida."
            color="text-accent"
          />
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/meme_gen/leonida_keys_01.webp')] bg-cover bg-center opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-black/80" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 space-y-8">
          <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.85]">
            YOUR JOURNEY <br /> STARTS IN <span className="text-primary">2026</span>
          </h2>
          <p className="text-muted-foreground text-lg font-bold max-w-xl mx-auto uppercase tracking-widest">
            Don't get left behind in the everglades.
          </p>
          <Button asChild size="lg" className="h-16 px-12 bg-white text-black font-black italic rounded-2xl text-xl hover:scale-110 transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)]">
            <Link href="/profile">GET YOUR LEONIDA CITIZENSHIP TODAY</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="text-xl font-black italic tracking-tighter">VICE <span className="text-primary">VAULT</span></div>
           <div className="flex gap-8 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
             <Link href="/map" className="hover:text-white">MAP</Link>
             <Link href="/feed" className="hover:text-white">FEED</Link>
             <Link href="/hype" className="hover:text-white">HYPE</Link>
             <Link href="/profile" className="hover:text-white">ACCESS</Link>
           </div>
           <div className="text-[10px] text-muted-foreground/50 uppercase font-black">© 2026 FAN PROJECT. NOT AFFILIATED WITH ROCKSTAR GAMES.</div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description, color }: any) {
  return (
    <div className="p-8 rounded-3xl bg-muted/20 border border-white/5 hover:border-primary/20 transition-all duration-500 group">
      <div className={cn("inline-flex p-3 rounded-2xl bg-muted/40 mb-6 group-hover:scale-110 transition-transform", color)}>
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-2xl font-black italic mb-4">{title}</h4>
      <p className="text-muted-foreground text-sm leading-relaxed font-medium">{description}</p>
    </div>
  )
}

function StatItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="text-center group">
      <div className="text-4xl md:text-6xl font-black italic mb-2 text-transparent bg-clip-text bg-gradient-to-t from-white/20 to-white transition-all group-hover:from-primary group-hover:to-secondary">{value}</div>
      <div className="text-[10px] uppercase font-black tracking-[0.3em] text-muted-foreground">{label}</div>
    </div>
  )
}
