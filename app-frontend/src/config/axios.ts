import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { API_BASE_URL, ADMIN_API_BASE_URL, STORAGE_KEYS} from './constants'

// Create axios instances
export const publicApi: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const adminApi: AxiosInstance = axios.create({
  baseURL: ADMIN_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor for admin API to add auth token
adminApi.interceptors.request.use(
  (config: AxiosRequestConfig): any => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('Request error:', error)
    }
    return Promise.reject(error)
  }
)

// Response interceptor for token refresh
adminApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
        if (refreshToken) {
          const response = await publicApi.post('/auth/refresh', {
            refreshToken
          })

          const { accessToken } = response.data.data
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return adminApi(originalRequest)
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

    if (import.meta.env.DEV) {
      console.error('Response error:', error)
    }
    return Promise.reject(error)
  }
)

// Request interceptor for public API (optional logging)
publicApi.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log('Public API Request:', config)
    }
    return config
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('Public API Request error:', error)
    }
    return Promise.reject(error)
  }
)

// Response interceptor for public API (optional logging)
publicApi.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log('Public API Response:', response)
    }
    return response
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('Public API Response error:', error)
    }
    return Promise.reject(error)
  }
)

export default { publicApi, adminApi }