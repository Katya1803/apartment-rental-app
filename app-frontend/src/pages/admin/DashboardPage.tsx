// src/pages/admin/DashboardPage.tsx
import React from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip
} from '@mui/material'
import {
  Business,
  Message,
  Article,
  People
} from '@mui/icons-material'
import { useAuthStore } from '../../stores/authStore'

const StatCard: React.FC<{
  title: string
  value: string | number
  icon: React.ReactNode
  color: 'primary' | 'secondary' | 'success' | 'warning'
}> = ({ title, value, icon, color }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ color: `${color}.main` }}>
          {icon}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
)

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore()

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.fullName}!
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body1" color="text.secondary">
            Role:
          </Typography>
          <Chip 
            label={user?.role} 
            color="primary" 
            size="small"
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Properties"
            value="--"
            icon={<Business fontSize="large" />}
            color="primary"
          />
        </Grid>
        
        {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Unread Messages"
              value="--"
              icon={<Message fontSize="large" />}
              color="warning"
            />
          </Grid>
        )}
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Published Content"
            value="--"
            icon={<Article fontSize="large" />}
            color="success"
          />
        </Grid>
        
        {user?.role === 'SUPER_ADMIN' && (
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Users"
              value="--"
              icon={<People fontSize="large" />}
              color="secondary"
            />
          </Grid>
        )}
      </Grid>

      {/* Quick Actions */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Dashboard with detailed analytics and quick actions will be implemented in the next phase.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}