import React from 'react'
import { Box, AppBar, Toolbar, Typography, Button, Container, IconButton, Menu, MenuItem } from '@mui/material'
import { Language as LanguageIcon, Favorite as FavoriteIcon } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../../hooks/useLocale'
import { FavouriteService } from '../../services/favouriteService'
import { ROUTES, APP_NAME } from '../../config/constants'
import type { Locale } from '../../types'

interface PublicLayoutProps {
  children: React.ReactNode
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { currentLocale, changeLocale, supportedLocales } = useLocale()
  
  const [langAnchor, setLangAnchor] = React.useState<null | HTMLElement>(null)
  const [favouriteCount, setFavouriteCount] = React.useState(0)

  React.useEffect(() => {
    // Update favourite count
    setFavouriteCount(FavouriteService.getFavouriteCount())
    
    // Listen for storage changes to update count
    const handleStorageChange = () => {
      setFavouriteCount(FavouriteService.getFavouriteCount())
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setLangAnchor(event.currentTarget)
  }

  const handleLanguageClose = () => {
    setLangAnchor(null)
  }

  const handleLanguageSelect = (locale: Locale) => {
    changeLocale(locale)
    handleLanguageClose()
  }

  const getLanguageLabel = (locale: string) => {
    switch (locale) {
      case 'vi': return 'Tiếng Việt'
      case 'en': return 'English'
      case 'ja': return '日本語'
      default: return locale.toUpperCase()
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography 
            variant="h6" 
            component={Link} 
            to={ROUTES.HOME}
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none', 
              color: 'inherit',
              fontWeight: 'bold'
            }}
          >
            {APP_NAME}
          </Typography>

          {/* Navigation Links */}
          <Button 
            color="inherit" 
            component={Link} 
            to={ROUTES.HOME}
          >
            {t('home')}
          </Button>
          
          <Button 
            color="inherit" 
            component={Link} 
            to={ROUTES.PROPERTIES}
          >
            {t('apartments')}
          </Button>
          
          <Button 
            color="inherit" 
            component={Link} 
            to={ROUTES.ROOMS}
          >
            {t('rooms')}
          </Button>
          
          <Button 
            color="inherit" 
            component={Link} 
            to={ROUTES.CONTACT}
          >
            {t('contact')}
          </Button>

          {/* Favourites */}
          <IconButton 
            color="inherit"
            onClick={() => navigate(ROUTES.FAVOURITES)}
            sx={{ position: 'relative' }}
          >
            <FavoriteIcon />
            {favouriteCount > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  bgcolor: 'error.main',
                  color: 'white',
                  borderRadius: '50%',
                  width: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 'bold'
                }}
              >
                {favouriteCount > 99 ? '99+' : favouriteCount}
              </Box>
            )}
          </IconButton>

          {/* Language Selector */}
          <IconButton 
            color="inherit"
            onClick={handleLanguageClick}
          >
            <LanguageIcon />
          </IconButton>
          
          <Menu
            anchorEl={langAnchor}
            open={Boolean(langAnchor)}
            onClose={handleLanguageClose}
          >
            {supportedLocales.map((locale: Locale) => (
              <MenuItem 
                key={locale}
                selected={locale === currentLocale}
                onClick={() => handleLanguageSelect(locale)}
              >
                {getLanguageLabel(locale)}
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          bgcolor: 'grey.100', 
          py: 4, 
          mt: 'auto'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 {APP_NAME}. {t('allRightsReserved')}
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}

export default PublicLayout