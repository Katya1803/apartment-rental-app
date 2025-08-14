import { createTheme, type ThemeOptions } from '@mui/material/styles'
import type { Locale } from '../types/common'
// Theme configuration
const getTheme = (_locale: Locale = 'vi') => {
  const themeOptions: ThemeOptions = {
    palette: {
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
        contrastText: '#ffffff'
      },
      secondary: {
        main: '#dc004e',
        light: '#ff5983',
        dark: '#9a0036',
        contrastText: '#ffffff'
      },
      background: {
        default: '#fafafa',
        paper: '#ffffff'
      },
      text: {
        primary: 'rgba(0, 0, 0, 0.87)',
        secondary: 'rgba(0, 0, 0, 0.6)'
      }
    },
    typography: {
      fontFamily: [
        '"Roboto"',
        '"Helvetica"',
        '"Arial"',
        'sans-serif'
      ].join(','),
      h1: {
        fontSize: '2.125rem',
        fontWeight: 500,
        lineHeight: 1.2
      },
      h2: {
        fontSize: '1.875rem',
        fontWeight: 500,
        lineHeight: 1.2
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: 500,
        lineHeight: 1.2
      },
      h4: {
        fontSize: '1.25rem',
        fontWeight: 500,
        lineHeight: 1.2
      },
      h5: {
        fontSize: '1.125rem',
        fontWeight: 500,
        lineHeight: 1.2
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.2
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.5
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.43
      }
    },
    shape: {
      borderRadius: 8
    },
    spacing: 8,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            padding: '8px 16px'
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: 12
          }
        }
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
          size: 'small'
        }
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: '#ffffff',
            color: 'rgba(0, 0, 0, 0.87)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)'
          }
        }
      }
    }
  }

  return createTheme(themeOptions)
}

export default getTheme