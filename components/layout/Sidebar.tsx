'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Map, LayoutDashboard, Sparkles, User, Settings, Radio, MessageSquare, LogOut, Image as ImageIcon, PlaySquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { name: 'The Vault', href: '/vault', icon: LayoutDashboard },
  { name: 'Interactive Map', href: '/map', icon: Map },
  { name: 'The Wire', href: '/feed', icon: Radio },
  { name: 'Global Chat', href: '/chat', icon: MessageSquare },
  { name: 'Hype Tools', href: '/hype', icon: Sparkles },
  { name: 'My Profile', href: '/profile', icon: User },
  { name: 'See Leonida', href: '/gallery', icon: ImageIcon },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/profile')
  }

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-black border-r border-primary/20 z-40 overflow-hidden group">
      <div className="absolute inset-0 bg-[url('/meme_gen/lucia_hugging_jason.PNG')] bg-cover bg-center opacity-60 transition-all duration-1000 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
      
      <div className="relative z-10 flex flex-col h-full">
      <div className="p-6 flex items-center gap-3">
        <img src="/icon-192x192.png" alt="Vice Vault Logo" className="w-10 h-10 rounded-xl shadow-[0_0_15px_rgba(255,0,255,0.3)]" />
        <h1 className="text-2xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-sm">
          VICE VAULT
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(255,0,255,0.1)]" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110", isActive && "drop-shadow-[0_0_8px_rgba(255,0,255,0.6)]")} />
              <span className="font-semibold tracking-wide">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-primary/20">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="font-semibold tracking-wide uppercase text-sm">Disconnect</span>
        </button>
      </div>
      </div>
    </aside>
  )
}
