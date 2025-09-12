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
  const [retry, setRetry] = useState(0)

  // Default coordinates (Hanoi)
  const defaultLat = 21.0285
  const defaultLng = 105.8542

  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        setLoading(true)
        setError(null)

        // Check if Leaflet CSS is already loaded
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const cssLink = document.createElement('link')
          cssLink.rel = 'stylesheet'
          cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          // Remove integrity check that might be causing issues
          document.head.appendChild(cssLink)
          
          // Wait for CSS to load
          await new Promise((resolve) => {
            cssLink.onload = resolve
            cssLink.onerror = resolve // Don't fail on CSS error, continue
            setTimeout(resolve, 2000) // Longer fallback timeout
          })
        }

        // Check if Leaflet JS is already loaded
        if (!(window as any).L) {
          const script = document.createElement('script')
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
          // Remove integrity check that might be causing issues
          
          await new Promise((resolve, reject) => {
            script.onload = resolve
            script.onerror = () => {
              // Try fallback CDN
              const fallbackScript = document.createElement('script')
              fallbackScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'
              fallbackScript.onload = resolve
              fallbackScript.onerror = reject
              document.head.appendChild(fallbackScript)
            }
            document.head.appendChild(script)
          })
        }

        // Small delay to ensure everything is ready
        await new Promise(resolve => setTimeout(resolve, 100))

        initializeMap()
      } catch (err) {
        console.error('Failed to load Leaflet:', err)
        setError('Không thể tải bản đồ. Vui lòng kiểm tra kết nối mạng và thử lại.')
      } finally {
        setLoading(false)
      }
    }

    loadLeaflet()
  }, [retry])

  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current && typeof latitude === 'number' && typeof longitude === 'number') {
      const L = (window as any).L
      if (L) {
        markerRef.current.setLatLng([latitude, longitude])
        mapInstanceRef.current.setView([latitude, longitude], 16)
      }
    }
  }, [latitude, longitude])

  const initializeMap = () => {
    if (!mapRef.current || !(window as any).L) {
      console.error('Map container or Leaflet not available')
      return
    }

    try {
      const L = (window as any).L
      const initialLat = typeof latitude === 'number' ? latitude : defaultLat
      const initialLng = typeof longitude === 'number' ? longitude : defaultLng

      // Clear any existing map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
      }

      // Create map
      const map = L.map(mapRef.current, {
        center: [initialLat, initialLng],
        zoom: (typeof latitude === 'number' && typeof longitude === 'number') ? 16 : 12,
        zoomControl: true,
        attributionControl: true
      })

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map)

      // Create custom icon
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background: #E53E3E;
            width: 24px;
            height: 24px;
            border-radius: 50% 50% 50% 0;
            border: 3px solid white;
            transform: rotate(-45deg);
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ">
            <div style="
              width: 6px;
              height: 6px;
              background: white;
              border-radius: 50%;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            "></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24]
      })

      // Add marker
      const marker = L.marker([initialLat, initialLng], {
        icon: customIcon,
        draggable: true
      }).addTo(map)

      // Map click handler
      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng
        marker.setLatLng([lat, lng])
        onLocationChange(lat, lng)
      })

      // Marker drag handler
      marker.on('dragend', (e: any) => {
        const { lat, lng } = e.target.getLatLng()
        onLocationChange(lat, lng)
      })

      mapInstanceRef.current = map
      markerRef.current = marker

      console.log('Leaflet map initialized successfully')
    } catch (err) {
      console.error('Failed to initialize Leaflet map:', err)
      setError('Không thể khởi tạo bản đồ. Vui lòng thử lại.')
    }
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Trình duyệt không hỗ trợ định vị.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        
        if (mapInstanceRef.current && markerRef.current && (window as any).L) {
          markerRef.current.setLatLng([lat, lng])
          mapInstanceRef.current.setView([lat, lng], 16)
          onLocationChange(lat, lng)
          setError(null)
        }
      },
      (err) => {
        console.error('Geolocation error:', err)
        if (err.code === 1) {
          setError('Vui lòng cho phép truy cập vị trí trong cài đặt trình duyệt.')
        } else if (err.code === 2) {
          setError('Không thể xác định vị trí. Vui lòng thử lại.')
        } else if (err.code === 3) {
          setError('Lấy vị trí quá lâu, vui lòng thử lại.')
        } else {
          setError('Không thể lấy vị trí.')
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )
  }

  const resetToDefault = () => {
    if (mapInstanceRef.current && markerRef.current && (window as any).L) {
      markerRef.current.setLatLng([defaultLat, defaultLng])
      mapInstanceRef.current.setView([defaultLat, defaultLng], 12)
      onLocationChange(defaultLat, defaultLng)
      setError(null)
    }
  }

  const handleRetry = () => {
    setRetry(prev => prev + 1)
  }

  if (loading) {
    return (
      <Paper sx={{ 
        p: 3, 
        height, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: 'grey.50',
        border: '1px solid',
        borderColor: 'grey.200'
      }}>
        <Box textAlign="center">
          <Typography color="text.secondary" gutterBottom>
            Đang tải bản đồ...
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Vui lòng đợi trong giây lát
          </Typography>
        </Box>
      </Paper>
    )
  }

  if (error) {
    return (
      <Paper sx={{ 
        p: 3, 
        height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.50',
        border: '1px solid',
        borderColor: 'grey.200'
      }}>
        <Alert severity="warning" sx={{ mb: 2, maxWidth: 400 }}>
          {error}
        </Alert>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
          Bạn vẫn có thể nhập tọa độ thủ công ở các ô bên trên.
        </Typography>
        
        <Button variant="outlined" onClick={handleRetry} startIcon={<RefreshIcon />}>
          Thử lại
        </Button>
      </Paper>
    )
  }

  return (
    <Paper sx={{ overflow: 'hidden', borderRadius: 1, border: '1px solid', borderColor: 'grey.200' }}>
      <Box
        ref={mapRef}
        sx={{
          height: height - 70,
          width: '100%',
          '& .leaflet-control-attribution': {
            fontSize: '10px',
            background: 'rgba(255,255,255,0.8)'
          },
          '& .custom-marker': {
            background: 'none !important',
            border: 'none !important'
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