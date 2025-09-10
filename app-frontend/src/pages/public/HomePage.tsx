// app-frontend/src/pages/public/HomePage.tsx
import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  Stack,
  Skeleton,
  Alert,
  Pagination
} from '@mui/material'
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  LocationOn as LocationIcon,
  AspectRatio as AreaIcon,
  Bed as BedIcon,
  Shower as BathIcon,
  Star as FeaturedIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PropertyService } from '../../services/propertyService'
import { CompanyService } from '../../services/companyService'
import { FavoritesService } from '../../services/favoritesService'
import type { PropertySummary, Locale } from '../../types'

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  
  // States
  const [properties, setProperties] = useState<PropertySummary[]>([])
  const [heroImageUrl, setHeroImageUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProperties, setTotalProperties] = useState(0)

  // Effects
  useEffect(() => {
    loadProperties()
  }, [i18n.language, currentPage])

  useEffect(() => {
    loadHeroImage()
  }, [i18n.language])

  useEffect(() => {
    loadFavorites()
    const handleStorageChange = () => loadFavorites()
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Functions
  const loadProperties = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const locale = i18n.language as Locale
      const response = await PropertyService.getPublishedProperties(undefined, locale, currentPage - 1, 9)
      
      setProperties(response.items || [])
      setTotalPages(response.totalPages || Math.ceil((response.totalPages || 0) / 9) || 1)
      setTotalProperties(response.totalElements || 0)
      
    } catch (err) {
      console.error('Failed to load properties:', err)
      setError('Failed to load properties')
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  const loadHeroImage = async () => {
    try {
      const companyInfo = await CompanyService.getCompanyInfo(i18n.language as Locale)
      setHeroImageUrl(companyInfo.hero_image_url || '')
    } catch (err) {
      console.error('Failed to load hero image:', err)
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

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price)
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
      {Array.from({ length: 9 }).map((_, index) => (
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

        {/* Featured icon */}
        {property.isFeatured && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: 'warning.main',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 1
            }}
          >
            <FeaturedIcon sx={{ color: 'white', fontSize: 18 }} />
          </Box>
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
        {/* Title (hiện đầy đủ, không cắt) */}
        <Typography variant="h6" gutterBottom>
          {property.title || `Property ${property.id}`}
        </Typography>

        {/* ❌ Bỏ shortDescription */}

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
          minHeight: '36vh',
          position: 'relative',
          ...(heroImageUrl ? {
            backgroundImage: `url(${heroImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          } : {
            bgcolor: 'primary.main',
            backgroundImage: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            display: 'flex',
            alignItems: 'center'
          })
        }}
      >
        {/* Show text only when no hero image */}
        {!heroImageUrl && (
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', color: 'white' }}>
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
        )}
      </Box>

      {/* Properties Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

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
            {/* Properties Grid */}
            <Grid container spacing={3}>
              {properties.map((property) => (
                <Grid item xs={12} sm={6} md={4} key={property.id}>
                  <PropertyCard property={property} />
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}

            {/* Properties count info */}
            {totalProperties > 0 && (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                   {(currentPage - 1) * 9 + 1}-{Math.min(currentPage * 9, totalProperties)} / {totalProperties} 
                </Typography>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  )
}

export default HomePage