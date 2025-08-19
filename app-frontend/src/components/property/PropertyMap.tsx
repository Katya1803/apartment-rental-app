// app-frontend/src/components/property/PropertyMap.tsx
import React, { useEffect, useRef, useState } from 'react'
import { Box, Alert, Skeleton, Typography, Paper } from '@mui/material'
import { LocationOn as LocationIcon } from '@mui/icons-material'

interface PropertyMapProps {
  latitude: number
  longitude: number
  title: string
  address?: string
  height?: number
}

// Global variables to manage Google Maps loading
let isGoogleMapsLoaded = false
let isGoogleMapsLoading = false
let googleMapsPromise: Promise<void> | null = null

const PropertyMap: React.FC<PropertyMapProps> = ({
  latitude,
  longitude,
  title,
  address,
  height = 400
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadGoogleMapsAPI = async (): Promise<void> => {
    // Check if API key exists
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      throw new Error('Google Maps API key not configured')
    }

    if (isGoogleMapsLoaded && (window as any).google?.maps) {
      return
    }

    if (isGoogleMapsLoading && googleMapsPromise) {
      return googleMapsPromise
    }

    isGoogleMapsLoading = true
    googleMapsPromise = new Promise<void>((resolve, reject) => {
      // Check if script already exists
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
      if (existingScript) {
        const checkLoaded = () => {
          if ((window as any).google?.maps) {
            isGoogleMapsLoaded = true
            isGoogleMapsLoading = false
            resolve()
          } else {
            setTimeout(checkLoaded, 100)
          }
        }
        checkLoaded()
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly&callback=initMap`
      script.async = true
      script.defer = true
      
      // Add global callback
      ;(window as any).initMap = () => {
        isGoogleMapsLoaded = true
        isGoogleMapsLoading = false
        resolve()
      }
      
      script.onerror = () => {
        isGoogleMapsLoading = false
        reject(new Error('Failed to load Google Maps. Please check your API key and network connection.'))
      }
      
      document.head.appendChild(script)
    })

    return googleMapsPromise
  }

  const initializeMap = () => {
    if (!mapRef.current || !(window as any).google?.maps || mapInstanceRef.current) {
      return
    }

    try {
      // Create map
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: latitude, lng: longitude },
        zoom: 16,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      })

      // Create marker
      const marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: title,
        animation: google.maps.Animation.DROP
      })

      // Create info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <strong style="display: block; margin-bottom: 4px;">${title}</strong>
            ${address ? `<div style="color: #666; font-size: 13px;">${address}</div>` : ''}
          </div>
        `
      })

      // Show info window on marker click
      marker.addListener('click', () => {
        infoWindow.open(map, marker)
      })

      mapInstanceRef.current = map
      setLoading(false)
    } catch (err) {
      console.error('Failed to initialize map:', err)
      setError('Failed to initialize map')
      setLoading(false)
    }
  }

  useEffect(() => {
    const setupMap = async () => {
      try {
        setError(null)
        setLoading(true)
        await loadGoogleMapsAPI()
        initializeMap()
      } catch (err) {
        console.error('Map setup failed:', err)
        setError(err instanceof Error ? err.message : 'Failed to load map')
        setLoading(false)
      }
    }

    setupMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null
      }
    }
  }, [latitude, longitude, title, address])

  if (loading) {
    return (
      <Skeleton 
        variant="rectangular" 
        width="100%" 
        height={height}
        sx={{ borderRadius: 1 }}
      />
    )
  }

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
          p: 3
        }}
      >
        <LocationIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Map Unavailable
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 1 }}>
          {error}
        </Typography>
        {address && (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Address: {address}
          </Typography>
        )}
      </Paper>
    )
  }

  return (
    <Box
      ref={mapRef}
      sx={{
        width: '100%',
        height: height,
        borderRadius: 1,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider'
      }}
    />
  )
}

export default PropertyMap