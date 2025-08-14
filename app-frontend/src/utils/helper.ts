import type { Locale } from '../types/common'
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '../config/constants'

// Locale utilities
export const isValidLocale = (locale: string): locale is Locale => {
  return SUPPORTED_LOCALES.includes(locale as Locale)
}

export const getValidLocale = (locale?: string): Locale => {
  if (locale && isValidLocale(locale)) {
    return locale
  }
  return DEFAULT_LOCALE
}

// Multilingual content helpers
export const getLocalizedContent = (content: Record<Locale, string>, locale: Locale): string => {
  return content[locale] || content[DEFAULT_LOCALE] || Object.values(content)[0] || ''
}

// Price formatting
export const formatPrice = (price: number, locale: Locale = DEFAULT_LOCALE): string => {  
  if (locale === 'vi') {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

export const formatPriceRange = (min: number, max: number, locale: Locale = DEFAULT_LOCALE): string => {
  if (min === max) {
    return formatPrice(min, locale)
  }
  return `${formatPrice(min, locale)} - ${formatPrice(max, locale)}`
}

// Date formatting
export const formatDate = (date: string | Date, locale: Locale = DEFAULT_LOCALE): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const localeMap = {
    vi: 'vi-VN',
    en: 'en-US',
    ja: 'ja-JP'
  }
  
  return new Intl.DateTimeFormat(localeMap[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj)
}

export const formatDateTime = (date: string | Date, locale: Locale = DEFAULT_LOCALE): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const localeMap = {
    vi: 'vi-VN',
    en: 'en-US',
    ja: 'ja-JP'
  }
  
  return new Intl.DateTimeFormat(localeMap[locale], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj)
}

// File utilities
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type)
}

export const isValidFileSize = (file: File, maxSize: number): boolean => {
  return file.size <= maxSize
}

// URL utilities
export const buildUrl = (base: string, params?: Record<string, any>): string => {
  const url = new URL(base, window.location.origin)
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value))
      }
    })
  }
  
  return url.toString()
}

// Slug utilities
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/
  return phoneRegex.test(phone)
}

// Array utilities
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: ReturnType<typeof setTimeout>

  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Error handling
export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  
  if (error.message) {
    return error.message
  }
  
  return 'An unexpected error occurred'
}

// Local storage utilities
export const safeJsonParse = <T>(value: string | null, defaultValue: T): T => {
  if (!value) return defaultValue
  
  try {
    return JSON.parse(value)
  } catch {
    return defaultValue
  }
}

export const safeJsonStringify = (value: any): string | null => {
  try {
    return JSON.stringify(value)
  } catch {
    return null
  }
}