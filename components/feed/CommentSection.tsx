'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatDistanceToNow } from 'date-fns'
import { Loader2, Send } from 'lucide-react'

interface CommentSectionProps {
  postId: string
  currentUserId?: string
  currentUserProfile?: any
}

export function CommentSection({ postId, currentUserId, currentUserProfile }: CommentSectionProps) {
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/feed/comment?postId=${postId}`)
      const data = await res.json()
      if (data.comments) {
        setComments(data.comments)
      }
    } catch (err) {
      console.error('Error fetching comments:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || submitting) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/feed/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content: newComment.trim() })
      })
      const data = await res.json()
      if (data.comment) {
        setComments([...comments, data.comment])
        setNewComment('')
      }
    } catch (err) {
      console.error('Error posting comment:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-xs text-muted-foreground italic text-center py-2">No talk on the wire yet...</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 animate-in fade-in slide-in-from-left-2 transition-all">
              <Avatar className="w-8 h-8 border border-white/10">
                <AvatarImage src={comment.profiles?.avatar_url} />
                <AvatarFallback className="text-[10px] font-black italic">{comment.profiles?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="bg-muted/30 p-3 rounded-2xl rounded-tl-none border border-white/5">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-black italic uppercase text-primary leading-none">
                      {comment.profiles?.username}
                    </span>
                    <span className="text-[8px] text-muted-foreground font-bold uppercase">
                      {formatDistanceToNow(new Date(comment.created_at))} AGO
                    </span>
                  </div>
                  <p className="text-xs text-foreground/90 leading-relaxed font-medium">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {currentUserId && (
        <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
          <Avatar className="w-8 h-8 border border-white/10 hidden sm:flex">
            <AvatarImage src={currentUserProfile?.avatar_url} />
            <AvatarFallback className="text-[10px] font-black italic">YOU</AvatarFallback>
          </Avatar>
          <div className="relative flex-1">
            <Input 
              placeholder="Join the conversation..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="bg-black/60 border-white/10 rounded-xl h-10 text-xs italic pr-10 focus:border-primary/50 transition-all"
              disabled={submitting}
            />
            <button 
              type="submit"
              disabled={!newComment.trim() || submitting}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-white transition-colors disabled:opacity-30 active:scale-90"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
