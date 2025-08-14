import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import AdminLayout from '../components/admin/AdminLayout'
import AdminLogin from '../pages/admin/AdminLogin'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminProperties from '../pages/admin/AdminProperties'
import AdminPropertyForm from '../pages/admin/AdminPropertyForm'
import AdminCompanyInfo from '../pages/admin/AdminCompanyInfo.tsx'

const AdminRoutes = () => {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    )
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/properties" element={<AdminProperties />} />
        <Route path="/properties/new" element={<AdminPropertyForm />} />
        <Route path="/properties/:id/edit" element={<AdminPropertyForm />} />
        <Route path="/company-info" element={<AdminCompanyInfo />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminLayout>
  )
}

export default AdminRoutes