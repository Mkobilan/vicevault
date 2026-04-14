'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Mail, 
  Lock, 
  UserPlus, 
  LogIn, 
  Eye, 
  EyeOff,
  ShieldCheck,
  Radio
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { ProfileView } from './ProfileView'

export default function ProfilePage() {
  const { user, setUser } = useStore()
  const [localLoading, setLocalLoading] = useState(true)
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [authMessage, setAuthMessage] = useState<string | null>(null)
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    setUser(currentUser)
    setLocalLoading(false)
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalLoading(true)
    setAuthMessage(null)

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        alert("Passwords do not match!")
        setLocalLoading(false)
        return
      }
      if (password.length < 6) {
        alert("Password must be at least 6 characters.")
        setLocalLoading(false)
        return
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        alert(error.message)
      } else {
        setAuthMessage('CONFIRMATION SENT! Please check your email to verify your account.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) alert(error.message)
      else checkUser()
    }
    setLocalLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.replace('/')
  }

  if (localLoading && !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <Radio className="w-12 h-12 text-primary animate-pulse mb-4" />
        <div className="text-primary font-black italic tracking-widest uppercase">Syncing with Central Intelligence...</div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="p-4 md:p-12 max-w-6xl mx-auto min-h-screen">
        <ProfileView user={user} onLogout={handleLogout} />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-6 bg-[url('https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      <Card className="w-full max-w-md bg-black/40 border-white/10 shadow-2xl backdrop-blur-xl relative z-10 overflow-hidden border-t-0">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
        
        <CardHeader className="text-center pb-2 pt-8">
          <div className="flex justify-center mb-4">
             <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                <ShieldCheck className="w-8 h-8 text-primary" />
             </div>
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter text-white mb-2 leading-none uppercase">
            {mode === 'login' ? 'CITIZEN LOGIN' : 'RECRUIT ACCESS'}
          </h1>
          <CardDescription className="text-muted-foreground uppercase tracking-[0.2em] text-[10px] font-black italic">
            {mode === 'login' ? 'Identify yourself to the Vault' : 'Establish your identity in Leonida'}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 pb-10">
          {authMessage ? (
            <div className="p-6 bg-primary/10 border border-primary/20 rounded-2xl text-center space-y-4 animate-in zoom-in-95">
              <Mail className="w-12 h-12 text-primary mx-auto animate-bounce" />
              <p className="text-sm font-bold text-white leading-relaxed italic">{authMessage}</p>
              <Button onClick={() => setAuthMessage(null)} variant="outline" className="w-full border-white/10 rounded-xl font-bold italic">BACK TO LOGIN</Button>
            </div>
          ) : (
            <form onSubmit={handleAuth} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Email Terminal</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    type="email" 
                    placeholder="name@vicecity.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-black/60 border-white/5 h-14 pl-12 rounded-xl focus:border-primary/50 transition-all font-medium italic"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Access Protocol</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black/60 border-white/5 h-14 pl-12 pr-12 rounded-xl focus:border-primary/50 transition-all font-medium"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {mode === 'signup' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Verify Protocol</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-black/60 border-white/5 h-14 pl-12 pr-12 rounded-xl focus:border-primary/50 transition-all font-medium"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <Button type="submit" disabled={localLoading} className="w-full h-14 bg-primary text-white font-black italic tracking-widest rounded-xl text-lg hover:shadow-[0_0_20px_rgba(255,0,255,0.3)] transition-all">
                {localLoading ? 'TRANSMITTING...' : mode === 'login' ? 'GRANT ACCESS' : 'ENLIST CITIZEN'}
              </Button>

              <div className="text-center pt-2">
                <button 
                  type="button" 
                  onClick={() => {
                    setMode(mode === 'login' ? 'signup' : 'login')
                    setAuthMessage(null)
                  }}
                  className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto decoration-primary/20 hover:decoration-primary underline underline-offset-4"
                >
                  {mode === 'login' ? (
                    <>
                      <UserPlus className="w-3 h-3" />
                      NEW RESIDENT? REGISTER SECRETS
                    </>
                  ) : (
                    <>
                      <LogIn className="w-3 h-3" />
                      ESTABLISHED CITIZEN? IDENTIFY
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
