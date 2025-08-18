// src/routes/PublicRoutes.tsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from '../components/layout/PublicLayout'
import { ROUTES } from '../config/constants'

// Import actual pages
const HomePage = React.lazy(() => import('../pages/public/HomePage'))
const PropertiesPage = React.lazy(() => import('../pages/public/PropertiesPage'))
const PropertyDetailPage = React.lazy(() => import('../pages/public/PropertyDetailPage'))
const FavouritesPage = React.lazy(() => import('../pages/public/FavouritesPage'))
const ContactPage = React.lazy(() => import('../pages/public/ContactPage'))
const GuidePage = React.lazy(() => import('../pages/public/GuidePage'))

// Content page placeholder
const ContentPage = React.lazy(() => import('../pages/public/ContentPage'))

const PublicRoutes: React.FC = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Homepage - uses its own PublicLayout */}
        <Route path={ROUTES.HOME} element={<PublicLayout><HomePage /></PublicLayout>} />
        
        {/* Other pages with PublicLayout */}
        <Route path={ROUTES.PROPERTIES} element={<PublicLayout><PropertiesPage /></PublicLayout>} />
        <Route path="/properties/:slug" element={<PublicLayout><PropertyDetailPage /></PublicLayout>} />
        <Route path={ROUTES.FAVOURITES} element={<PublicLayout><FavouritesPage /></PublicLayout>} />
        <Route path={ROUTES.CONTACT} element={<PublicLayout><ContactPage /></PublicLayout>} />
        <Route path={ROUTES.GUIDE} element={<PublicLayout><GuidePage /></PublicLayout>} />
        <Route path="/content/:slug" element={<PublicLayout><ContentPage /></PublicLayout>} />
        
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </React.Suspense>
  )
}

export default PublicRoutes