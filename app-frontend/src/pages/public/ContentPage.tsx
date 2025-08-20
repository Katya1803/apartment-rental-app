// app-frontend/src/pages/public/ContentPage.tsx
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Container,
  Typography,
  Box,
  Breadcrumbs,
  Link,
  Paper,
  Skeleton,
  Alert,
  Button
} from '@mui/material'
import { 
  Home as HomeIcon,
  Book as BookIcon,
  ArrowBack as ArrowBackIcon 
} from '@mui/icons-material'
import { useContentPage } from '../../hooks/useContentPages'
import { parseMarkdown } from '../../utils/markdown'
import type { Locale } from '../../types'

export const ContentPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  const { data: page, isLoading, error } = useContentPage(
    slug || '', 
    i18n.language as Locale
  )

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="100%" height={48} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" height={400} />
      </Container>
    )
  }

  if (error || !page) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {t('content_not_found')}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/guides')}
        >
          {t('back_to_guides')}
        </Button>
      </Container>
    )
  }

  // Get translation with fallback logic
  const translation = page.translations[i18n.language] || 
                     page.translations['vi'] || 
                     Object.values(page.translations)[0]

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/')}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <HomeIcon fontSize="small" />
          {t('home')}
        </Link>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/guides')}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <BookIcon fontSize="small" />
          {t('guides')}
        </Link>
        <Typography variant="body2" color="text.primary">
          {page.title}
        </Typography>
      </Breadcrumbs>

      {/* Content */}
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {page.title}
        </Typography>

        <Box
          sx={{ 
            '& h1': { fontSize: '1.75rem', fontWeight: 600, mt: 3, mb: 2 },
            '& h2': { fontSize: '1.5rem', fontWeight: 600, mt: 3, mb: 2 },
            '& h3': { fontSize: '1.25rem', fontWeight: 600, mt: 2, mb: 1 },
            '& p': { mb: 2, lineHeight: 1.7 },
            '& li': { mb: 1, ml: 2 },
            '& ul': { mb: 2 },
            '& ol': { mb: 2 },
            '& strong': { fontWeight: 600 },
            '& em': { fontStyle: 'italic' },
            '& a': { color: 'primary.main', textDecoration: 'underline' }
          }}
          dangerouslySetInnerHTML={{
            __html: translation ? parseMarkdown(translation.bodyMd) : ''
          }}
        />

        {/* Updated info */}
        <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            {t('last_updated')}: {new Date(page.updatedAt).toLocaleDateString()}
          </Typography>
        </Box>
      </Paper>

      {/* Back button */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/guides')}
        >
          {t('back_to_guides')}
        </Button>
      </Box>
    </Container>
  )
}

export default ContentPage