import React from 'react'
import { Typography, Box } from '@mui/material'

const AdminDashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      
      <Typography variant="body1" color="text.secondary">
        Dashboard content coming soon...
      </Typography>
    </Box>
  )
}

export default AdminDashboard