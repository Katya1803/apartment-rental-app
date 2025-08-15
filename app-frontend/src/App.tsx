// src/App.tsx - Updated với complete foundation
import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { theme } from './styles/theme'
import { useAuthStore } from './stores/authStore'
import { ROUTES } from './config/constants'

// Import global styles
import './styles/globals.css'

// Admin Components
import { LoginPage } from './pages/admin/LoginPage'
import { DashboardPage } from './pages/admin/DashboardPage'
import { AdminLayout } from './components/admin/AdminLayout'
import { ProtectedRoute } from './components/admin/ProtectedRoute'

// Public Components (placeholders - will be implemented later)
const HomePage = React.lazy(() => Promise.resolve({ 
  default: () => (
    <div className="flex items-center justify-center h-screen flex-col">
      <h1 className="text-3xl font-bold text-primary mb-4">Q Apartment</h1>
      <p className="text-gray-600">Home Page - Coming Soon</p>
    </div>
  )
}))

const PropertiesPage = React.lazy(() => Promise.resolve({ 
  default: () => (
    <div className="flex items-center justify-center h-screen flex-col">
      <h1 className="text-2xl font-semibold mb-4">Properties</h1>
      <p className="text-gray-600">Properties Page - Coming Soon</p>
    </div>
  )
}))

const PropertyDetailPage = React.lazy(() => Promise.resolve({ 
  default: () => (
    <div className="flex items-center justify-center h-screen flex-col">
      <h1 className="text-2xl font-semibold mb-4">Property Detail</h1>
      <p className="text-gray-600">Property Detail Page - Coming Soon</p>
    </div>
  )
}))

const ContactPage = React.lazy(() => Promise.resolve({ 
  default: () => (
    <div className="flex items-center justify-center h-screen flex-col">
      <h1 className="text-2xl font-semibold mb-4">Contact</h1>
      <p className="text-gray-600">Contact Page - Coming Soon</p>
    </div>
  )
}))

const FavouritesPage = React.lazy(() => Promise.resolve({ 
  default: () => (
    <div className="flex items-center justify-center h-screen flex-col">
      <h1 className="text-2xl font-semibold mb-4">Favourites</h1>
      <p className="text-gray-600">Favourites Page - Coming Soon</p>
    </div>
  )
}))

const SearchPage = React.lazy(() => Promise.resolve({ 
  default: () => (
    <div className="flex items-center justify-center h-screen flex-col">
      <h1 className="text-2xl font-semibold mb-4">Search</h1>
      <p className="text-gray-600">Search Page - Coming Soon</p>
    </div>
  )
}))

const GuidePage = React.lazy(() => Promise.resolve({ 
  default: () => (
    <div className="flex items-center justify-center h-screen flex-col">
      <h1 className="text-2xl font-semibold mb-4">Guide</h1>
      <p className="text-gray-600">Guide Page - Coming Soon</p>
    </div>
  )
}))

const ContentPage = React.lazy(() => Promise.resolve({ 
  default: () => (
    <div className="flex items-center justify-center h-screen flex-col">
      <h1 className="text-2xl font-semibold mb-4">Content</h1>
      <p className="text-gray-600">Content Page - Coming Soon</p>
    </div>
  )
}))

// Admin Pages (placeholders - will be implemented later)
const AdminPropertiesPage = React.lazy(() => Promise.resolve({ 
  default: () => (
    <div className="card">
      <div className="card-header">
        <h2 className="text-xl font-semibold">Properties Management</h2>
      </div>
      <div className="card-body">
        <p className="text-gray-600">Admin Properties Page - Coming Soon</p>
      </div>
    </div>
  )
}))

const AdminMessagesPage = React.lazy(() => Promise.resolve({ 
  default: () => (
    <div className="card">
      <div className="card-header">
        <h2 className="text-xl font-semibold">Messages Management</h2>
      </div>
      <div className="card-body">
        <p className="text-gray-600">Admin Messages Page - Coming Soon</p>
      </div>
    </div>
  )
}))

const AdminContentPage = React.lazy(() => Promise.resolve({ 
  default: () => (
    <div className="card">
      <div className="card-header">
        <h2 className="text-xl font-semibold">Content Management</h2>
      </div>
      <div className="card-body">
        <p className="text-gray-600">Admin Content Page - Coming Soon</p>
      </div>
    </div>
  )
}))

const AdminUsersPage = React.lazy(() => Promise.resolve({ 
  default: () => (
    <div className="card">
      <div className="card-header">
        <h2 className="text-xl font-semibold">Users Management</h2>
      </div>
      <div className="card-body">
        <p className="text-gray-600">Admin Users Page - Coming Soon</p>
      </div>
    </div>
  )
}))

const AdminSettingsPage = React.lazy(() => Promise.resolve({ 
  default: () => (
    <div className="card">
      <div className="card-header">
        <h2 className="text-xl font-semibold">Settings</h2>
      </div>
      <div className="card-body">
        <p className="text-gray-600">Admin Settings Page - Coming Soon</p>
      </div>
    </div>
  )
}))

// 404 Not Found
const NotFoundPage: React.FC = () => (
  <div className="flex items-center justify-center h-screen flex-col">
    <h1 className="text-4xl font-bold text-error mb-4">404</h1>
    <h2 className="text-xl font-semibold mb-2">Page Not Found</h2>
    <p className="text-gray-600">The page you're looking for doesn't exist.</p>
  </div>
)

// Loading Component
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center h-screen flex-col">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
    <p className="text-gray-600">Loading...</p>
  </div>
)

const App: React.FC = () => {
  const { checkAuth } = useAuthStore()

  // Check authentication on app startup
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <React.Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.PROPERTIES} element={<PropertiesPage />} />
            <Route path={ROUTES.PROPERTY_DETAIL} element={<PropertyDetailPage />} />
            <Route path={ROUTES.ROOMS} element={<PropertiesPage />} /> {/* Same as properties but filtered */}
            <Route path={ROUTES.CONTACT} element={<ContactPage />} />
            <Route path={ROUTES.FAVOURITES} element={<FavouritesPage />} />
            <Route path={ROUTES.SEARCH} element={<SearchPage />} />
            <Route path={ROUTES.GUIDE} element={<GuidePage />} />
            <Route path={ROUTES.CONTENT} element={<ContentPage />} />

            {/* Admin Login (public route) */}
            <Route path={ROUTES.ADMIN.LOGIN} element={<LoginPage />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              {/* Admin Dashboard */}
              <Route index element={<DashboardPage />} />
              
              {/* Properties Management - All roles can access */}
              <Route path="properties" element={
                <ProtectedRoute requiredRoles={['SUPER_ADMIN', 'ADMIN', 'EDITOR']}>
                  <AdminPropertiesPage />
                </ProtectedRoute>
              } />
              
              {/* Messages Management - Admin and Super Admin only */}
              <Route path="messages" element={
                <ProtectedRoute requiredRoles={['SUPER_ADMIN', 'ADMIN']}>
                  <AdminMessagesPage />
                </ProtectedRoute>
              } />
              
              {/* Content Management - All roles can access */}
              <Route path="content" element={
                <ProtectedRoute requiredRoles={['SUPER_ADMIN', 'ADMIN', 'EDITOR']}>
                  <AdminContentPage />
                </ProtectedRoute>
              } />
              
              {/* User Management - Super Admin only */}
              <Route path="users" element={
                <ProtectedRoute requiredRoles={['SUPER_ADMIN']}>
                  <AdminUsersPage />
                </ProtectedRoute>
              } />
              
              {/* Settings - Admin and Super Admin only */}
              <Route path="settings" element={
                <ProtectedRoute requiredRoles={['SUPER_ADMIN', 'ADMIN']}>
                  <AdminSettingsPage />
                </ProtectedRoute>
              } />
            </Route>

            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </React.Suspense>
      </Router>
    </ThemeProvider>
  )
}

export default App