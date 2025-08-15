import React from 'react'
import { Container, Typography, Box } from '@mui/material'

const AdminLogin: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Login
        </Typography>
        
        <Typography variant="body1" color="text.secondary">
          Admin login page coming soon...
        </Typography>
      </Box>
    </Container>
  )
}

export default AdminLogin