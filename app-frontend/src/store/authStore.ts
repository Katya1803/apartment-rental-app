import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, LoginRequest } from '../types/common'
import { publicApi } from '../config/axios'
import { STORAGE_KEYS, API_ENDPOINTS } from '../config/constants'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
  clearError: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Actions
      login: async (credentials: LoginRequest) => {
        try {
          set({ loading: true, error: null })

          const response = await publicApi.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
          const { user, accessToken, refreshToken } = response.data.data

          // Store tokens
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)

          set({
            user,
            isAuthenticated: true,
            loading: false,
            error: null
          })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Login failed'
          set({
            error: errorMessage,
            loading: false,
            isAuthenticated: false
          })
          throw error
        }
      },

      logout: () => {
        // Clear localStorage
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)

        // Reset state
        set({
          user: null,
          isAuthenticated: false,
          error: null
        })
      },

      clearError: () => set({ error: null }),
      setLoading: (loading: boolean) => set({ loading })
    }),
    {
      name: 'auth-store'
    }
  )
)