// API Constants
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
export const ADMIN_API_BASE_URL = import.meta.env.VITE_ADMIN_API_BASE_URL || 'http://localhost:8080/api/admin'

// App Constants
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Q Apartment'
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0'

// File Upload Constants
export const MAX_FILE_SIZE = parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 10485760 // 10MB
export const ALLOWED_FILE_TYPES = import.meta.env.VITE_ALLOWED_FILE_TYPES?.split(',') || [
  'image/jpeg',
  'image/png',
  'image/webp'
]

// Google Maps
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

// Development
export const DEBUG = import.meta.env.DEV || import.meta.env.VITE_DEBUG === 'true'

// API Endpoints (matching backend)
export const API_ENDPOINTS = {
  // Public endpoints
  PROPERTIES: '/properties',
  AMENITIES: '/amenities',
  DISTRICTS: '/districts',
  CONTACT: '/contact',
  CONTENT: '/content',
  COMPANY_INFO: '/company-info',
  
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    CHANGE_PASSWORD: '/auth/change-password'
  },
  
  // Admin endpoints (relative to ADMIN_API_BASE_URL)
  ADMIN: {
    PROPERTIES: '/properties',
    USERS: '/users',
    MESSAGES: '/messages',
    ANALYTICS: '/analytics',
    SITE_SETTINGS: '/site-settings',
    CONTENT: '/content'
  }
} as const

// Default locale
export const DEFAULT_LOCALE = 'vi'

// Supported locales
export const SUPPORTED_LOCALES = ['vi', 'en', 'ja'] as const

// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  LOCALE: 'locale'
} as const

// Routes
export const ROUTES = {
  HOME: '/',
  PROPERTIES: '/properties',
  PROPERTY_DETAIL: '/properties/:id',
  CONTACT: '/contact',
  ABOUT: '/about',
  
  // Admin routes
  ADMIN: {
    ROOT: '/admin',
    LOGIN: '/admin/login',
    DASHBOARD: '/admin/dashboard',
    PROPERTIES: '/admin/properties',
    USERS: '/admin/users',
    MESSAGES: '/admin/messages',
    SETTINGS: '/admin/settings'
  }
} as const