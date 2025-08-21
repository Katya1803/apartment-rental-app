// app-frontend/src/components/common/FloatingContactIcons.tsx
import React, { useState, useEffect } from 'react'
import {
  Box,
  Fab,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material'
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Close as CloseIcon,
  Chat as ChatIcon
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { ContactDialog } from './ContactDialog'
import { CompanyService } from '../../services/companyService'
import type { Locale } from '../../types'

export const FloatingContactIcons: React.FC = () => {
  const { t, i18n } = useTranslation()
  
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false)
  const [companyPhone, setCompanyPhone] = useState('')
  const [companyEmail, setCompanyEmail] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)

  // Load company info on mount
  useEffect(() => {
    loadCompanyInfo()
  }, [i18n.language])

  const loadCompanyInfo = async () => {
    try {
      const companyInfo = await CompanyService.getCompanyInfo(i18n.language as Locale)
      setCompanyPhone(companyInfo.companyPhone || '0903228571')
      setCompanyEmail(companyInfo.companyEmail || 'q.apartment09hbm@gmail.com')
    } catch (error) {
      console.error('Failed to load company info:', error)
      // Use fallback values
      setCompanyPhone('0903228571')
      setCompanyEmail('q.apartment09hbm@gmail.com')
    }
  }

  const handleEmailClick = () => {
    setContactDialogOpen(true)
  }

  const handlePhoneClick = () => {
    setPhoneDialogOpen(true)
  }

  const handlePhoneCall = () => {
    window.open(`tel:${companyPhone}`)
    setPhoneDialogOpen(false)
  }

  // Thay thế handleCopyPhone bằng handleZaloLink
  const handleZaloLink = () => {
    // Tạo link Zalo - format: https://zalo.me/[số điện thoại]
    const zaloUrl = `https://zalo.me/${companyPhone.replace(/\s/g, '')}`
    window.open(zaloUrl, '_blank')
    setPhoneDialogOpen(false)
  }

  return (
    <>
      {/* Floating Icons */}
      <Box
        sx={{
          position: 'fixed',
          right: { xs: 16, md: 24 },
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        {/* Email Icon */}
        <Tooltip title={t('sendEmailContact')} placement="left">
          <Fab
            color="primary"
            onClick={handleEmailClick}
            size="medium"
            sx={{
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s ease-in-out',
              boxShadow: 3
            }}
          >
            <EmailIcon />
          </Fab>
        </Tooltip>

        {/* Phone Icon */}
        <Tooltip title={t('phoneContact')} placement="left">
          <Fab
            color="secondary"
            onClick={handlePhoneClick}
            size="medium"
            sx={{
              bgcolor: 'success.main',
              '&:hover': {
                bgcolor: 'success.dark',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s ease-in-out',
              boxShadow: 3
            }}
          >
            <PhoneIcon />
          </Fab>
        </Tooltip>
      </Box>

      {/* Contact Form Dialog */}
      <ContactDialog
        open={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
      />

      {/* Phone Contact Dialog */}
      <Dialog
        open={phoneDialogOpen}
        onClose={() => setPhoneDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">{t('phoneContactTitle')}</Typography>
            <IconButton
              onClick={() => setPhoneDialogOpen(false)}
              sx={{ minWidth: 'auto', p: 1 }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} alignItems="center">
            <PhoneIcon sx={{ fontSize: 48, color: 'success.main' }} />
            
            <Typography variant="h6" textAlign="center">
              {companyPhone}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" textAlign="center">
              {t('phoneContactDescription')}
            </Typography>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="success"
              startIcon={<PhoneIcon />}
              onClick={handlePhoneCall}
            >
              {t('callNow')}
            </Button>
            
            {/* Thay thế button Copy thành Link to Zalo */}
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ChatIcon />}
              onClick={handleZaloLink}
              sx={{
                borderColor: '#0068FF', // Màu xanh Zalo
                color: '#0068FF',
                '&:hover': {
                  borderColor: '#0052CC',
                  color: '#0052CC',
                  backgroundColor: 'rgba(0, 104, 255, 0.04)'
                }
              }}
            >
              {t('contactZalo')}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      {/* Copy Success Snackbar - Có thể xóa nếu không dùng nữa */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setCopySuccess(false)} severity="success">
          {t('phoneCopied')}
        </Alert>
      </Snackbar>
    </>
  )
}