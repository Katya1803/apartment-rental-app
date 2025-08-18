import React from 'react'
import { Container, Typography, Box, Paper } from '@mui/material'
import { MenuBook as GuideIcon } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import PublicLayout from '../../components/layout/PublicLayout'

const GuidePage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <PublicLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <GuideIcon />
          {t('guide')}
        </Typography>
        
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {t('comingSoon')}
          </Typography>
          <Typography color="text.secondary">
            Guides for expats and international customers coming soon...
          </Typography>
        </Paper>
      </Container>
    </PublicLayout>
  )
}

export default GuidePage