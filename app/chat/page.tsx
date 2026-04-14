'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Radio, Send } from 'lucide-react'
import Link from 'next/link'

export default function ChatPage() {
  const { user } = useStore()
  const supabase = createClient()
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMessages()

    const channel = supabase.channel('global-chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
         if (payload.new.receiver_id === null) {
            fetchMessages() 
         }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*, profiles!sender_id(username, avatar_url, display_name)')
      .is('receiver_id', null)
      .order('created_at', { ascending: true })
      .limit(100)
    
    if (error) {
      console.error("Error fetching chat:", error)
      setErrorMsg(error.message || "Failed to fetch messages")
    } else {
      setErrorMsg(null)
    }
    if (data) setMessages(data)
    setLoading(false)
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    const { error } = await supabase.from('chat_messages').insert({
      sender_id: user.id,
      content: newMessage.trim()
    })
    
    if (error) {
       console.error("Failed to push message:", error)
       alert("Error sending message: " + error.message)
    } else {
       setNewMessage('')
    }
  }

  if (loading) return <div className="p-12 animate-pulse flex justify-center"><Radio className="animate-spin text-primary w-12 h-12" /></div>

  return (
    <div className="relative flex flex-col h-screen overflow-hidden">
      {/* Full Page Background */}
      <div className="absolute inset-0 bg-[url('/meme_gen/vice_city_01.webp')] bg-cover bg-center opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black/80" />
      
      <div className="relative z-10 flex flex-col h-full max-w-4xl mx-auto w-full p-4 md:p-8 pt-8">
        <header className="mb-6">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
          <span className="text-primary">GLOBAL</span> FREQUENCY
        </h1>
        <p className="text-xs uppercase font-bold text-muted-foreground tracking-widest mt-1">Live chatter across the Vice Vault</p>
      </header>
      
      <div className="flex-1 bg-black/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-xl flex flex-col shadow-2xl">
        {errorMsg && (
          <div className="p-3 bg-red-500/20 text-red-500 font-bold text-xs uppercase tracking-widest border-b border-red-500/30 text-center">
            {errorMsg}
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground font-black italic opacity-50 text-xl">SILENCE ON THE WIRE</div>
          ) : (
            messages.map(msg => {
              const isMine = msg.sender_id === user?.id
              return (
                <div key={msg.id} className={`flex gap-3 ${isMine ? 'flex-row-reverse' : ''}`}>
                  <Link href={`/profile/${msg.sender_id}`}>
                    <Avatar className="w-10 h-10 border border-white/10 hover:border-primary/50 transition-colors">
                      <AvatarImage src={msg.profiles?.avatar_url} />
                      <AvatarFallback className="bg-muted text-[10px] font-black italic">{msg.profiles?.username?.substring(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-[70%]`}>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                      {msg.profiles?.username}
                    </span>
                    <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed ${isMine ? 'bg-primary text-white rounded-tr-sm shadow-[0_0_15px_rgba(255,0,255,0.3)]' : 'bg-muted/50 border border-white/5 rounded-tl-sm'}`}>
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
            placeholder="Broadcast to all citizens..." 
            className="flex-1 bg-black/50 border-white/10 h-14 rounded-xl italic font-medium focus:border-primary/50 text-white"
            autoFocus={!loading}
          />
          <Button type="submit" disabled={!newMessage.trim() || !user} className="h-14 w-14 rounded-xl bg-primary text-white hover:bg-primary/80 transition-all font-black shrink-0 shadow-[0_0_20px_rgba(255,0,255,0.3)]">
            <Send className="w-5 h-5" />
          </Button>
        </form>
        </div>
      </div>
    </div>
  )
}
