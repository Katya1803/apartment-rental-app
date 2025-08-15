import React from 'react'
import { Typography, Box } from '@mui/material'

const AdminContent: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Content Management
      </Typography>
      
      <Typography variant="body1" color="text.secondary">
        Content management coming soon...
      </Typography>
    </Box>
  )
}

export default AdminContent