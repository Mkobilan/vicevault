'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Fix for default marker icons in Leaflet
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})
L.Marker.prototype.options.icon = DefaultIcon

interface MapProps {
  pins: any[]
  onPinAdd?: (lat: number, lng: number) => void
}

function LocationMarker({ onPinAdd }: { onPinAdd?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (onPinAdd) {
        onPinAdd(e.latlng.lat, e.latlng.lng)
      }
    },
  })
  return null
}

export default function ViceVaultMap({ pins, onPinAdd }: MapProps) {
  // Center of "Vice City" (approximate for Miami/Florida)
  const center: [number, number] = [25.7617, -80.1918]

  return (
    <div className="w-full h-[calc(100vh-4rem)] md:h-screen bg-black">
      <MapContainer 
        center={center} 
        zoom={13} 
        className="w-full h-full grayscale-[0.8] invert-[0.9] hue-rotate-[180deg] brightness-[0.8] contrast-[1.2]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <LocationMarker onPinAdd={onPinAdd} />

        <MarkerClusterGroup>
          {pins.map((pin) => (
            <Marker key={pin.id} position={[pin.lat, pin.lng]}>
              <Popup className="bg-black border-primary/20 text-foreground">
                <div className="p-2 min-w-[200px]">
                  {pin.image_url && (
                    <img src={pin.image_url} alt={pin.title} className="w-full h-32 object-cover rounded-md mb-2" />
                  )}
                  <h3 className="font-bold text-primary mb-1 uppercase tracking-wider">{pin.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{pin.description}</p>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-[8px] border-primary/40 text-primary">COMMUNITY PIN</Badge>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  )
}
