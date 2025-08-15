import React from 'react'
import { Typography, Box } from '@mui/material'

const AdminProperties: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Property Management
      </Typography>
      
      <Typography variant="body1" color="text.secondary">
        Property management coming soon...
      </Typography>
    </Box>
  )
}

export default AdminProperties