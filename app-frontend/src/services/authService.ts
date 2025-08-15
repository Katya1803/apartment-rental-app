import { publicApi } from '../config/axios'
import { STORAGE_KEYS, API_ENDPOINTS } from '../config/constants'
import type { LoginRequest, LoginResponse, ApiResponse, UserSummary } from '../types'

export class AuthService {
  
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await publicApi.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.AUTH.LOGIN, 
      credentials
    )
    
    const loginData = response.data.data
    
    // Store tokens and user info
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, loginData.accessToken)
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, loginData.refreshToken)
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(loginData.user))
    
    return loginData
  }

  static async logout(): Promise<void> {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
    
    try {
      if (refreshToken) {
        await publicApi.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken })
      }
    } catch (error) {
      console.warn('Logout API call failed:', error)
    } finally {
      // Always clear local storage
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
    }
  }

  static async refreshToken(): Promise<LoginResponse> {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await publicApi.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    )

    const loginData = response.data.data
    
    // Update stored tokens
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, loginData.accessToken)
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, loginData.refreshToken)
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(loginData.user))
    
    return loginData
  }

  static getCurrentUser(): UserSummary | null {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER)
    if (!userStr) return null
    
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  }

  static isAuthenticated(): boolean {
    const token = this.getAccessToken()
    const user = this.getCurrentUser()
    return !!(token && user)
  }

  static hasRole(role: string): boolean {
    const user = this.getCurrentUser()
    return user?.role === role
  }

  static hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser()
    return user ? roles.includes(user.role) : false
  }
}