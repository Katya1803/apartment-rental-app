import React from 'react'
import { Typography, Box } from '@mui/material'

const AdminMessages: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Messages
      </Typography>
      
      <Typography variant="body1" color="text.secondary">
        Messages management coming soon...
      </Typography>
    </Box>
  )
}

export default AdminMessages