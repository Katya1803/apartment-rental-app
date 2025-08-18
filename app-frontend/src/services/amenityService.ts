// src/services/amenityService.ts
import { publicApi } from '../config/axios'
import { API_ENDPOINTS } from '../config/constants'
import type { Amenity, ApiResponse, Locale, PropertyType } from '../types'

export class AmenityService {
  
  // Get all amenities
  static async getAllAmenities(locale: Locale = 'en'): Promise<Amenity[]> {
    const response = await publicApi.get<ApiResponse<Amenity[]>>(
      `${API_ENDPOINTS.AMENITIES}?locale=${locale}`
    )
    
    return response.data.data
  }

  // Get amenities for specific property type
  static async getAmenitiesForPropertyType(
    propertyType: PropertyType, 
    locale: Locale = 'en'
  ): Promise<Amenity[]> {
    const response = await publicApi.get<ApiResponse<Amenity[]>>(
      `${API_ENDPOINTS.AMENITIES}/property-type/${propertyType}?locale=${locale}`
    )
    
    return response.data.data
  }

  // Get amenity by ID
  static async getAmenityById(id: number, locale: Locale = 'en'): Promise<Amenity> {
    const response = await publicApi.get<ApiResponse<Amenity>>(
      `${API_ENDPOINTS.AMENITIES}/${id}?locale=${locale}`
    )
    
    return response.data.data
  }
}