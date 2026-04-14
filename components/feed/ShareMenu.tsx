'use client'

import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { Share2, Link2, User, Send, ExternalLink } from 'lucide-react'

interface ShareMenuProps {
  postId: string
  authorName?: string
}

export function ShareMenu({ postId, authorName }: ShareMenuProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/feed/${postId}`

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareToProfile = async () => {
    try {
      const res = await fetch('/api/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'text',
          content: `Checking out this post by @${authorName}`,
          metadata: { original_post_id: postId, share_ref: true }
        })
      })
      if (res.ok) {
        alert('Shared to your profile!')
      }
    } catch (err) {
      console.error('Error sharing to profile:', err)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center p-0 hover:bg-transparent text-muted-foreground hover:text-white active:scale-95 border-none bg-transparent outline-none cursor-pointer">
        <Share2 className="w-5 h-5 mr-2" />
        <span className="text-xs font-black italic tracking-tighter uppercase">SHARE</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-black/90 border-white/10 backdrop-blur-xl rounded-xl">
        <div className="px-3 py-2 text-[10px] uppercase font-black text-muted-foreground tracking-widest">Spread the Hype</div>
        <DropdownMenuSeparator className="bg-white/5" />
        <DropdownMenuItem 
          onClick={shareToProfile}
          className="focus:bg-primary/20 focus:text-white cursor-pointer py-3 rounded-lg transition-colors"
        >
          <User className="w-4 h-4 mr-3 text-primary" />
          <span className="text-xs font-bold italic">Share to My Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={copyLink}
          className="focus:bg-primary/20 focus:text-white cursor-pointer py-3 rounded-lg transition-colors"
        >
          <Link2 className="w-4 h-4 mr-3 text-secondary" />
          <span className="text-xs font-bold italic">{copied ? 'Copied!' : 'Copy Link'}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/5" />
        <DropdownMenuItem 
          className="focus:bg-primary/20 focus:text-white cursor-pointer py-3 rounded-lg transition-colors"
          onClick={() => window.open(`https://twitter.com/intent/tweet?text=Check this out on Vice Vault! @${authorName}&url=${shareUrl}`, '_blank', 'noopener,noreferrer')}
        >
          <Send className="w-4 h-4 mr-3 text-[#1DA1F2]" />
          <span className="text-xs font-bold italic">X / Twitter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
