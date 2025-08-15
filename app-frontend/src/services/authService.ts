// src/services/authService.ts - FIXED VERSION
import { publicApi, adminApi } from '../config/axios'
import { API_ENDPOINTS } from '../config/constants'
import type { LoginRequest, LoginResponse, ApiResponse } from '../types'

export class AuthService {
  
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Use publicApi with correct endpoint path
    // Backend: POST /api/auth/login (not /api/admin/auth/login)
    const response = await publicApi.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,  // This resolves to '/auth/login'
      credentials
    )
    
    return response.data.data
  }

  static async logout(): Promise<void> {
    try {
      // Use publicApi for logout
      await publicApi.post<ApiResponse<void>>(API_ENDPOINTS.AUTH.LOGOUT)
    } catch {
      // Ignore logout errors - token will be removed locally anyway
    }
  }

  static async refreshToken(refreshToken: string): Promise<LoginResponse> {
    // Use publicApi for refresh
    const response = await publicApi.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    )
    
    return response.data.data
  }

  static async changePassword(
    currentPassword: string, 
    newPassword: string
  ): Promise<void> {
    // Use adminApi for change password (requires authentication)
    await adminApi.post<ApiResponse<void>>(
      API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
      { currentPassword, newPassword }
    )
  }
}