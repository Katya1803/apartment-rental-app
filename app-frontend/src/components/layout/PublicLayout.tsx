// app-frontend/src/components/layout/PublicLayout.tsx - FIXED VERSION
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
  Grid,
  CircularProgress
} from '@mui/material'
import {
  Language as LanguageIcon,
  Favorite as FavoriteIcon,
  KeyboardArrowDown as ArrowDownIcon
} from '@mui/icons-material'
import { APP_NAME, ROUTES, STORAGE_KEYS } from '../../config/constants'
import { useContentPages } from '../../hooks/useContentPages'
import { FavoritesService } from '../../services/favoritesService'
import { FloatingContactIcons } from '../common/FloatingContactIcons'
import { CompanyService, type CompanyInfo } from '../../services/companyService'
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
  
  // 🔧 NEW: Company info state
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null)
  const [companyInfoLoading, setCompanyInfoLoading] = useState(true)

  // Fetch content pages for guide dropdown
  const { data: contentPages, isLoading: contentLoading } = useContentPages(i18n.language as Locale)

  useEffect(() => {
    // Load favorites and listen to storage changes
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
  }, [])

  // 🔧 NEW: Load company info on mount and language change
  useEffect(() => {
    loadCompanyInfo()
  }, [i18n.language])

  const loadCompanyInfo = async () => {
    try {
      setCompanyInfoLoading(true)
      const info = await CompanyService.getCompanyInfo(i18n.language as Locale)
      setCompanyInfo(info)
    } catch (error) {
      console.error('Failed to load company info:', error)
      // Set fallback data if API fails
      setCompanyInfo({
        companyName: 'Q Apartment',
        companyEmail: 'q.apartment09hbm@gmail.com',
        companyPhone: '0903228571',
        companyAddress: 'Hanoi, Vietnam',
        facebookUrl: '#',
        zaloPhone: '0903228571'
      })
    } finally {
      setCompanyInfoLoading(false)
    }
  }

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
            {/* Left: Logo & Company Name */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Vite Logo */}
              <img 
                src="/vite.svg" 
                alt="Logo" 
                style={{ width: 32, height: 32 }}
              />
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
            </Box>

            {/* Center: Navigation (Desktop) - Only Home & Guide */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
              <Button
                color={isActivePage(ROUTES.HOME) ? 'primary' : 'inherit'}
                onClick={() => handleNavigation(ROUTES.HOME)}
                sx={{ textTransform: 'none', fontSize: '1rem' }}
              >
                {t('home')}
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
              color={isActivePage('/content') ? 'primary' : 'inherit'}
              onClick={() => navigate('/guides')}
            >
              {t('guide')}
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

      {/* Footer - 🔧 SIMPLIFIED: Only Contact & Address with Dynamic Data */}
      <Box component="footer" sx={{ bgcolor: 'grey.900', color: 'white', py: 4, mt: 'auto' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {/* Contact Section */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" gutterBottom>
                {t('contact')}
              </Typography>
              
              {companyInfoLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} />
                  <Typography variant="body2" color="grey.400">
                    Loading...
                  </Typography>
                </Box>
              ) : companyInfo ? (
                <Stack spacing={1}>
                  <Typography variant="body2" color="grey.400" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    📧 Email: {companyInfo.companyEmail}
                  </Typography>
                  <Typography variant="body2" color="grey.400" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    📱 Phone: {companyInfo.companyPhone}
                  </Typography>
                  <Typography variant="body2" color="grey.400" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    💬 Zalo: {companyInfo.zaloPhone || companyInfo.companyPhone}
                  </Typography>
                </Stack>
              ) : (
                <Typography variant="body2" color="grey.400">
                  {t('contactInfo')}
                </Typography>
              )}
            </Grid>
            
            {/* Address Section */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" gutterBottom>
                {t('address')}
              </Typography>
              
              {companyInfoLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} />
                  <Typography variant="body2" color="grey.400">
                    Loading...
                  </Typography>
                </Box>
              ) : companyInfo ? (
                <Typography variant="body2" color="grey.400" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  📍 {companyInfo.companyAddress}
                </Typography>
              ) : (
                <Typography variant="body2" color="grey.400">
                  Hanoi, Vietnam
                </Typography>
              )}
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3, borderColor: 'grey.700' }} />
          
          {/* Copyright - Always in English */}
          <Typography variant="body2" color="grey.400" align="center">
            © 2024 {APP_NAME}. All rights reserved
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}

export default PublicLayout