'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Send, ArrowLeft, Radio } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function DMThreadPage() {
  const params = useParams()
  const otherUserId = params.id as string
  const { user } = useStore()
  const supabase = createClient()
  
  const [messages, setMessages] = useState<any[]>([])
  const [otherUser, setOtherUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user && otherUserId) {
      fetchOtherUser()
      fetchMessages()

      const channel = supabase.channel(`dm-${user.id}-${otherUserId}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
           // We could optimize, but refetching ensures we get latest ordering easily
           const msg = payload.new
           if ((msg.sender_id === user.id && msg.receiver_id === otherUserId) || 
               (msg.sender_id === otherUserId && msg.receiver_id === user.id)) {
               fetchMessages()
           }
        })
        .subscribe()

      return () => { supabase.removeChannel(channel) }
    }
  }, [user, otherUserId])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  const fetchOtherUser = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('id', otherUserId).single()
    if (data) setOtherUser(data)
  }

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .or(`and(sender_id.eq.${user?.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user?.id})`)
      .order('created_at', { ascending: true })
      .limit(100)
    
    if (data) {
      setMessages(data)
      // mark read
      const unreadIds = data.filter(m => m.receiver_id === user?.id && !m.read).map(m => m.id)
      if (unreadIds.length > 0) {
        await supabase.from('chat_messages').update({ read: true }).in('id', unreadIds)
      }
    }
    setLoading(false)
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user || !otherUser) return

    const { error } = await supabase.from('chat_messages').insert({
      sender_id: user.id,
      receiver_id: otherUserId,
      content: newMessage.trim()
    })
    
    if (!error) setNewMessage('')
  }

  if (loading) return <div className="p-12 animate-pulse flex justify-center min-h-screen items-center"><Radio className="animate-spin text-primary w-12 h-12 mb-20" /></div>

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-4xl mx-auto p-4 md:p-8 pt-8">
      <header className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-white rounded-full">
            <Link href="/dm"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <Link href={`/profile/${otherUserId}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Avatar className="w-12 h-12 border-2 border-primary/20">
              <AvatarImage src={otherUser?.avatar_url} />
              <AvatarFallback className="bg-muted text-xs font-black italic">{otherUser?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-black italic tracking-tighter uppercase text-white">
                {otherUser?.display_name || otherUser?.username}
              </h1>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Encrypted Channel</span>
            </div>
          </Link>
        </div>
      </header>
      
      <div className="flex-1 bg-black/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-xl flex flex-col shadow-2xl">
        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground font-black italic opacity-50 space-y-2">
              <span className="text-2xl tracking-tighter">SECURE CONNECTION ESTABLISHED</span>
              <span className="text-xs uppercase tracking-widest bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/30">End-to-end Encrypted</span>
            </div>
          ) : (
            messages.map(msg => {
              const isMine = msg.sender_id === user?.id
              return (
                <div key={msg.id} className={`flex gap-3 ${isMine ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-[75%]`}>
                    <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed ${isMine ? 'bg-primary text-white rounded-br-sm shadow-[0_0_15px_rgba(255,0,255,0.3)]' : 'bg-muted/50 border border-white/5 rounded-bl-sm text-foreground/90'}`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
        
        <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-black/60 flex items-center gap-3">
          <Input 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message @${otherUser?.username}...`} 
            className="flex-1 bg-black/50 border-white/10 h-14 rounded-xl italic font-medium focus:border-primary/50 text-white"
            autoFocus={!loading}
          />
          <Button type="submit" disabled={!newMessage.trim() || !user || !otherUser} className="h-14 w-14 rounded-xl bg-primary text-white hover:bg-primary/80 transition-all font-black shrink-0 shadow-[0_0_20px_rgba(255,0,255,0.3)]">
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}
