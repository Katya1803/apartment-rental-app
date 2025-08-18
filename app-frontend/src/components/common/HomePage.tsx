// src/pages/public/HomePage.tsx
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
import PublicLayout from '../../components/layout/PublicLayout'
import { ROUTES } from '../../config/constants'
import type { PropertySummary, Locale } from '../../types'

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  
  // State
  const [featuredProperties, setFeaturedProperties] = useState<PropertySummary[]>([])
  const [allProperties, setAllProperties] = useState<PropertySummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<number[]>([])

  // Load data
  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const locale = i18n.language as Locale
        
        // Load featured properties first
        const featured = await PropertyService.getFeaturedProperties(locale)
        setFeaturedProperties(featured)
        
        // Load all properties (limited for homepage)
        const allProps = await PropertyService.getPublishedProperties(undefined, locale, 0, 12)
        setAllProperties(allProps.content)
        
      } catch (error) {
        console.error('Failed to load properties:', error)
        setError('Failed to load properties. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadProperties()
  }, [i18n.language])

  // Load favorites
  useEffect(() => {
    const loadFavorites = () => {
      setFavorites(FavoritesService.getFavorites())
    }

    loadFavorites()
    
    // Listen for favorites changes
    window.addEventListener('storage', loadFavorites)
    return () => window.removeEventListener('storage', loadFavorites)
  }, [])

  // Handle favorite toggle
  const handleFavoriteToggle = (propertyId: number, event: React.MouseEvent) => {
    event.stopPropagation() // Prevent card click
    FavoritesService.toggleFavorite(propertyId)
    setFavorites(FavoritesService.getFavorites())
  }

  // Handle property click
  const handlePropertyClick = (slug: string) => {
    navigate(`/properties/${slug}`)
  }

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price)
  }

  // Get property type label
  const getPropertyTypeLabel = (type: string) => {
    return t(`propertyTypes.${type}`) || type
  }

  // Get property type icon
  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'APARTMENT': return '🏢'
      case 'ROOM': return '🏠'
      case 'STUDIO': return '🏙️'
      case 'HOUSE': return '🏘️'
      default: return '🏠'
    }
  }

  // Property Card Component
  const PropertyCard: React.FC<{ property: PropertySummary }> = ({ property }) => {
    const isFavorite = favorites.includes(property.id)
    
    return (
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 3
          }
        }}
        onClick={() => handlePropertyClick(property.slug)}
      >
        {/* Property Image */}
        <Box sx={{ position: 'relative', height: 240 }}>
          {property.coverImageUrl ? (
            <CardMedia
              component="img"
              height="240"
              image={property.coverImageUrl}
              alt={property.title}
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
          
          {/* Featured Badge */}
          {property.isFeatured && (
            <Chip
              label="Featured"
              color="primary"
              size="small"
              sx={{ position: 'absolute', top: 8, left: 8 }}
            />
          )}
          
          {/* Property Type Badge */}
          <Chip
            label={getPropertyTypeLabel(property.propertyType)}
            size="small"
            sx={{ 
              position: 'absolute', 
              top: 8, 
              right: 48,
              bgcolor: 'rgba(255,255,255,0.9)'
            }}
          />
          
          {/* Favorite Button */}
          <IconButton
            onClick={(e) => handleFavoriteToggle(property.id, e)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(255,255,255,0.8)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
            }}
          >
            {isFavorite ? (
              <FavoriteIcon color="error" />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 2 }}>
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
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: '2.5em'
              }}
            >
              {property.shortDescription}
            </Typography>
          )}

          {/* Property Details */}
          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
            {property.areaSqm && (
              <Chip
                icon={<AreaIcon />}
                label={`${property.areaSqm}m²`}
                size="small"
                variant="outlined"
              />
            )}
            {property.bedrooms !== undefined && property.bedrooms > 0 && (
              <Chip
                icon={<BedIcon />}
                label={`${property.bedrooms} ${t('bedrooms')}`}
                size="small"
                variant="outlined"
              />
            )}
            {property.bathrooms !== undefined && property.bathrooms > 0 && (
              <Chip
                icon={<BathIcon />}
                label={`${property.bathrooms} ${t('bathrooms')}`}
                size="small"
                variant="outlined"
              />
            )}
          </Stack>

          {/* Price */}
          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
            {formatPrice(property.priceMonth)}{t('pricePerMonth')}
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

  // Loading Skeleton
  const PropertySkeleton = () => (
    <Card sx={{ height: '100%' }}>
      <Skeleton variant="rectangular" height={240} />
      <CardContent>
        <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 1 }} />
        <Skeleton variant="text" sx={{ mb: 2 }} />
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Skeleton variant="rounded" width={60} height={24} />
          <Skeleton variant="rounded" width={80} height={24} />
        </Stack>
        <Skeleton variant="text" sx={{ fontSize: '1.25rem', mb: 1 }} />
        <Skeleton variant="text" width="60%" />
      </CardContent>
    </Card>
  )

  return (
    <PublicLayout>
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
                {t('home')}
              </Typography>
              <Typography variant="h5" paragraph sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
                Find your perfect apartment or room in Vietnam
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: 800, mx: 'auto' }}>
                Browse quality properties with multilingual support for international customers
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

          {/* Featured Properties */}
          {featuredProperties.length > 0 && (
            <Box sx={{ mb: 6 }}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
                Featured Properties
              </Typography>
              
              <Grid container spacing={3}>
                {featuredProperties.slice(0, 3).map((property) => (
                  <Grid item xs={12} sm={6} md={4} key={property.id}>
                    <PropertyCard property={property} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* All Properties */}
          <Box>
            <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
              {t('properties')}
            </Typography>

            {loading ? (
              <Grid container spacing={3}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <PropertySkeleton />
                  </Grid>
                ))}
              </Grid>
            ) : allProperties.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {t('noData')}
                </Typography>
                <Typography color="text.secondary">
                  No properties available at the moment.
                </Typography>
              </Box>
            ) : (
              <>
                <Grid container spacing={3}>
                  {allProperties.map((property) => (
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
          </Box>
        </Container>
      </Box>
    </PublicLayout>
  )
}

export default HomePage