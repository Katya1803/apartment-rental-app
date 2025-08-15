import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { useAuthStore } from './store/authStore'
import PublicRoutes from './routes/PublicRoutes'
import AdminRoutes from './routes/AdminRoutes'
import './config/i18n' // Initialize i18n

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2'
    },
    secondary: {
      main: '#dc004e'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  }
})

const App: React.FC = () => {
  const { initializeAuth } = useAuthStore()

  useEffect(() => {
    // Initialize auth state from localStorage on app start
    initializeAuth()
  }, [initializeAuth])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Admin routes */}
          <Route path="/admin/*" element={<AdminRoutes />} />
          
          {/* Public routes */}
          <Route path="/*" element={<PublicRoutes />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App