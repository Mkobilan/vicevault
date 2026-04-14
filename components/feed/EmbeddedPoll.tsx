'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trophy, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function EmbeddedPoll({ pollId }: { pollId: string }) {
  const [poll, setPoll] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchPoll()

    const channel = supabase
      .channel(`poll-${pollId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'poll_votes', filter: `poll_id=eq.${pollId}` }, () => {
        fetchPoll()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [pollId])

  const fetchPoll = async () => {
    const { data: pollData } = await supabase.from('polls').select('*').eq('id', pollId).single()
    const { data: votesData } = await supabase.from('poll_votes').select('*').eq('poll_id', pollId)

    if (pollData) {
      const votes = votesData || []
      const totalVotes = votes.length
      const optionStats = pollData.options.map((_: any, idx: number) => {
        const count = votes.filter(v => v.option_index === idx).length
        return {
          percent: totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0,
          count
        }
      })
      setPoll({ ...pollData, totalVotes, optionStats })
    }
    setLoading(false)
  }

  const handleVote = async (optionIndex: number) => {
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) return alert('Please login to vote!')

    const { error } = await supabase.from('poll_votes').insert({
      poll_id: pollId,
      user_id: currentUser.id,
      option_index: optionIndex
    })

    if (error) {
      if (error.code === '23505') {
        alert('You have already voted on this poll!')
      } else {
        console.error(error)
      }
    }
  }

  if (loading) return <div className="flex justify-center p-6"><Loader2 className="animate-spin text-primary" /></div>
  if (!poll) return (
    <div className="text-center p-4 border border-white/10 rounded-xl bg-white/5 opacity-50 text-xs font-bold uppercase tracking-widest mt-2">
      Poll no longer available
    </div>
  )

  return (
    <Card className="bg-black/40 border-white/5 group overflow-hidden mt-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold italic mb-2 leading-tight">{poll.question}</CardTitle>
          <Trophy className="w-4 h-4 text-warning opacity-20 group-hover:opacity-100 transition-opacity" />
        </div>
        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{poll.totalVotes?.toLocaleString() || 0} VOTES</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {poll.options.map((opt: string, i: number) => (
          <Button 
            key={i} 
            onClick={() => handleVote(i)}
            variant="outline" 
            className="w-full justify-start h-12 rounded-xl border-white/5 bg-white/5 hover:bg-primary/10 hover:border-primary/40 relative overflow-hidden group/opt"
          >
             <div 
               className="absolute left-0 top-0 bottom-0 bg-primary/20 transition-all duration-1000" 
               style={{ width: `${poll.optionStats?.[i]?.percent || 0}%` }}
             />
             <span className="relative z-10 font-bold italic tracking-tight flex-1 text-left">{opt}</span>
             <span className="relative z-10 text-[10px] font-black opacity-40 group-hover/opt:opacity-100 italic">
               {poll.optionStats?.[i]?.percent || 0}%
             </span>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
