import React from 'react'
import { Container, Typography, Box, Paper } from '@mui/material'
import { ContactMail as ContactIcon } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

const ContactPage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ContactIcon />
        {t('contactUs')}
      </Typography>
      
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {t('comingSoon')}
        </Typography>
        <Typography color="text.secondary">
          Contact form and company information coming soon...
        </Typography>
      </Paper>
    </Container>
  )
}

export default ContactPage