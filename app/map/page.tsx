'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Dynamically import MapContainer to avoid SSR issues
const ViceVaultMap = dynamic(() => import('@/components/map/MapContainer'), { 
  ssr: false,
  loading: () => <MapLoadingState />
})

export default function MapPage() {
  const [pins, setPins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchPins()

    // Realtime subscription
    const channel = supabase
      .channel('public:user_pins')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_pins' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setPins((prev) => [...prev, payload.new])
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchPins = async () => {
    const { data, error } = await supabase
      .from('user_pins')
      .select('*')
    
    if (data) setPins(data)
    setLoading(false)
  }

  const handlePinAdd = (lat: number, lng: number) => {
    console.log('Pin clicked at:', lat, lng)
    // Here I would open a modal to add a pin
    // For MVP, if auth allowed, I would save it
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Map Controls Overlay */}
      <div className="absolute top-6 left-6 z-[1000] flex flex-col gap-4 w-72">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary" />
          <Input 
            placeholder="Search landmarks..." 
            className="pl-10 bg-black/60 backdrop-blur-md border-primary/20 focus:border-primary/60 rounded-2xl h-12 text-sm shadow-2xl"
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1 rounded-xl h-10 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20">
            <Filter className="w-4 h-4 mr-2" />
            FILTER
          </Button>
          <Button className="flex-1 rounded-xl h-10 bg-secondary text-black font-bold hover:bg-secondary/80">
            <Plus className="w-4 h-4 mr-2" />
            ADD PIN
          </Button>
        </div>
      </div>

      <ViceVaultMap pins={pins} onPinAdd={handlePinAdd} />
    </div>
  )
}

function MapLoadingState() {
  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="w-[80vw] h-[80vh] rounded-3xl bg-muted/20 border border-primary/10 animate-pulse" />
        <p className="text-primary font-bold tracking-[0.4em] text-xs animate-pulse">UPDATING VAULT GPS...</p>
      </div>
    </div>
  )
}
