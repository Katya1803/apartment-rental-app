/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_ADMIN_API_BASE_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_MAX_FILE_SIZE: string
  readonly VITE_ALLOWED_FILE_TYPES: string
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  readonly VITE_DEBUG: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}