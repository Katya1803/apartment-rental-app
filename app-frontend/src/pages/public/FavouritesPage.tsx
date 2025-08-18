import React, { useState, useEffect } from 'react'
import { Container, Typography, Box, Paper, Grid, Button } from '@mui/material'
import { Favorite as FavoriteIcon, Home as HomeIcon } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { FavoritesService } from '../../services/favoritesService'
import { ROUTES } from '../../config/constants'

const FavouritesPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [favoritesCount, setFavoritesCount] = useState(0)

  useEffect(() => {
    const updateCount = () => {
      setFavoritesCount(FavoritesService.getFavoritesCount())
    }

    updateCount()
    
    const handleStorageChange = () => {
      updateCount()
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FavoriteIcon />
        {t('favourites')} ({favoritesCount})
      </Typography>
      
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <HomeIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Your favorite properties will appear here
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
    </Container>
  )
}

export default FavouritesPage