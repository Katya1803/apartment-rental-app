import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { STORAGE_KEYS, SUPPORTED_LOCALES, ADMIN_LOCALE } from '../config/constants'
import type { Locale } from '../types'

export const useLocale = (isAdminPage: boolean = false) => {
  const { i18n } = useTranslation()
  
  // Admin pages always use English, public pages support all 3 languages
  const [currentLocale, setCurrentLocale] = useState<Locale>(() => {
    if (isAdminPage) return ADMIN_LOCALE
    
    const saved = localStorage.getItem(STORAGE_KEYS.LOCALE) as Locale
    return saved && SUPPORTED_LOCALES.includes(saved) ? saved : 'vi'
  })

  const changeLocale = (locale: Locale) => {
    if (isAdminPage) return // Admin pages can't change locale
    
    if (SUPPORTED_LOCALES.includes(locale)) {
      setCurrentLocale(locale)
      localStorage.setItem(STORAGE_KEYS.LOCALE, locale)
      i18n.changeLanguage(locale)
    }
  }

  useEffect(() => {
    if (isAdminPage) {
      // Force English for admin pages
      i18n.changeLanguage(ADMIN_LOCALE)
    } else {
      i18n.changeLanguage(currentLocale)
    }
  }, [currentLocale, isAdminPage, i18n])

  return {
    currentLocale: isAdminPage ? ADMIN_LOCALE : currentLocale,
    changeLocale,
    supportedLocales: isAdminPage ? [ADMIN_LOCALE] : SUPPORTED_LOCALES,
    isAdminPage
  }
}
