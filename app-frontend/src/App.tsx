import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import AdminRoutes from './routes/AdminRoutes'
import { useAuthStore } from './store/authStore'
import { STORAGE_KEYS } from './config/constants'

function App() {
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    // Initialize auth state from localStorage on app start
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    const userStr = localStorage.getItem(STORAGE_KEYS.USER)
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        // Initialize auth store if tokens exist and user data is valid
        if (user && user.id) {
          useAuthStore.setState({
            user,
            isAuthenticated: true
          })
        }
      } catch (error) {
        // Clear invalid data if JSON parsing fails
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)
      }
    }
  }, [])

  return (
    <Box sx={{ display: 'flex' }}>
      <Routes>
        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        
        {/* Public routes placeholder */}
        <Route path="/" element={
          <Box sx={{ p: 4, textAlign: 'center', width: '100vw' }}>
            <h1>Q Apartment - Public Site</h1>
            <p>Admin panel is available at <a href="/admin">/admin</a></p>
            <p>Public site will be developed in next phase.</p>
            {/* Show current auth status for debugging */}
            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '20px' }}>
              Auth Status: {isAuthenticated ? 'Logged in' : 'Not logged in'}
            </p>
          </Box>
        } />
      </Routes>
    </Box>
  )
}

export default App