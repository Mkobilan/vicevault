'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ProfileView } from '../ProfileView'
import { useStore } from '@/store/useStore'
import { Radio } from 'lucide-react'
import { useParams } from 'next/navigation'

export default function OtherProfilePage() {
  const { user, setUser } = useStore()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const params = useParams()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    setUser(currentUser)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <Radio className="w-12 h-12 text-primary animate-pulse mb-4" />
        <div className="text-primary font-black italic tracking-widest uppercase">Syncing with Central Intelligence...</div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-12 max-w-6xl mx-auto min-h-screen">
      <ProfileView user={user} targetUserId={params.id as string} />
    </div>
  )
}
