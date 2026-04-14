'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, MessageSquare, Share2, ExternalLink, MoreHorizontal } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import { CommentSection } from '@/components/feed/CommentSection'
import { ShareMenu } from '@/components/feed/ShareMenu'
import { EmbeddedPoll } from '@/components/feed/EmbeddedPoll'
import Link from 'next/link'

interface FeedPostCardProps {
  post: any
  onLike?: (postId: string, liked: boolean) => void
  onComment?: (postId: string, content: string) => void
  currentUserId?: string
  currentUserProfile?: any
}

export function FeedPostCard({ post, onLike, onComment, currentUserId, currentUserProfile }: FeedPostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [isLiked, setIsLiked] = useState(post.user_liked)
  const [likesCount, setLikesCount] = useState(post.likes_count || 0)

  const handleLike = async () => {
    const newLiked = !isLiked
    setIsLiked(newLiked)
    setLikesCount((prev: number) => newLiked ? prev + 1 : prev - 1)
    
    try {
      const res = await fetch('/api/feed/like', {
        method: newLiked ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id })
      })
      if (!res.ok) throw new Error('Failed to like/unlike')
    } catch (err) {
      // Revert if API fails
      setIsLiked(!newLiked)
      setLikesCount((prev: number) => !newLiked ? prev + 1 : prev - 1)
    }
  }

  const renderContent = () => {
    switch (post.type) {
      case 'story':
        return (
          <div className="p-6 bg-primary/10 border-l-4 border-primary rounded-r-xl space-y-4">
             {post.metadata && (
               <div className="flex flex-wrap gap-2 mb-2">
                 {post.metadata.loc && <Badge variant="outline" className="text-[8px] border-primary/30 text-primary uppercase">{post.metadata.loc}</Badge>}
                 {post.metadata.job && <Badge variant="outline" className="text-[8px] border-secondary/30 text-secondary uppercase">{post.metadata.job}</Badge>}
                 {post.metadata.event && <Badge variant="outline" className="text-[8px] border-accent/30 text-accent uppercase">{post.metadata.event}</Badge>}
               </div>
             )}
             <p className="text-lg font-medium leading-relaxed italic text-white/90">"{post.content}"</p>
          </div>
        )
      case 'image':
        return (
          <div className="space-y-4">
            {post.content && <p className="text-sm text-foreground/80 leading-relaxed font-medium">{post.content}</p>}
            <div className="relative w-full rounded-xl overflow-hidden border border-white/5 bg-black/20 group flex justify-center">
              <img src={post.image_url} alt="post content" className="w-full h-auto max-h-[700px] object-contain transition-transform duration-500 group-hover:scale-[1.02]" />
            </div>
          </div>
        )
      case 'poll_share':
        return (
          <div className="space-y-4 bg-muted/20 p-6 rounded-xl border border-white/5">
             <div className="flex items-center gap-2 mb-2">
               <Badge className="bg-secondary text-black font-bold text-[8px] tracking-tighter">SHARED POLL</Badge>
             </div>
             {post.metadata?.poll_id ? (
               <EmbeddedPoll pollId={post.metadata.poll_id} />
             ) : (
               <>
                 <p className="text-lg font-bold italic">{post.content}</p>
                 <Button variant="outline" className="w-full border-white/10 hover:border-secondary/50 font-bold italic h-12" asChild>
                   <a href="/hype">VOTE NOW ON THE POLLS PAGE</a>
                 </Button>
               </>
             )}
          </div>
        )
      default:
        return <p className="text-base text-foreground/90 leading-relaxed whitespace-pre-wrap font-medium">{post.content}</p>
    }
  }

  return (
    <Card className="bg-black/60 border-white/5 hover:border-primary/20 transition-all duration-300 overflow-hidden backdrop-blur-xl group">
      <CardHeader className="p-6 pb-4">
        <div className="flex justify-between items-center">
          <Link href={`/profile/${post.user_id}`} className="flex items-center gap-4 hover:opacity-80 transition-opacity">
            <Avatar className="w-12 h-12 border-2 border-primary/20">
              <AvatarImage src={post.profiles?.avatar_url} />
              <AvatarFallback className="bg-muted text-xs font-black italic">{post.profiles?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black italic tracking-tighter uppercase text-white group-hover:text-primary transition-colors">
                  {post.profiles?.display_name || post.profiles?.username}
                </span>
                <span className="text-[10px] text-muted-foreground font-bold font-mono">
                  @{post.profiles?.username}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-0.5">
                {formatDistanceToNow(new Date(post.created_at))} AGO • Leonida Citizen
              </p>
            </div>
          </Link>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white rounded-full">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-0 space-y-6">
        <div className="content">
          {renderContent()}
        </div>

        <div className="flex items-center gap-6 pt-4 border-t border-white/5">
          <Button 
            onClick={handleLike}
            variant="ghost" 
            className={cn(
              "p-0 hover:bg-transparent transition-all active:scale-90",
              isLiked ? "text-primary" : "text-muted-foreground hover:text-white"
            )}
          >
            <Heart className={cn("w-5 h-5 mr-2", isLiked && "fill-current animate-heart-pop")} />
            <span className="text-xs font-black italic tracking-tighter">{likesCount}</span>
          </Button>

          <Button 
            onClick={() => setShowComments(!showComments)}
            variant="ghost" 
            className="p-0 hover:bg-transparent text-muted-foreground hover:text-white active:scale-95"
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            <span className="text-xs font-black italic tracking-tighter">{post.comments_count || 0}</span>
          </Button>

          <div className="ml-auto">
             <ShareMenu postId={post.id} authorName={post.profiles?.username} />
          </div>
        </div>

        {showComments && (
          <div className="pt-4 border-t border-white/5 animate-in slide-in-from-top-2">
            <CommentSection 
              postId={post.id} 
              currentUserId={currentUserId} 
              currentUserProfile={currentUserProfile}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
