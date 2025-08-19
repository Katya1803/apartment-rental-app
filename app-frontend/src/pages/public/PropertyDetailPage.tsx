// app-frontend/src/pages/public/PropertyDetailPage.tsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Container,
  Typography,
  Box,
  Grid,
  Alert,
  Skeleton,
  Stack,
  Paper,
  IconButton,
  Button
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Bed as BedIcon,
  Shower as BathIcon,
  AspectRatio as AreaIcon,
  LocationOn as LocationIcon,
  Favorite as FavoriteIcon,
  Email as EmailIcon,
  Apartment as ApartmentIcon
} from '@mui/icons-material'
import { PropertyService } from '../../services/propertyService'
import PropertyImageGallery from '../../components/property/PropertyImageGallery'
import PropertyAmenities from '../../components/property/PropertyAmenities'
import PropertyMap from '../../components/property/PropertyMap'
import SimpleMapFallback from '../../components/property/SimpleMapFallback'
import { PROPERTY_TYPE_LABELS } from '../../config/constants'
import type { PropertyDetail, Locale } from '../../types'

const PropertyDetailPage: React.FC = () => {
  const { t, i18n } = useTranslation()
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  
  const [property, setProperty] = useState<PropertyDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const currentLocale = i18n.language as Locale

  useEffect(() => {
    const fetchProperty = async () => {
      if (!slug) {
        setError('Property not found')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await PropertyService.getPropertyBySlug(slug, currentLocale)
        setProperty(data)
      } catch (err) {
        console.error('Failed to fetch property:', err)
        setError('Failed to load property details')
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [slug, currentLocale])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(currentLocale === 'vi' ? 'vi-VN' : 'en-US', {
      style: 'currency',
      currency: currentLocale === 'vi' ? 'VND' : 'USD',
      maximumFractionDigits: 0
    }).format(price)
  }

  const getPropertyTypeLabel = () => {
    if (!property) return ''
    return PROPERTY_TYPE_LABELS[currentLocale]?.[property.propertyType] || property.propertyType
  }

  const getCurrentTranslation = () => {
    if (!property?.translations) return null
    return property.translations[currentLocale] || property.translations['vi'] || property.translations['en']
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={400} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="text" width="60%" height={60} />
            <Skeleton variant="rectangular" width="100%" height={200} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" width="100%" height={300} />
          </Grid>
        </Grid>
      </Container>
    )
  }

  if (error || !property) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Property not found'}</Alert>
      </Container>
    )
  }

  const translation = getCurrentTranslation()
  if (!translation) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">Translation not available</Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back button */}
      <Box sx={{ mb: 2 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="body2" color="text.secondary" component="span">
          {t('backToProperties')}
        </Typography>
      </Box>

      {/* Main Layout */}
      <Grid container spacing={4}>
        {/* Left - Images Only */}
        <Grid item xs={12} md={8}>
          {property.images && property.images.length > 0 ? (
            <PropertyImageGallery images={property.images} />
          ) : (
            <Box 
              sx={{ 
                height: 400, 
                bgcolor: 'grey.100', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: 1
              }}
            >
              <Typography color="text.secondary">
                No images available
              </Typography>
            </Box>
          )}
        </Grid>

        {/* Right - Property Info Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 'fit-content', position: 'relative' }}>
            {/* Favourite Button - Top Right */}
            <IconButton 
              color="primary" 
              sx={{ 
                position: 'absolute',
                top: 16,
                right: 16,
                border: 1, 
                borderColor: 'primary.main' 
              }}
            >
              <FavoriteIcon />
            </IconButton>

            {/* Property Code */}
            <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mb: 1, pr: 6 }}>
              {property.code}
            </Typography>
            
            {/* Property Title */}
            <Typography variant="h5" component="h1" fontWeight="bold" sx={{ mb: 2, pr: 6 }}>
              {translation.title}
            </Typography>
            
            {/* Price */}
            <Typography variant="h4" color="primary" fontWeight="bold" sx={{ mb: 3 }}>
              {formatPrice(property.priceMonth)}/month
            </Typography>

            {/* Updated Date */}
            {property.publishedAt && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Updated: {new Date(property.publishedAt).toLocaleDateString(currentLocale)}
              </Typography>
            )}

            {/* Property Details Grid */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {property.areaSqm && (
                <Grid item xs={6}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <AreaIcon fontSize="small" color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Size</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {property.areaSqm}m²
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              )}
              
              {property.bedrooms && property.bedrooms > 0 && (
                <Grid item xs={6}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <BedIcon fontSize="small" color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Bedrooms</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {property.bedrooms}BR
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              )}
              
              {property.bathrooms && property.bathrooms > 0 && (
                <Grid item xs={6}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <BathIcon fontSize="small" color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Bathrooms</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {property.bathrooms}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              )}

              <Grid item xs={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Type</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {getPropertyTypeLabel()}
                  </Typography>
                </Box>
              </Grid>

              {property.floorNo && property.floorNo > 0 && (
                <Grid item xs={6}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <ApartmentIcon fontSize="small" color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Floor</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {property.floorNo}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              )}
            </Grid>

            {/* Contact Button */}
            <Button 
              variant="contained" 
              fullWidth 
              size="large"
              sx={{ 
                bgcolor: '#c41e3a',
                '&:hover': { bgcolor: '#a01729' },
                textTransform: 'uppercase',
                fontWeight: 'bold'
              }}
              startIcon={<EmailIcon />}
            >
              Contact Us
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Full Width Sections Below */}
      {/* Description Section */}
      {translation.descriptionMd && (
        <Box sx={{ mt: 6, mb: 6 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
            DESCRIPTION
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              whiteSpace: 'pre-wrap',
              lineHeight: 1.6,
              color: 'text.secondary'
            }}
          >
            {translation.descriptionMd}
          </Typography>
        </Box>
      )}

      {/* Amenities Section */}
      {property.amenities && property.amenities.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
            AMENITIES
          </Typography>
          <PropertyAmenities amenities={property.amenities} />
        </Box>
      )}

      {/* Location Map */}
      {(property.latitude && property.longitude) && (
        <Box>
          <Typography variant="h5" component="h2" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
            LOCATION
          </Typography>
          
          {/* Address */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
            <LocationIcon fontSize="small" color="primary" />
            <Typography variant="body1" color="text.secondary">
              {translation.addressText}
            </Typography>
          </Stack>
          
          {/* Try Google Maps first, fallback to simple map */}
          {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? (
            <PropertyMap 
              latitude={property.latitude}
              longitude={property.longitude}
              title={translation.title}
              address={translation.addressText}
            />
          ) : (
            <SimpleMapFallback
              latitude={property.latitude}
              longitude={property.longitude}
              title={translation.title}
              address={translation.addressText}
            />
          )}
        </Box>
      )}
    </Container>
  )
}

export default PropertyDetailPage