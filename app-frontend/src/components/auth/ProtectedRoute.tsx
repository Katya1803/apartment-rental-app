import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { ROUTES } from '../../config/constants'
import type { UserRole } from '../../types'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: UserRole[]
  redirectTo?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles,
  redirectTo = ROUTES.ADMIN.LOGIN 
}) => {
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return <Navigate to={ROUTES.ADMIN.DASHBOARD} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute