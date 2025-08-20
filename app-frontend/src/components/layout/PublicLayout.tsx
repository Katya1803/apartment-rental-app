// app-frontend/src/components/layout/PublicLayout.tsx - UPDATED NAVIGATION
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Stack
} from '@mui/material'
import {
  Language as LanguageIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material'
import { APP_NAME, ROUTES, STORAGE_KEYS } from '../../config/constants'
import type { Locale } from '../../types'

interface PublicLayoutProps {
  children: React.ReactNode
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t, i18n } = useTranslation()
  
  const [languageMenu, setLanguageMenu] = useState<null | HTMLElement>(null)
  const [favoriteCount, setFavoriteCount] = useState(0)

  useEffect(() => {
    // Update favorite count from localStorage
    const favorites = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVOURITES) || '[]')
    setFavoriteCount(favorites.length)
  }, [location.pathname])

  const isActivePage = (path: string): boolean => {
    if (path === ROUTES.HOME) {
      return location.pathname === ROUTES.HOME
    }
    return location.pathname.startsWith(path)
  }

  const handleLanguageChange = (locale: Locale) => {
    i18n.changeLanguage(locale)
    localStorage.setItem(STORAGE_KEYS.LOCALE, locale)
    setLanguageMenu(null)
  }

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  // Language options
  const languages = [
    { code: 'vi' as Locale, label: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en' as Locale, label: 'English', flag: '🇺🇸' },
    { code: 'ja' as Locale, label: '日本語', flag: '🇯🇵' }
  ]

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Bar */}
      <AppBar position="static" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: 1 }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            {/* Left: Logo */}
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                cursor: 'pointer'
              }}
              onClick={() => handleNavigation(ROUTES.HOME)}
            >
              {APP_NAME}
            </Typography>

            {/* Center: Navigation Tabs */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              <Button
                color={isActivePage(ROUTES.HOME) ? 'primary' : 'inherit'}
                onClick={() => handleNavigation(ROUTES.HOME)}
                sx={{ textTransform: 'none', fontSize: '1rem' }}
              >
                {t('home')}
              </Button>
              
              <Button
                color={isActivePage(ROUTES.GUIDE) ? 'primary' : 'inherit'}
                onClick={() => handleNavigation(ROUTES.GUIDE)}
                sx={{ textTransform: 'none', fontSize: '1rem' }}
              >
                {t('guide')}
              </Button>
              
              <Button
                color={isActivePage(ROUTES.INFO) ? 'primary' : 'inherit'}
                onClick={() => handleNavigation(ROUTES.INFO)}
                sx={{ textTransform: 'none', fontSize: '1rem' }}
              >
                {t('info')}
              </Button>
            </Box>

            {/* Right: Language Switcher & Favorites */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Language Switcher */}
              <Button
                startIcon={<LanguageIcon />}
                onClick={(e) => setLanguageMenu(e.currentTarget)}
                sx={{ textTransform: 'none', color: 'text.primary' }}
              >
                <span style={{ marginRight: 4 }}>{currentLanguage.flag}</span>
                {currentLanguage.label}
              </Button>

              <Menu
                anchorEl={languageMenu}
                open={Boolean(languageMenu)}
                onClose={() => setLanguageMenu(null)}
              >
                {languages.map((lang) => (
                  <MenuItem
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    selected={lang.code === i18n.language}
                  >
                    <span style={{ marginRight: 8 }}>{lang.flag}</span>
                    {lang.label}
                  </MenuItem>
                ))}
              </Menu>

              {/* Favorites Icon */}
              <IconButton
                color="primary"
                onClick={() => handleNavigation(ROUTES.FAVOURITES)}
                title={t('favourites')}
              >
                <Badge badgeContent={favoriteCount} color="error">
                  <FavoriteIcon />
                </Badge>
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Navigation */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, bgcolor: 'grey.50', py: 1 }}>
        <Container maxWidth="lg">
          <Stack direction="row" spacing={1} justifyContent="center">
            <Button
              size="small"
              color={isActivePage(ROUTES.HOME) ? 'primary' : 'inherit'}
              onClick={() => handleNavigation(ROUTES.HOME)}
            >
              {t('home')}
            </Button>
            
            <Button
              size="small"
              color={isActivePage(ROUTES.GUIDE) ? 'primary' : 'inherit'}
              onClick={() => handleNavigation(ROUTES.GUIDE)}
            >
              {t('guide')}
            </Button>
            
            <Button
              size="small"
              color={isActivePage(ROUTES.INFO) ? 'primary' : 'inherit'}
              onClick={() => handleNavigation(ROUTES.INFO)}
            >
              {t('info')}
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: 'grey.100', py: 3, mt: 'auto' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 {APP_NAME}. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}

export default PublicLayout