// app-frontend/src/components/admin/LeafletMapPicker.tsx
// Thay thế GoogleMapPicker với tính năng click-to-pick location
import React, { useEffect, useRef, useState } from 'react'
import { Box, Typography, Alert, Button, Paper, Stack } from '@mui/material'
import { LocationOn as LocationIcon, MyLocation as MyLocationIcon, Refresh as RefreshIcon } from '@mui/icons-material'

interface LeafletMapPickerProps {
  latitude?: number
  longitude?: number
  onLocationChange: (lat: number, lng: number) => void
  height?: number
}

const LeafletMapPicker: React.FC<LeafletMapPickerProps> = ({
  latitude,
  longitude,
  onLocationChange,
  height = 400
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Default coordinates (Hanoi)
  const defaultLat = 21.0285
  const defaultLng = 105.8542

  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        setLoading(true)
        setError(null)

        // Load Leaflet CSS if not already loaded
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const cssLink = document.createElement('link')
          cssLink.rel = 'stylesheet'
          cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          document.head.appendChild(cssLink)
        }

        // Load Leaflet JS if not already loaded
        if (!(window as any).L) {
          const script = document.createElement('script')
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
          await new Promise((resolve, reject) => {
            script.onload = resolve
            script.onerror = reject
            document.head.appendChild(script)
          })
        }

        initializeMap()
      } catch (err) {
        console.error('Failed to load Leaflet:', err)
        setError('Failed to load map')
      } finally {
        setLoading(false)
      }
    }

    loadLeaflet()
  }, [])

  // Update marker when coordinates change
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current && typeof latitude === 'number' && typeof longitude === 'number') {
      const L = (window as any).L
      markerRef.current.setLatLng([latitude, longitude])
      mapInstanceRef.current.setView([latitude, longitude], 16)
    }
  }, [latitude, longitude])

  const initializeMap = () => {
    if (!mapRef.current || !(window as any).L) return

    const L = (window as any).L
    const initialLat = typeof latitude === 'number' ? latitude : defaultLat
    const initialLng = typeof longitude === 'number' ? longitude : defaultLng

    // Create map
    const map = L.map(mapRef.current).setView([initialLat, initialLng], 16)

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map)

    // Custom draggable marker icon (red for admin)
    const customIcon = L.divIcon({
      html: `
        <div style="
          background: #E53E3E;
          width: 28px;
          height: 28px;
          border-radius: 50% 50% 50% 0;
          border: 3px solid white;
          transform: rotate(-45deg);
          box-shadow: 0 3px 10px rgba(0,0,0,0.4);
          cursor: move;
        ">
          <div style="
            color: white;
            font-size: 14px;
            line-height: 22px;
            text-align: center;
            transform: rotate(45deg);
          ">📍</div>
        </div>
      `,
      className: 'custom-admin-marker',
      iconSize: [28, 28],
      iconAnchor: [14, 28]
    })

    // Add draggable marker
    const marker = L.marker([initialLat, initialLng], { 
      icon: customIcon,
      draggable: true
    }).addTo(map)

    // Click on map to move marker
    map.on('click', (e: any) => {
      const { lat, lng } = e.latlng
      marker.setLatLng([lat, lng])
      onLocationChange(lat, lng)
    })

    // Drag marker to change location
    marker.on('dragend', (e: any) => {
      const { lat, lng } = e.target.getLatLng()
      onLocationChange(lat, lng)
    })

    // Store references
    mapInstanceRef.current = map
    markerRef.current = marker

    console.log('Leaflet map initialized for admin')
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        
        if (mapInstanceRef.current && markerRef.current) {
          markerRef.current.setLatLng([lat, lng])
          mapInstanceRef.current.setView([lat, lng], 16)
          onLocationChange(lat, lng)
        }
      },
      (err) => {
        console.error('Geolocation error:', err)
        setError('Unable to get your location')
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )
  }

  const resetLocation = () => {
    if (mapInstanceRef.current && markerRef.current) {
      markerRef.current.setLatLng([defaultLat, defaultLng])
      mapInstanceRef.current.setView([defaultLat, defaultLng], 12)
      onLocationChange(defaultLat, defaultLng)
    }
  }

  if (loading) {
    return (
      <Paper sx={{ p: 2, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">Loading map...</Typography>
      </Paper>
    )
  }

  if (error) {
    return (
      <Paper sx={{ p: 2, height }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="body2" color="text.secondary">
          You can still enter coordinates manually using the latitude/longitude fields above.
        </Typography>
      </Paper>
    )
  }

  return (
    <Paper sx={{ overflow: 'hidden', borderRadius: 1 }}>
      {/* Map Container */}
      <Box
        ref={mapRef}
        sx={{
          height: height - 70,
          width: '100%',
          '& .leaflet-control-attribution': {
            fontSize: '10px',
            background: 'rgba(255,255,255,0.8)'
          }
        }}
      />
      
      {/* Control Bar */}
      <Box sx={{ 
        p: 2, 
        bgcolor: 'grey.50', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <Box>
          <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
            Click map or drag marker to set location
          </Typography>
          {typeof latitude === 'number' && typeof longitude === 'number' && (
            <Typography variant="caption" color="text.secondary">
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </Typography>
          )}
        </Box>
        
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<MyLocationIcon />}
            onClick={getCurrentLocation}
          >
            My Location
          </Button>
          
          <Button
            size="small"
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={resetLocation}
          >
            Reset
          </Button>
        </Stack>
      </Box>
    </Paper>
  )
}

export default LeafletMapPicker