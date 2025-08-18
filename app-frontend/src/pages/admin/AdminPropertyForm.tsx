// src/pages/admin/AdminPropertyForm.tsx
import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
  Button,
  Grid,
  Tabs,
  Tab,
  Divider,
  Alert,
  Stack,
  Chip,
  Autocomplete,
  InputAdornment
} from '@mui/material'
import {
  Save as SaveIcon,
  ArrowBack as BackIcon,
  Business as PropertyIcon,
  AttachMoney as MoneyIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { PropertyService, type PropertyCreateRequest, type PropertyUpdateRequest } from '../../services/propertyService'
import { AmenityService } from '../../services/amenityService'
import { ROUTES } from '../../config/constants'
import type { PropertyDetail, PropertyType, PropertyStatus, Amenity } from '../../types'

interface PropertyFormData {
  slug: string
  code?: string
  propertyType: PropertyType
  priceMonth: number
  areaSqm?: number
  bedrooms?: number
  bathrooms?: number
  floorNo?: number
  petPolicy?: string
  viewDesc?: string
  latitude?: number
  longitude?: number
  addressLine?: string
  status: PropertyStatus
  isFeatured: boolean
  translations: {
    [locale: string]: {
      title: string
      descriptionMd: string
      addressText: string
    }
  }
  amenityIds: number[]
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
)

const AdminPropertyForm: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)

  // State
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentTab, setCurrentTab] = useState(0)
  const [amenities, setAmenities] = useState<Amenity[]>([])
  
  const [formData, setFormData] = useState<PropertyFormData>({
    slug: '',
    code: '',
    propertyType: 'APARTMENT',
    priceMonth: 0,
    areaSqm: undefined,
    bedrooms: undefined,
    bathrooms: undefined,
    floorNo: undefined,
    petPolicy: '',
    viewDesc: '',
    latitude: undefined,
    longitude: undefined,
    addressLine: '',
    status: 'DRAFT',
    isFeatured: false,
    translations: {
      en: { title: '', descriptionMd: '', addressText: '' },
      vi: { title: '', descriptionMd: '', addressText: '' },
      ja: { title: '', descriptionMd: '', addressText: '' }
    },
    amenityIds: []
  })

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch amenities
        const amenitiesData = await AmenityService.getAllAmenities('en')
        setAmenities(amenitiesData)

        // Fetch property if editing
        if (isEdit && id) {
          const property: PropertyDetail = await PropertyService.getPropertyForAdmin(parseInt(id))
          
          setFormData({
            slug: property.slug,
            code: property.code || '',
            propertyType: property.propertyType,
            priceMonth: property.priceMonth,
            areaSqm: property.areaSqm || undefined,
            bedrooms: property.bedrooms || undefined,
            bathrooms: property.bathrooms || undefined,
            floorNo: property.floorNo || undefined,
            petPolicy: property.petPolicy || '',
            viewDesc: property.viewDesc || '',
            latitude: property.latitude || undefined,
            longitude: property.longitude || undefined,
            addressLine: property.addressLine || '',
            status: property.status,
            isFeatured: property.isFeatured,
            translations: property.translations || {
              en: { title: '', descriptionMd: '', addressText: '' },
              vi: { title: '', descriptionMd: '', addressText: '' },
              ja: { title: '', descriptionMd: '', addressText: '' }
            },
            amenityIds: property.amenities?.map(a => a.id) || []
          })
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isEdit, id])

  // Handlers
  const handleFieldChange = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleTranslationChange = (locale: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      translations: {
        ...prev.translations,
        [locale]: {
          ...prev.translations[locale],
          [field]: value
        }
      }
    }))
  }

  const generateSlugFromTitle = () => {
    const title = formData.translations.en.title || formData.translations.vi.title
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      handleFieldChange('slug', slug)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.slug.trim()) {
      setError('Slug is required')
      return
    }
    
    if (!formData.translations.en.title.trim()) {
      setError('English title is required')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const payload = {
        ...formData,
        amenityIds: formData.amenityIds.length > 0 ? formData.amenityIds : undefined
      }

      if (isEdit && id) {
        await PropertyService.updateProperty(parseInt(id), payload)
      } else {
        await PropertyService.createProperty(payload)
      }

      navigate(ROUTES.ADMIN.PROPERTIES)
    } catch (error: any) {
      console.error('Failed to save property:', error)
      setError(error.response?.data?.message || 'Failed to save property')
    } finally {
      setSaving(false)
    }
  }

  const locales = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' }
  ]

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate(ROUTES.ADMIN.PROPERTIES)}
        >
          Back to Properties
        </Button>
        <Divider orientation="vertical" flexItem />
        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PropertyIcon />
          {isEdit ? 'Edit Property' : 'Create Property'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            {/* Tabs */}
            <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
              <Tab label="Basic Information" />
              <Tab label="Multilingual Content" />
              <Tab label="Location & Amenities" />
            </Tabs>

            {/* Tab 1: Basic Information */}
            <TabPanel value={currentTab} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Slug"
                    value={formData.slug}
                    onChange={(e) => handleFieldChange('slug', e.target.value)}
                    helperText="URL-friendly identifier (e.g., luxury-apartment-hanoi)"
                    required
                    InputProps={{
                      endAdornment: (
                        <Button size="small" onClick={generateSlugFromTitle}>
                          Generate
                        </Button>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Property Code"
                    value={formData.code}
                    onChange={(e) => handleFieldChange('code', e.target.value)}
                    helperText="Internal reference code (optional)"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Property Type</InputLabel>
                    <Select
                      value={formData.propertyType}
                      onChange={(e) => handleFieldChange('propertyType', e.target.value)}
                      label="Property Type"
                    >
                      <MenuItem value="APARTMENT">🏢 Apartment</MenuItem>
                      <MenuItem value="ROOM">🏠 Room</MenuItem>
                      <MenuItem value="STUDIO">🏙️ Studio</MenuItem>
                      <MenuItem value="HOUSE">🏘️ House</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      onChange={(e) => handleFieldChange('status', e.target.value)}
                      label="Status"
                    >
                      <MenuItem value="DRAFT">📝 Draft</MenuItem>
                      <MenuItem value="PUBLISHED">✅ Published</MenuItem>
                      <MenuItem value="HIDDEN">🙈 Hidden</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Monthly Price"
                    type="number"
                    value={formData.priceMonth}
                    onChange={(e) => handleFieldChange('priceMonth', parseFloat(e.target.value) || 0)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>
                    }}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Area (sqm)"
                    type="number"
                    value={formData.areaSqm || ''}
                    onChange={(e) => handleFieldChange('areaSqm', parseFloat(e.target.value) || undefined)}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">m²</InputAdornment>
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Bedrooms"
                    type="number"
                    value={formData.bedrooms || ''}
                    onChange={(e) => handleFieldChange('bedrooms', parseInt(e.target.value) || undefined)}
                    inputProps={{ min: 0, max: 20 }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Bathrooms"
                    type="number"
                    value={formData.bathrooms || ''}
                    onChange={(e) => handleFieldChange('bathrooms', parseInt(e.target.value) || undefined)}
                    inputProps={{ min: 0, max: 20 }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Floor Number"
                    type="number"
                    value={formData.floorNo || ''}
                    onChange={(e) => handleFieldChange('floorNo', parseInt(e.target.value) || undefined)}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Pet Policy"
                    value={formData.petPolicy}
                    onChange={(e) => handleFieldChange('petPolicy', e.target.value)}
                    helperText="e.g., Pets allowed, No pets, Small pets only"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="View Description"
                    value={formData.viewDesc}
                    onChange={(e) => handleFieldChange('viewDesc', e.target.value)}
                    helperText="e.g., City view, Garden view, Lake view"
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isFeatured}
                        onChange={(e) => handleFieldChange('isFeatured', e.target.checked)}
                      />
                    }
                    label="Featured Property"
                  />
                </Grid>
              </Grid>
            </TabPanel>

            {/* Tab 2: Multilingual Content */}
            <TabPanel value={currentTab} index={1}>
              <Stack spacing={4}>
                {locales.map((locale) => (
                  <Card key={locale.code} variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span style={{ fontSize: '1.5rem' }}>{locale.flag}</span>
                        {locale.label}
                        {locale.code === 'en' && <Chip label="Required" color="error" size="small" />}
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Title"
                            value={formData.translations[locale.code]?.title || ''}
                            onChange={(e) => handleTranslationChange(locale.code, 'title', e.target.value)}
                            required={locale.code === 'en'}
                            helperText={locale.code === 'en' ? 'English title is required' : undefined}
                          />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Description (Markdown)"
                            multiline
                            rows={4}
                            value={formData.translations[locale.code]?.descriptionMd || ''}
                            onChange={(e) => handleTranslationChange(locale.code, 'descriptionMd', e.target.value)}
                            helperText="Use Markdown syntax for formatting"
                          />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Address Text"
                            value={formData.translations[locale.code]?.addressText || ''}
                            onChange={(e) => handleTranslationChange(locale.code, 'addressText', e.target.value)}
                            helperText="Human-readable address"
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </TabPanel>

            {/* Tab 3: Location & Amenities */}
            <TabPanel value={currentTab} index={2}>
              <Grid container spacing={3}>
                {/* Location Section */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon />
                    Location
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address Line"
                    value={formData.addressLine}
                    onChange={(e) => handleFieldChange('addressLine', e.target.value)}
                    helperText="Street address, building name, etc."
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Latitude"
                    type="number"
                    value={formData.latitude || ''}
                    onChange={(e) => handleFieldChange('latitude', parseFloat(e.target.value) || undefined)}
                    inputProps={{ step: 'any', min: -90, max: 90 }}
                    helperText="GPS coordinate (e.g., 21.0285)"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Longitude"
                    type="number"
                    value={formData.longitude || ''}
                    onChange={(e) => handleFieldChange('longitude', parseFloat(e.target.value) || undefined)}
                    inputProps={{ step: 'any', min: -180, max: 180 }}
                    helperText="GPS coordinate (e.g., 105.8542)"
                  />
                </Grid>

                {/* Google Maps Integration Placeholder */}
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography color="text.secondary" align="center">
                      🗺️ Google Maps integration will be added here
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                      Click on map to set coordinates automatically
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>

                {/* Amenities Section */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HomeIcon />
                    Amenities
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    options={amenities}
                    getOptionLabel={(option) => option.label}
                    value={amenities.filter(amenity => formData.amenityIds.includes(amenity.id))}
                    onChange={(event, newValue) => {
                      handleFieldChange('amenityIds', newValue.map(amenity => amenity.id))
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          variant="outlined"
                          label={option.label}
                          {...getTagProps({ index })}
                          key={option.id}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Amenities"
                        placeholder="Choose amenities..."
                        helperText="Select all amenities available in this property"
                      />
                    )}
                  />
                </Grid>

                {/* Amenities Preview */}
                {formData.amenityIds.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Selected Amenities ({formData.amenityIds.length}):
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {amenities
                        .filter(amenity => formData.amenityIds.includes(amenity.id))
                        .map((amenity) => (
                          <Chip
                            key={amenity.id}
                            label={amenity.label}
                            color="primary"
                            variant="outlined"
                            size="small"
                          />
                        ))
                      }
                    </Box>
                  </Grid>
                )}
              </Grid>
            </TabPanel>

            {/* Form Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Button
                variant="outlined"
                onClick={() => navigate(ROUTES.ADMIN.PROPERTIES)}
                disabled={saving}
              >
                Cancel
              </Button>

              <Stack direction="row" spacing={2}>
                {currentTab > 0 && (
                  <Button
                    variant="outlined"
                    onClick={() => setCurrentTab(currentTab - 1)}
                    disabled={saving}
                  >
                    Previous
                  </Button>
                )}
                
                {currentTab < 2 ? (
                  <Button
                    variant="contained"
                    onClick={() => setCurrentTab(currentTab + 1)}
                    disabled={saving}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : (isEdit ? 'Update Property' : 'Create Property')}
                  </Button>
                )}
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </form>
    </Box>
  )
}

export default AdminPropertyForm