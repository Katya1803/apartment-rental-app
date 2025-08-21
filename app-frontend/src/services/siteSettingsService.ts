// app-frontend/src/services/companyService.ts
import { publicApi } from '../config/axios'
import { API_ENDPOINTS } from '../config/constants'
import type { ApiResponse, Locale } from '../types'

export interface CompanyInfo {
  companyName: string
  companyEmail: string
  companyPhone: string
  companyAddress: string
  companyZalo: string
  [key: string]: string
}

export class CompanyService {
  
  // Get all company info using existing /api/company-info endpoint
  static async getCompanyInfo(locale: Locale = 'vi'): Promise<CompanyInfo> {
    try {
      const response = await publicApi.get<ApiResponse<Record<string, string>>>(
        `${API_ENDPOINTS.COMPANY_INFO}?locale=${locale}`
      )
      
      // Map API response to CompanyInfo interface
      const data = response.data.data
      return {
        companyName: data.company_name || 'Q Apartment',
        companyEmail: data.company_email || 'q.apartment09hbm@gmail.com',
        companyPhone: data.company_phone || '0903228571',
        companyAddress: data.company_address || 'Hanoi, Vietnam',
        companyZalo: data.company_zalo || '0903228571',
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
        companyZalo: '0903228571'
      }
    }
  }

  // Get specific setting value using existing endpoint
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