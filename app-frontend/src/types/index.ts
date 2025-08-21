// app-frontend/src/types/index.ts

// Locale, Role, Status
export type Locale = 'vi' | 'en' | 'ja'
export type PropertyStatus = 'DRAFT' | 'PUBLISHED' | 'HIDDEN'
export type PropertyType = 'APARTMENT' | 'ROOM' | 'STUDIO' | 'HOUSE'
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR'

// API Response wrapper (matching backend ApiResponse)
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  timestamp: string
}

// Pagination (matching backend PageResponse)
export interface PageRequest {
  page?: number
  size?: number
  sort?: string
  direction?: 'asc' | 'desc'
}

export interface PageResponse<T> {
  items: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
}

// -------------------------------------------
// Property types
// -------------------------------------------
export interface PropertyTranslation {
  title: string
  descriptionMd: string
  addressText: string
}

export interface PropertyImage {
  id: number
  fileName: string
  originalName: string
  imageUrl: string
  altText?: Record<Locale, string>
  displayOrder: number
}

export interface PropertySummary {
  id: number
  slug: string
  code: string
  propertyType: PropertyType
  title: string
  shortDescription?: string
  priceMonth: number
  areaSqm?: number
  bedrooms?: number
  bathrooms?: number
  addressText?: string
  coverImageUrl?: string
  status: PropertyStatus
  isFeatured: boolean
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface PropertyDetail {
  id: number
  slug: string
  code: string
  propertyType: PropertyType
  priceMonth: number
  areaSqm?: number
  bedrooms?: number
  bathrooms?: number
  floorNo?: number
  petPolicy?: string
  viewDesc?: string
  latitude?: number
  longitude?: number
  addressLine?: string
  status: PropertyStatus
  isFeatured: boolean
  publishedAt?: string
  createdAt: string
  updatedAt: string

  // Multilingual content
  translations: Record<string, PropertyTranslation>

  // Related entities
  images: PropertyImage[]
  amenities: Amenity[]
  createdBy?: UserSummary
  updatedBy?: UserSummary

  // Statistics
  totalImages?: number
  totalAmenities?: number
  totalInquiries?: number
}

export interface Amenity {
  id: number
  key: string
  label: string
  translations: Record<string, string>
  isRoomAmenity: boolean
  isCommonAmenity: boolean
}

// -------------------------------------------
// User types
// -------------------------------------------
export interface UserSummary {
  id: number
  email: string
  fullName: string
  role: UserRole
  isActive: boolean
  createdAt: string
  lastLoginAt?: string
}

// -------------------------------------------
// Auth
// -------------------------------------------
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  user: UserSummary
}

// -------------------------------------------
// Contact
// -------------------------------------------
export interface ContactMessage {
  id: number
  fullName: string
  email: string
  phone?: string
  subject: string
  message: string
  property?: PropertySummary
  preferredLang: Locale
  createdAt: string
  isHandled: boolean
  handledBy?: UserSummary
  handledAt?: string
  responseTimeFormatted?: string
}

export interface ContactRequest {
  fullName: string
  email: string
  phone?: string
  subject: string
  message: string
  propertyId?: number
  preferredLang?: Locale
}

// -------------------------------------------
// Site settings
// -------------------------------------------
export interface SiteSetting {
  id: number
  key: string
  value: Record<Locale, string>
  description?: string
  updatedAt: string
}

// -------------------------------------------
// Content Pages
// -------------------------------------------

// ⚠️ SỬA: Entity used in frontend - đổi 'content' thành 'bodyMd'
export interface ContentPage {
  id: number
  slug: string
  status: PropertyStatus
  publishedAt?: string
  createdAt: string
  updatedAt: string
  translations: Record<string, {
    title: string
    bodyMd: string // ⚠️ ĐỔI TỪ: content -> bodyMd
    metaDescription?: string
  }>
}

// API responses (matching backend)
export interface ContentPageResponse {
  id: number
  slug: string
  status: PropertyStatus
  title: string // Current locale title
  bodyPreview: string // First 200 chars
  translations: Record<string, ContentPageTranslationResponse>
  createdBy: UserSummary
  updatedBy: UserSummary
  createdAt: string
  updatedAt: string
}

// ⚠️ SỬA: ContentPageTranslationResponse - đổi 'content' thành 'bodyMd'
export interface ContentPageTranslationResponse {
  title: string
  bodyMd: string // ⚠️ ĐỔI TỪ: content -> bodyMd (khớp với backend)
}

// Requests
export interface ContentPageCreateRequest {
  slug: string
  status: PropertyStatus
  translations: Record<string, ContentPageTranslationRequest>
}

export interface ContentPageUpdateRequest {
  slug?: string
  status?: PropertyStatus
  translations?: Record<string, ContentPageTranslationRequest>
}

// ⚠️ SỬA: ContentPageTranslationRequest - đổi 'content' thành 'bodyMd'
export interface ContentPageTranslationRequest {
  title: string
  bodyMd: string // ⚠️ ĐỔI TỪ: content -> bodyMd (khớp với backend)
}

// -------------------------------------------
// Search & Filter types
// -------------------------------------------
export interface PropertyFilters {
  propertyType?: PropertyType
  minPrice?: number
  maxPrice?: number
  minArea?: number
  maxArea?: number
  minBedrooms?: number
  maxBedrooms?: number
  amenityIds?: number[]
  isFeatured?: boolean
  query?: string
  locale?: Locale
}

export interface SiteSetting {
  id: number
  key: string
  value: Record<Locale, string>
  description?: string
  updatedAt: string
}

// Backend response interface (what API actually returns)
export interface SiteSettingResponse {
  key: string
  value: string // Backend default value
  displayValue: string
  translations: Record<string, string> // Backend translations object  
  updatedAt: string
  updatedBy?: UserSummary
}
		

// -------------------------------------------
// Error & File upload
// -------------------------------------------
export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
}

export interface FileUploadResponse {
  fileName: string
  originalName: string
  imageUrl: string
  size: number
}

// -------------------------------------------
// Favourite
// -------------------------------------------
export interface FavouriteItem {
  propertyId: number
  addedAt: string
}