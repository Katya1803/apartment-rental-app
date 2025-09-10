import React, { useState, useRef } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Stack,
  LinearProgress,
  Slider
} from '@mui/material'
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon
} from '@mui/icons-material'
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from '../../config/constants'

interface HeroImageUploadProps {
  currentImageUrl?: string
  onImageChange: (imageUrl: string) => void
  disabled?: boolean
}

const HeroImageUpload: React.FC<HeroImageUploadProps> = ({
  currentImageUrl,
  onImageChange,
  disabled = false
}) => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [imagePosition, setImagePosition] = useState(50) // Vị trí Y của ảnh (0-100%)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)
    setUploading(true)
    setUploadProgress(0)

    try {
      // Validate file
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        throw new Error(`Invalid file type. Only JPEG, PNG, and WebP are allowed.`)
      }

      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`)
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      // TODO: Replace with actual CloudinaryService.uploadImage() call
      const imageUrl = URL.createObjectURL(file)
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      onImageChange(imageUrl)

    } catch (error: any) {
      console.error('Upload failed:', error)
      setError(error.message || 'Failed to upload image')
    } finally {
      setUploading(false)
      setUploadProgress(0)
      event.target.value = ''
    }
  }

  const handleRemoveImage = () => {
    onImageChange('')
    setImagePosition(50)
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ImageIcon />
          Hero Background Image
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Current Image Preview với positioning */}
        {currentImageUrl && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Current Image:
            </Typography>
            
            {/* Preview như trên homepage */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: 300,
                borderRadius: 1,
                overflow: 'hidden',
                bgcolor: 'grey.200'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${currentImageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: `center ${imagePosition}%`,
                  backgroundRepeat: 'no-repeat'
                }}
              />
              
              {/* Text overlay để test */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  color: 'white',
                  zIndex: 1
                }}
              >
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  Find Your Perfect Home
                </Typography>
                <Typography variant="h6">
                  Quality apartments and rooms in Vietnam
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="error"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={handleRemoveImage}
                disabled={disabled || uploading}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 2
                }}
              >
                Remove
              </Button>
            </Box>

            {/* Image Position Slider */}
            <Box sx={{ mt: 2, px: 2 }}>
              <Typography variant="body2" gutterBottom>
                Adjust Image Position:
              </Typography>
              <Slider
                value={imagePosition}
                onChange={(_, value) => setImagePosition(value as number)}
                min={0}
                max={100}
                step={1}
                marks={[
                  { value: 0, label: 'Top' },
                  { value: 50, label: 'Center' },
                  { value: 100, label: 'Bottom' }
                ]}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
                disabled={disabled}
              />
            </Box>
          </Box>
        )}

        {/* Upload Button */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Button
            variant="contained"
            component="label"
            startIcon={<UploadIcon />}
            disabled={disabled || uploading}
          >
            {currentImageUrl ? 'Change Image' : 'Upload Image'}
            <input
              type="file"
              hidden
              accept={ALLOWED_FILE_TYPES.join(',')}
              onChange={handleFileSelect}
            />
          </Button>

          <Typography variant="body2" color="text.secondary">
            Max 10MB • JPEG, PNG, WebP
          </Typography>
        </Stack>

        {/* Upload Progress */}
        {uploading && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Uploading... {Math.round(uploadProgress)}%
            </Typography>
            <LinearProgress variant="determinate" value={uploadProgress} />
          </Box>
        )}

        <Typography variant="body2" color="text.secondary">
          💡 Recommended size: 1920x1080px or higher. You can adjust the vertical position after upload.
        </Typography>
      </CardContent>
    </Card>
  )
}

export default HeroImageUpload