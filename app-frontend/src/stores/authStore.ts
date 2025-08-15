import { create } from 'zustand'
import { AuthService } from '../services/authService'
import { STORAGE_KEYS } from '../config/constants'
import type { UserSummary, LoginRequest } from '../types'

interface AuthState {
  user: UserSummary | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
  clearError: () => void
  checkAuth: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await AuthService.login(credentials)
      
      // Store tokens
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken)
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user))
      
      set({ 
        user: response.user, 
        isAuthenticated: true, 
        isLoading: false 
      })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed'
      set({ 
        error: errorMessage, 
        isLoading: false,
        isAuthenticated: false,
        user: null
      })
      throw error
    }
  },

  logout: () => {
    // Clear tokens
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
    
    set({ 
      user: null, 
      isAuthenticated: false, 
      error: null 
    })
    
    // Call logout API (optional, since we're using stateless JWT)
    AuthService.logout().catch(() => {
      // Ignore logout API errors - user is already logged out locally
    })
  },

  clearError: () => set({ error: null }),

  checkAuth: () => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    const userStr = localStorage.getItem(STORAGE_KEYS.USER)
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as UserSummary
        set({ user, isAuthenticated: true })
      } catch {
        // Invalid stored data, clear it
        get().logout()
      }
    }
  }
}))