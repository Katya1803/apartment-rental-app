// src/pages/public/HomePage.tsx
import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Alert,
  Skeleton
} from '@mui/material'
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { PropertyService } from '../../services/propertyService'
import { FavouriteService } from '../../services/favouriteService'
import { useLocale } from '../../hooks/useLocale'
import { formatPrice, getPropertyTypeLabel } from '../../utils/formatters'
import { ROUTES } from '../../config/constants'
import type { PropertySummary } from '../../types'

const HomePage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { currentLocale } = useLocale()
  
  const [featuredProperties, setFeaturedProperties] = useState<PropertySummary[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favourites, setFavourites] = useState<number[]>([])

  useEffect(() => {
    loadFeaturedProperties()
    loadFavourites()
  }, [currentLocale])

  const loadFeaturedProperties = async () => {
    try {
      setLoading(true)
      setError(null)
      const properties = await PropertyService.getFeaturedProperties(currentLocale)
      setFeaturedProperties(properties)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  const loadFavourites = () => {
    setFavourites(FavouriteService.getFavouriteIds())
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleSearchKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  const toggleFavourite = (propertyId: number) => {
    FavouriteService.toggleFavourite(propertyId)
    loadFavourites()
  }

  const handlePropertyClick = (slug: string) => {
    navigate(`/properties/${slug}`)
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
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                {t('home')}
              </Typography>
              <Typography variant="h5" paragraph sx={{ opacity: 0.9 }}>
                Find your perfect apartment or room in Vietnam
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8, mb: 4 }}>
                Browse thousands of verified properties with multilingual support
              </Typography>
              
              {/* Search Bar */}
              <Box sx={{ maxWidth: 500 }}>
                <TextField
                  fullWidth
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  sx={{
                    bgcolor: 'white',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { border: 'none' }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          variant="contained"
                          onClick={handleSearch}
                          sx={{ minWidth: 'auto', px: 3 }}
                        >
                          {t('search')}
                        </Button>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/hero-image.jpg"
                alt="Vietnam apartments"
                sx={{
                  width: '100%',
                  height: 300,
                  objectFit: 'cover',
                  borderRadius: 2,
                  display: { xs: 'none', md: 'block' }
                }}
                onError={(e) => {
                  // Hide image if not found
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Quick Links */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                textAlign: 'center', 
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}
              onClick={() => navigate(ROUTES.PROPERTIES)}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  🏢 {t('apartments')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Full apartments for rent
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}
              onClick={() => navigate(ROUTES.ROOMS)}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  🏠 {t('rooms')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Individual rooms for rent
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}
              onClick={() => navigate(ROUTES.FAVOURITES)}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  ❤️ {t('favourites')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your saved properties
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}
              onClick={() => navigate(ROUTES.CONTACT)}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  📞 {t('contact')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Get help and support
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Featured Properties */}
      <Container maxWidth="lg" sx={{ pb: 6 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            {t('featured')} {t('properties')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Discover our handpicked premium properties
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {loading ? (
            // Loading Skeletons
            [...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton variant="text" height={32} />
                    <Skeleton variant="text" height={24} />
                    <Skeleton variant="text" height={20} width="60%" />
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : featuredProperties.length === 0 ? (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  {t('noPropertiesFound')}
                </Typography>
              </Box>
            </Grid>
          ) : (
            featuredProperties.map((property) => (
              <Grid item xs={12} sm={6} md={4} key={property.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': { 
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                  onClick={() => handlePropertyClick(property.slug)}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={property.coverImageUrl || '/placeholder-property.jpg'}
                      alt={property.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-property.jpg'
                      }}
                    />
                    
                    {/* Favourite Button */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'white',
                        borderRadius: '50%',
                        p: 0.5,
                        cursor: 'pointer',
                        boxShadow: 1
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavourite(property.id)
                      }}
                    >
                      {favourites.includes(property.id) ? (
                        <FavoriteIcon color="error" />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                    </Box>

                    {/* Property Type Badge */}
                    <Chip
                      label={getPropertyTypeLabel(property.propertyType, currentLocale)}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        bgcolor: 'primary.main',
                        color: 'white'
                      }}
                    />

                    {/* Featured Badge */}
                    {property.isFeatured && (
                      <Chip
                        label="⭐ Featured"
                        size="small"
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          left: 8,
                          bgcolor: 'warning.main',
                          color: 'white'
                        }}
                      />
                    )}
                  </Box>

                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" gutterBottom noWrap>
                      {property.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary" noWrap sx={{ ml: 0.5 }}>
                        {property.addressText}
                      </Typography>
                    </Box>

                    <Typography variant="h6" color="primary" gutterBottom>
                      {formatPrice(property.priceMonth, currentLocale)} {t('vnd')}/{t('perMonth')}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {property.areaSqm && (
                        <Chip 
                          label={`${property.areaSqm} ${t('sqm')}`} 
                          size="small" 
                          variant="outlined" 
                        />
                      )}
                      {property.bedrooms && (
                        <Chip 
                          label={`${property.bedrooms} ${t('bedrooms')}`} 
                          size="small" 
                          variant="outlined" 
                        />
                      )}
                      {property.bathrooms && (
                        <Chip 
                          label={`${property.bathrooms} ${t('bathrooms')}`} 
                          size="small" 
                          variant="outlined" 
                        />
                      )}
                    </Box>

                    {property.shortDescription && (
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mt: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {property.shortDescription}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        {/* View All Button */}
        {featuredProperties.length > 0 && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate(ROUTES.PROPERTIES)}
            >
              View All Properties
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default HomePage