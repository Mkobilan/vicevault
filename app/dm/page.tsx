'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useStore } from '@/store/useStore'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { MessageSquare, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function DMInbox() {
  const { user } = useStore()
  const supabase = createClient()
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) fetchConversations()
  }, [user])

  const fetchConversations = async () => {
    // To get unique conversations, we fetch messages where we are sender or receiver
    const { data: messages } = await supabase
      .from('chat_messages')
      .select('*, profiles:profiles!sender_id(id, username, avatar_url, display_name), receiver:profiles!receiver_id(id, username, avatar_url, display_name)')
      .not('receiver_id', 'is', null)
      .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
      .order('created_at', { ascending: false })

    if (messages) {
      // Group by the *other* user
      const usersMap = new Map()
      messages.forEach(msg => {
        const isOutgoing = msg.sender_id === user?.id
        const otherUser = isOutgoing ? msg.receiver : msg.profiles
        if (otherUser && !usersMap.has(otherUser.id)) {
          usersMap.set(otherUser.id, {
            user: otherUser,
            lastMessage: msg.content,
            time: msg.created_at,
            read: msg.read || isOutgoing
          })
        }
      })
      setConversations(Array.from(usersMap.values()))
    }
    setLoading(false)
  }

  return (
    <div className="p-4 md:p-12 max-w-4xl mx-auto min-h-screen">
      <header className="mb-10 flex items-center gap-4">
        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
          <MessageSquare className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">PRIVATE CHANNELS</h1>
          <p className="text-xs uppercase font-bold text-muted-foreground tracking-widest mt-1">Encrypted Vice Vault Communications</p>
        </div>
      </header>

      <div className="grid gap-4">
        {loading ? (
          <div className="animate-pulse text-muted-foreground italic font-black uppercase text-xl text-center py-20">DECRYPTING INBOX...</div>
        ) : conversations.length === 0 ? (
          <div className="py-20 text-center opacity-30 border-2 border-dashed border-white/5 rounded-3xl">
            <p className="font-black italic text-xl">NO ENCRYPTED MESSAGES</p>
            <p className="text-xs uppercase font-bold tracking-widest mt-2">Find citizens in the Wire to start a chat</p>
          </div>
        ) : (
          conversations.map(conv => (
            <Link key={conv.user.id} href={`/dm/${conv.user.id}`} className="group relative bg-black/40 border border-white/5 p-6 rounded-2xl hover:border-primary/50 transition-all flex items-center justify-between overflow-hidden backdrop-blur-xl">
              {!conv.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(255,0,255,0.8)]" />}
              <div className="flex items-center gap-5">
                <Avatar className="w-14 h-14 border-2 border-primary/20 group-hover:border-primary transition-colors">
                  <AvatarImage src={conv.user.avatar_url} />
                  <AvatarFallback className="bg-muted text-sm font-black italic">{conv.user.username?.substring(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-black italic text-lg uppercase group-hover:text-primary transition-colors">{conv.user.display_name || conv.user.username}</h3>
                  <p className="text-sm font-medium text-muted-foreground line-clamp-1 italic mt-1">{conv.lastMessage}</p>
                </div>
              </div>
              <Button size="icon" variant="ghost" className="rounded-full text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all scale-75 md:scale-100">
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
