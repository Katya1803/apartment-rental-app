import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Box, Typography, Button, Paper, Stack } from '@mui/material'
import { MyLocation as MyLocationIcon, Refresh as RefreshIcon } from '@mui/icons-material'

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface LeafletMapPickerLocalProps {
  latitude?: number
  longitude?: number
  onLocationChange: (lat: number, lng: number) => void
  height?: number
}

const LeafletMapPickerLocal: React.FC<LeafletMapPickerLocalProps> = ({
  latitude,
  longitude,
  onLocationChange,
  height = 400
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  const defaultLat = 21.0285
  const defaultLng = 105.8542

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const initialLat = latitude || defaultLat
    const initialLng = longitude || defaultLng

    // Initialize map
    const map = L.map(mapRef.current).setView([initialLat, initialLng], 16)

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map)

    // Add marker
    const marker = L.marker([initialLat, initialLng], { draggable: true }).addTo(map)

    // Event handlers
    map.on('click', (e) => {
      const { lat, lng } = e.latlng
      marker.setLatLng([lat, lng])
      onLocationChange(lat, lng)
    })

    marker.on('dragend', (e) => {
      const { lat, lng } = e.target.getLatLng()
      onLocationChange(lat, lng)
    })

    mapInstanceRef.current = map
    markerRef.current = marker

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markerRef.current = null
      }
    }
  }, [])

  // Update marker when props change
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current && latitude && longitude) {
      markerRef.current.setLatLng([latitude, longitude])
      mapInstanceRef.current.setView([latitude, longitude], 16)
    }
  }, [latitude, longitude])

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt không hỗ trợ định vị.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        onLocationChange(lat, lng)
      },
      (error) => {
        console.error('Geolocation error:', error)
        alert('Không thể lấy vị trí. Vui lòng thử lại.')
      }
    )
  }

  const resetToHanoi = () => {
    onLocationChange(defaultLat, defaultLng)
  }

  return (
    <Paper sx={{ overflow: 'hidden', borderRadius: 1 }}>
      <Box
        ref={mapRef}
        sx={{
          height: height - 60,
          width: '100%'
        }}
      />
      
      <Box sx={{ 
        p: 2, 
        bgcolor: 'grey.50', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center'
      }}>
        <Typography variant="body2" color="primary">
          Click hoặc kéo marker để chọn vị trí
        </Typography>

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
            onClick={resetToHanoi}
          >
            Reset
          </Button>
        </Stack>
      </Box>
    </Paper>
  )
}

export default LeafletMapPickerLocal