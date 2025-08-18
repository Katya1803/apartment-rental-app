import React, { useEffect, useRef, useState } from 'react'
import { Box, Typography, Alert, Button, Paper } from '@mui/material'
import { LocationOn as LocationIcon, MyLocation as MyLocationIcon } from '@mui/icons-material'

interface GoogleMapPickerProps {
  latitude?: number
  longitude?: number
  onLocationChange: (lat: number, lng: number) => void
  height?: number
}

// Global singletons to avoid duplicate loads
let isGoogleMapsLoaded = false
let isGoogleMapsLoading = false
let googleMapsPromise: Promise<void> | null = null
const SCRIPT_ID = 'google-maps-sdk'

const GoogleMapPicker: React.FC<GoogleMapPickerProps> = ({
  latitude,
  longitude,
  onLocationChange,
  height = 400
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markerInstanceRef = useRef<google.maps.Marker | null>(null)

  const [sdkReady, setSdkReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Default (Hanoi)
  const defaultLat = 21.0285
  const defaultLng = 105.8542

  const loadGoogleMapsAPI = async (): Promise<void> => {
    if (isGoogleMapsLoaded && (window as any).google?.maps) return
    if (isGoogleMapsLoading && googleMapsPromise) return googleMapsPromise

    // If a script element with our id already exists, wait until google.maps is available
    const existing = document.getElementById(SCRIPT_ID)
    if (existing) {
      await new Promise<void>((resolve) => {
        const check = () => ((window as any).google?.maps ? resolve() : setTimeout(check, 50))
        check()
      })
      isGoogleMapsLoaded = true
      return
    }

    isGoogleMapsLoading = true
    googleMapsPromise = new Promise<void>((resolve, reject) => {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      if (!apiKey) {
        isGoogleMapsLoading = false
        reject(new Error('Google Maps API key not found'))
        return
      }

      const script = document.createElement('script')
      script.id = SCRIPT_ID
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly`
      script.async = true
      script.defer = true
      script.onload = () => {
        const check = () => {
          if ((window as any).google?.maps) {
            isGoogleMapsLoaded = true
            isGoogleMapsLoading = false
            resolve()
          } else {
            setTimeout(check, 50)
          }
        }
        check()
      }
      script.onerror = () => {
        isGoogleMapsLoading = false
        reject(new Error('Failed to load Google Maps'))
      }
      document.head.appendChild(script)
    })

    return googleMapsPromise
  }

  const initializeMap = () => {
    if (!mapRef.current || !(window as any).google?.maps || mapInstanceRef.current) return

    try {
      const initialLat = typeof latitude === 'number' ? latitude : defaultLat
      const initialLng = typeof longitude === 'number' ? longitude : defaultLng

      const map = new google.maps.Map(mapRef.current, {
        center: { lat: initialLat, lng: initialLng },
        zoom: (typeof latitude === 'number' && typeof longitude === 'number') ? 16 : 12,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        gestureHandling: 'greedy'
      })

      const marker = new google.maps.Marker({
        position: { lat: initialLat, lng: initialLng },
        map,
        title: 'Property Location',
        draggable: true,
        icon: {
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 24 32">
              <path fill="#E53E3E" stroke="#FFF" stroke-width="2"
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="3" fill="#FFF"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 40),
          anchor: new google.maps.Point(16, 40)
        }
      })

      map.addListener('click', (e: google.maps.MapMouseEvent) => {
        const lat = e.latLng?.lat()
        const lng = e.latLng?.lng()
        if (lat !== undefined && lng !== undefined) {
          marker.setPosition({ lat, lng })
          onLocationChange(lat, lng)
        }
      })

      marker.addListener('dragend', (e: google.maps.MapMouseEvent) => {
        const lat = e.latLng?.lat()
        const lng = e.latLng?.lng()
        if (lat !== undefined && lng !== undefined) {
          onLocationChange(lat, lng)
        }
      })

      mapInstanceRef.current = map
      markerInstanceRef.current = marker
    } catch (err) {
      console.error('Failed to initialize map:', err)
      setError('Failed to initialize map')
    }
  }

  // Load SDK
  useEffect(() => {
    const setup = async () => {
      try {
        await loadGoogleMapsAPI()
        setSdkReady(true)
      } catch (e: any) {
        console.error('Google Maps loading error:', e)
        setError(e?.message || 'Failed to load Google Maps')
      }
    }
    setup()
  }, [])

  // Initialize map when SDK ready & ref available
  useEffect(() => {
    if (sdkReady && mapRef.current && !mapInstanceRef.current && (window as any).google?.maps) {
      initializeMap()
    }
  }, [sdkReady])

  // Update marker position when props change
  useEffect(() => {
    if (mapInstanceRef.current && markerInstanceRef.current && typeof latitude === 'number' && typeof longitude === 'number') {
      const pos = { lat: latitude, lng: longitude }
      markerInstanceRef.current.setPosition(pos)
      mapInstanceRef.current.setCenter(pos)
    }
  }, [latitude, longitude])

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        if (mapInstanceRef.current && markerInstanceRef.current) {
          const pos = { lat, lng }
          markerInstanceRef.current.setPosition(pos)
          mapInstanceRef.current.setCenter(pos)
          mapInstanceRef.current.setZoom(16)
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
    if (mapInstanceRef.current && markerInstanceRef.current) {
      const pos = { lat: defaultLat, lng: defaultLng }
      markerInstanceRef.current.setPosition(pos)
      mapInstanceRef.current.setCenter(pos)
      mapInstanceRef.current.setZoom(12)
      onLocationChange(defaultLat, defaultLng)
    }
  }

  if (error) {
    return (
      <Paper sx={{ p: 2, height }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="body2" color="text.secondary">
          Please check your Google Maps API key configuration or enter coordinates manually.
        </Typography>
      </Paper>
    )
  }

  return (
    <Box>
      <Paper sx={{ position: 'relative', height, bgcolor: 'grey.100' }}>
        {/* Always render container so ref exists */}
        <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: 4 }} />
        {(!sdkReady || !mapInstanceRef.current) && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none'
            }}
          >
            <Typography color="text.secondary">Loading Google Maps...</Typography>
          </Box>
        )}
      </Paper>

      <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<MyLocationIcon />}
          onClick={getCurrentLocation}
          disabled={!sdkReady || !mapInstanceRef.current}
        >
          My Location
        </Button>

        <Button
          variant="outlined"
          size="small"
          startIcon={<LocationIcon />}
          onClick={resetLocation}
          disabled={!sdkReady || !mapInstanceRef.current}
        >
          Reset
        </Button>

        {typeof latitude === 'number' && typeof longitude === 'number' && (
          <Typography variant="caption" sx={{ alignSelf: 'center', ml: 1 }}>
            {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default GoogleMapPicker
