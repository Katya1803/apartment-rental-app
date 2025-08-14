import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress
} from '@mui/material'
import { Save, ArrowBack } from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { adminApi } from '../../config/axios'
import { Property, Locale } from '../../types/common'

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

const AdminPropertyForm: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  
  const [tabValue, setTabValue] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    // Basic info
    propertyType: 'APARTMENT',
    district: '',
    priceMin: '',
    priceMax: '',
    totalUnits: '',
    availableUnits: '',
    latitude: '',
    longitude: '',
    featured: false,
    active: true,
    
    // Multilingual content
    title: { vi: '', en: '', ja: '' },
    description: { vi: '', en: '', ja: '' },
    address: { vi: '', en: '', ja: '' }
  })

  useEffect(() => {
    if (isEdit && id) {
      fetchProperty(id)
    }
  }, [isEdit, id])

  const fetchProperty = async (propertyId: string) => {
    try {
      setLoading(true)
      const response = await adminApi.get(`/properties/${propertyId}`)
      const property: Property = response.data.data
      
      setFormData({
        propertyType: property.propertyType,
        district: property.district,
        priceMin: property.priceRange.min.toString(),
        priceMax: property.priceRange.max.toString(),
        totalUnits: property.totalUnits.toString(),
        availableUnits: property.availableUnits.toString(),
        latitude: property.latitude?.toString() || '',
        longitude: property.longitude?.toString() || '',
        featured: property.featured,
        active: property.active,
        title: property.title,
        description: property.description,
        address: property.address
      })
    } catch (error) {
      setError('Failed to fetch property')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)
      
      const requestData = {
        propertyType: formData.propertyType,
        district: formData.district,
        priceRange: {
          min: parseFloat(formData.priceMin) || 0,
          max: parseFloat(formData.priceMax) || 0
        },
        totalUnits: parseInt(formData.totalUnits) || 0,
        availableUnits: parseInt(formData.availableUnits) || 0,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        featured: formData.featured,
        active: formData.active,
        title: formData.title,
        description: formData.description,
        address: formData.address
      }
      
      if (isEdit) {
        await adminApi.put(`/properties/${id}`, requestData)
      } else {
        await adminApi.post('/properties', requestData)
      }
      
      navigate('/admin/properties')
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to save property')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleMultilingualChange = (field: 'title' | 'description' | 'address', locale: Locale, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [locale]: value
      }
    }))
  }

  if (loading && isEdit) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/admin/properties')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          {isEdit ? 'Edit Property' : 'Add New Property'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Tabs value={tabValue} onChange={(_e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
            <Tab label="Basic Information" />
            <Tab label="Vietnamese" />
            <Tab label="English" />
            <Tab label="Japanese" />
          </Tabs>

          {/* Basic Information Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Property Type</InputLabel>
                  <Select
                    value={formData.propertyType}
                    label="Property Type"
                    onChange={(e) => handleInputChange('propertyType', e.target.value)}
                  >
                    <MenuItem value="APARTMENT">Apartment</MenuItem>
                    <MenuItem value="ROOM">Room</MenuItem>
                    <MenuItem value="STUDIO">Studio</MenuItem>
                    <MenuItem value="HOUSE">House</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="District"
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Min Price"
                  type="number"
                  value={formData.priceMin}
                  onChange={(e) => handleInputChange('priceMin', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Max Price"
                  type="number"
                  value={formData.priceMax}
                  onChange={(e) => handleInputChange('priceMax', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Total Units"
                  type="number"
                  value={formData.totalUnits}
                  onChange={(e) => handleInputChange('totalUnits', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Available Units"
                  type="number"
                  value={formData.availableUnits}
                  onChange={(e) => handleInputChange('availableUnits', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Latitude"
                  type="number"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  helperText="Optional - for map display"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Longitude"
                  type="number"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  helperText="Optional - for map display"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.featured}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                    />
                  }
                  label="Featured Property"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.active}
                      onChange={(e) => handleInputChange('active', e.target.checked)}
                    />
                  }
                  label="Active"
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
                  label="Title (Vietnamese)"
                  value={formData.title.vi}
                  onChange={(e) => handleMultilingualChange('title', 'vi', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description (Vietnamese)"
                  multiline
                  rows={4}
                  value={formData.description.vi}
                  onChange={(e) => handleMultilingualChange('description', 'vi', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address (Vietnamese)"
                  value={formData.address.vi}
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
                  label="Title (English)"
                  value={formData.title.en}
                  onChange={(e) => handleMultilingualChange('title', 'en', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description (English)"
                  multiline
                  rows={4}
                  value={formData.description.en}
                  onChange={(e) => handleMultilingualChange('description', 'en', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address (English)"
                  value={formData.address.en}
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
                  label="Title (Japanese)"
                  value={formData.title.ja}
                  onChange={(e) => handleMultilingualChange('title', 'ja', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description (Japanese)"
                  multiline
                  rows={4}
                  value={formData.description.ja}
                  onChange={(e) => handleMultilingualChange('description', 'ja', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address (Japanese)"
                  value={formData.address.ja}
                  onChange={(e) => handleMultilingualChange('address', 'ja', e.target.value)}
                />
              </Grid>
            </Grid>
          </TabPanel>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              disabled={loading}
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Property' : 'Create Property')}
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => navigate('/admin/properties')}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default AdminPropertyForm