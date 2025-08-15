import React from 'react'
import { Alert, AlertTitle, Box, Button } from '@mui/material'
import { Refresh as RefreshIcon } from '@mui/icons-material'

interface ErrorMessageProps {
  message: string
  title?: string
  onRetry?: () => void
  variant?: 'error' | 'warning' | 'info'
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  title,
  onRetry,
  variant = 'error'
}) => {
  return (
    <Box sx={{ my: 2 }}>
      <Alert 
        severity={variant}
        action={
          onRetry && (
            <Button 
              color="inherit" 
              size="small" 
              onClick={onRetry}
              startIcon={<RefreshIcon />}
            >
              Retry
            </Button>
          )
        }
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Box>
  )
}

export default ErrorMessage