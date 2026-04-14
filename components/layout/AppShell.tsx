'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useStore } from '@/store/useStore'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, setUser } = useStore()
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Initial user check
    const getUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)
      setIsInitialLoad(false)
    }
    getUser()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Navigation Guard: Redirect if not logged in and trying to access protected routes
  useEffect(() => {
    if (!isInitialLoad && !user) {
      const publicRoutes = ['/', '/profile']
      if (!publicRoutes.includes(pathname)) {
        router.push('/profile')
      }
    }
  }, [user, pathname, isInitialLoad, router])

  // Logic: Only show sidebar and bottom nav if user is logged in
  const showNav = !!user

  return (
    <>
      {showNav && <Sidebar />}
      <main 
        className={cn(
          "flex-1 pb-16 md:pb-0 overflow-x-hidden transition-all duration-300",
          showNav ? "md:ml-64" : "md:ml-0"
        )}
      >
        {children}
      </main>
      {showNav && <BottomNav />}
    </>
  )
}
