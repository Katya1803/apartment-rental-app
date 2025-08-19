// app-frontend/src/services/propertyService.ts - Thêm method getPropertyBySlug
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

  // Get property by slug - METHOD MỚI
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
}