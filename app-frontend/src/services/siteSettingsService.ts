// app-frontend/src/services/siteSettingsService.ts
import { adminApi } from '../config/axios'
import { API_ENDPOINTS } from '../config/constants'
import type { ApiResponse, SiteSettingResponse } from '../types'

export interface SiteSettingUpdateRequest {
  translations: Record<string, string> // { vi: "", en: "", ja: "" }
  description?: string
}

class SiteSettingsService {
  async getAllSettings(locale: string = 'vi'): Promise<SiteSettingResponse[]> {
    const response = await adminApi.get<ApiResponse<SiteSettingResponse[]>>(
      API_ENDPOINTS.ADMIN.SITE_SETTINGS,
      { params: { locale } }
    )
    return response.data.data
  }

  async getSettingByKey(key: string, locale: string = 'vi'): Promise<SiteSettingResponse> {
    const response = await adminApi.get<ApiResponse<SiteSettingResponse>>(
      `${API_ENDPOINTS.ADMIN.SITE_SETTINGS}/${key}`,
      { params: { locale } }
    )
    return response.data.data
  }

  async updateSetting(key: string, data: SiteSettingUpdateRequest): Promise<SiteSettingResponse> {
    const response = await adminApi.put<ApiResponse<SiteSettingResponse>>(
      `${API_ENDPOINTS.ADMIN.SITE_SETTINGS}/${key}`,
      data
    )
    return response.data.data
  }

  async initializeDefaultSettings(): Promise<string> {
    const response = await adminApi.post<ApiResponse<string>>(
      `${API_ENDPOINTS.ADMIN.SITE_SETTINGS}/initialize`,
      {}
    )
    return response.data.data
  }
}

export const siteSettingsService = new SiteSettingsService()