// app-frontend/src/components/layout/PublicLayout.tsx
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
  Stack,
  Divider,
  Grid
} from '@mui/material'
import {
  Language as LanguageIcon,
  Favorite as FavoriteIcon,
  KeyboardArrowDown as ArrowDownIcon
} from '@mui/icons-material'
import { APP_NAME, ROUTES, STORAGE_KEYS } from '../../config/constants'
import { useContentPages } from '../../hooks/useContentPages'
import { FavoritesService } from '../../services/favoritesService' // ⚠️ THÊM import
import { FloatingContactIcons } from '../common/FloatingContactIcons'
import type { Locale } from '../../types'

interface PublicLayoutProps {
  children: React.ReactNode
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t, i18n } = useTranslation()
  
  const [languageMenu, setLanguageMenu] = useState<null | HTMLElement>(null)
  const [guideMenu, setGuideMenu] = useState<null | HTMLElement>(null)
  const [favoriteCount, setFavoriteCount] = useState(0)

  // Fetch content pages for guide dropdown
  const { data: contentPages, isLoading: contentLoading } = useContentPages(i18n.language as Locale)

  useEffect(() => {
    // ⚠️ SỬA: Load favorites and listen to storage changes
    const updateFavoriteCount = () => {
      setFavoriteCount(FavoritesService.getFavoritesCount())
    }

    // Initial load
    updateFavoriteCount()
    
    // Listen to storage changes
    const handleStorageChange = () => {
      updateFavoriteCount()
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, []) // ⚠️ SỬA: Bỏ dependency location.pathname

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

  const handleGuideItemClick = (slug: string) => {
    navigate(`/content/${slug}`)
    setGuideMenu(null)
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
      {/* Header */}
      <AppBar position="sticky" sx={{ backgroundColor: '#fff', color: 'text.primary', boxShadow: 1 }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            {/* Left: Logo */}
            <Typography
              variant="h6"
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

            {/* Center: Navigation (Desktop) */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
              <Button
                color={isActivePage(ROUTES.HOME) ? 'primary' : 'inherit'}
                onClick={() => handleNavigation(ROUTES.HOME)}
                sx={{ textTransform: 'none', fontSize: '1rem' }}
              >
                {t('home')}
              </Button>
              
              <Button
                color={isActivePage('/properties') ? 'primary' : 'inherit'}
                onClick={() => handleNavigation('/properties')}
                sx={{ textTransform: 'none', fontSize: '1rem' }}
              >
                {t('properties')}
              </Button>
              
              <Button
                endIcon={<ArrowDownIcon />}
                onClick={(e) => setGuideMenu(e.currentTarget)}
                sx={{ textTransform: 'none', fontSize: '1rem' }}
              >
                {t('guide')}
              </Button>

              <Menu
                anchorEl={guideMenu}
                open={Boolean(guideMenu)}
                onClose={() => setGuideMenu(null)}
              >
                <MenuItem onClick={() => navigate('/guides')}>
                  <Typography>{t('allGuides')}</Typography>
                </MenuItem>
                {!contentLoading && contentPages && (
                  <>
                    <Divider />
                    {contentPages.slice(0, 5).map((page) => (
                      <MenuItem
                        key={page.slug}
                        onClick={() => handleGuideItemClick(page.slug)}
                      >
                        <Typography variant="body2">
                          {page.translations[i18n.language as Locale]?.title || page.slug}
                        </Typography>
                      </MenuItem>
                    ))}
                  </>
                )}
              </Menu>
              
              <Button
                color={isActivePage(ROUTES.CONTACT) ? 'primary' : 'inherit'}
                onClick={() => handleNavigation(ROUTES.CONTACT)}
                sx={{ textTransform: 'none', fontSize: '1rem' }}
              >
                {t('contact')}
              </Button>
            </Box>

            {/* Right: Language & Favorites */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Language Switcher */}
              <Button
                startIcon={<LanguageIcon />}
                onClick={(e) => setLanguageMenu(e.currentTarget)}
                sx={{ textTransform: 'none', color: 'text.primary', display: { xs: 'none', sm: 'flex' } }}
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
          <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
            <Button
              size="small"
              color={isActivePage(ROUTES.HOME) ? 'primary' : 'inherit'}
              onClick={() => handleNavigation(ROUTES.HOME)}
            >
              {t('home')}
            </Button>
            
            <Button
              size="small"
              color={isActivePage('/properties') ? 'primary' : 'inherit'}
              onClick={() => handleNavigation('/properties')}
            >
              {t('properties')}
            </Button>
            
            <Button
              size="small"
              color={isActivePage('/content') ? 'primary' : 'inherit'}
              onClick={() => navigate('/guides')}
            >
              {t('guide')}
            </Button>
            
            <Button
              size="small"
              color={isActivePage(ROUTES.CONTACT) ? 'primary' : 'inherit'}
              onClick={() => handleNavigation(ROUTES.CONTACT)}
            >
              {t('contact')}
            </Button>

            {/* Mobile Language Switcher */}
            <Button
              size="small"
              onClick={(e) => setLanguageMenu(e.currentTarget)}
            >
              {currentLanguage.flag}
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>

      {/* Floating Contact Icons */}
      <FloatingContactIcons />

      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: 'grey.900', color: 'white', py: 4, mt: 'auto' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom>
                {APP_NAME}
              </Typography>
              <Typography variant="body2" color="grey.400">
                {t('footerDescription')}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom>
                {t('quickLinks')}
              </Typography>
              <Stack spacing={1}>
                <Button color="inherit" onClick={() => handleNavigation(ROUTES.HOME)} sx={{ justifyContent: 'flex-start' }}>
                  {t('home')}
                </Button>
                <Button color="inherit" onClick={() => handleNavigation('/properties')} sx={{ justifyContent: 'flex-start' }}>
                  {t('properties')}
                </Button>
                <Button color="inherit" onClick={() => handleNavigation(ROUTES.CONTACT)} sx={{ justifyContent: 'flex-start' }}>
                  {t('contact')}
                </Button>
              </Stack>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom>
                {t('contact')}
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" color="grey.400">
                  📧 q.apartment09hbm@gmail.com
                </Typography>
                <Typography variant="body2" color="grey.400">
                  📱 0903228571
                </Typography>
                <Typography variant="body2" color="grey.400">
                  💬 Zalo: 0903228571
                </Typography>
              </Stack>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom>
                {t('followUs')}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Typography variant="body2" color="grey.400">
                  🌐 {t('comingSoon')}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3, borderColor: 'grey.700' }} />
          
          <Typography variant="body2" color="grey.400" align="center">
            © 2024 {APP_NAME}. {t('allRightsReserved')}
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}

export default PublicLayout