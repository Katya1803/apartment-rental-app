// app-frontend/src/pages/public/PropertyDetailPage.tsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Apartment as FloorIcon } from '@mui/icons-material'
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
  Divider,
  Snackbar,
  Chip
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Bed as BedIcon,
  Shower as BathIcon,
  AspectRatio as AreaIcon,
  LocationOn as LocationIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Home as HomeIcon
} from '@mui/icons-material'
import { PropertyService } from '../../services/propertyService'
import { FavoritesService } from '../../services/favoritesService'
import PropertyImageGallery from '../../components/property/PropertyImageGallery'
import PropertyAmenities from '../../components/property/PropertyAmenities'
import LeafletMap from '../../components/property/LeafletMap'
import { parseMarkdown } from '../../utils/markdown'
import type { PropertyDetail, Locale } from '../../types'

const PropertyDetailPage: React.FC = () => {
  const { t, i18n } = useTranslation()
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  
  const [property, setProperty] = useState<PropertyDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteMessage, setFavoriteMessage] = useState('')

  const currentLocale = i18n.language as Locale

  // Function để hiển thị rental status
  const getRentalStatusLabel = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return currentLocale === 'vi' ? 'Còn trống' : 
               currentLocale === 'ja' ? '空室あり' : 'Available';
      case 'RENTED':
        return currentLocale === 'vi' ? 'Đang cho thuê' : 
               currentLocale === 'ja' ? '賃貸中' : 'Rented';
      default:
        return status;
    }
  };

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

  const handleFavoriteToggle = () => {
    if (!property) return
    FavoritesService.toggleFavorite(property.id)
    const newIsFavorite = FavoritesService.isFavorite(property.id)
    setIsFavorite(newIsFavorite)
    setFavoriteMessage(
      newIsFavorite 
        ? t('favouriteAdded')
        : t('favouriteRemoved')
    )
  }

  const formatPrice = (price: number) => {
    return currentLocale === 'vi' 
      ? `${(price * 24000).toLocaleString('vi-VN')} VND`
      : `$${price.toLocaleString()}`
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width={200} height={40} />
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={400} sx={{ mb: 3 }} />
            <Skeleton variant="text" height={40} />
            <Skeleton variant="text" height={60} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={300} />
          </Grid>
        </Grid>
      </Container>
    )
  }

  if (error || !property) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Property not found'}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          {t('back')}
        </Button>
      </Container>
    )
  }

  const translation = property.translations[currentLocale] || property.translations['vi'] || property.translations['en']

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Box sx={{ mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          {t('back')}
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Image Gallery */}
          {property.images && property.images.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <PropertyImageGallery images={property.images} />
            </Box>
          )}

        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'relative' }}>
            {/* Favorite Button */}
            <IconButton
              onClick={handleFavoriteToggle}
              color={isFavorite ? "error" : "default"}
              sx={{ 
                position: 'absolute',
                top: 16,
                right: 16,
                border: 1, 
                borderColor: isFavorite ? 'error.main' : 'grey.300',
                bgcolor: 'background.paper',
                '&:hover': {
                  bgcolor: isFavorite ? 'error.50' : 'grey.50'
                }
              }}
            >
              {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>

            <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mb: 1, pr: 6 }}>
              {property.code}
            </Typography>
            
            <Typography variant="h5" component="h1" fontWeight="bold" sx={{ mb: 2, pr: 6 }}>
              {translation?.title || property.slug}
            </Typography>

            <Typography variant="h4" color="primary" fontWeight="bold" sx={{ mb: 3 }}>
              {property.priceMonth}$
              <Typography component="span" variant="body1" color="text.secondary">
                {currentLocale === 'vi' ? '/tháng' : currentLocale === 'ja' ? '/月' : '/month'}
              </Typography>
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Stack spacing={2} sx={{ mb: 3 }}>
              {property.areaSqm && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AreaIcon color="action" />
                  <Typography>
                    <strong>{property.areaSqm}</strong> {t('sqm')}
                  </Typography>
                </Box>
              )}
              
              {property.bedrooms && property.bedrooms > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BedIcon color="action" />
                  <Typography>
                    <strong>{property.bedrooms}</strong> {t('bedrooms')}
                  </Typography>
                </Box>
              )}
              
              {property.bathrooms && property.bathrooms > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BathIcon color="action" />
                  <Typography>
                    <strong>{property.bathrooms}</strong> {t('bathrooms')}
                  </Typography>
                </Box>
              )}

              {property.floorNo && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FloorIcon color="action" />
                  <Typography>
                    <strong>{t('floor')} {property.floorNo}</strong>
                  </Typography>
                </Box>
              )}

              {/* Rental Status Display */}
              {property.petPolicy && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HomeIcon color="action" />
                  <Typography sx={{ mr: 1 }}>
                    <strong>{t('status')}</strong>
                  </Typography>
                  <Chip 
                    label={getRentalStatusLabel(property.petPolicy)}
                    color={property.petPolicy === 'AVAILABLE' ? 'success' : 'warning'}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              )}
            </Stack>

            <Divider sx={{ mb: 3 }} />

            {property.publishedAt && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                {t('last_updated')}: {new Date(property.publishedAt).toLocaleDateString(currentLocale)}
              </Typography>
            )}
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

      {/* Included Services */}
      {property.amenities?.some(a => a.key.startsWith('IS_')) && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('includedServices')}
          </Typography>
          <PropertyAmenities 
            amenities={property.amenities.filter(a => a.key.startsWith('IS_'))} 
          />
        </Paper>
      )}

      {/* Interior Facilities */}
      {property.amenities?.some(a => a.key.startsWith('IF_')) && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('interiorFacilities')}
          </Typography>
          <PropertyAmenities 
            amenities={property.amenities.filter(a => a.key.startsWith('IF_'))} 
          />
        </Paper>
      )}

      {/* Map */}
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
            title=""
            address={translation?.addressText || property.addressLine}
          />
        </Paper>
      )}

      {/* Address without map */}
      {(!property.latitude || !property.longitude) && (property.addressLine || translation?.addressText) && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationIcon />
            {t('address')}
          </Typography>
          <Typography color="text.secondary">
            
          </Typography>
        </Paper>
      )}

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