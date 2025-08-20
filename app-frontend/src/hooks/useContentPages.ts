import { useQuery } from '@tanstack/react-query'
import { ContentService } from '../services/contentService'
import type { Locale } from '../types'

export const useContentPages = (locale: Locale) => {
  return useQuery({
    queryKey: ['content-pages', locale],
    queryFn: () => ContentService.getPublishedPages(locale),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false,
  })
}

export const useContentPage = (slug: string, locale: Locale) => {
  return useQuery({
    queryKey: ['content-page', slug, locale],
    queryFn: () => ContentService.getPageBySlug(slug, locale),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes cache for individual pages
    refetchOnWindowFocus: false,
  })
}