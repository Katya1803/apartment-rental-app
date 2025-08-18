// src/services/propertyService.ts - Updated to match backend API
import { publicApi, adminApi } from '../config/axios'
import { API_ENDPOINTS } from '../config/constants'
import type { 
  PropertySummary, 
  PropertyDetail, 
  ApiResponse, 
  PageResponse, 
  PropertyType,
  PropertyStatus,
  Locale 
} from '../types'

// Interface for filters (matching backend PropertySearchRequest)
export interface PropertyFilters {
  query?: string
  propertyType?: PropertyType
  status?: PropertyStatus
  minPrice?: number
  maxPrice?: number
  minArea?: number
  maxArea?: number
  minBedrooms?: number
  maxBedrooms?: number
  isFeatured?: boolean
}

// Interface for property create request (matching backend PropertyCreateRequest)
export interface PropertyCreateRequest {
  slug: string
  code?: string
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
  translations: {
    [locale: string]: {
      title: string
      descriptionMd: string
      addressText: string
    }
  }
  amenityIds?: number[]
}

// Interface for property update request (matching backend PropertyUpdateRequest)
export interface PropertyUpdateRequest {
  slug?: string
  code?: string
  propertyType?: PropertyType
  priceMonth?: number
  areaSqm?: number
  bedrooms?: number
  bathrooms?: number
  floorNo?: number
  petPolicy?: string
  viewDesc?: string
  latitude?: number
  longitude?: number
  addressLine?: string
  status?: PropertyStatus
  isFeatured?: boolean
  translations?: {
    [locale: string]: {
      title: string
      descriptionMd: string
      addressText: string
    }
  }
  amenityIds?: number[]
}

export class PropertyService {
  
  // === PUBLIC APIs ===
  
  // Get published properties
  static async getPublishedProperties(
    propertyType?: string,
    locale: Locale = 'vi',
    page: number = 0,
    size: number = 20
  ): Promise<PageResponse<PropertySummary>> {
    const params = new URLSearchParams({
      locale,
      page: page.toString(),
      size: size.toString()
    })

    if (propertyType) {
      params.append('propertyType', propertyType)
    }

    const response = await publicApi.get<ApiResponse<PageResponse<PropertySummary>>>(
      `${API_ENDPOINTS.PROPERTIES}?${params}`
    )
    
    return response.data.data
  }

  // Get property by slug
  static async getPropertyBySlug(slug: string, locale: Locale = 'vi'): Promise<PropertyDetail> {
    const response = await publicApi.get<ApiResponse<PropertyDetail>>(
      `${API_ENDPOINTS.PROPERTIES}/${slug}?locale=${locale}`
    )
    
    return response.data.data
  }

  // Get featured properties
  static async getFeaturedProperties(locale: Locale = 'vi'): Promise<PropertySummary[]> {
    const response = await publicApi.get<ApiResponse<PropertySummary[]>>(
      `${API_ENDPOINTS.PROPERTIES}/featured?locale=${locale}`
    )
    
    return response.data.data
  }

  // === ADMIN APIs ===
  
  // Get properties for admin (with filters)
  static async getPropertiesForAdmin(
    filters: PropertyFilters = {},
    page: number = 0,
    size: number = 20
  ): Promise<PageResponse<PropertySummary>> {
    // Build query params for @ModelAttribute PropertySearchRequest
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    })

    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString())
      }
    })

    const response = await adminApi.get<ApiResponse<PageResponse<PropertySummary>>>(
      `${API_ENDPOINTS.ADMIN.PROPERTIES}?${params}`
    )
    
    return response.data.data
  }

  // Get property for admin by ID
  static async getPropertyForAdmin(id: number): Promise<PropertyDetail> {
    const response = await adminApi.get<ApiResponse<PropertyDetail>>(
      `${API_ENDPOINTS.ADMIN.PROPERTIES}/${id}`
    )
    
    return response.data.data
  }

  // Create property
  static async createProperty(propertyData: PropertyCreateRequest): Promise<PropertyDetail> {
    const response = await adminApi.post<ApiResponse<PropertyDetail>>(
      API_ENDPOINTS.ADMIN.PROPERTIES,
      propertyData
    )
    
    return response.data.data
  }

  // Update property
  static async updateProperty(id: number, propertyData: PropertyUpdateRequest): Promise<PropertyDetail> {
    const response = await adminApi.put<ApiResponse<PropertyDetail>>(
      `${API_ENDPOINTS.ADMIN.PROPERTIES}/${id}`,
      propertyData
    )
    
    return response.data.data
  }

  // Delete property (soft delete)
  static async deleteProperty(id: number): Promise<void> {
    await adminApi.delete(`${API_ENDPOINTS.ADMIN.PROPERTIES}/${id}`)
  }

  // === IMAGE MANAGEMENT ===
  
  // Get property images
  static async getPropertyImages(propertyId: number): Promise<any[]> {
    const response = await adminApi.get<ApiResponse<any[]>>(
      `${API_ENDPOINTS.ADMIN.PROPERTIES}/${propertyId}/images`
    )
    
    return response.data.data
  }

  // Upload property image
  static async uploadPropertyImage(propertyId: number, file: File, altText?: string): Promise<any> {
    const formData = new FormData()
    formData.append('file', file)
    
    if (altText) {
      formData.append('altText', altText)
    }

    const response = await adminApi.post(
      `${API_ENDPOINTS.ADMIN.PROPERTIES}/${propertyId}/images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    
    return response.data.data
  }

  // Delete property image
  static async deletePropertyImage(propertyId: number, imageId: number): Promise<void> {
    await adminApi.delete(`${API_ENDPOINTS.ADMIN.PROPERTIES}/${propertyId}/images/${imageId}`)
  }

  // === UTILITY ===
  
  // Check slug availability
  static async checkSlugAvailability(slug: string): Promise<boolean> {
    const response = await publicApi.get<ApiResponse<boolean>>(
      `${API_ENDPOINTS.PROPERTIES}/${slug}/available`
    )
    
    return response.data.data
  }
}