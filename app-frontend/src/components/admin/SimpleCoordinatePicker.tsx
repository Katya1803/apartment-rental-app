// app-frontend/src/components/admin/SimpleCoordinatePicker.tsx
// Fallback component when Leaflet fails to load
import React from 'react'
import { Box, Typography, Paper, Button, Stack, Alert } from '@mui/material'
import { MyLocation as MyLocationIcon, Map as MapIcon } from '@mui/icons-material'

interface SimpleCoordinatePickerProps {
  latitude?: number
  longitude?: number
  onLocationChange: (lat: number, lng: number) => void
  height?: number
}

const SimpleCoordinatePicker: React.FC<SimpleCoordinatePickerProps> = ({
  latitude,
  longitude,
  onLocationChange,
  height = 400
}) => {
  const defaultLat = 21.0285
  const defaultLng = 105.8542

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
      (err) => {
        console.error('Geolocation error:', err)
        alert('Không thể lấy vị trí. Vui lòng nhập tọa độ thủ công.')
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )
  }

  const resetToDefault = () => {
    onLocationChange(defaultLat, defaultLng)
  }

  const openGoogleMaps = () => {
    const lat = latitude || defaultLat
    const lng = longitude || defaultLng
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    window.open(url, '_blank')
  }

  return (
    <Paper sx={{ 
      height, 
      border: '2px dashed', 
      borderColor: 'grey.300',
      bgcolor: 'grey.50',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      p: 3
    }}>
      <MapIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
      
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Bản đồ tương tác
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center', maxWidth: 400 }}>
        Bản đồ không thể tải. Bạn có thể sử dụng các tùy chọn bên dưới hoặc nhập tọa độ thủ công ở các ô phía trên.
      </Typography>

      {(typeof latitude === 'number' && typeof longitude === 'number') && (
        <Alert severity="info" sx={{ mb: 2, maxWidth: 400 }}>
          <Typography variant="body2">
            <strong>Tọa độ hiện tại:</strong><br />
            Vĩ độ: {latitude.toFixed(6)}<br />
            Kinh độ: {longitude.toFixed(6)}
          </Typography>
        </Alert>
      )}

      <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
        <Button
          variant="outlined"
          startIcon={<MyLocationIcon />}
          onClick={getCurrentLocation}
          size="small"
        >
          Lấy vị trí hiện tại
        </Button>
        
        <Button
          variant="outlined"
          onClick={resetToDefault}
          size="small"
        >
          Đặt về Hà Nội
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<MapIcon />}
          onClick={openGoogleMaps}
          size="small"
        >
          Mở Google Maps
        </Button>
      </Stack>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
        💡 Mẹo: Bạn có thể tìm tọa độ trên Google Maps rồi copy-paste vào các ô bên trên
      </Typography>
    </Paper>
  )
}

export default SimpleCoordinatePicker