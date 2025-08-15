import React from 'react'
import { Container, Typography, Box } from '@mui/material'
import { useTranslation } from 'react-i18next'

const SearchPage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('search')}
        </Typography>
        
        <Typography variant="body1" color="text.secondary">
          Search page coming soon...
        </Typography>
      </Box>
    </Container>
  )
}

export default SearchPage
