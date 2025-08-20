// app-frontend/src/services/publicContentService.ts
import { publicApi } from '../config/axios'
import { API_ENDPOINTS } from '../config/constants'
import type { ApiResponse, ContentPage } from '../types'

class PublicContentService {
  async getPublishedPages(locale: string = 'vi'): Promise<ContentPage[]> {
    const response = await publicApi.get<ApiResponse<ContentPage[]>>(
      API_ENDPOINTS.CONTENT,
      { params: { locale } }
    )
    return response.data.data
  }

  async getPageBySlug(slug: string, locale: string = 'vi'): Promise<ContentPage> {
    const response = await publicApi.get<ApiResponse<ContentPage>>(
      `${API_ENDPOINTS.CONTENT}/${slug}`,
      { params: { locale } }
    )
    return response.data.data
  }
}

export const publicContentService = new PublicContentService()