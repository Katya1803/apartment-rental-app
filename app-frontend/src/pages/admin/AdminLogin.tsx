import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Stack
} from '@mui/material'
import { Login as LoginIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

const AdminLogin: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await login(credentials)
      navigate('/admin')
    } catch (error: any) {
      setError(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      bgcolor: 'grey.100'
    }}>
      <Card sx={{ maxWidth: 400, width: '100%', mx: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Q Apartment
              </Typography>
              <Typography color="text.secondary">
                Admin Login
              </Typography>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<LoginIcon />}
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </Stack>
            </form>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}

export default AdminLogin