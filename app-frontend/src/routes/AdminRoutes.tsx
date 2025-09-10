import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from '../components/layout/AdminLayout'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import { useAuthStore } from '../stores/authStore'
import { ROUTES } from '../config/constants'

// Lazy load admin components
const AdminLogin = React.lazy(() => import('../pages/admin/AdminLogin'))
const AdminDashboard = React.lazy(() => import('../pages/admin/AdminDashboard'))
const AdminProperties = React.lazy(() => import('../pages/admin/AdminProperties'))
const AdminPropertyForm = React.lazy(() => import('../pages/admin/AdminPropertyForm'))
const AdminMessages = React.lazy(() => import('../pages/admin/AdminMessages'))
const AdminContent = React.lazy(() => import('../pages/admin/AdminContent'))
const AdminSettings = React.lazy(() => import('../pages/admin/AdminSettings'))
const AdminUsers = React.lazy(() => import('../pages/admin/AdminUsers'))

const AdminRoutes: React.FC = () => {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return (
      <React.Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route path="*" element={<Navigate to={ROUTES.ADMIN.LOGIN} replace />} />
        </Routes>
      </React.Suspense>
    )
  }

  return (
    <AdminLayout>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to={ROUTES.ADMIN.DASHBOARD} replace />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/properties" 
            element={
              <ProtectedRoute>
                <AdminProperties />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/properties/new" 
            element={
              <ProtectedRoute>
                <AdminPropertyForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/properties/:id/edit" 
            element={
              <ProtectedRoute>
                <AdminPropertyForm />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/messages" 
            element={
              <ProtectedRoute requiredRoles={['SUPER_ADMIN', 'ADMIN']}>
                <AdminMessages />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/content" 
            element={
              <ProtectedRoute requiredRoles={['SUPER_ADMIN', 'ADMIN']}>
                <AdminContent />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute requiredRoles={['SUPER_ADMIN', 'ADMIN']}>
                <AdminSettings />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/users" 
            element={
              <ProtectedRoute requiredRoles={['SUPER_ADMIN']}>
                <AdminUsers />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to={ROUTES.ADMIN.DASHBOARD} replace />} />
        </Routes>
      </React.Suspense>
    </AdminLayout>
  )
}

export default AdminRoutes