// src/types/helpers.ts
import type { Locale } from './index'

// Type-safe locale arrays
export const LOCALE_OPTIONS: Locale[] = ['vi', 'en', 'ja']
export const ADMIN_LOCALE_OPTIONS: Locale[] = ['en']

// Type guards
export const isValidLocale = (value: string): value is Locale => {
  return LOCALE_OPTIONS.includes(value as Locale)
}

export const assertLocale = (value: string): Locale => {
  if (isValidLocale(value)) {
    return value
  }
  return 'vi' // fallback
}