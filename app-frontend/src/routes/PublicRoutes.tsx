// src/routes/PublicRoutes.tsx - STRATEGY: Wrap tất cả pages trong PublicLayout ở route level
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from '../components/layout/PublicLayout'
import { ROUTES } from '../config/constants'

// Import actual pages - ĐÃ BỎ PublicLayout bên trong pages
const HomePage = React.lazy(() => import('../pages/public/HomePage'))
const PropertiesPage = React.lazy(() => import('../pages/public/PropertiesPage'))
const PropertyDetailPage = React.lazy(() => import('../pages/public/PropertyDetailPage'))
const FavouritesPage = React.lazy(() => import('../pages/public/FavouritesPage'))
const ContactPage = React.lazy(() => import('../pages/public/ContactPage'))
const GuidePage = React.lazy(() => import('../pages/public/GuidePage'))
const ContentPage = React.lazy(() => import('../pages/public/ContentPage'))

const PublicRoutes: React.FC = () => {
  return (
    <PublicLayout>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Tất cả pages đều được wrap bởi PublicLayout ở level này */}
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.PROPERTIES} element={<PropertiesPage />} />
          <Route path="/properties/:slug" element={<PropertyDetailPage />} />
          <Route path={ROUTES.FAVOURITES} element={<FavouritesPage />} />
          <Route path={ROUTES.CONTACT} element={<ContactPage />} />
          <Route path={ROUTES.GUIDE} element={<GuidePage />} />
          <Route path="/content/:slug" element={<ContentPage />} />
          
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </React.Suspense>
    </PublicLayout>
  )
}

export default PublicRoutes