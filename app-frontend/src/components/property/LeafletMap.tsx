// app-frontend/src/components/property/LeafletMap.tsx
// Thay thế tạm thời cho Google Maps
import React, { useEffect, useRef } from 'react'
import { Box, Paper, Typography, Button } from '@mui/material'
import { LocationOn as LocationIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material'

interface LeafletMapProps {
  latitude: number
  longitude: number
  title: string
  address?: string
  height?: number
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  latitude,
  longitude,
  title,
  address,
  height = 400
}) => {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load Leaflet dynamically
    const loadLeaflet = async () => {
      if (!(window as any).L) {
        // Load CSS
        const cssLink = document.createElement('link')
        cssLink.rel = 'stylesheet'
        cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(cssLink)

        // Load JS
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        await new Promise((resolve) => {
          script.onload = resolve
          document.head.appendChild(script)
        })
      }

      if (mapRef.current && (window as any).L) {
        const L = (window as any).L

        // Create map
        const map = L.map(mapRef.current).setView([latitude, longitude], 16)

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map)

        // Custom marker icon
        const customIcon = L.divIcon({
          html: `
            <div style="
              background: #1976d2;
              width: 24px;
              height: 24px;
              border-radius: 50% 50% 50% 0;
              border: 3px solid white;
              transform: rotate(-45deg);
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ">
              <div style="
                color: white;
                font-size: 12px;
                line-height: 18px;
                text-align: center;
                transform: rotate(45deg);
              ">📍</div>
            </div>
          `,
          className: 'custom-div-icon',
          iconSize: [24, 24],
          iconAnchor: [12, 24]
        })

        // Add marker
        const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map)

        // Add popup
        marker.bindPopup(`
          <div style="font-family: Roboto, sans-serif; min-width: 200px;">
            <strong style="color: #1976d2; font-size: 16px; display: block; margin-bottom: 8px;">
              ${title}
            </strong>
            ${address ? `<div style="color: #666; font-size: 14px; margin-bottom: 8px;">${address}</div>` : ''}
            <div style="color: #999; font-size: 12px;">
              Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}
            </div>
          </div>
        `).openPopup()
      }
    }

    loadLeaflet()
  }, [latitude, longitude, title, address])

  const handleOpenGoogleMaps = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, '_blank')
  }

  return (
    <Paper sx={{ overflow: 'hidden', borderRadius: 1 }}>
      {/* Map Container */}
      <Box
        ref={mapRef}
        sx={{
          height: height - 60,
          width: '100%',
          '& .leaflet-control-attribution': {
            fontSize: '10px',
            background: 'rgba(255,255,255,0.8)'
          }
        }}
      />
      
      {/* Action Bar */}
      <Box sx={{ 
        p: 2, 
        bgcolor: 'grey.50', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationIcon color="primary" sx={{ fontSize: 20 }} />
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
        
        <Button
          size="small"
          variant="outlined"
          startIcon={<OpenInNewIcon />}
          onClick={handleOpenGoogleMaps}
        >
          Google Maps
        </Button>
      </Box>
    </Paper>
  )
}

export default LeafletMap