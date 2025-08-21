// app-frontend/src/styles/theme.ts
import { createTheme, type ThemeOptions } from '@mui/material/styles'

// Color palette
const colors = {
  primary: {
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#2196f3',
    600: '#1976d2',
    700: '#1565c0',
    800: '#0d47a1',
    900: '#0a369d',
  },
  secondary: {
    50: '#fce4ec',
    100: '#f8bbd9',
    200: '#f48fb1',
    300: '#f06292',
    400: '#ec407a',
    500: '#e91e63',
    600: '#d81b60',
    700: '#c2185b',
    800: '#ad1457',
    900: '#880e4f',
  },
  success: {
    50: '#e8f5e8',
    100: '#c8e6c9',
    200: '#a5d6a7',
    300: '#81c784',
    400: '#66bb6a',
    500: '#4caf50',
    600: '#43a047',
    700: '#388e3c',
    800: '#2e7d32',
    900: '#1b5e20',
  },
  warning: {
    50: '#fff3e0',
    100: '#ffe0b2',
    200: '#ffcc80',
    300: '#ffb74d',
    400: '#ffa726',
    500: '#ff9800',
    600: '#fb8c00',
    700: '#f57c00',
    800: '#ef6c00',
    900: '#e65100',
  },
  error: {
    50: '#ffebee',
    100: '#ffcdd2',
    200: '#ef9a9a',
    300: '#e57373',
    400: '#ef5350',
    500: '#f44336',
    600: '#e53935',
    700: '#d32f2f',
    800: '#c62828',
    900: '#b71c1c',
  },
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
}

// Typography
const typography: ThemeOptions['typography'] = {
  fontFamily: [
    'Roboto',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(','),
  h1: {
    fontSize: '2.25rem',   // 36px
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.025em'
  },
  h2: {
    fontSize: '1.875rem',  // 30px
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.025em'
  },
  h3: {
    fontSize: '1.5rem',    // 24px
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '-0.0125em'
  },
  h4: {
    fontSize: '1.25rem',   // 20px
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '-0.0125em'
  },
  h5: {
    fontSize: '1.125rem',  // 18px
    fontWeight: 600,
    lineHeight: 1.5
  },
  h6: {
    fontSize: '1rem',      // 16px
    fontWeight: 600,
    lineHeight: 1.5
  },
  body1: {
    fontSize: '1rem',      // 16px
    lineHeight: 1.5
  },
  body2: {
    fontSize: '0.875rem',  // 14px
    lineHeight: 1.5
  },
  caption: {
    fontSize: '0.75rem',   // 12px
    lineHeight: 1.4,
    color: colors.gray[600]
  },
  button: {
    fontSize: '0.875rem',  // 14px
    fontWeight: 500,
    letterSpacing: '0.025em',
    textTransform: 'none' as const
  }
}

// Component overrides
const components: ThemeOptions['components'] = {
  MuiCssBaseline: {
    styleOverrides: {
      '*': {
        boxSizing: 'border-box',
      },
      html: {
        height: '100%',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      },
      body: {
        height: '100%',
        margin: 0,
        padding: 0,
      },
      '#root': {
        height: '100%',
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        textTransform: 'none',
        fontWeight: 500,
        padding: '8px 16px',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        },
      },
      containedPrimary: {
        '&:hover': {
          backgroundColor: colors.primary[700],
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.primary[400],
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2,
          },
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
      elevation1: {
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      },
      elevation2: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
      elevation3: {
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderRadius: 0, // Bỏ bo góc cho AppBar
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRight: `1px solid ${colors.gray[200]}`,
        boxShadow: 'none',
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        margin: '2px 8px',
        '&.Mui-selected': {
          backgroundColor: colors.primary[50],
          color: colors.primary[700],
          '&:hover': {
            backgroundColor: colors.primary[100],
          },
          '& .MuiListItemIcon-root': {
            color: colors.primary[600],
          },
        },
        '&:hover': {
          backgroundColor: colors.gray[50],
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        fontWeight: 500,
      },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },
}

// Create the theme
const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary[600],
      light: colors.primary[400],
      dark: colors.primary[800],
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.secondary[500],
      light: colors.secondary[300],
      dark: colors.secondary[700],
      contrastText: '#ffffff',
    },
    error: {
      main: colors.error[500],
      light: colors.error[300],
      dark: colors.error[700],
    },
    warning: {
      main: colors.warning[500],
      light: colors.warning[300],
      dark: colors.warning[700],
    },
    success: {
      main: colors.success[500],
      light: colors.success[300],
      dark: colors.success[700],
    },
    grey: colors.gray,
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: colors.gray[900],
      secondary: colors.gray[600],
    },
    divider: colors.gray[200],
  },
  typography,
  components,
  spacing: 8, // 8px base unit
  shape: {
    borderRadius: 8,
  },
}

export const theme = createTheme(themeOptions)

// Export colors for use in components
export { colors }

// Utility function to create custom theme variations
export const createCustomTheme = (customOptions: ThemeOptions) => {
  return createTheme({
    ...themeOptions,
    ...customOptions,
  })
}