import React from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper
} from '@mui/material'
import {
  Home,
  Add,
  Business
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const StatCard = ({ title, icon, action }: any) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Button variant="contained" onClick={action} sx={{ mt: 1 }}>
              Manage
            </Button>
          </Box>
          <Box sx={{ color: 'primary.main' }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/admin/properties/new')}
        >
          Add Property
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Welcome back, {user?.fullName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your properties and company information from this admin panel.
        </Typography>
      </Paper>

      {/* Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Properties"
            icon={<Home sx={{ fontSize: 40 }} />}
            action={() => navigate('/admin/properties')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Company Info"
            icon={<Business sx={{ fontSize: 40 }} />}
            action={() => navigate('/admin/company-info')}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default AdminDashboard