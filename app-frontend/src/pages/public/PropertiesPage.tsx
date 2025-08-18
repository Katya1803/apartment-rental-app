import React from 'react'
import { Container, Typography, Box, Paper } from '@mui/material'
import { Business as PropertyIcon } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

const PropertiesPage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PropertyIcon />
        {t('properties')}
      </Typography>
      
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {t('comingSoon')}
        </Typography>
        <Typography color="text.secondary">
          Property listings page with search and filters coming soon...
        </Typography>
      </Paper>
    </Container>
  )
}

export default PropertiesPage
