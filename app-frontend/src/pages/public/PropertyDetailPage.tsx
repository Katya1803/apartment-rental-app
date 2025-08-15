import React from 'react'
import { Container, Typography, Box } from '@mui/material'
import { useParams } from 'react-router-dom'

const PropertyDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Property Detail: {slug}
        </Typography>
        
        <Typography variant="body1" color="text.secondary">
          Property detail page coming soon...
        </Typography>
      </Box>
    </Container>
  )
}

export default PropertyDetailPage