// app-frontend/src/components/property/SimpleMapFallback.tsx
import React from 'react'
import { Box, Typography, Paper, Button } from '@mui/material'
import { LocationOn as LocationIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material'

interface SimpleMapFallbackProps {
  latitude: number
  longitude: number
  title: string
  address?: string
  height?: number
}

const SimpleMapFallback: React.FC<SimpleMapFallbackProps> = ({
  latitude,
  longitude,
  title,
  address,
  height = 400
}) => {
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
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {address}
        </Typography>
      )}
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
      </Typography>
      
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

export default SimpleMapFallback