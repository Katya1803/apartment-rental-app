// app-frontend/src/pages/admin/AdminSettings.tsx - FINAL FIXED
import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material'
import {
  Settings as SettingsIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'
import { siteSettingsService } from '../../services/siteSettingsService'
import type { SiteSettingUpdateRequest } from '../../services/siteSettingsService'
import type { SiteSettingResponse, Locale } from '../../types'
import { useAuthStore } from '../../stores/authStore'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
)

const AdminSettings: React.FC = () => {
  const { user } = useAuthStore()
  const [tabValue, setTabValue] = useState(0)
  const [settings, setSettings] = useState<SiteSettingResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Form states for each setting
  const [formData, setFormData] = useState<Record<string, Record<Locale, string>>>({})

  const locales: Locale[] = ['vi', 'en', 'ja']
  const localeLabels = {
    vi: 'Tiếng Việt',
    en: 'English',
    ja: '日本語'
  }

  const commonSettings = [
    'company_name',
    'company_email', 
    'company_phone',
    'company_address',
    'company_description',
    'company_zalo'
  ]

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const data = await siteSettingsService.getAllSettings()
      
      console.log('Settings response:', data) // Debug log
      setSettings(data)
      
      // FIXED: Map backend response correctly to form state
      const formState: Record<string, Record<Locale, string>> = {}
      data.forEach(setting => {
        formState[setting.key] = {
          vi: setting.translations.vi || setting.value || '',
          en: setting.translations.en || setting.value || '',
          ja: setting.translations.ja || setting.value || ''
        }
        console.log(`Mapped ${setting.key}:`, formState[setting.key]) // Debug log
      })
      
      console.log('Final form state:', formState) // Debug log
      setFormData(formState)
    } catch (error) {
      console.error('Failed to load settings:', error)
      setMessage({ type: 'error', text: 'Failed to load settings' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (key: string, locale: Locale, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [locale]: value
      }
    }))
  }

  const handleSave = async (key: string) => {
    try {
      setSaving(key)
      const updateData: SiteSettingUpdateRequest = {
        translations: formData[key] || {}
      }
      
      console.log(`Saving ${key}:`, updateData) // Debug log
      
      await siteSettingsService.updateSetting(key, updateData)
      setMessage({ type: 'success', text: `${key} updated successfully` })
      
      // Refresh data after save
      await loadSettings()
    } catch (error) {
      console.error(`Failed to update ${key}:`, error)
      setMessage({ type: 'error', text: `Failed to update ${key}` })
    } finally {
      setSaving(null)
    }
  }

  const handleInitializeDefaults = async () => {
    if (!user || user.role !== 'SUPER_ADMIN') return
    
    try {
      setSaving('initialize')
      await siteSettingsService.initializeDefaultSettings()
      setMessage({ type: 'success', text: 'Default settings initialized' })
      await loadSettings()
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to initialize default settings' })
    } finally {
      setSaving(null)
    }
  }

  const renderSettingCard = (setting: SiteSettingResponse) => (
    <Card key={setting.key} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="h3">
            {setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Typography>
          <Chip 
            label={setting.key} 
            size="small" 
            variant="outlined" 
            color="primary"
          />
        </Box>

        <Grid container spacing={2}>
          {locales.map(locale => (
            <Grid item xs={12} md={4} key={locale}>
              <TextField
                fullWidth
                label={localeLabels[locale]}
                value={formData[setting.key]?.[locale] || ''}
                onChange={(e) => handleInputChange(setting.key, locale, e.target.value)}
                multiline={setting.key.includes('description')}
                rows={setting.key.includes('description') ? 3 : 1}
                variant="outlined"
                size="small"
              />
            </Grid>
          ))}
        </Grid>
      </CardContent>
      
      <CardActions>
        <Button
          variant="contained"
          startIcon={saving === setting.key ? <CircularProgress size={16} /> : <SaveIcon />}
          onClick={() => handleSave(setting.key)}
          disabled={saving === setting.key}
          size="small"
        >
          {saving === setting.key ? 'Saving...' : 'Save'}
        </Button>
      </CardActions>
    </Card>
  )

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SettingsIcon />
        Site Settings
      </Typography>

      {/* Success/Error Messages */}
      {message && (
        <Alert 
          severity={message.type} 
          onClose={() => setMessage(null)}
          sx={{ mb: 2 }}
        >
          {message.text}
        </Alert>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
          <Tab label="Company Information" />
          <Tab label="All Settings" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <TabPanel value={tabValue} index={0}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {settings
              .filter(setting => commonSettings.includes(setting.key))
              .map(renderSettingCard)}
          </Grid>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Initialize button for SUPER_ADMIN */}
            {user?.role === 'SUPER_ADMIN' && (
              <Box sx={{ mb: 3 }}>
                <Button
                  variant="outlined"
                  startIcon={saving === 'initialize' ? <CircularProgress size={16} /> : <RefreshIcon />}
                  onClick={handleInitializeDefaults}
                  disabled={saving === 'initialize'}
                >
                  {saving === 'initialize' ? 'Initializing...' : 'Initialize Default Settings'}
                </Button>
              </Box>
            )}

            <Grid container spacing={2}>
              {settings.map(renderSettingCard)}
            </Grid>
          </>
        )}
      </TabPanel>
    </Box>
  )
}

export default AdminSettings