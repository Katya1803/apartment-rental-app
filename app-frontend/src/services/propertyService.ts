// app-frontend/src/services/propertyService.ts - FIXED VERSION
import { publicApi, adminApi } from '../config/axios'
import { API_ENDPOINTS } from '../config/constants'
import type { 
  ApiResponse, 
  PageResponse, 
  PropertySummary, 
  PropertyDetail, 
  PropertyType, 
  PropertyStatus, 
  Locale,
  PropertyImage // 🔧 Added PropertyImage type
} from '../types'

// Property filters interface
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

// 🔧 NEW: Image upload request interface
export interface ImageUploadRequest {
  sortOrder?: number
  isCover?: boolean
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
  
  // Get properties for admin
  static async getPropertiesForAdmin(
    filters: PropertyFilters = {},
    page: number = 0,
    size: number = 20
  ): Promise<PageResponse<PropertySummary>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    })

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
  static async createProperty(propertyData: any): Promise<PropertyDetail> {
    const response = await adminApi.post<ApiResponse<PropertyDetail>>(
      API_ENDPOINTS.ADMIN.PROPERTIES,
      propertyData
    )
    
    return response.data.data
  }

  // Update property
  static async updateProperty(id: number, propertyData: any): Promise<PropertyDetail> {
    const response = await adminApi.put<ApiResponse<PropertyDetail>>(
      `${API_ENDPOINTS.ADMIN.PROPERTIES}/${id}`,
      propertyData
    )
    
    return response.data.data
  }

  // Delete property
  static async deleteProperty(id: number): Promise<void> {
    await adminApi.delete(`${API_ENDPOINTS.ADMIN.PROPERTIES}/${id}`)
  }

  // 🔧 NEW: Get property images
  static async getPropertyImages(propertyId: number): Promise<PropertyImage[]> {
    const response = await adminApi.get<ApiResponse<PropertyImage[]>>(
      `${API_ENDPOINTS.ADMIN.PROPERTIES}/${propertyId}/images`
    )
    
    return response.data.data
  }

  // 🔧 NEW: Upload property image
  static async uploadPropertyImage(
    propertyId: number, 
    file: File, 
    options: ImageUploadRequest = {}
  ): Promise<PropertyImage> {
    const formData = new FormData()
    formData.append('file', file)
    
    if (options.sortOrder !== undefined) {
      formData.append('sortOrder', options.sortOrder.toString())
    }
    
    if (options.isCover !== undefined) {
      formData.append('isCover', options.isCover.toString())
    }

    const response = await adminApi.post<ApiResponse<PropertyImage>>(
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

  // 🔧 NEW: Delete property image
  static async deletePropertyImage(propertyId: number, imageId: number): Promise<void> {
    await adminApi.delete(`${API_ENDPOINTS.ADMIN.PROPERTIES}/images/${imageId}`)
  }

  // 🔧 NEW: Update image sort order
  static async updateImageSortOrder(imageId: number, sortOrder: number): Promise<void> {
    await adminApi.patch(
      `${API_ENDPOINTS.ADMIN.PROPERTIES}/images/${imageId}/sort-order`,
      null,
      {
        params: { sortOrder }
      }
    )
  }

  // 🔧 NEW: Set cover image
  static async setCoverImage(imageId: number): Promise<void> {
    await adminApi.patch(`${API_ENDPOINTS.ADMIN.PROPERTIES}/images/${imageId}/set-cover`)
  }

  // 🔧 NEW: Check slug availability
  static async checkSlugAvailability(slug: string, excludeId?: number): Promise<boolean> {
    const params = new URLSearchParams()
    if (excludeId) {
      params.append('excludeId', excludeId.toString())
    }

    const response = await adminApi.get<ApiResponse<boolean>>(
      `${API_ENDPOINTS.ADMIN.PROPERTIES}/slug/${slug}/available?${params}`
    )
    
    return response.data.data
  }
}