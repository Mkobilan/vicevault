'use client'

import { useState } from 'react'
import { X, Maximize2, Camera } from 'lucide-react'
import { cn } from '@/lib/utils'

const ALL_IMAGES = [
  // meme_gen
  "/meme_gen/Ambrosia_01.webp",
  "/meme_gen/Ambrosia_02.ec311051.jpg",
  "/meme_gen/Ambrosia_03.webp",
  "/meme_gen/Ambrosia_04.webp",
  "/meme_gen/Ambrosia_05.webp",
  "/meme_gen/Boobie_Ike_01.webp",
  "/meme_gen/Boobie_Ike_02.webp",
  "/meme_gen/Boobie_Ike_03.webp",
  "/meme_gen/Boobie_Ike_04.webp",
  "/meme_gen/Brian.PNG",
  "/meme_gen/Brian_Heder_01.webp",
  "/meme_gen/Brian_Heder_02.webp",
  "/meme_gen/Brian_Heder_03.webp",
  "/meme_gen/Brian_Heder_04.webp",
  "/meme_gen/Cal_Hampton.PNG",
  "/meme_gen/Cal_Hampton_01_mini_golf.webp",
  "/meme_gen/Cal_Hampton_02_drinking_in_bar.webp",
  "/meme_gen/Cal_Hampton_03_In_pool.webp",
  "/meme_gen/Cal_Hampton_04_and_Jason.webp",
  "/meme_gen/Cal_Looking_at_plane.PNG",
  "/meme_gen/DreQuan.PNG",
  "/meme_gen/DreQuan_Priest_01.webp",
  "/meme_gen/DreQuan_Priest_02.webp",
  "/meme_gen/DreQuan_Priest_03.webp",
  "/meme_gen/DreQuan_Priest_04.webp",
  "/meme_gen/Grassrivers_01.webp",
  "/meme_gen/Grassrivers_02.webp",
  "/meme_gen/Grassrivers_03.webp",
  "/meme_gen/Grassrivers_04.webp",
  "/meme_gen/Jason_Duval_01_on_motorcycle.webp",
  "/meme_gen/Jason_Duval_02.webp",
  "/meme_gen/Jason_Duval_03_fishing.webp",
  "/meme_gen/Jason_Duval_04_cellphone.webp",
  "/meme_gen/Jason_Duval_05_Rifle.webp",
  "/meme_gen/Jason_Duval_06_drinking_bar.webp",
  "/meme_gen/Jason_Robbing.PNG",
  "/meme_gen/Jason_and_Lucia_chilling.PNG",
  "/meme_gen/Leonida_Keys_02.webp",
  "/meme_gen/Leonida_Keys_03.webp",
  "/meme_gen/Leonida_Keys_04.webp",
  "/meme_gen/Leonida_Keys_05.webp",
  "/meme_gen/Lucia_Caminos_01_Boxing.webp",
  "/meme_gen/Lucia_Caminos_02_Swimming_pool.webp",
  "/meme_gen/Lucia_Caminos_03_on_motorcycle.webp",
  "/meme_gen/Lucia_Caminos_04_gun_in_hand.webp",
  "/meme_gen/Lucia_Caminos_05_prison_orange.webp",
  "/meme_gen/Lucia_Caminos_06_night_life.webp",
  "/meme_gen/Lucia_head_out_window.PNG",
  "/meme_gen/Lucia_Head_out_window_2.PNG",
  "/meme_gen/lucia_hugging_jason.PNG",
  "/meme_gen/Mount_Kalaga_National_Park_01.webp",
  "/meme_gen/Mount_Kalaga_National_Park_02.webp",
  "/meme_gen/Mount_Kalaga_National_Park_03.webp",
  "/meme_gen/Mount_Kalaga_National_Park_04.webp",
  "/meme_gen/Mount_Kalaga_National_Park_05.webp",
  "/meme_gen/Mount_Kalaga_National_Park_06.webp",
  "/meme_gen/Port_Gellhorn_01.webp",
  "/meme_gen/Port_Gellhorn_02.webp",
  "/meme_gen/Port_Gellhorn_03.webp",
  "/meme_gen/Port_Gellhorn_04.webp",
  "/meme_gen/Port_Gellhorn_05.webp",
  "/meme_gen/raul.PNG",
  "/meme_gen/Raul_Bautista_01.webp",
  "/meme_gen/Raul_Bautista_02.webp",
  "/meme_gen/Raul_Bautista_03.webp",
  "/meme_gen/Raul_Bautista_04.webp",
  "/meme_gen/Real_Dimez_01.webp",
  "/meme_gen/real_dimez_02.webp",
  "/meme_gen/Real_Dimez_03.webp",
  "/meme_gen/Real_Dimez_04.webp",
  "/meme_gen/Roxy.PNG",
  "/meme_gen/vice_city_01.webp",
  "/meme_gen/Vice_City_02.webp",
  "/meme_gen/Vice_City_03.webp",
  "/meme_gen/Vice_City_04.webp",
  "/meme_gen/Vice_City_05.webp",
  "/meme_gen/vice_city_06.webp",
  "/meme_gen/Vice_City_07.webp",
  "/meme_gen/vice_city_08.webp",
  "/meme_gen/Vice_City_09.webp",
  "/meme_gen/jason_hugging_lucia.PNG",
  "/meme_gen/jason_lucia_trunk.PNG",
  "/meme_gen/leonida_keys_01.webp",
  
  
]

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <div className="p-8 md:p-12 min-h-screen bg-black">
      <header className="mb-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-2">
          <Camera className="w-6 h-6 text-primary" />
          <h2 className="text-primary font-bold uppercase tracking-[0.3em] text-xs">Visual Archive</h2>
        </div>
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">SEE LEONIDA</h1>
        <p className="text-muted-foreground mt-4 max-w-2xl font-medium tracking-wide">
          Explore the stunning landscapes, characters, and postcards of the next generation of Leonida. 
          A curated collection of official artworks and community captures.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {ALL_IMAGES.map((src, i) => (
          <div 
            key={i} 
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 cursor-pointer bg-muted/20"
            onClick={() => setSelectedImage(src)}
          >
            <img 
              src={src} 
              alt={`Leonida ${i}`} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
              <div className="flex items-center gap-2 text-white font-black italic uppercase tracking-widest text-xs">
                <Maximize2 className="w-4 h-4" />
                EXPAND VIEW
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-2 rounded-full bg-white/5"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedImage(null)
            }}
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              src={selectedImage} 
              alt="Leonida Full View" 
              className="max-w-full max-h-full object-contain rounded-xl shadow-[0_0_50px_rgba(255,0,255,0.2)] animate-in zoom-in-95 duration-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  )
}
