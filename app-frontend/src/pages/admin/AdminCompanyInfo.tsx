import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Tabs,
  Tab,
  Alert,
  CircularProgress
} from '@mui/material'
import { Save } from '@mui/icons-material'
import { adminApi } from '../../config/axios'
import { SiteSetting, Locale } from '../../types/common'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

const AdminCompanyInfo: React.FC = () => {
  const [tabValue, setTabValue] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Form state
  const [companyInfo, setCompanyInfo] = useState({
    name: { vi: '', en: '', ja: '' },
    description: { vi: '', en: '', ja: '' },
    address: { vi: '', en: '', ja: '' },
    phone: '',
    email: '',
    zalo: '',
    website: ''
  })

  useEffect(() => {
    fetchCompanyInfo()
  }, [])

  const fetchCompanyInfo = async () => {
    try {
      setLoading(true)
      
      // Fetch company info from site settings
      const response = await adminApi.get('/site-settings')
      const settings: SiteSetting[] = response.data.data
      
      // Map settings to form data
      const newCompanyInfo = { ...companyInfo }
      
      settings.forEach(setting => {
        switch (setting.key) {
          case 'company_name':
            newCompanyInfo.name = setting.value
            break
          case 'company_description':
            newCompanyInfo.description = setting.value
            break
          case 'company_address':
            newCompanyInfo.address = setting.value
            break
          case 'company_phone':
            newCompanyInfo.phone = setting.value.vi || setting.value.en || ''
            break
          case 'company_email':
            newCompanyInfo.email = setting.value.vi || setting.value.en || ''
            break
          case 'company_zalo':
            newCompanyInfo.zalo = setting.value.vi || setting.value.en || ''
            break
          case 'company_website':
            newCompanyInfo.website = setting.value.vi || setting.value.en || ''
            break
        }
      })
      
      setCompanyInfo(newCompanyInfo)
    } catch (error) {
      setError('Failed to fetch company information')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)
      
      // Update each setting
      const updates = [
        { key: 'company_name', value: companyInfo.name },
        { key: 'company_description', value: companyInfo.description },
        { key: 'company_address', value: companyInfo.address },
        { 
          key: 'company_phone', 
          value: { vi: companyInfo.phone, en: companyInfo.phone, ja: companyInfo.phone }
        },
        { 
          key: 'company_email', 
          value: { vi: companyInfo.email, en: companyInfo.email, ja: companyInfo.email }
        },
        { 
          key: 'company_zalo', 
          value: { vi: companyInfo.zalo, en: companyInfo.zalo, ja: companyInfo.zalo }
        },
        { 
          key: 'company_website', 
          value: { vi: companyInfo.website, en: companyInfo.website, ja: companyInfo.website }
        }
      ]
      
      // Update each setting
      for (const update of updates) {
        await adminApi.put(`/site-settings/${update.key}`, { value: update.value })
      }
      
      setSuccess('Company information updated successfully!')
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update company information')
    } finally {
      setLoading(false)
    }
  }

  const handleMultilingualChange = (field: 'name' | 'description' | 'address', locale: Locale, value: string) => {
    setCompanyInfo(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [locale]: value
      }
    }))
  }

  const handleInputChange = (field: string, value: string) => {
    setCompanyInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading && Object.values(companyInfo.name).every(v => !v)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Company Information
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Tabs value={tabValue} onChange={(_e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
            <Tab label="Contact Info" />
            <Tab label="Vietnamese" />
            <Tab label="English" />
            <Tab label="Japanese" />
          </Tabs>

          {/* Contact Information Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={companyInfo.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={companyInfo.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Zalo Number"
                  value={companyInfo.zalo}
                  onChange={(e) => handleInputChange('zalo', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Website"
                  value={companyInfo.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Vietnamese Tab */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company Name (Vietnamese)"
                  value={companyInfo.name.vi}
                  onChange={(e) => handleMultilingualChange('name', 'vi', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description (Vietnamese)"
                  multiline
                  rows={4}
                  value={companyInfo.description.vi}
                  onChange={(e) => handleMultilingualChange('description', 'vi', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address (Vietnamese)"
                  multiline
                  rows={2}
                  value={companyInfo.address.vi}
                  onChange={(e) => handleMultilingualChange('address', 'vi', e.target.value)}
                  required
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* English Tab */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company Name (English)"
                  value={companyInfo.name.en}
                  onChange={(e) => handleMultilingualChange('name', 'en', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description (English)"
                  multiline
                  rows={4}
                  value={companyInfo.description.en}
                  onChange={(e) => handleMultilingualChange('description', 'en', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address (English)"
                  multiline
                  rows={2}
                  value={companyInfo.address.en}
                  onChange={(e) => handleMultilingualChange('address', 'en', e.target.value)}
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Japanese Tab */}
          <TabPanel value={tabValue} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company Name (Japanese)"
                  value={companyInfo.name.ja}
                  onChange={(e) => handleMultilingualChange('name', 'ja', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description (Japanese)"
                  multiline
                  rows={4}
                  value={companyInfo.description.ja}
                  onChange={(e) => handleMultilingualChange('description', 'ja', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address (Japanese)"
                  multiline
                  rows={2}
                  value={companyInfo.address.ja}
                  onChange={(e) => handleMultilingualChange('address', 'ja', e.target.value)}
                />
              </Grid>
            </Grid>
          </TabPanel>

          <Box sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Company Information'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default AdminCompanyInfo