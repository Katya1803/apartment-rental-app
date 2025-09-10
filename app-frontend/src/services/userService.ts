// app-frontend/src/services/userService.ts
import { adminApi } from '../config/axios'
import { API_ENDPOINTS } from '../config/constants'
import type { 
  UserSummary, 
  UserRole, 
  PageResponse, 
  ApiResponse 
} from '../types'

// Request types
interface UserCreateRequest {
  email: string
  fullName: string
  role: UserRole
  password: string
}

interface UserUpdateRequest {
  email?: string
  fullName?: string
  role?: UserRole
  isActive?: boolean
}

interface PasswordChangeRequest {
  newPassword: string
  confirmPassword: string
}

export class UserService {
  
  // Get all users (Super Admin only)
  static async getAllUsers(
    page: number = 0,
    size: number = 20
  ): Promise<PageResponse<UserSummary>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    })

    const response = await adminApi.get<ApiResponse<PageResponse<UserSummary>>>(
      `${API_ENDPOINTS.ADMIN.USERS}?${params}`
    )
    
    return response.data.data
  }

  // Get users by role
  static async getUsersByRole(
    role: UserRole,
    page: number = 0,
    size: number = 20
  ): Promise<PageResponse<UserSummary>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    })

    const response = await adminApi.get<ApiResponse<PageResponse<UserSummary>>>(
      `${API_ENDPOINTS.ADMIN.USERS}/role/${role}?${params}`
    )
    
    return response.data.data
  }

  // Search users
  static async searchUsers(
    query: string,
    page: number = 0,
    size: number = 20
  ): Promise<PageResponse<UserSummary>> {
    const params = new URLSearchParams({
      query,
      page: page.toString(),
      size: size.toString()
    })

    const response = await adminApi.get<ApiResponse<PageResponse<UserSummary>>>(
      `${API_ENDPOINTS.ADMIN.USERS}/search?${params}`
    )
    
    return response.data.data
  }

  // Get user by ID
  static async getUserById(id: number): Promise<UserSummary> {
    const response = await adminApi.get<ApiResponse<UserSummary>>(
      `${API_ENDPOINTS.ADMIN.USERS}/${id}`
    )
    
    return response.data.data
  }

  // Create new user (Super Admin only)
  static async createUser(userData: UserCreateRequest): Promise<UserSummary> {
    const response = await adminApi.post<ApiResponse<UserSummary>>(
      API_ENDPOINTS.ADMIN.USERS,
      userData
    )
    
    return response.data.data
  }

  // Update user (Super Admin only)
  static async updateUser(id: number, userData: UserUpdateRequest): Promise<UserSummary> {
    const response = await adminApi.put<ApiResponse<UserSummary>>(
      `${API_ENDPOINTS.ADMIN.USERS}/${id}`,
      userData
    )
    
    return response.data.data
  }

  // Delete user (Super Admin only)
  static async deleteUser(id: number): Promise<void> {
    await adminApi.delete<ApiResponse<void>>(
      `${API_ENDPOINTS.ADMIN.USERS}/${id}`
    )
  }

  // Activate user
  static async activateUser(id: number): Promise<void> {
    await adminApi.patch<ApiResponse<void>>(
      `${API_ENDPOINTS.ADMIN.USERS}/${id}/activate`
    )
  }

  // Deactivate user
  static async deactivateUser(id: number): Promise<void> {
    await adminApi.patch<ApiResponse<void>>(
      `${API_ENDPOINTS.ADMIN.USERS}/${id}/deactivate`
    )
  }

  // Change user password (Super Admin only)
  static async changeUserPassword(
    id: number, 
    passwordData: PasswordChangeRequest
  ): Promise<void> {
    await adminApi.patch<ApiResponse<void>>(
      `${API_ENDPOINTS.ADMIN.USERS}/${id}/change-password`,
      passwordData
    )
  }

  // Check if email is available
  static async checkEmailAvailability(
    email: string, 
    excludeId?: number
  ): Promise<boolean> {
    const params = new URLSearchParams({ email })
    if (excludeId) {
      params.append('excludeId', excludeId.toString())
    }

    const response = await adminApi.get<ApiResponse<{ available: boolean }>>(
      `${API_ENDPOINTS.ADMIN.USERS}/check-email?${params}`
    )
    
    return response.data.data.available
  }

  // Get user statistics
  static async getUserStats(): Promise<{
    totalUsers: number
    activeUsers: number
    usersByRole: Record<UserRole, number>
    recentUsers: UserSummary[]
  }> {
    const response = await adminApi.get<ApiResponse<{
      totalUsers: number
      activeUsers: number
      usersByRole: Record<UserRole, number>
      recentUsers: UserSummary[]
    }>>(
      `${API_ENDPOINTS.ADMIN.USERS}/stats`
    )
    
    return response.data.data
  }
}

// Export singleton instance
export const userService = UserService