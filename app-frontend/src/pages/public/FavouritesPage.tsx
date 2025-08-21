// app-frontend/src/pages/public/FavouritesPage.tsx
import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  Stack,
  Skeleton,
  Alert
} from '@mui/material'
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  AspectRatio as AreaIcon,
  Bed as BedIcon,
  Shower as BathIcon
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { FavoritesService } from '../../services/favoritesService'
import { PropertyService } from '../../services/propertyService'
import { ROUTES } from '../../config/constants'
import type { PropertySummary, Locale } from '../../types'
const FavouritesPage: React.FC = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])
  const [favoriteProperties, setFavoriteProperties] = useState<PropertySummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadFavorites()
    
    // Listen to storage changes
    const handleStorageChange = () => {
      loadFavorites()
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  useEffect(() => {
    if (favoriteIds.length > 0) {
      loadFavoriteProperties()
    } else {
      setFavoriteProperties([])
      setLoading(false)
    }
  }, [favoriteIds, i18n.language])

  const loadFavorites = () => {
    const ids = FavoritesService.getFavorites()
    setFavoriteIds(ids)
  }

  const loadFavoriteProperties = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const locale = i18n.language as Locale
      
      // Load all published properties and filter by favorites
      // Since we don't have batch API, we'll load all and filter
      const response = await PropertyService.getPublishedProperties(undefined, locale, 0, 100)
      const allProperties = response.items || []
      
      // Filter only favorite properties
      const favProperties = allProperties.filter(property => 
        favoriteIds.includes(property.id)
      )
      
      setFavoriteProperties(favProperties)
    } catch (err) {
      console.error('Failed to load favorite properties:', err)
      setError('Failed to load favorite properties')
      setFavoriteProperties([])
    } finally {
      setLoading(false)
    }
  }

  const handleFavoriteToggle = (propertyId: number, event: React.MouseEvent) => {
    event.stopPropagation()
    FavoritesService.toggleFavorite(propertyId)
    loadFavorites()
  }

  const handlePropertyClick = (slug: string) => {
    navigate(`/properties/${slug}`)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getPropertyTypeLabel = (type: string) => {
    const labels = {
      APARTMENT: 'Apartment',
      ROOM: 'Room',
      STUDIO: 'Studio',
      HOUSE: 'House'
    }
    return labels[type as keyof typeof labels] || type
  }

  const getPropertyTypeIcon = (type: string) => {
    const icons = {
      APARTMENT: '🏢',
      ROOM: '🏠',
      STUDIO: '🏙️',
      HOUSE: '🏘️'
    }
    return icons[type as keyof typeof icons] || '🏠'
  }

  // Property card component
  const PropertyCard = ({ property }: { property: PropertySummary }) => {
    const isFavorite = favoriteIds.includes(property.id)

    return (
      <Card 
        sx={{ 
          height: '100%',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          '&:hover': { transform: 'translateY(-2px)' }
        }}
        onClick={() => handlePropertyClick(property.slug)}
      >
        {/* Image */}
        <Box sx={{ position: 'relative', height: 240 }}>
          {property.coverImageUrl ? (
            <CardMedia
              component="img"
              height="240"
              image={property.coverImageUrl}
              alt={property.title || 'Property'}
              sx={{ objectFit: 'cover' }}
            />
          ) : (
            <Box sx={{
              height: 240,
              bgcolor: 'grey.200',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem'
            }}>
              {getPropertyTypeIcon(property.propertyType)}
            </Box>
          )}

          {/* Property type badge */}
          <Chip
            label={getPropertyTypeLabel(property.propertyType)}
            size="small"
            sx={{ 
              position: 'absolute', 
              top: 8, 
              left: 8,
              bgcolor: 'rgba(255,255,255,0.9)'
            }}
          />

          {/* Featured badge */}
          {property.isFeatured && (
            <Chip
              label="Featured"
              color="primary"
              size="small"
              sx={{ position: 'absolute', top: 8, right: 48 }}
            />
          )}

          {/* Favorite button */}
          <IconButton
            onClick={(e) => handleFavoriteToggle(property.id, e)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(255,255,255,0.8)'
            }}
          >
            {isFavorite ? (
              <FavoriteIcon color="error" />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
        </Box>

        <CardContent>
          {/* Title */}
          <Typography variant="h6" gutterBottom noWrap>
            {property.title || `Property ${property.id}`}
          </Typography>

          {/* Description */}
          {property.shortDescription && (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {property.shortDescription}
            </Typography>
          )}

          {/* Property details */}
          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
            {property.areaSqm && (
              <Chip
                icon={<AreaIcon />}
                label={`${property.areaSqm}m²`}
                size="small"
                variant="outlined"
              />
            )}
            {property.bedrooms && property.bedrooms > 0 && (
              <Chip
                icon={<BedIcon />}
                label={`${property.bedrooms} bed`}
                size="small"
                variant="outlined"
              />
            )}
            {property.bathrooms && property.bathrooms > 0 && (
              <Chip
                icon={<BathIcon />}
                label={`${property.bathrooms} bath`}
                size="small"
                variant="outlined"
              />
            )}
          </Stack>

          {/* Price */}
          <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
            {formatPrice(property.priceMonth)}/month
          </Typography>

          {/* Address */}
          {property.addressText && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary" noWrap>
                {property.addressText}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    )
  }

  // Loading skeleton
  const LoadingSkeleton = () => (
    <Grid container spacing={3}>
      {Array.from({ length: 6 }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <Skeleton variant="rectangular" height={240} />
            <CardContent>
              <Skeleton variant="text" height={32} />
              <Skeleton variant="text" height={20} />
              <Skeleton variant="text" height={20} />
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Skeleton variant="rounded" width={60} height={24} />
                <Skeleton variant="rounded" width={80} height={24} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FavoriteIcon />
          {t('favourites')} ({favoriteIds.length})
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <LoadingSkeleton />
        ) : favoriteProperties.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <HomeIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {favoriteIds.length === 0 
                ? 'No favorite properties yet'
                : 'Some favorite properties may no longer be available'
              }
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Browse properties and click the heart icon to add them to your favorites.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate(ROUTES.HOME)}
            >
              Browse Properties
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {favoriteProperties.map((property) => (
              <Grid item xs={12} sm={6} md={4} key={property.id}>
                <PropertyCard property={property} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    )
  }

export default FavouritesPage