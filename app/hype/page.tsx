'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Sparkles, 
  Image as ImageIcon, 
  MessageSquare, 
  Trophy, 
  Download, 
  Plus, 
  Loader2, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { toPng } from 'html-to-image'
import { MEME_TEMPLATES } from '@/lib/meme-templates'
import { useStore } from '@/store/useStore'

export default function HypePage() {
  return (
    <div className="relative p-6 md:p-12 min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[url('/meme_gen/vice_city_06.webp')] bg-cover bg-center opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <header className="mb-12">
        <h2 className="text-accent font-bold uppercase tracking-widest text-xs mb-2">Fan Workshop</h2>
        <h1 className="text-4xl font-black italic tracking-tighter">VICE VAULT TOOLS</h1>
      </header>

      <Tabs defaultValue="stories" className="space-y-8">
        <TabsList className="bg-muted/30 p-1 rounded-2xl border border-white/5 inline-flex">
          <TabsTrigger value="stories" className="rounded-xl px-6">STORY BUILDER</TabsTrigger>
          <TabsTrigger value="memes" className="rounded-xl px-6">MEME GEN</TabsTrigger>
          <TabsTrigger value="polls" className="rounded-xl px-6">COMMUNITY POLLS</TabsTrigger>
        </TabsList>

        <TabsContent value="stories">
          <StoryBuilder />
        </TabsContent>

        <TabsContent value="memes">
          <MemeGenerator />
        </TabsContent>

        <TabsContent value="polls">
          <PollsSystem />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  )
}

function StoryBuilder() {
  const { user } = useStore()
  const [step, setStep] = useState(1)
  const [choices, setChoices] = useState<any>({})
  const [result, setResult] = useState<string | null>(null)
  const [isSharing, setIsSharing] = useState(false)
  const [hasShared, setHasShared] = useState(false)

  const handleChoice = (key: string, value: string) => {
    const newChoices = { ...choices, [key]: value }
    setChoices(newChoices)
    if (step < 3) {
      setStep(step + 1)
    } else {
      generateStory(newChoices)
    }
  }

  const generateStory = async (c: any) => {
    setResult("Generating your Vice story...")
    setHasShared(false)
    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(c),
      })
      const data = await response.json()
      setResult(data.story)
    } catch (error) {
      console.error('Error generating story:', error)
      setResult("The neon lights flickered out... (AI failed to generate). Try again.")
    }
  }

  const handleShare = async () => {
    if (!user || !result || isSharing) return
    setIsSharing(true)
    try {
      const res = await fetch('/api/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'story',
          content: result,
          metadata: choices
        })
      })
      if (res.ok) {
        setHasShared(true)
      }
    } catch (err) {
      console.error('Error sharing story:', err)
      alert('Failed to share to the wire.')
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <Card className="bg-black/40 border-white/5 p-8 overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-transform group-hover:scale-[1.6]">
        <Sparkles className="w-64 h-64 text-primary" />
      </div>

      <div className="relative z-10 max-w-2xl">
        {!result ? (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-black italic">{step}/3</div>
              <h3 className="text-2xl font-bold italic tracking-tight">BUILD YOUR VICE STORY</h3>
            </div>

            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Where do you land first?</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {['VICE CITY', 'HAMLET', 'THE KEYS'].map(loc => (
                    <Button key={loc} variant="outline" className="h-16 rounded-xl border-white/10 hover:border-primary/50 font-bold" onClick={() => handleChoice('loc', loc)}>{loc}</Button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">What's your background?</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {['HUSTLER', 'GETAWAY DRIVER', 'LEO (UNDERCOVER)'].map(job => (
                    <Button key={job} variant="outline" className="h-16 rounded-xl border-white/10 hover:border-primary/50 font-bold" onClick={() => handleChoice('job', job)}>{job}</Button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">What goes wrong?</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {['POLICE CHASE', 'BETRAYAL', 'DEAL GONE SOUTH'].map(event => (
                    <Button key={event} variant="outline" className="h-16 rounded-xl border-white/10 hover:border-primary/50 font-bold" onClick={() => handleChoice('event', event)}>{event}</Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 animate-in zoom-in-95">
             <div className="p-6 bg-primary/10 border-l-4 border-primary rounded-r-xl">
               <p className="text-xl font-medium leading-relaxed italic">"{result}"</p>
             </div>
             <div className="flex gap-3">
               <Button onClick={() => {setStep(1); setResult(null); setChoices({})}} variant="secondary" className="rounded-xl font-bold">RESTART</Button>
               <Button 
                onClick={handleShare} 
                className={cn(
                  "rounded-xl font-bold transition-all",
                  hasShared ? "bg-green-500 hover:bg-green-600 text-white" : "bg-primary text-white"
                )}
                disabled={isSharing || hasShared || !user}
               >
                 {isSharing ? (
                   <Loader2 className="w-4 h-4 animate-spin mr-2" />
                 ) : hasShared ? (
                   <CheckCircle2 className="w-4 h-4 mr-2" />
                 ) : null}
                 {hasShared ? 'SHARED TO WIRE' : 'SHARE TO FEED'}
               </Button>
             </div>
          </div>
        )}
      </div>
    </Card>
  )
}

function MemeGenerator() {
  const [topText, setTopText] = useState('')
  const [bottomText, setBottomText] = useState('')
  const [templates, setTemplates] = useState<string[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const memeRef = useRef<HTMLDivElement>(null)
  const { user } = useStore()
  const [isSharing, setIsSharing] = useState(false)
  const [hasShared, setHasShared] = useState(false)

  const refreshTemplates = () => {
    const shuffled = [...MEME_TEMPLATES].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, 4).map(name => `/meme_gen/${name}`)
    setTemplates(selected)
    if (!selectedImage || !selected.includes(selectedImage)) {
      setSelectedImage(selected[0])
    }
  }

  useEffect(() => {
    refreshTemplates()
  }, [])

  const handleDownload = async () => {
    if (!memeRef.current) return
    try {
      const dataUrl = await toPng(memeRef.current, { cacheBust: true })
      const link = document.createElement('a')
      link.download = `vice-vault-meme-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Download failed', err)
    }
  }

  const handleShareToWire = async () => {
    if (!memeRef.current || !user || isSharing) return
    setIsSharing(true)
    try {
      const dataUrl = await toPng(memeRef.current, { cacheBust: true })
      
      const resData = await fetch(dataUrl)
      const blob = await resData.blob()
      const file = new File([blob], 'meme.png', { type: 'image/png' })
      const formData = new FormData()
      formData.append('file', file)
      
      const uploadRes = await fetch('/api/feed/image', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      })
      const uploadData = await uploadRes.json()
      
      if (uploadData.url) {
        const res = await fetch('/api/feed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'image',
            content: 'Just made this in the Fan Workshop 🔥',
            image_url: uploadData.url
          })
        })
        if (res.ok) setHasShared(true)
      }
    } catch (err) {
      console.error('Share to wire failed', err)
      alert('Failed to share to the wire.')
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <Card className="bg-black/40 border-white/10 p-6 space-y-6">
        <h3 className="text-xl font-black italic tracking-tighter flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-secondary" />
          EDITOR
        </h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-black text-muted-foreground">Top Text</Label>
            <Input 
              placeholder="e.g. Me waiting for 2026..." 
              value={topText} 
              onChange={e => setTopText(e.target.value)}
              className="bg-black/60 border-white/5 rounded-xl h-12 italic"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-black text-muted-foreground">Bottom Text</Label>
            <Input 
              placeholder="e.g. *Internal screaming*" 
              value={bottomText} 
              onChange={e => setBottomText(e.target.value)}
              className="bg-black/60 border-white/5 rounded-xl h-12 italic"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-[10px] uppercase font-black text-muted-foreground">Select Template</Label>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={refreshTemplates}
            className="h-6 px-2 text-[10px] font-black italic hover:text-primary transition-colors gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            REFRESH
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {templates.map((url, i) => (
            <div 
              key={i} 
              onClick={() => setSelectedImage(url)}
              className={cn(
                "aspect-square bg-muted rounded-lg border cursor-pointer overflow-hidden transition-all",
                selectedImage === url ? "border-primary scale-95" : "border-white/5 hover:border-primary/50"
              )}
            >
               <img src={url} className="w-full h-full object-cover" alt="template" />
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button onClick={handleDownload} variant="outline" className="flex-1 h-12 rounded-xl border-white/10 hover:border-secondary/50 font-black italic tracking-wider group">
            <Download className="w-4 h-4 mr-2 group-active:scale-90 transition-transform" />
            DOWNLOAD
          </Button>
          <Button 
            onClick={handleShareToWire} 
            disabled={isSharing || hasShared || !user}
            className={cn(
               "flex-[2] h-12 rounded-xl font-black italic tracking-wider transition-all",
               hasShared ? "bg-green-500 hover:bg-green-600 text-white" : "bg-primary text-white"
            )}
          >
            {isSharing ? (
               <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : hasShared ? (
               <CheckCircle2 className="w-4 h-4 mr-2" />
            ) : null}
            {hasShared ? 'SHARED TO WIRE' : 'SHARE TO WIRE'}
          </Button>
        </div>
      </Card>

      <div className="relative aspect-square md:aspect-auto h-full flex items-center justify-center">
        <div ref={memeRef} className="relative w-full max-w-md aspect-[4/5] bg-muted rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          {selectedImage && (
            <img 
              src={selectedImage} 
              className="w-full h-full object-cover" 
              alt="preview" 
            />
          )}
          <div className="absolute inset-0 p-8 flex flex-col justify-between items-center pointer-events-none text-center">
            <h2 className="text-4xl md:text-5xl font-black italic text-white uppercase drop-shadow-[0_2px_5px_rgba(0,0,0,1)] tracking-tighter break-words w-full">
              {topText}
            </h2>
            <h2 className="text-4xl md:text-5xl font-black italic text-white uppercase drop-shadow-[0_2px_5px_rgba(0,0,0,1)] tracking-tighter break-words w-full">
              {bottomText}
            </h2>
          </div>
        </div>
      </div>
    </div>
  )
}

function PollsSystem() {
  const [polls, setPolls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [newQuestion, setNewQuestion] = useState('')
  const [newOptions, setNewOptions] = useState(['', ''])
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()
    fetchPolls()

    const channel = supabase
      .channel('polls-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'poll_votes' }, () => {
        fetchPolls()
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'polls' }, () => {
        fetchPolls()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const fetchPolls = async () => {
    const { data: pollsData } = await supabase.from('polls').select('*').order('created_at', { ascending: false })
    const { data: votesData } = await supabase.from('poll_votes').select('*')

    if (pollsData) {
      const enrichedPolls = pollsData.map(poll => {
        const votes = votesData?.filter(v => v.poll_id === poll.id) || []
        const totalVotes = votes.length
        const optionStats = poll.options.map((_: any, idx: number) => {
          const count = votes.filter(v => v.option_index === idx).length
          return {
            percent: totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0,
            count
          }
        })
        return { ...poll, totalVotes, optionStats }
      })
      setPolls(enrichedPolls)
    }
    setLoading(false)
  }

  const handleCreatePoll = async () => {
    if (!user) return alert('Please login to create a poll!')
    if (!newQuestion || newOptions.some(o => !o)) return
    
    // 1. Create Poll
    const { data: pollData, error } = await supabase.from('polls').insert({
      question: newQuestion,
      options: newOptions,
      user_id: user.id
    }).select().single()

    if (!error && pollData) {
      setIsCreating(false)
      setNewQuestion('')
      setNewOptions(['', ''])

      // 2. Share to Wire
      await fetch('/api/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'poll_share',
          content: newQuestion,
          metadata: { poll_id: pollData.id, options: newOptions }
        })
      })
    }
  }

  const handleVote = async (pollId: string, optionIndex: number) => {
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) return alert('Please login to vote!')

    const { error } = await supabase.from('poll_votes').upsert({
      poll_id: pollId,
      user_id: currentUser.id,
      option_index: optionIndex
    }, { onConflict: 'poll_id,user_id' })

    if (error) console.error(error)
  }

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" /></div>

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center bg-black/40 p-6 rounded-2xl border border-white/5">
        <div>
          <h3 className="text-xl font-bold italic">COMMUNITY PULSE</h3>
          <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mt-1">Shape the future of Leonida</p>
        </div>
        {user ? (
          <Button onClick={() => setIsCreating(!isCreating)} className="rounded-xl bg-primary text-white font-bold italic">
            <Plus className="w-4 h-4 mr-2" />
            {isCreating ? 'CANCEL' : 'NEW POLL'}
          </Button>
        ) : (
          <Button asChild className="rounded-xl bg-muted text-foreground font-bold italic">
            <a href="/profile">LOGIN TO CREATE POLL</a>
          </Button>
        )}
      </div>

      {isCreating && (
        <Card className="bg-primary/5 border-primary/20 animate-in slide-in-from-top-4">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black">Question</Label>
              <Input 
                value={newQuestion} 
                onChange={e => setNewQuestion(e.target.value)}
                placeholder="What do you think about...?" 
                className="bg-black/40 border-white/10 rounded-xl"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {newOptions.map((opt, i) => (
                <div key={i} className="space-y-2">
                  <Label className="text-[10px] uppercase font-black">Option {i + 1}</Label>
                  <Input 
                    value={opt}
                    onChange={e => {
                      const next = [...newOptions]
                      next[i] = e.target.value
                      setNewOptions(next)
                    }}
                    placeholder={`Choice ${i + 1}`} 
                    className="bg-black/40 border-white/10 rounded-xl"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2">
               <Button onClick={() => setNewOptions([...newOptions, ''])} disabled={newOptions.length >= 4} variant="outline" className="rounded-xl flex-1">ADD OPTION</Button>
               <Button onClick={handleCreatePoll} className="rounded-xl flex-1 bg-primary text-white font-bold italic">CREATE POLL</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {polls.map(poll => (
          <PollCard 
            key={poll.id} 
            poll={poll} 
            onVote={(idx: number) => handleVote(poll.id, idx)} 
          />
        ))}
      </div>
    </div>
  )
}

function PollCard({ poll, onVote }: any) {
  return (
    <Card className="bg-black/40 border-white/5 group overflow-hidden">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold italic mb-2 leading-tight">{poll.question}</CardTitle>
          <Trophy className="w-4 h-4 text-warning opacity-20 group-hover:opacity-100 transition-opacity" />
        </div>
        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{poll.totalVotes.toLocaleString()} VOTES</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {poll.options.map((opt: string, i: number) => (
          <Button 
            key={i} 
            onClick={() => onVote(i)}
            variant="outline" 
            className="w-full justify-start h-12 rounded-xl border-white/5 bg-white/5 hover:bg-primary/10 hover:border-primary/40 relative overflow-hidden group/opt"
          >
             <div 
               className="absolute left-0 top-0 bottom-0 bg-primary/20 transition-all duration-1000" 
               style={{ width: `${poll.optionStats[i].percent}%` }}
             />
             <span className="relative z-10 font-bold italic tracking-tight flex-1 text-left">{opt}</span>
             <span className="relative z-10 text-[10px] font-black opacity-40 group-hover/opt:opacity-100 italic">
               {poll.optionStats[i].percent}%
             </span>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
