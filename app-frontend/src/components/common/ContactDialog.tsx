// app-frontend/src/components/common/ContactDialog.tsx
import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Stack,
  IconButton
} from '@mui/material'
import {
  Send as SendIcon,
  Close as CloseIcon
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { ContactService } from '../../services/contactServices'
import type { ContactRequest, Locale } from '../../types'

interface ContactDialogProps {
  open: boolean
  onClose: () => void
  propertyId?: number
}

export const ContactDialog: React.FC<ContactDialogProps> = ({
  open,
  onClose,
  propertyId
}) => {
  const { t, i18n } = useTranslation()
  
  const [formData, setFormData] = useState<ContactRequest>({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    propertyId,
    preferredLang: i18n.language as Locale
  })
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    
    if (!formData.fullName.trim()) {
      errors.fullName = t('required')
    } else if (formData.fullName.length > 100) {
      errors.fullName = t('maxLength', { max: 100 })
    }
    
    if (!formData.email.trim()) {
      errors.email = t('required')
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t('invalidEmail')
    }
    
    if (formData.phone && formData.phone.length > 20) {
      errors.phone = t('maxLength', { max: 20 })
    }
    
    if (formData.subject && formData.subject.length > 200) {
      errors.subject = t('maxLength', { max: 200 })
    }
    
    if (!formData.message.trim()) {
      errors.message = t('required')
    } else if (formData.message.length > 2000) {
      errors.message = t('maxLength', { max: 2000 })
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: keyof ContactRequest) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }))
    }
    
    // Clear general error
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      setLoading(true)
      setError(null)
      
      // Send data matching backend DTO - use empty string for optional fields
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim() || '', // backend expects String, not null
        subject: formData.subject?.trim() || '', // backend expects String, not null
        message: formData.message.trim(),
        propertyId: formData.propertyId,
        preferredLang: i18n.language.toUpperCase() // backend enum might be uppercase
      }
      
      console.log('Sending payload:', payload) // Debug log
      
      await ContactService.submitMessage(payload as any) // cast to bypass type check
      
      setSuccess(true)
      
      // Auto close after 2 seconds
      setTimeout(() => {
        handleClose()
      }, 2000)
      
    } catch (err: any) {
      console.error('Contact form error:', err) // Debug log
      setError(err.response?.data?.message || t('messageError'))
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (loading) return
    
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      propertyId,
      preferredLang: i18n.language as Locale
    })
    setSuccess(false)
    setError(null)
    setValidationErrors({})
    onClose()
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={loading}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">{t('contactUs')}</Typography>
          <IconButton
            onClick={handleClose}
            disabled={loading}
            sx={{ minWidth: 'auto', p: 1 }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Instruction Text */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            {t('contactFormInstruction')}
          </Typography>
        </Alert>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {t('messageSuccess')}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              required
              label={t('fullName')}
              value={formData.fullName}
              onChange={handleInputChange('fullName')}
              error={!!validationErrors.fullName}
              helperText={validationErrors.fullName}
              disabled={loading || success}
            />

            <TextField
              fullWidth
              required
              type="email"
              label={t('email')}
              value={formData.email}
              onChange={handleInputChange('email')}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              disabled={loading || success}
            />

            <TextField
              fullWidth
              label={t('phone')}
              value={formData.phone}
              onChange={handleInputChange('phone')}
              error={!!validationErrors.phone}
              helperText={validationErrors.phone}
              disabled={loading || success}
            />

            <TextField
              fullWidth
              label={t('subject')}
              value={formData.subject}
              onChange={handleInputChange('subject')}
              error={!!validationErrors.subject}
              helperText={validationErrors.subject}
              disabled={loading || success}
            />

            <TextField
              fullWidth
              required
              multiline
              rows={4}
              label={t('message')}
              value={formData.message}
              onChange={handleInputChange('message')}
              error={!!validationErrors.message}
              helperText={validationErrors.message}
              disabled={loading || success}
            />
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
        >
          {t('cancel')}
        </Button>
        
        <Button
          onClick={handleSubmit}
          disabled={loading || success}
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
        >
          {loading ? t('sending') : t('sendMessage')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}