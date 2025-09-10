// app-frontend/src/components/admin/LeafletMapPicker.tsx
import React, { useEffect, useRef, useState } from 'react'
import { Box, Typography, Alert, Button, Paper, Stack } from '@mui/material'
import { MyLocation as MyLocationIcon, Refresh as RefreshIcon } from '@mui/icons-material'

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

        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const cssLink = document.createElement('link')
          cssLink.rel = 'stylesheet'
          cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          document.head.appendChild(cssLink)
        }

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
        setError('Không tải được bản đồ, vui lòng thử lại.')
      } finally {
        setLoading(false)
      }
    }

    loadLeaflet()
  }, [])

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

    const map = L.map(mapRef.current).setView([initialLat, initialLng], 16)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map)

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

    const marker = L.marker([initialLat, initialLng], { 
      icon: customIcon,
      draggable: true
    }).addTo(map)

    map.on('click', (e: any) => {
      const { lat, lng } = e.latlng
      marker.setLatLng([lat, lng])
      onLocationChange(lat, lng)
    })

    marker.on('dragend', (e: any) => {
      const { lat, lng } = e.target.getLatLng()
      onLocationChange(lat, lng)
    })

    mapInstanceRef.current = map
    markerRef.current = marker
  }

  const resetToDefault = () => {
    if (mapInstanceRef.current && markerRef.current) {
      markerRef.current.setLatLng([defaultLat, defaultLng])
      mapInstanceRef.current.setView([defaultLat, defaultLng], 12)
      onLocationChange(defaultLat, defaultLng)
    }
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Trình duyệt không hỗ trợ định vị GPS.')
      resetToDefault()
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
          setError(null)
        }
      },
      (err) => {
        console.error('Geolocation error:', err)
        if (err.code === 1) {
          setError('Bạn đã từ chối quyền truy cập vị trí. Hãy cho phép trong cài đặt trình duyệt.')
        } else if (err.code === 2) {
          setError('Không thể xác định vị trí. Vui lòng thử lại.')
        } else if (err.code === 3) {
          setError('Lấy vị trí quá lâu, vui lòng thử lại.')
        } else {
          setError('Không thể lấy vị trí.')
        }
        resetToDefault()
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )
  }

  if (loading) {
    return (
      <Paper sx={{ p: 2, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">Đang tải bản đồ...</Typography>
      </Paper>
    )
  }

  return (
    <Paper sx={{ overflow: 'hidden', borderRadius: 1 }}>
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

      <Box sx={{ 
        p: 2, 
        bgcolor: 'grey.50', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderTop: '1px solid',
        borderColor: 'divider',
        flexWrap: 'wrap'
      }}>
        <Box>
          <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
            Click bản đồ hoặc kéo marker để chọn vị trí
          </Typography>
          {typeof latitude === 'number' && typeof longitude === 'number' && (
            <Typography variant="caption" color="text.secondary">
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </Typography>
          )}
          {error && (
            <Alert severity="warning" sx={{ mt: 1, p: 0.5 }}>
              {error}
            </Alert>
          )}
        </Box>

        <Stack direction="row" spacing={1} sx={{ mt: { xs: 1, sm: 0 } }}>
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
            onClick={resetToDefault}
          >
            Reset
          </Button>
        </Stack>
      </Box>
    </Paper>
  )
}

export default LeafletMapPicker
