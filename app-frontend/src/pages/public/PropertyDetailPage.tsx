import React from 'react'
import { Container, Typography, Box, Paper } from '@mui/material'
import { Home as HomeIcon } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

const PropertyDetailPage: React.FC = () => {
  const { t } = useTranslation()
  const { slug } = useParams<{ slug: string }>()

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <HomeIcon />
        {t('propertyDetails')}
      </Typography>
      
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Property: {slug}
        </Typography>
        <Typography color="text.secondary">
          Property details page coming soon...
        </Typography>
      </Paper>
    </Container>
  )
}

export default PropertyDetailPage