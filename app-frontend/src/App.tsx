import { Box, Container, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { APP_NAME } from './config/constants'

function App() {
  const { t } = useTranslation()

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          {APP_NAME}
        </Typography>
        
        <Typography variant="h5" component="h2" gutterBottom align="center" color="text.secondary">
          {t('loading')}...
        </Typography>
        
        <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Frontend Setup Complete! 🎉
          </Typography>
          
          <Typography variant="body1" paragraph>
            Your React frontend is now configured with:
          </Typography>
          
          <Box component="ul" sx={{ pl: 2 }}>
            <Typography component="li" variant="body2">✅ Environment configuration (.env)</Typography>
            <Typography component="li" variant="body2">✅ API connection (Axios)</Typography>
            <Typography component="li" variant="body2">✅ TypeScript types</Typography>
            <Typography component="li" variant="body2">✅ Material UI theme</Typography>
            <Typography component="li" variant="body2">✅ Internationalization (i18n)</Typography>
            <Typography component="li" variant="body2">✅ Constants and utilities</Typography>
          </Box>
          
          <Typography variant="body2" sx={{ mt: 2, p: 2, bgcolor: 'primary.light', color: 'primary.contrastText', borderRadius: 1 }}>
            Ready to start building features! 🚀
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default App