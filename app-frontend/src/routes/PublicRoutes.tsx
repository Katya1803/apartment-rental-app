import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from '../components/layout/PublicLayout'
import { ROUTES } from '../config/constants'

// Import pages
const HomePage = React.lazy(() => import('../pages/public/HomePage'))
const PropertyDetailPage = React.lazy(() => import('../pages/public/PropertyDetailPage'))
const FavouritesPage = React.lazy(() => import('../pages/public/FavouritesPage'))
const ContactPage = React.lazy(() => import('../pages/public/ContactPage'))
const GuidesPage = React.lazy(() => import('../pages/public/GuidesPage'))
const ContentPage = React.lazy(() => import('../pages/public/ContentPage'))

const PublicRoutes: React.FC = () => {
  return (
    <PublicLayout>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path="/properties/:slug" element={<PropertyDetailPage />} />
          <Route path={ROUTES.FAVOURITES} element={<FavouritesPage />} />
          <Route path={ROUTES.CONTACT} element={<ContactPage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/content/:slug" element={<ContentPage />} />
          
          {/* Redirect old routes */}
          <Route path="/guide" element={<Navigate to="/guides" replace />} />
          <Route path="/rooms" element={<Navigate to="/properties" replace />} />
          <Route path="/info" element={<Navigate to="/guides" replace />} />
          
          {/* 404 */}
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </React.Suspense>
    </PublicLayout>
  )
}

export default PublicRoutes