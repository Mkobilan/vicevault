'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Map, LayoutDashboard, Sparkles, User, Radio, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Vault', href: '/vault', icon: LayoutDashboard },
  { name: 'Map', href: '/map', icon: Map },
  { name: 'Wire', href: '/feed', icon: Radio },
  { name: 'Hype', href: '/hype', icon: Sparkles },
  { name: 'Chat', href: '/chat', icon: MessageSquare },
  { name: 'Profile', href: '/profile', icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-black/80 backdrop-blur-lg border-t border-primary/20 md:hidden">
      <div className="grid h-full grid-cols-6 mx-auto max-w-lg">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-colors duration-200",
                isActive ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "drop-shadow-[0_0_8px_rgba(255,0,255,0.6)]")} />
              <span className="text-[10px] font-medium uppercase tracking-widest">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
