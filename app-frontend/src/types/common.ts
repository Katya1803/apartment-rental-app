export type Locale = 'vi' | 'en' | 'ja'

// API Response wrapper (matching backend)
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  timestamp: string
}

// Pagination (matching backend)
export interface PageRequest {
  page?: number
  size?: number
  sort?: string
  direction?: 'asc' | 'desc'
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
}

// Property types (matching backend entities)
export interface Property {
  id: number
  title: Record<Locale, string>
  description: Record<Locale, string>
  slug: string
  propertyType: 'APARTMENT' | 'ROOM'
  priceRange: {
    min: number
    max: number
  }
  address: Record<Locale, string>
  district: string
  latitude?: number
  longitude?: number
  totalUnits: number
  availableUnits: number
  amenities: Amenity[]
  images: PropertyImage[]
  featured: boolean
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface PropertyImage {
  id: number
  fileName: string
  originalName: string
  url: string
  altText?: Record<Locale, string>
  displayOrder: number
}

export interface Amenity {
  id: number
  name: Record<Locale, string>
  icon?: string
  active: boolean
}

// User types (matching backend)
export interface User {
  id: number
  email: string
  fullName: string
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR'
  active: boolean
  createdAt: string
  lastLoginAt?: string
}

// Auth types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: User
}

// Contact types
export interface ContactMessage {
  id: number
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  locale: Locale
  read: boolean
  createdAt: string
}

export interface ContactRequest {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  locale?: Locale
}

// Site settings
export interface SiteSetting {
  id: number
  key: string
  value: Record<Locale, string>
  description?: string
  updatedAt: string
}

// Error types
export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
}

// Filter types
export interface PropertyFilters {
  propertyType?: 'APARTMENT' | 'ROOM'
  district?: string
  minPrice?: number
  maxPrice?: number
  amenities?: number[]
  featured?: boolean
  locale?: Locale
}

// Form validation
export interface ValidationError {
  field: string
  message: string
}

// File upload
export interface FileUploadResponse {
  fileName: string
  originalName: string
  url: string
  size: number
}

// Theme types for Material UI
export interface ThemeConfig {
  mode: 'light' | 'dark'
  primaryColor: string
  locale: Locale
}