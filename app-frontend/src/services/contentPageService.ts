// app-frontend/src/services/contentPageService.ts
import { adminApi } from '../config/axios'
import { API_ENDPOINTS } from '../config/constants'
import type { ApiResponse, ContentPage, PageResponse, PropertyStatus } from '../types'

export interface ContentPageCreateRequest {
  slug: string
  status: PropertyStatus
  translations: Record<string, {
    title: string
    content: string
    metaDescription?: string
  }>
}

export interface ContentPageUpdateRequest {
  slug?: string
  status?: PropertyStatus
  translations?: Record<string, {
    title: string
    content: string
    metaDescription?: string
  }>
}

class ContentPageService {
  async getAllPages(params: {
    status?: PropertyStatus
    locale?: string
    page?: number
    size?: number
  } = {}): Promise<PageResponse<ContentPage>> {
    const response = await adminApi.get<ApiResponse<PageResponse<ContentPage>>>(
      API_ENDPOINTS.ADMIN.CONTENT,
      {
        params: {
          locale: 'vi',
          page: 0,
          size: 20,
          ...params
        }
      }
    )
    return response.data.data
  }

  async getPageById(id: number, locale: string = 'vi'): Promise<ContentPage> {
    const response = await adminApi.get<ApiResponse<ContentPage>>(
      `${API_ENDPOINTS.ADMIN.CONTENT}/${id}`,
      { params: { locale } }
    )
    return response.data.data
  }

  async createPage(data: ContentPageCreateRequest): Promise<ContentPage> {
    const response = await adminApi.post<ApiResponse<ContentPage>>(
      API_ENDPOINTS.ADMIN.CONTENT,
      data
    )
    return response.data.data
  }

  async updatePage(id: number, data: ContentPageUpdateRequest): Promise<ContentPage> {
    const response = await adminApi.put<ApiResponse<ContentPage>>(
      `${API_ENDPOINTS.ADMIN.CONTENT}/${id}`,
      data
    )
    return response.data.data
  }

  async deletePage(id: number): Promise<void> {
    await adminApi.delete(`${API_ENDPOINTS.ADMIN.CONTENT}/${id}`)
  }

  async checkSlugAvailability(slug: string, excludeId?: number): Promise<boolean> {
    const response = await adminApi.get<ApiResponse<boolean>>(
      `${API_ENDPOINTS.ADMIN.CONTENT}/slug/${slug}/available`,
      {
        params: excludeId ? { excludeId } : {}
      }
    )
    return response.data.data
  }
}

export const contentPageService = new ContentPageService()