import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { I18nextProvider } from 'react-i18next'
import { theme } from './styles/theme'
import { useAuthStore } from './stores/authStore'
import i18n from './config/i18n'
import './components/common/ContactDialog'
import './components/common/FloatingContactIcons'
import './services/companyService'

import './styles/globals.css'

import PublicRoutes from './routes/PublicRoutes'
import AdminRoutes from './routes/AdminRoutes'

const LoadingSpinner: React.FC = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    flexDirection: 'column'
  }}>
    <div style={{
      width: 40,
      height: 40,
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #1976d2',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: 16
    }} />
    <p style={{ color: '#666' }}>Loading...</p>
  </div>
)

const App: React.FC = () => {
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <React.Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="/*" element={<PublicRoutes />} />
          </Routes>
        </React.Suspense>
      </ThemeProvider>
    </I18nextProvider>
  )
}

export default App
