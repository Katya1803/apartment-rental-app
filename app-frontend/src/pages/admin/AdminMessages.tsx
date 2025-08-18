import React from 'react'
import { Box, Typography, Paper } from '@mui/material'
import { Message as MessageIcon } from '@mui/icons-material'

const AdminMessages: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <MessageIcon />
        Messages
      </Typography>
      
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Message management coming soon...
        </Typography>
      </Paper>
    </Box>
  )
}

export default AdminMessages