'use client'

import { useState, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Image as ImageIcon, X, Send, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PostComposerProps {
  currentUserProfile: any
  onPostCreated?: (post: any) => void
}

export function PostComposer({ currentUserProfile, onPostCreated }: PostComposerProps) {
  const [content, setContent] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setIsExpanded(true)
    }
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handlePost = async () => {
    if (!content.trim() && !image) return
    setLoading(true)

    try {
      let imageUrl = null

      // 1. Upload image if exists
      if (image) {
        const formData = new FormData()
        formData.append('file', image)
        const uploadRes = await fetch('/api/feed/image', {
          method: 'POST',
          body: formData
        })
        const uploadData = await uploadRes.json()
        if (uploadData.url) imageUrl = uploadData.url
      }

      // 2. Create post
      const res = await fetch('/api/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: imageUrl ? 'image' : 'text',
          content: content.trim(),
          image_url: imageUrl
        })
      })

      const data = await res.json()
      if (data.post) {
        setContent('')
        setImage(null)
        setImagePreview(null)
        setIsExpanded(false)
        if (onPostCreated) onPostCreated(data.post)
      }
    } catch (err) {
      console.error('Error creating post:', err)
      alert('Failed to post to the wire. Neon lights flickering...')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className={cn(
      "bg-black/60 border-white/10 hover:border-primary/20 transition-all duration-300 backdrop-blur-xl overflow-hidden mb-8",
      isExpanded ? "ring-1 ring-primary/20" : ""
    )}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Avatar className="w-10 h-10 border border-white/10 mt-1">
            <AvatarImage src={currentUserProfile?.avatar_url} />
            <AvatarFallback className="text-[10px] font-black italic">{currentUserProfile?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-4">
            <div className="relative">
              <textarea 
                placeholder="What's happening in Leonida?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => setIsExpanded(true)}
                className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium italic resize-none min-h-[40px] placeholder:text-muted-foreground/50 transition-all"
                style={{ height: isExpanded ? '100px' : '40px' }}
              />
            </div>

            {imagePreview && (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                <img src={imagePreview} className="w-full h-full object-cover" alt="preview" />
                <button 
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {isExpanded && (
              <div className="flex items-center justify-between pt-2 border-t border-white/5 animate-in fade-in slide-in-from-top-2">
                <div className="flex gap-2">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-muted-foreground hover:text-secondary h-8 rounded-lg"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    <span className="text-[10px] font-black italic tracking-widest uppercase">IMAGE</span>
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <span className={cn(
                    "text-[10px] font-bold tracking-widest uppercase",
                    content.length > 250 ? "text-red-500" : "text-muted-foreground"
                  )}>
                    {content.length}/280
                  </span>
                  <Button 
                    onClick={handlePost}
                    disabled={(!content.trim() && !image) || loading || content.length > 280}
                    className="bg-primary text-white font-black italic h-9 rounded-xl px-6 tracking-widest hover:shadow-[0_0_15px_rgba(255,0,255,0.3)] transition-all"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                      <>
                        <Send className="w-3 h-3 mr-2" />
                        POST
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
