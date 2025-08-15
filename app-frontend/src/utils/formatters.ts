import type { Locale } from '../types'

export const formatPrice = (price: number, locale: Locale = 'vi'): string => {
  if (locale === 'vi') {
    if (price >= 1_000_000_000) {
      return `${(price / 1_000_000_000).toFixed(1)} tỷ`
    } else if (price >= 1_000_000) {
      return `${(price / 1_000_000).toFixed(1)} triệu`
    } else {
      return price.toLocaleString('vi-VN')
    }
  } else {
    // English and Japanese use same number formatting
    return price.toLocaleString('en-US')
  }
}

export const formatArea = (area: number, _locale: Locale = 'vi'): string => {
  return `${area} m²`
}

export const formatDate = (dateString: string, locale: Locale = 'vi'): string => {
  const date = new Date(dateString)
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
  
  switch (locale) {
    case 'vi':
      return date.toLocaleDateString('vi-VN', options)
    case 'en':
      return date.toLocaleDateString('en-US', options)
    case 'ja':
      return date.toLocaleDateString('ja-JP', options)
    default:
      return date.toLocaleDateString('vi-VN', options)
  }
}

export const formatDateTime = (dateString: string, locale: Locale = 'vi'): string => {
  const date = new Date(dateString)
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  
  switch (locale) {
    case 'vi':
      return date.toLocaleDateString('vi-VN', options)
    case 'en':
      return date.toLocaleDateString('en-US', options)
    case 'ja':
      return date.toLocaleDateString('ja-JP', options)
    default:
      return date.toLocaleDateString('vi-VN', options)
  }
}

export const getPropertyTypeLabel = (type: string, locale: Locale = 'vi'): string => {
  const labels = {
    vi: {
      APARTMENT: 'Căn hộ',
      ROOM: 'Phòng trọ',
      STUDIO: 'Studio',
      HOUSE: 'Nhà nguyên căn'
    },
    en: {
      APARTMENT: 'Apartment',
      ROOM: 'Room',
      STUDIO: 'Studio',
      HOUSE: 'House'
    },
    ja: {
      APARTMENT: 'アパート',
      ROOM: '部屋',
      STUDIO: 'スタジオ',
      HOUSE: '一軒家'
    }
  }
  
  return labels[locale]?.[type as keyof typeof labels[typeof locale]] || type
}

export const truncateText = (text: string, maxLength: number = 150): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with dashes
    .replace(/^-+|-+$/g, '') // Remove leading/trailing dashes
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[0-9\-\s\(\)]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
}