// src/components/layout/PublicLayout.tsx
import React, { useState, useEffect } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Divider,
  Link,
  Grid,
  Paper,
  Stack
} from '@mui/material'
import {
  Language as LanguageIcon,
  Favorite as FavoriteIcon,
  Facebook as FacebookIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CompanyService } from '../../services/companyService'
import type { CompanyInfo } from '../../services/companyService'
import { ROUTES, STORAGE_KEYS, APP_NAME } from '../../config/constants'
import type { Locale } from '../../types'

interface PublicLayoutProps {
  children: React.ReactNode
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t, i18n } = useTranslation()
  
  // State
  const [languageMenu, setLanguageMenu] = useState<null | HTMLElement>(null)
  const [favoriteCount, setFavoriteCount] = useState(0)
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null)

  // Load favorites count from localStorage
  useEffect(() => {
    const updateFavoriteCount = () => {
      const favorites = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVOURITES) || '[]')
      setFavoriteCount(favorites.length)
    }

    updateFavoriteCount()
    
    // Listen for storage changes
    window.addEventListener('storage', updateFavoriteCount)
    return () => window.removeEventListener('storage', updateFavoriteCount)
  }, [])

  // Load company info
  useEffect(() => {
    const loadCompanyInfo = async () => {
      try {
        const info = await CompanyService.getCompanyInfo(i18n.language as Locale)
        setCompanyInfo(info)
      } catch (error) {
        console.error('Failed to load company info:', error)
      }
    }

    loadCompanyInfo()
  }, [i18n.language])

  // Language change handler
  const handleLanguageChange = (locale: Locale) => {
    i18n.changeLanguage(locale)
    localStorage.setItem(STORAGE_KEYS.LOCALE, locale)
    setLanguageMenu(null)
  }

  // Navigation helpers
  const isActivePage = (path: string) => {
    return location.pathname === path
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
                color={isActivePage(ROUTES.GUIDE) ? 'primary' : 'inherit'}
                onClick={() => handleNavigation(ROUTES.GUIDE)}
                sx={{ textTransform: 'none', fontSize: '1rem' }}
              >
                {t('guide')}
              </Button>
              
              <Button
                color={isActivePage(ROUTES.PROPERTIES) ? 'primary' : 'inherit'}
                onClick={() => handleNavigation(ROUTES.PROPERTIES)}
                sx={{ textTransform: 'none', fontSize: '1rem' }}
              >
                {t('apartment')}
              </Button>
              
              <Button
                color="inherit"
                disabled
                sx={{ textTransform: 'none', fontSize: '1rem', opacity: 0.5 }}
              >
                {t('blog')} <small style={{ marginLeft: 4 }}>(Soon)</small>
              </Button>
              
              <Button
                color={isActivePage(ROUTES.CONTACT) ? 'primary' : 'inherit'}
                onClick={() => handleNavigation(ROUTES.CONTACT)}
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
              color={isActivePage(ROUTES.GUIDE) ? 'primary' : 'inherit'}
              onClick={() => handleNavigation(ROUTES.GUIDE)}
            >
              {t('guide')}
            </Button>
            
            <Button
              size="small"
              color={isActivePage(ROUTES.PROPERTIES) ? 'primary' : 'inherit'}
              onClick={() => handleNavigation(ROUTES.PROPERTIES)}
            >
              {t('apartment')}
            </Button>
            
            <Button size="small" disabled sx={{ opacity: 0.5 }}>
              {t('blog')}
            </Button>
            
            <Button
              size="small"
              color={isActivePage(ROUTES.CONTACT) ? 'primary' : 'inherit'}
              onClick={() => handleNavigation(ROUTES.CONTACT)}
            >
              {t('info')}
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'grey.50' }}>
        {children}
      </Box>

      {/* Bottom Bar / Footer */}
      <Paper
        component="footer"
        sx={{
          bgcolor: 'grey.900',
          color: 'white',
          py: 4,
          mt: 'auto'
        }}
      >
        <Container maxWidth="lg">
          {companyInfo ? (
            <Grid container spacing={4}>
              {/* Company Info */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.light' }}>
                  {companyInfo.companyName}
                </Typography>
                
                <Stack spacing={1}>
                  {companyInfo.companyAddress && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon fontSize="small" />
                      <Typography variant="body2">
                        {companyInfo.companyAddress}
                      </Typography>
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon fontSize="small" />
                    <Typography variant="body2">
                      {companyInfo.companyPhone}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon fontSize="small" />
                    <Typography variant="body2">
                      {companyInfo.companyEmail}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              {/* Contact Links */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.light' }}>
                  {t('contactUs')}
                </Typography>
                
                <Stack direction="row" spacing={2}>
                  {/* Facebook Link */}
                  {companyInfo.facebookUrl && companyInfo.facebookUrl !== '#' && (
                    <Link
                      href={companyInfo.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: 'primary.light',
                        textDecoration: 'none',
                        '&:hover': { color: 'primary.main' }
                      }}
                    >
                      <FacebookIcon />
                      <Typography variant="body2">Facebook</Typography>
                    </Link>
                  )}
                  
                  {/* Zalo Link */}
                  {companyInfo.zaloPhone && (
                    <Link
                      href={`https://zalo.me/${companyInfo.zaloPhone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: 'primary.light',
                        textDecoration: 'none',
                        '&:hover': { color: 'primary.main' }
                      }}
                    >
                      <PhoneIcon />
                      <Typography variant="body2">
                        Zalo: {companyInfo.zaloPhone}
                      </Typography>
                    </Link>
                  )}
                </Stack>
              </Grid>
            </Grid>
          ) : (
            // Loading fallback
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Loading company information...
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 3, borderColor: 'grey.700' }} />
          
          {/* Copyright */}
          <Typography variant="body2" align="center" sx={{ opacity: 0.7 }}>
            © {new Date().getFullYear()} {companyInfo?.companyName || APP_NAME}. {t('allRightsReserved')}
          </Typography>
        </Container>
      </Paper>
    </Box>
  )
}

export default PublicLayout