import { publicApi, adminApi } from '../config/axios'
import { API_ENDPOINTS } from '../config/constants'
import type { 
  PropertySummary, 
  PropertyDetail, 
  PropertyFilters,
  ApiResponse, 
  PageResponse,
  Locale 
} from '../types'

export class PropertyService {
  
  // Public API methods
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

  static async getPropertyBySlug(slug: string, locale: Locale = 'vi'): Promise<PropertyDetail> {
    const response = await publicApi.get<ApiResponse<PropertyDetail>>(
      `${API_ENDPOINTS.PROPERTIES}/${slug}?locale=${locale}`
    )
    
    return response.data.data
  }

  static async searchProperties(
    filters: PropertyFilters,
    page: number = 0,
    size: number = 20
  ): Promise<PageResponse<PropertySummary>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      locale: filters.locale || 'vi'
    })

    // Add filters to params
    if (filters.query) params.append('query', filters.query)
    if (filters.propertyType) params.append('propertyType', filters.propertyType)
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString())
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
    if (filters.minArea) params.append('minArea', filters.minArea.toString())
    if (filters.maxArea) params.append('maxArea', filters.maxArea.toString())
    if (filters.minBedrooms) params.append('minBedrooms', filters.minBedrooms.toString())
    if (filters.maxBedrooms) params.append('maxBedrooms', filters.maxBedrooms.toString())
    if (filters.isFeatured !== undefined) params.append('isFeatured', filters.isFeatured.toString())
    if (filters.amenityIds) {
      filters.amenityIds.forEach(id => params.append('amenityIds', id.toString()))
    }

    const response = await publicApi.get<ApiResponse<PageResponse<PropertySummary>>>(
      `${API_ENDPOINTS.PROPERTIES}/search?${params}`
    )
    
    return response.data.data
  }

  static async getFeaturedProperties(locale: Locale = 'vi'): Promise<PropertySummary[]> {
    const response = await publicApi.get<ApiResponse<PropertySummary[]>>(
      `${API_ENDPOINTS.PROPERTIES}/featured?locale=${locale}`
    )
    
    return response.data.data
  }

  // Admin API methods
  static async getPropertiesForAdmin(
    filters?: PropertyFilters,
    page: number = 0,
    size: number = 10
  ): Promise<PageResponse<PropertySummary>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    })

    if (filters) {
      if (filters.propertyType) params.append('propertyType', filters.propertyType)
      if (filters.query) params.append('query', filters.query)
    }

    const response = await adminApi.get<ApiResponse<PageResponse<PropertySummary>>>(
      `${API_ENDPOINTS.ADMIN.PROPERTIES}?${params}`
    )
    
    return response.data.data
  }

  static async getPropertyForAdmin(id: number): Promise<PropertyDetail> {
    const response = await adminApi.get<ApiResponse<PropertyDetail>>(
      `${API_ENDPOINTS.ADMIN.PROPERTIES}/${id}`
    )
    
    return response.data.data
  }

  static async createProperty(propertyData: any): Promise<PropertyDetail> {
    const response = await adminApi.post<ApiResponse<PropertyDetail>>(
      API_ENDPOINTS.ADMIN.PROPERTIES,
      propertyData
    )
    
    return response.data.data
  }

  static async updateProperty(id: number, propertyData: any): Promise<PropertyDetail> {
    const response = await adminApi.put<ApiResponse<PropertyDetail>>(
      `${API_ENDPOINTS.ADMIN.PROPERTIES}/${id}`,
      propertyData
    )
    
    return response.data.data
  }

  static async deleteProperty(id: number): Promise<void> {
    await adminApi.delete(`${API_ENDPOINTS.ADMIN.PROPERTIES}/${id}`)
  }

  static async togglePropertyActive(id: number): Promise<void> {
    await adminApi.patch(`${API_ENDPOINTS.ADMIN.PROPERTIES}/${id}/toggle-active`)
  }

  static async uploadPropertyImages(propertyId: number, files: File[]): Promise<any> {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))

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

  static async deletePropertyImage(imageId: number): Promise<void> {
    await adminApi.delete(`/images/${imageId}`)
  }
}
