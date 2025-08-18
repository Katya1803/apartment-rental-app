import React from 'react'
import { Box, Typography, Paper } from '@mui/material'
import { Article as ContentIcon } from '@mui/icons-material'

const AdminContent: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ContentIcon />
        Content Management
      </Typography>
      
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Content management coming soon...
        </Typography>
      </Paper>
    </Box>
  )
}

export default AdminContent