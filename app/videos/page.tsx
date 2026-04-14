'use client'

import { useState } from 'react'
import { Video, Play, Info, X, Maximize2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const FEATURED_TRAILERS = [
  { id: 'trailer-1', title: 'TRAILER 1', src: '/clips/Trailer_1/GTAVI_Trailer_1.mp4' },
  { id: 'trailer-2', title: 'TRAILER 2', src: '/clips/Trailer_2/GTAVI_Trailer_2.mp4' },
]

const CHARACTER_CLIPS = [
  { name: 'BOOBIE IKE', src: '/clips/Boobie_Ike_Video_Clip.mp4' },
  { name: 'BRIAN HEDER', src: '/clips/Brian_Heder_Video_Clip.mp4' },
  { name: 'CAL HAMPTON', src: '/clips/Cal_Hampton_Video_Clip.mp4' },
  { name: 'DREQUAN PRIEST', src: '/clips/DreQuan_Priest_Video_Clip.mp4' },
  { name: 'JASON DUVAL', src: '/clips/Jason_Duval_Video_Clip.mp4' },
  { name: 'LUCIA CAMINOS', src: '/clips/Lucia_Caminos_Video_Clip.mp4' },
  { name: 'RAUL BAUTISTA', src: '/clips/Raul_Bautista_Video_Clip.mp4' },
  { name: 'REAL DIMEZ', src: '/clips/Real_Dimez_Video_Clip.mp4' },
]

export default function VideosPage() {
  const [selectedVideo, setSelectedVideo] = useState<{ src: string, title?: string } | null>(null)

  return (
    <div className="p-8 md:p-12 min-h-screen bg-black overflow-y-auto max-w-7xl mx-auto space-y-16 pb-24">
      <header>
        <div className="flex items-center gap-4 mb-2">
          <Video className="w-6 h-6 text-secondary" />
          <h2 className="text-secondary font-bold uppercase tracking-[0.3em] text-xs">Media Archive</h2>
        </div>
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">LEONIDA ON FILM</h1>
        <p className="text-muted-foreground mt-4 max-w-2xl font-medium tracking-wide">
          Official trailers and character dossiers. Experience the sights and sounds of the next generation.
        </p>
      </header>

      {/* Featured Trailers Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <Play className="w-5 h-5 text-primary" />
          <h3 className="text-2xl font-bold italic uppercase tracking-tight">FEATURED TRAILERS</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-black">
          {FEATURED_TRAILERS.map((trailer) => (
            <div key={trailer.id} className="space-y-4">
               <div 
                 className="group relative aspect-video rounded-3xl overflow-hidden border border-primary/20 bg-muted/20 shadow-2xl cursor-pointer"
                 onClick={() => setSelectedVideo({ src: trailer.src, title: trailer.title })}
               >
                 <video 
                   playsInline
                   muted
                   className="w-full h-full object-cover"
                   preload="metadata"
                 >
                    <source src={trailer.src} type="video/mp4" />
                 </video>
                 <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <div className="bg-primary/20 backdrop-blur-md p-4 rounded-full border border-primary/40 group-hover:scale-110 transition-transform">
                      <Play className="w-10 h-10 text-white fill-white" />
                    </div>
                 </div>
                 <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10 text-[10px] uppercase font-bold tracking-widest text-white/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                    <Maximize2 className="w-3 h-3" />
                    Expand CINEMATIC
                 </div>
               </div>
               <div className="flex items-center justify-between px-2">
                 <h4 className="text-lg italic tracking-widest">{trailer.title}</h4>
                 <span className="text-[10px] text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 tracking-tighter uppercase font-black">4K CINEMATIC</span>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Character Dossiers / Clips Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-accent" />
          <h3 className="text-2xl font-bold italic uppercase tracking-tight">CHARACTER DOSSIERS</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CHARACTER_CLIPS.map((clip) => (
            <Card 
              key={clip.name} 
              className="bg-muted/10 border-white/5 hover:border-primary/30 transition-all group overflow-hidden rounded-2xl cursor-pointer"
              onClick={() => setSelectedVideo({ src: clip.src, title: clip.name })}
            >
               <CardContent className="p-0">
                  <div className="aspect-video bg-black relative">
                    <video 
                      playsInline
                      className="w-full h-full object-cover"
                      preload="metadata"
                      muted
                      onMouseOver={(e) => e.currentTarget.play()}
                      onMouseOut={(e) => {
                        e.currentTarget.pause()
                        e.currentTarget.currentTime = 0
                      }}
                    >
                      <source src={clip.src} type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all flex items-center justify-center pointer-events-none">
                      <Play className="w-8 h-8 text-white/50 group-hover:opacity-0 transition-opacity" />
                    </div>
                  </div>
                  <div className="p-4 bg-black/40 border-t border-white/5">
                    <h5 className="font-bold italic text-xs tracking-[0.2em] group-hover:text-primary transition-colors">{clip.name}</h5>
                  </div>
               </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Lightbox Video Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300"
          onClick={() => setSelectedVideo(null)}
        >
          <button 
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-2 rounded-full bg-white/5 z-50"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedVideo(null)
            }}
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="relative w-full h-full max-w-6xl flex flex-col items-center justify-center">
            {selectedVideo.title && (
              <h3 className="absolute -top-12 left-0 text-white font-black italic tracking-widest uppercase text-xl md:text-2xl drop-shadow-lg">
                <span className="text-primary mr-2">//</span> {selectedVideo.title}
              </h3>
            )}
            <div 
              className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(255,0,255,0.15)] ring-1 ring-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <video 
                src={selectedVideo.src} 
                className="w-full h-full"
                controls
                autoPlay
                playsInline
              >
                <source src={selectedVideo.src} type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
