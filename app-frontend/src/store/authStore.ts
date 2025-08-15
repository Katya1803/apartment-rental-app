import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthService } from '../services/authService'
import type { UserSummary, LoginRequest } from '../types'

interface AuthState {
  user: UserSummary | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  clearError: () => void
  initializeAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null })
        try {
          const response = await AuthService.login(credentials)
          set({ 
            user: response.user, 
            isAuthenticated: true, 
            isLoading: false 
          })
        } catch (error: any) {
          set({ 
            error: error.response?.data?.message || 'Login failed',
            isLoading: false 
          })
          throw error
        }
      },

      logout: async () => {
        set({ isLoading: true })
        try {
          await AuthService.logout()
        } catch (error) {
          console.warn('Logout API call failed:', error)
        } finally {
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: null 
          })
        }
      },

      refreshToken: async () => {
        try {
          const response = await AuthService.refreshToken()
          set({ 
            user: response.user, 
            isAuthenticated: true 
          })
        } catch (error) {
          set({ 
            user: null, 
            isAuthenticated: false,
            error: 'Session expired' 
          })
          throw error
        }
      },

      clearError: () => set({ error: null }),

      initializeAuth: () => {
        const user = AuthService.getCurrentUser()
        const isAuthenticated = AuthService.isAuthenticated()
        set({ user, isAuthenticated })
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
)
