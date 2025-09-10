import React, { useEffect, useRef, useState } from 'react'
import { Box, Alert, Skeleton, Typography, Paper, Button } from '@mui/material'
import { LocationOn as LocationIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material'

interface PropertyMapProps {
  latitude: number
  longitude: number
  title: string
  address?: string
  height?: number
}

let isGoogleMapsLoaded = false
let isGoogleMapsLoading = false
let googleMapsPromise: Promise<void> | null = null
const SCRIPT_ID = 'google-maps-sdk'

const PropertyMap: React.FC<PropertyMapProps> = ({
  latitude,
  longitude,
  title,
  address,
  height = 400
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)

  const [sdkReady, setSdkReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadGoogleMapsAPI = async (): Promise<void> => {
    if (isGoogleMapsLoaded && (window as any).google?.maps) return
    if (isGoogleMapsLoading && googleMapsPromise) return googleMapsPromise

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
      console.log('Google Maps API Key:', apiKey ? 'Configured' : 'Missing') // Debug log
      
      if (!apiKey) {
        isGoogleMapsLoading = false
        reject(new Error('Google Maps API key not found. Please check your .env file.'))
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
            console.log('Google Maps API loaded successfully') // Debug log
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
        console.error('Failed to load Google Maps script') 
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
      console.log('Initializing PropertyMap with coordinates:', latitude, longitude) // Debug log
      
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: latitude, lng: longitude },
        zoom: 16,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        gestureHandling: 'cooperative', 
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      })

      const marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: title,
        animation: google.maps.Animation.DROP,
        icon: {
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 24 32">
              <path fill="#1976d2" stroke="#FFF" stroke-width="2"
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="3" fill="#FFF"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 40),
          anchor: new google.maps.Point(16, 40)
        }
      })

      // Create info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 12px; max-width: 250px; font-family: Roboto, sans-serif;">
            <strong style="display: block; margin-bottom: 8px; color: #1976d2; font-size: 16px;">${title}</strong>
            ${address ? `<div style="color: #666; font-size: 14px; line-height: 1.4;">${address}</div>` : ''}
            <div style="color: #999; font-size: 12px; margin-top: 8px;">
              Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}
            </div>
          </div>
        `
      })

      // Show info window on marker click
      marker.addListener('click', () => {
        infoWindow.open(map, marker)
      })

      // Auto-open info window after a short delay
      setTimeout(() => {
        infoWindow.open(map, marker)
      }, 1000)

      mapInstanceRef.current = map
      console.log('PropertyMap initialized successfully') // Debug log
    } catch (err) {
      console.error('Failed to initialize PropertyMap:', err)
      setError('Failed to initialize map')
    }
  }

  // Load SDK
  useEffect(() => {
    const setup = async () => {
      try {
        setError(null)
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
  }, [sdkReady, latitude, longitude])

  const handleOpenInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    window.open(url, '_blank')
  }

  const handleOpenWithAddress = () => {
    if (address) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
      window.open(url, '_blank')
    }
  }

  // Loading state
  if (!sdkReady && !error) {
    return (
      <Box sx={{ height }}>
        <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: 1 }} />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Loading map...
        </Typography>
      </Box>
    )
  }

  // Error state - Show fallback with links to Google Maps
  if (error) {
    return (
      <Paper
        sx={{
          height: height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.50',
          border: '1px dashed',
          borderColor: 'grey.300',
          p: 3,
          textAlign: 'center'
        }}
      >
        <LocationIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        
        {address && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {address}
          </Typography>
        )}
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </Typography>

        <Alert severity="info" sx={{ mb: 3, maxWidth: 400 }}>
          <Typography variant="body2">
            {error.includes('API key') 
              ? 'Google Maps API key not configured. Contact administrator.'
              : 'Map temporarily unavailable. You can view location on Google Maps instead.'
            }
          </Typography>
        </Alert>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<OpenInNewIcon />}
            onClick={handleOpenInGoogleMaps}
            size="small"
          >
            Open in Google Maps
          </Button>
          
          {address && (
            <Button
              variant="outlined"
              startIcon={<LocationIcon />}
              onClick={handleOpenWithAddress}
              size="small"
            >
              Search Address
            </Button>
          )}
        </Box>
      </Paper>
    )
  }

  // Success state - Show map
  return (
    <Box
      ref={mapRef}
      sx={{
        height,
        width: '100%',
        borderRadius: 1,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider'
      }}
    />
  )
}

export default PropertyMap