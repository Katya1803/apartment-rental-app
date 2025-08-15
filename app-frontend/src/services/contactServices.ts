import { publicApi, adminApi } from '../config/axios'
import { API_ENDPOINTS } from '../config/constants'
import type { ContactRequest, ContactMessage, ApiResponse, PageResponse, Locale } from '../types'

export class ContactService {
  
  // Public API - Submit contact message
  static async submitMessage(message: ContactRequest): Promise<void> {
    await publicApi.post<ApiResponse<void>>(
      API_ENDPOINTS.CONTACT,
      message
    )
  }

  // Admin API - Get messages
  static async getMessages(
    handled: boolean = false,
    page: number = 0,
    size: number = 20,
    locale: Locale = 'en'
  ): Promise<PageResponse<ContactMessage>> {
    const endpoint = handled ? '/handled' : '/unhandled'
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      locale
    })

    const response = await adminApi.get<ApiResponse<PageResponse<ContactMessage>>>(
      `${API_ENDPOINTS.ADMIN.MESSAGES}${endpoint}?${params}`
    )
    
    return response.data.data
  }

  static async searchMessages(
    query: string,
    page: number = 0,
    size: number = 20,
    locale: Locale = 'en'
  ): Promise<PageResponse<ContactMessage>> {
    const params = new URLSearchParams({
      query,
      page: page.toString(),
      size: size.toString(),
      locale
    })

    const response = await adminApi.get<ApiResponse<PageResponse<ContactMessage>>>(
      `${API_ENDPOINTS.ADMIN.MESSAGES}/search?${params}`
    )
    
    return response.data.data
  }

  static async getMessageById(id: number, locale: Locale = 'en'): Promise<ContactMessage> {
    const response = await adminApi.get<ApiResponse<ContactMessage>>(
      `${API_ENDPOINTS.ADMIN.MESSAGES}/${id}?locale=${locale}`
    )
    
    return response.data.data
  }

  static async markMessageAsHandled(id: number): Promise<void> {
    await adminApi.patch<ApiResponse<string>>(
      `${API_ENDPOINTS.ADMIN.MESSAGES}/${id}/handle`
    )
  }
}