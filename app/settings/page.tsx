'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  User, 
  Camera, 
  Lock, 
  Shield, 
  Check, 
  Loader2, 
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Profile State
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  // Security State
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.replace('/profile')
      return
    }
    setUser(user)
    fetchProfile(user.id)
  }

  const fetchProfile = async (userId: string) => {
    try {
      const res = await fetch(`/api/profile?userId=${userId}`)
      const data = await res.json()
      if (data.profile) {
        setProfile(data.profile)
        setUsername(data.profile.username || '')
        setDisplayName(data.profile.display_name || '')
        setBio(data.profile.bio || '')
        setBannerPreview(data.profile.banner_url || null)
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSaving(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.avatar_url) {
        setAvatarPreview(data.avatar_url)
        setProfile({ ...profile, avatar_url: data.avatar_url })
      }
    } catch (err) {
      console.error('Avatar upload failed:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSaving(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/profile/banner', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.banner_url) {
        setBannerPreview(data.banner_url)
        setProfile({ ...profile, banner_url: data.banner_url })
      }
    } catch (err) {
      console.error('Banner upload failed:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          display_name: displayName,
          bio
        })
      })
      const data = await res.json()
      if (data.error) {
        alert(data.error)
      } else {
        setProfile(data.profile)
        alert('Profile protocol updated successfully.')
      }
    } catch (err) {
      console.error('Profile update failed:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match!")
      return
    }
    setPasswordSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      alert('Security protocol updated. New password active.')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setPasswordSaving(false)
    }
  }

  if (loading) return <div className="p-12 animate-pulse flex flex-col items-center justify-center min-h-screen text-primary font-black italic uppercase">Accessing Secure Settings...</div>

  return (
    <div className="relative p-4 md:p-12 min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[url('/meme_gen/jason_lucia_trunk.PNG')] bg-cover bg-center opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      
      <div className="relative z-10 max-w-4xl mx-auto space-y-12 pb-24">
        <header className="flex items-center gap-6">
        <Button asChild variant="ghost" size="icon" className="rounded-full hover:bg-white/5">
          <Link href="/profile">
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </Button>
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase">CITIZEN SETTINGS</h1>
          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em]">Vault Security & Identity Management</p>
        </div>
      </header>

      {/* Banner Upload Area */}
      <section className="relative group rounded-3xl overflow-hidden border border-white/5 bg-black/40 h-48 md:h-64 cursor-pointer" onClick={() => bannerInputRef.current?.click()}>
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
          style={{ backgroundImage: `url(${bannerPreview || 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2000&auto=format&fit=crop'})` }} 
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="w-10 h-10 text-white mb-2" />
          <span className="text-xs font-black italic tracking-widest uppercase text-white">UPDATE COVER PHOTO</span>
        </div>
        <input 
          type="file" 
          ref={bannerInputRef} 
          onChange={handleBannerUpload} 
          className="hidden" 
          accept="image/*" 
        />
        {saving && (
           <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
           </div>
        )}
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <aside className="md:col-span-1 space-y-6">
          <Card className="bg-black/40 border-white/5 overflow-hidden backdrop-blur-xl">
             <CardHeader className="pb-0 pt-8 flex flex-col items-center">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                   <Avatar className="w-32 h-32 border-4 border-primary/20 p-1 bg-black group-hover:border-primary transition-all">
                     <AvatarImage src={avatarPreview || profile?.avatar_url || user?.user_metadata?.avatar_url} />
                     <AvatarFallback className="text-4xl font-black italic">{user?.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
                   </Avatar>
                   <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                      <Camera className="w-8 h-8 text-primary" />
                   </div>
                   {saving && (
                     <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-full">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                     </div>
                   )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarUpload} 
                  className="hidden" 
                  accept="image/*" 
                />
                <div className="text-center mt-4">
                   <h3 className="font-black italic text-lg uppercase">{profile?.display_name || 'VC Citizen'}</h3>
                   <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">Verified Resident</p>
                </div>
             </CardHeader>
             <CardContent className="pt-8 space-y-2">
                <Button variant="ghost" className="w-full justify-start font-bold italic h-12 rounded-xl text-primary hover:bg-primary/10">
                  <User className="w-4 h-4 mr-3" />
                  IDENTITY
                </Button>
                <Button variant="ghost" className="w-full justify-start font-bold italic h-12 rounded-xl text-muted-foreground hover:bg-white/5">
                  <Shield className="w-4 h-4 mr-3" />
                  SECURITY
                </Button>
             </CardContent>
          </Card>
        </aside>

        <main className="md:col-span-2 space-y-10">
          <section className="space-y-6">
             <div className="flex items-center gap-4 mb-2">
                <Radio className="w-4 h-4 text-primary" />
                <h2 className="text-xl font-black italic tracking-tight uppercase">IDENTITY PROTOCOL</h2>
             </div>
             
             <Card className="bg-black/40 border-white/5 backdrop-blur-xl">
                <CardContent className="pt-8 pb-10">
                   <form onSubmit={handleSaveProfile} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-black text-muted-foreground ml-1">Username (Network ID)</Label>
                          <Input 
                            value={username}
                            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                            placeholder="e.g. tommy_v"
                            className="bg-black/60 border-white/10 h-12 rounded-xl focus:border-primary/50 transition-all font-bold italic"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-black text-muted-foreground ml-1">Public Display Name</Label>
                          <Input 
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="e.g. Tommy V"
                            className="bg-black/60 border-white/10 h-12 rounded-xl focus:border-primary/50 transition-all font-bold italic"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                         <Label className="text-[10px] uppercase font-black text-muted-foreground ml-1">Leonida Dossier (Bio)</Label>
                         <Textarea 
                           value={bio}
                           onChange={(e) => setBio(e.target.value)}
                           placeholder="Tell the vault who you are..."
                           className="bg-black/60 border-white/10 rounded-xl min-h-[120px] focus:border-primary/50 transition-all italic font-medium"
                           maxLength={280}
                         />
                      </div>

                      <Button type="submit" disabled={saving} className="w-full md:w-auto px-10 h-12 bg-primary text-white font-black italic tracking-widest rounded-xl hover:shadow-[0_0_15px_rgba(255,0,255,0.3)] transition-all">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'SAVE CHANGES'}
                      </Button>
                   </form>
                </CardContent>
             </Card>
          </section>

          <section className="space-y-6">
             <div className="flex items-center gap-4 mb-2">
                <Lock className="w-4 h-4 text-secondary" />
                <h2 className="text-xl font-black italic tracking-tight uppercase">SECURITY PROTOCOL</h2>
             </div>
             
             <Card className="bg-black/40 border-white/5 backdrop-blur-xl">
                <CardContent className="pt-8 pb-10">
                   <form onSubmit={handleChangePassword} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-black text-muted-foreground ml-1">New Access Key</Label>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="••••••••"
                              className="bg-black/60 border-white/10 h-12 rounded-xl focus:border-secondary/50 transition-all"
                            />
                            <button 
                              type="button" 
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-black text-muted-foreground ml-1">Confirm Access Key</Label>
                          <Input 
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="bg-black/60 border-white/10 h-12 rounded-xl focus:border-secondary/50 transition-all"
                          />
                        </div>
                      </div>

                      <Button type="submit" disabled={passwordSaving} className="w-full md:w-auto px-10 h-12 bg-secondary text-black font-black italic tracking-widest rounded-xl hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all">
                        {passwordSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'UPDATE PASSWORD'}
                      </Button>
                   </form>
                </CardContent>
             </Card>
          </section>
        </main>
        </div>
      </div>
    </div>
  )
}

function Radio({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={cn("animate-pulse", className)}
    >
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.4" />
      <circle cx="12" cy="12" r="2" />
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.4" />
      <path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1" />
    </svg>
  )
}
