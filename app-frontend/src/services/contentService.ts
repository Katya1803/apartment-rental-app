import { publicApi } from '../config/axios'
import { API_ENDPOINTS } from '../config/constants'
import type { 
  ApiResponse, 
  ContentPageResponse, 
  Locale 
} from '../types'

export class ContentService {
  /**
   * Get all published content pages for public display
   */
  static async getPublishedPages(locale: Locale = 'vi'): Promise<ContentPageResponse[]> {
    const response = await publicApi.get<ApiResponse<ContentPageResponse[]>>(
      API_ENDPOINTS.CONTENT,
      { params: { locale } }
    )
    return response.data.data
  }

  /**
   * Get a specific content page by slug for public display
   */
  static async getPageBySlug(slug: string, locale: Locale = 'vi'): Promise<ContentPageResponse> {
    const response = await publicApi.get<ApiResponse<ContentPageResponse>>(
      `${API_ENDPOINTS.CONTENT}/${slug}`,
      { params: { locale } }
    )
    return response.data.data
  }
}