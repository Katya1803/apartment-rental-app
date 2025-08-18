import React from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Business as PropertyIcon,
  Message as MessageIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material'

const AdminDashboard: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <DashboardIcon />
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PropertyIcon color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">0</Typography>
                  <Typography color="text.secondary">Properties</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <MessageIcon color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">0</Typography>
                  <Typography color="text.secondary">Messages</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingIcon color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">0</Typography>
                  <Typography color="text.secondary">Views</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PropertyIcon color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">0</Typography>
                  <Typography color="text.secondary">Featured</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Welcome to Q Apartment Admin
            </Typography>
            <Typography color="text.secondary">
              Use the sidebar to navigate through different sections:
            </Typography>
            <ul style={{ marginTop: '1rem' }}>
              <li>Properties - Manage apartment and room listings</li>
              <li>Messages - View and respond to customer inquiries</li>
              <li>Content - Manage static pages and guides</li>
              <li>Settings - Configure site settings</li>
            </ul>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AdminDashboard