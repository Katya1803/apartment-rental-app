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
  Button,
  Chip,
  Divider,
  Snackbar
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Bed as BedIcon,
  Shower as BathIcon,
  AspectRatio as AreaIcon,
  LocationOn as LocationIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material'
import { PropertyService } from '../../services/propertyService'
import { FavoritesService } from '../../services/favoritesService'
import PropertyImageGallery from '../../components/property/PropertyImageGallery'
import PropertyAmenities from '../../components/property/PropertyAmenities'
// import PropertyMap from '../../components/property/PropertyMap'
import LeafletMap from '../../components/property/LeafletMap' // Thay thế Google Maps
import { parseMarkdown } from '../../utils/markdown'
import type { PropertyDetail, Locale } from '../../types'

const PropertyDetailPage: React.FC = () => {
  const { t, i18n } = useTranslation()
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  
  const [property, setProperty] = useState<PropertyDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Favorites state
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteMessage, setFavoriteMessage] = useState('')

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
        
        // Check if property is in favorites
        setIsFavorite(FavoritesService.isFavorite(data.id))
      } catch (err) {
        console.error('Failed to fetch property:', err)
        setError('Failed to load property details')
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [slug, currentLocale])

  // Handle favorite toggle
  const handleFavoriteToggle = () => {
    if (!property) return

    FavoritesService.toggleFavorite(property.id)
    const newIsFavorite = FavoritesService.isFavorite(property.id)
    setIsFavorite(newIsFavorite)
    
    // Show feedback message
    setFavoriteMessage(
      newIsFavorite 
        ? t('favouriteAdded')
        : t('favouriteRemoved')
    )
  }

  const handleBackClick = () => {
    navigate(-1)
  }

  // Format price
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}${t('billion')}`
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}${t('million')}`
    }
    return price.toString()
  }

  // Get property type label
  const getPropertyTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      APARTMENT: t('apartment'),
      ROOM: t('room'),
      STUDIO: t('studio'),
      HOUSE: t('house')
    }
    return typeLabels[type] || type
  }

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" width="100%" height={400} sx={{ mb: 3, borderRadius: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="text" width="40%" height={30} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={200} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" width="100%" height={300} />
          </Grid>
        </Grid>
      </Container>
    )
  }

  // Error state
  if (error || !property) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Property not found'}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBackClick}
        >
          {t('back')}
        </Button>
      </Container>
    )
  }

  // Get current translation
  const translation = property.translations?.[currentLocale] || 
                     property.translations?.['vi'] || 
                     property.translations?.['en']

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBackClick}
          size="small"
        >
          {t('back')}
        </Button>
      </Box>

      {/* Image Gallery */}
      {property.images && property.images.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <PropertyImageGallery images={property.images} />
        </Box>
      )}

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Left Column - Details */}
        <Grid item xs={12} md={8}>
          {/* Title & Basic Info */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                  {translation?.title || property.slug}
                </Typography>
                
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <Chip 
                    label={getPropertyTypeLabel(property.propertyType)} 
                    color="primary" 
                    size="small"
                  />
                  {property.code && (
                    <Chip 
                      label={`Code: ${property.code}`} 
                      variant="outlined" 
                      size="small"
                    />
                  )}
                  {property.isFeatured && (
                    <Chip 
                      label={t('featured')} 
                      color="secondary" 
                      size="small"
                    />
                  )}
                </Stack>
              </Box>

              {/* Favorite Button */}
              <IconButton
                onClick={handleFavoriteToggle}
                color={isFavorite ? 'error' : 'default'}
                size="large"
              >
                {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Box>

            {/* Price */}
            <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 3 }}>
              {formatPrice(property.priceMonth)} VND{t('perMonth')}
            </Typography>

            {/* Property Stats */}
            <Stack direction="row" spacing={3} flexWrap="wrap">
              {property.areaSqm && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AreaIcon color="action" />
                  <Typography>
                    <strong>{property.areaSqm}{t('sqm')}</strong>
                  </Typography>
                </Box>
              )}

              {property.bedrooms && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BedIcon color="action" />
                  <Typography>
                    <strong>{property.bedrooms} {t('bedrooms')}</strong>
                  </Typography>
                </Box>
              )}

              {property.bathrooms && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BathIcon color="action" />
                  <Typography>
                    <strong>{property.bathrooms} {t('bathrooms')}</strong>
                  </Typography>
                </Box>
              )}

              {property.floorNo && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography color="action">🏢</Typography>
                  <Typography>
                    <strong>{t('floor')} {property.floorNo}</strong>
                  </Typography>
                </Box>
              )}
            </Stack>

            <Divider sx={{ mb: 3 }} />

            {/* Updated Date */}
            {property.publishedAt && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                {t('last_updated')}: {new Date(property.publishedAt).toLocaleDateString(currentLocale)}
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Right Column - Contact Info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 24 }}>
            <Typography variant="h6" gutterBottom>
              {t('contactInfo')}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t('contactFormInstruction')}
            </Typography>

            <Stack spacing={2}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => {
                  // Open contact dialog or navigate to contact page
                  navigate('/contact')
                }}
              >
                {t('contactUs')}
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  window.open(`tel:0903228571`)
                }}
              >
                {t('callNow')}
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  window.open(`https://zalo.me/0903228571`, '_blank')
                }}
              >
                {t('contactZalo')}
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Description */}
      {translation?.descriptionMd && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('viewDescription')}
          </Typography>
          <Box
            sx={{
              '& h1, & h2, & h3': { fontWeight: 600, mt: 2, mb: 1 },
              '& p': { mb: 2, lineHeight: 1.7 },
              '& ul, & ol': { mb: 2 },
              '& li': { mb: 0.5 }
            }}
            dangerouslySetInnerHTML={{
              __html: parseMarkdown(translation.descriptionMd)
            }}
          />
        </Paper>
      )}

      {/* Amenities */}
      {property.amenities && property.amenities.length > 0 && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('amenities')}
          </Typography>
          <PropertyAmenities amenities={property.amenities} />
        </Paper>
      )}

      {/* Map - Using LeafletMap instead of Google Maps */}
      {(property.latitude && property.longitude) && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationIcon />
            {t('address')}
          </Typography>
          {property.addressLine && (
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {translation?.addressText || property.addressLine}
            </Typography>
          )}
          <LeafletMap
            latitude={property.latitude}
            longitude={property.longitude}
            title={translation?.title || property.slug}
            address={translation?.addressText || property.addressLine}
          />
        </Paper>
      )}

      {/* Address without map (when no coordinates) */}
      {(!property.latitude || !property.longitude) && (property.addressLine || translation?.addressText) && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationIcon />
            {t('address')}
          </Typography>
          <Typography color="text.secondary">
            {translation?.addressText || property.addressLine}
          </Typography>
        </Paper>
      )}

      {/* Pet Policy */}
      {property.petPolicy && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('petPolicy')}
          </Typography>
          <Typography color="text.secondary">
            {property.petPolicy}
          </Typography>
        </Paper>
      )}

      {/* View Description */}
      {property.viewDesc && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('viewDescription')}
          </Typography>
          <Typography color="text.secondary">
            {property.viewDesc}
          </Typography>
        </Paper>
      )}

      {/* Favorite Success Message */}
      <Snackbar
        open={!!favoriteMessage}
        autoHideDuration={3000}
        onClose={() => setFavoriteMessage('')}
        message={favoriteMessage}
      />
    </Container>
  )
}

export default PropertyDetailPage