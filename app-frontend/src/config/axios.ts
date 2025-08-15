import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios'
import { API_BASE_URL, ADMIN_API_BASE_URL, STORAGE_KEYS, DEBUG } from './constants'

// Create public API instance (for public endpoints)
export const publicApi: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Create admin API instance (requires authentication)
export const adminApi: AxiosInstance = axios.create({
  baseURL: ADMIN_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor for admin API (add auth token)
adminApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    if (DEBUG) {
      console.log('Admin API Request:', config)
    }
    return config
  },
  (error) => {
    if (DEBUG) {
      console.error('Admin API Request error:', error)
    }
    return Promise.reject(error)
  }
)

// Response interceptor for admin API (handle auth errors & token refresh)
adminApi.interceptors.response.use(
  (response: AxiosResponse) => {
    if (DEBUG) {
      console.log('Admin API Response:', response)
    }
    return response
  },
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true

      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
        if (refreshToken) {
          const response = await publicApi.post('/auth/refresh', { refreshToken })
          const { accessToken, refreshToken: newRefreshToken } = response.data.data
          
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken)
          
          // Retry original request with new token
          original.headers.Authorization = `Bearer ${accessToken}`
          return adminApi(original)
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)
        
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login'
        }
      }
    }

    if (DEBUG) {
      console.error('Admin API Response error:', error)
    }
    return Promise.reject(error)
  }
)

// Request interceptor for public API (optional logging)
publicApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (DEBUG) {
      console.log('Public API Request:', config)
    }
    return config
  },
  (error) => {
    if (DEBUG) {
      console.error('Public API Request error:', error)
    }
    return Promise.reject(error)
  }
)

// Response interceptor for public API (optional logging)
publicApi.interceptors.response.use(
  (response: AxiosResponse) => {
    if (DEBUG) {
      console.log('Public API Response:', response)
    }
    return response
  },
  (error) => {
    if (DEBUG) {
      console.error('Public API Response error:', error)
    }
    return Promise.reject(error)
  }
)

export default { publicApi, adminApi }