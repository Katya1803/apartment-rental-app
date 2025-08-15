import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from '../components/layout/PublicLayout'
import { ROUTES } from '../config/constants'

// Lazy load components for better performance
const HomePage = React.lazy(() => import('../pages/public/HomePage'))
const PropertiesPage = React.lazy(() => import('../pages/public/PropertiesPage'))
const PropertyDetailPage = React.lazy(() => import('../pages/public/PropertyDetailPage'))
const RoomsPage = React.lazy(() => import('../pages/public/RoomsPage'))
const FavouritesPage = React.lazy(() => import('../pages/public/FavouritesPage'))
const SearchPage = React.lazy(() => import('../pages/public/SearchPage'))
const ContactPage = React.lazy(() => import('../pages/public/ContactPage'))
const ContentPage = React.lazy(() => import('../pages/public/ContentPage'))

const PublicRoutes: React.FC = () => {
  return (
    <PublicLayout>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.PROPERTIES} element={<PropertiesPage />} />
          <Route path="/properties/:slug" element={<PropertyDetailPage />} />
          <Route path={ROUTES.ROOMS} element={<RoomsPage />} />
          <Route path={ROUTES.FAVOURITES} element={<FavouritesPage />} />
          <Route path={ROUTES.SEARCH} element={<SearchPage />} />
          <Route path={ROUTES.CONTACT} element={<ContactPage />} />
          <Route path="/content/:slug" element={<ContentPage />} />
          
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </React.Suspense>
    </PublicLayout>
  )
}

export default PublicRoutes
