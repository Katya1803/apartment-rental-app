import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Import i18n configuration
import './config/i18n'

// Import foundation styles
import './styles/globals.css'

// Import Roboto font
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)