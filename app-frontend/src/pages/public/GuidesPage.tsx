import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Box,
  Chip,
  Skeleton
} from '@mui/material'
import { Book as BookIcon } from '@mui/icons-material'
import { useContentPages } from '../../hooks/useContentPages'
import type { Locale } from '../../types'

export const GuidesPage: React.FC = () => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { data: contentPages, isLoading } = useContentPages(i18n.language as Locale)

  const handlePageClick = (slug: string) => {
    navigate(`/content/${slug}`)
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('guides')}
        </Typography>
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="80%" height={32} />
                  <Skeleton variant="text" height={20} sx={{ mt: 1 }} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" width="60%" height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('helpful_guides')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('guides_description')}
        </Typography>
      </Box>

      {/* Content Grid */}
      {contentPages?.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <BookIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            {t('no_guides_available')}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {contentPages?.map((page) => (
            <Grid item xs={12} md={6} lg={4} key={page.id}>
              <Card sx={{ height: '100%' }}>
                <CardActionArea
                  onClick={() => handlePageClick(page.slug)}
                  sx={{ height: '100%', alignItems: 'flex-start' }}
                >
                  <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {page.title}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        flexGrow: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {page.bodyPreview}
                    </Typography>

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip 
                        label={t('read_more')} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(page.updatedAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}

export default GuidesPage