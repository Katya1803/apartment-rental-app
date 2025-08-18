// src/components/admin/PropertyImageUpload.tsx
import React, { useState, useCallback } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  LinearProgress,
  Alert,
  Chip,
  Stack
} from '@mui/material'
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Visibility as ViewIcon
} from '@mui/icons-material'
import { PropertyService } from '../../services/propertyService'
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from '../../config/constants'
import type { PropertyImage } from '../../types'

interface PropertyImageUploadProps {
  propertyId: number
  images: PropertyImage[]
  onImagesChange: (images: PropertyImage[]) => void
  disabled?: boolean
}

const PropertyImageUpload: React.FC<PropertyImageUploadProps> = ({
  propertyId,
  images,
  onImagesChange,
  disabled = false
}) => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Handle file selection
  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    setError(null)
    setUploading(true)
    setUploadProgress(0)

    try {
      const uploadPromises = files.map(async (file, index) => {
        // Validate file
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
          throw new Error(`Invalid file type: ${file.name}. Only JPEG, PNG, and WebP are allowed.`)
        }

        if (file.size > MAX_FILE_SIZE) {
          throw new Error(`File too large: ${file.name}. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`)
        }

        // Upload file
        const result = await PropertyService.uploadPropertyImage(propertyId, file)
        
        // Update progress
        setUploadProgress(((index + 1) / files.length) * 100)
        
        return result
      })

      const uploadedImages = await Promise.all(uploadPromises)
      
      // Refresh images list
      const updatedImages = await PropertyService.getPropertyImages(propertyId)
      onImagesChange(updatedImages)

    } catch (error: any) {
      console.error('Upload failed:', error)
      setError(error.message || 'Failed to upload images')
    } finally {
      setUploading(false)
      setUploadProgress(0)
      // Reset file input
      event.target.value = ''
    }
  }, [propertyId, onImagesChange])

  // Handle image deletion
  const handleDelete = async (imageId: number) => {
    try {
      await PropertyService.deletePropertyImage(propertyId, imageId)
      
      // Update images list
      const updatedImages = images.filter(img => img.id !== imageId)
      onImagesChange(updatedImages)
    } catch (error: any) {
      console.error('Delete failed:', error)
      setError(error.message || 'Failed to delete image')
    }
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Box>
      {/* Upload Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ImageIcon />
            Property Images ({images.length})
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Upload Button */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Button
              variant="contained"
              component="label"
              startIcon={<UploadIcon />}
              disabled={disabled || uploading}
            >
              Upload Images
              <input
                type="file"
                hidden
                multiple
                accept={ALLOWED_FILE_TYPES.join(',')}
                onChange={handleFileSelect}
              />
            </Button>

            <Typography variant="body2" color="text.secondary">
              Max {formatFileSize(MAX_FILE_SIZE)} per file • JPEG, PNG, WebP
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

          {/* Upload Guidelines */}
          <Typography variant="body2" color="text.secondary">
            💡 Tips: First image will be used as cover image. Recommended size: 1200x800px
          </Typography>
        </CardContent>
      </Card>

      {/* Images Grid */}
      {images.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <ImageIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No images uploaded
            </Typography>
            <Typography color="text.secondary">
              Upload some images to showcase this property
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {images.map((image, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
              <Card sx={{ position: 'relative' }}>
                {/* Cover Badge */}
                {index === 0 && (
                  <Chip
                    label="Cover"
                    color="primary"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      zIndex: 1
                    }}
                  />
                )}

                {/* Image */}
                <Box
                  sx={{
                    height: 200,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    bgcolor: 'grey.200'
                  }}
                  onClick={() => setPreviewImage(image.imageUrl)}
                >
                  <img
                    src={image.imageUrl}
                    alt={image.altText?.en || image.originalName}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Box>

                {/* Image Actions */}
                <CardContent sx={{ p: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                      {image.originalName}
                    </Typography>
                    
                    <Stack direction="row" spacing={0.5}>
                      <IconButton
                        size="small"
                        onClick={() => setPreviewImage(image.imageUrl)}
                        title="View"
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                      
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(image.id)}
                        disabled={disabled || uploading}
                        title="Delete"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Stack>
                  
                  <Typography variant="caption" color="text.secondary">
                    Order: {image.displayOrder}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Image Preview Dialog */}
      <Dialog
        open={Boolean(previewImage)}
        onClose={() => setPreviewImage(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewImage(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default PropertyImageUpload