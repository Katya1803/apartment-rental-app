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
      
      // Map API response to CompanyInfo interface
      const data = response.data.data
      return {
        companyName: data.companyName || 'Q Apartment',
        companyEmail: data.companyEmail || 'q.apartment09hbm@gmail.com',
        companyPhone: data.companyPhone || '0903228571',
        companyAddress: data.companyAddress || 'Hanoi, Vietnam',
        facebookUrl: data.facebookUrl || '#',
        zaloPhone: data.zaloPhone || '0903228571',
        ...data
      }
    } catch (error) {
      console.error('Failed to fetch company info:', error)
      
      // Return fallback data
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

  // Get specific setting value
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
}