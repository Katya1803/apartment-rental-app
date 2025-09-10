// src/services/companyService.ts
import { publicApi } from '../config/axios'
import { API_ENDPOINTS } from '../config/constants'
import type { ApiResponse, Locale } from '../types'

export interface CompanyInfo {
  companyName: string
  companyEmail: string
  companyPhone: string
  companyAddress: string
  facebookUrl: string
  zaloPhone: string
  [key: string]: string
}

export class CompanyService {
  
  // Get all company info
  static async getCompanyInfo(locale: Locale = 'vi'): Promise<CompanyInfo> {
    try {
      const response = await publicApi.get<ApiResponse<Record<string, string>>>(
        `${API_ENDPOINTS.COMPANY_INFO}?locale=${locale}`
      )
      

      const data = response.data.data
      return {
        companyName: data.company_name || 'Q Apartment',
        companyEmail: data.company_email || 'q.apartment09hbm@gmail.com', 
        companyPhone: data.company_phone || '0903228571',
        companyAddress: data.company_address || 'Hanoi, Vietnam',
        facebookUrl: data.facebook_url || '#', 
        zaloPhone: data.company_zalo || '0903228571',
        ...data
      }
    } catch (error) {
      console.error('Failed to fetch company info:', error)
      
      return {
        companyName: 'Q Apartment',
        companyEmail: 'q.apartment09hbm@gmail.com',
        companyPhone: '0903228571',
        companyAddress: 'Hanoi, Vietnam',
        facebookUrl: '#',
        zaloPhone: '0903228571'
      }
    }
  }

  static async getSettingValue(key: string, locale: Locale = 'vi'): Promise<string> {
    try {
      const response = await publicApi.get<ApiResponse<string>>(
        `${API_ENDPOINTS.COMPANY_INFO}/${key}?locale=${locale}`
      )
      
      return response.data.data || ''
    } catch (error) {
      console.error(`Failed to fetch setting ${key}:`, error)
      return ''
    }
  }

  static async getHeroImageUrl(locale: Locale = 'vi'): Promise<string> {
    try {
      const response = await publicApi.get<ApiResponse<string>>(
        `${API_ENDPOINTS.COMPANY_INFO}/hero_image_url?locale=${locale}`
      )
      return response.data.data || ''
    } catch (error) {
      console.error('Failed to fetch hero image:', error)
      return ''
    }
  }
}