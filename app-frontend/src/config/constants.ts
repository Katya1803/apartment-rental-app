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

// API Endpoints (matching backend ApiEndpoints.java)
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

// Locale type definition
export type Locale = 'vi' | 'en' | 'ja'

// Locales (public pages support all 3, admin only English)
export const DEFAULT_LOCALE: Locale = 'vi'
export const SUPPORTED_LOCALES: readonly Locale[] = ['vi', 'en', 'ja'] as const
export const ADMIN_LOCALE = 'en' // Admin pages only use English

// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token', 
  USER: 'user',
  LOCALE: 'locale',
  FAVOURITES: 'favourites'
} as const

// Routes
export const ROUTES = {
  // Public routes
  HOME: '/',
  PROPERTIES: '/properties',
  PROPERTY_DETAIL: '/properties/:slug',
  ROOMS: '/rooms',
  FAVOURITES: '/favourites',
  SEARCH: '/search',
  CONTACT: '/contact',
  GUIDE: '/guide',
  CONTENT: '/content/:slug',
  
  // Admin routes
  ADMIN: {
    LOGIN: '/admin/login',
    DASHBOARD: '/admin',
    PROPERTIES: '/admin/properties',
    PROPERTY_CREATE: '/admin/properties/create',
    PROPERTY_EDIT: '/admin/properties/:id/edit',
    MESSAGES: '/admin/messages',
    CONTENT: '/admin/content',
    USERS: '/admin/users',
    SETTINGS: '/admin/settings'
  }
} as const

// Property Type Labels
export const PROPERTY_TYPE_LABELS = {
  vi: {
    APARTMENT: 'Căn hộ',
    ROOM: 'Phòng trọ', 
    STUDIO: 'Studio',
    HOUSE: 'Nhà nguyên căn'
  },
  en: {
    APARTMENT: 'Apartment',
    ROOM: 'Room',
    STUDIO: 'Studio', 
    HOUSE: 'House'
  },
  ja: {
    APARTMENT: 'アパート',
    ROOM: '部屋',
    STUDIO: 'スタジオ',
    HOUSE: '一軒家'
  }
} as const

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 20,
  ADMIN_DEFAULT_SIZE: 10,
  MAX_SIZE: 100
} as const

// UI Constants
export const DRAWER_WIDTH = 240 // Admin sidebar width
export const HEADER_HEIGHT = 64 // Public header height

// Validation patterns
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\+]?[0-9\-\s\(\)]+$/,
  SLUG_REGEX: /^[a-z0-9-]+$/
} as const