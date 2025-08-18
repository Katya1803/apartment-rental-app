import React, { useEffect, useRef, useState } from 'react'
import { Box, Typography, Alert, Button, Paper } from '@mui/material'
import { LocationOn as LocationIcon, MyLocation as MyLocationIcon } from '@mui/icons-material'

interface GoogleMapPickerProps {
  latitude?: number
  longitude?: number
  onLocationChange: (lat: number, lng: number) => void
  height?: number
}

const GoogleMapPicker: React.FC<GoogleMapPickerProps> = ({
  latitude,
  longitude,
  onLocationChange,
  height = 400
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [marker, setMarker] = useState<google.maps.Marker | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Default location (Hanoi, Vietnam)
  const defaultLat = 21.0285
  const defaultLng = 105.8542

  // Initialize Google Maps
  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        // Check if Google Maps is already loaded
        if (window.google && window.google.maps) {
          initializeMap()
          return
        }

        // Load Google Maps script
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`
        script.async = true
        script.defer = true
        
        script.onload = () => {
          setIsLoaded(true)
          initializeMap()
        }
        
        script.onerror = () => {
          setError('Failed to load Google Maps. Please check your API key.')
        }

        document.head.appendChild(script)
      } catch (err) {
        setError('Error loading Google Maps')
        console.error('Google Maps loading error:', err)
      }
    }

    loadGoogleMaps()
  }, [])

  // Initialize map instance
  const initializeMap = () => {
    if (!mapRef.current) return

    try {
      const initialLat = latitude || defaultLat
      const initialLng = longitude || defaultLng

      // Create map
      const mapInstance = new google.maps.Map(mapRef.current, {
        center: { lat: initialLat, lng: initialLng },
        zoom: latitude && longitude ? 16 : 12,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        gestureHandling: 'greedy'
      })

      // Create marker
      const markerInstance = new google.maps.Marker({
        position: { lat: initialLat, lng: initialLng },
        map: mapInstance,
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

      // Handle map click to move marker
      mapInstance.addListener('click', (event: google.maps.MapMouseEvent) => {
        const lat = event.latLng?.lat()
        const lng = event.latLng?.lng()
        
        if (lat && lng) {
          markerInstance.setPosition({ lat, lng })
          onLocationChange(lat, lng)
        }
      })

      // Handle marker drag
      markerInstance.addListener('dragend', (event: google.maps.MapMouseEvent) => {
        const lat = event.latLng?.lat()
        const lng = event.latLng?.lng()
        
        if (lat && lng) {
          onLocationChange(lat, lng)
        }
      })

      setMap(mapInstance)
      setMarker(markerInstance)
      setError(null)

    } catch (err) {
      setError('Failed to initialize map')
      console.error('Map initialization error:', err)
    }
  }

  // Update marker position when props change
  useEffect(() => {
    if (map && marker && latitude && longitude) {
      const newPosition = { lat: latitude, lng: longitude }
      marker.setPosition(newPosition)
      map.setCenter(newPosition)
    }
  }, [latitude, longitude, map, marker])

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        
        if (map && marker) {
          const newPosition = { lat, lng }
          marker.setPosition(newPosition)
          map.setCenter(newPosition)
          map.setZoom(16)
          onLocationChange(lat, lng)
        }
      },
      (error) => {
        console.error('Geolocation error:', error)
        setError('Unable to get your current location')
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    )
  }

  // Clear location
  const clearLocation = () => {
    if (map && marker) {
      marker.setPosition({ lat: defaultLat, lng: defaultLng })
      map.setCenter({ lat: defaultLat, lng: defaultLng })
      map.setZoom(12)
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
          Please add your Google Maps API key to environment variables (VITE_GOOGLE_MAPS_API_KEY)
          or enter coordinates manually in the latitude/longitude fields below.
        </Typography>
      </Paper>
    )
  }

  return (
    <Box>
      {/* Map Container */}
      <Paper 
        sx={{ 
          position: 'relative',
          height,
          bgcolor: 'grey.100',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {!isLoaded ? (
          <Typography color="text.secondary">
            Loading Google Maps...
          </Typography>
        ) : (
          <>
            <div 
              ref={mapRef} 
              style={{ 
                width: '100%', 
                height: '100%',
                borderRadius: '8px'
              }} 
            />
            
            {/* Control Buttons */}
            <Box
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}
            >
              <Button
                variant="contained"
                size="small"
                startIcon={<MyLocationIcon />}
                onClick={getCurrentLocation}
                sx={{ 
                  bgcolor: 'white', 
                  color: 'primary.main',
                  boxShadow: 2,
                  '&:hover': { bgcolor: 'grey.50' }
                }}
              >
                My Location
              </Button>
              
              <Button
                variant="outlined"
                size="small"
                onClick={clearLocation}
                sx={{ 
                  bgcolor: 'white',
                  boxShadow: 1,
                  '&:hover': { bgcolor: 'grey.50' }
                }}
              >
                Reset
              </Button>
            </Box>
          </>
        )}
      </Paper>

      {/* Instructions */}
      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <LocationIcon color="primary" fontSize="small" />
        <Typography variant="body2" color="text.secondary">
          Click on the map to set property location, or drag the red marker to adjust position
        </Typography>
      </Box>

      {/* Current Coordinates Display */}
      {latitude && longitude && (
        <Box sx={{ mt: 1, p: 1, bgcolor: 'primary.50', borderRadius: 1 }}>
          <Typography variant="caption" color="primary.main">
            📍 Selected: {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default GoogleMapPicker