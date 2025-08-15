import React from 'react'
import { Container, Typography, Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const HomePage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {t('home')}
        </Typography>
        
        <Typography variant="h6" color="text.secondary" paragraph>
          Welcome to Q Apartment - Your property rental platform
        </Typography>

        <Box sx={{ mt: 4 }}>
          <LoadingSpinner message="Homepage content coming soon..." />
        </Box>
      </Box>
    </Container>
  )
}

export default HomePage