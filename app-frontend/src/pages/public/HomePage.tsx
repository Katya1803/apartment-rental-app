// src/pages/public/HomePage.tsx - VIẾT LẠI CLEAN
import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Chip,
  Stack,
  Skeleton,
  Alert
} from '@mui/material'
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  LocationOn as LocationIcon,
  AspectRatio as AreaIcon,
  Bed as BedIcon,
  Shower as BathIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PropertyService } from '../../services/propertyService'
import { FavoritesService } from '../../services/favoritesService'
import { ROUTES } from '../../config/constants'
import type { PropertySummary, Locale } from '../../types'

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  
  // Simple state
  const [properties, setProperties] = useState<PropertySummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<number[]>([])

  // Load properties
  useEffect(() => {
    loadProperties()
  }, [i18n.language])

  // Load favorites
  useEffect(() => {
    loadFavorites()
    const handleStorageChange = () => loadFavorites()
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const loadProperties = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const locale = i18n.language as Locale
      
      // Load all published properties (limit 12 for homepage)
      const response = await PropertyService.getPublishedProperties(undefined, locale, 0, 12)
      setProperties(response.items || [])
      
    } catch (err) {
      console.error('Failed to load properties:', err)
      setError('Failed to load properties')
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  const loadFavorites = () => {
    setFavorites(FavoritesService.getFavorites())
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

  // Property card component
  const PropertyCard = ({ property }: { property: PropertySummary }) => {
    const isFavorite = favorites.includes(property.id)

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

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          backgroundImage: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
              Find Your Perfect Home
            </Typography>
            <Typography variant="h5" paragraph sx={{ opacity: 0.9 }}>
              Quality apartments and rooms in Vietnam
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>
              Browse verified properties with multilingual support
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Properties Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Available Properties
        </Typography>

        {loading ? (
          <LoadingSkeleton />
        ) : properties.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No properties available
            </Typography>
            <Typography color="text.secondary">
              Please check back later or contact us for more information.
            </Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {properties.map((property) => (
                <Grid item xs={12} sm={6} md={4} key={property.id}>
                  <PropertyCard property={property} />
                </Grid>
              ))}
            </Grid>

            {/* View All Button */}
            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate(ROUTES.PROPERTIES)}
                sx={{ px: 4, py: 1.5 }}
              >
                View All Properties
              </Button>
            </Box>
          </>
        )}
      </Container>
    </Box>
  )
}

export default HomePage