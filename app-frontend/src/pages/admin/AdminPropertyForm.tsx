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
  Home as HomeIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { PropertyService } from '../../services/propertyService'
import { AmenityService } from '../../services/amenityService'
import { ROUTES } from '../../config/constants'
import PropertyImageUpload from '../../components/admin/PropertyImageUpload'
import GoogleMapPicker from '../../components/admin/GoogleMapPicker'
import type { PropertyDetail, PropertyType, PropertyStatus, Amenity, PropertyImage } from '../../types'
import LeafletMapPicker from '../../components/admin/LeafletMapPicker'


interface PropertyFormData {
  slug: string
  code?: string
  propertyType: PropertyType
  priceMonth: string
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

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentTab, setCurrentTab] = useState(0)
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [images, setImages] = useState<PropertyImage[]>([])
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<PropertyFormData>({
    slug: '',
    code: '',
    propertyType: 'ROOM',
    priceMonth: '',
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const amenitiesData = await AmenityService.getAllAmenities('en')
        setAmenities(amenitiesData)

        if (isEdit && id) {
          const property: PropertyDetail = await PropertyService.getPropertyForAdmin(parseInt(id, 10))
          setFormData({
            slug: property.slug,
            code: property.code || '',
            propertyType: property.propertyType,
            priceMonth: property.priceMonth.toString(),
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
          setImages(property.images || [])
        }
      } catch (err) {
        console.error('Failed to fetch data:', err)
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [isEdit, id])

  const validateSlug = (slug: string): string | null => {
    if (!slug.trim()) return 'Slug is required'
    if (!/^[a-z0-9-]+$/.test(slug.trim())) return 'Slug must contain only lowercase letters, numbers, and hyphens'
    return null
  }

  const validatePrice = (price: string): string | null => {
    if (!price.trim()) return 'Price is required'
    const numPrice = parseFloat(price)
    if (isNaN(numPrice) || numPrice <= 0) return 'Price must be greater than 0'
    return null
  }

  const validateTranslations = (): string | null => {
    const hasValidTranslation = Object.values(formData.translations).some(t => t.title.trim())
    if (!hasValidTranslation) return 'At least one translation with title is required'
    return null
  }

  const handleFieldChangeWithValidation = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setValidationErrors(prev => {
      const next = { ...prev }
      delete next[field]
      return next
    })
    let err: string | null = null
    if (field === 'slug') err = validateSlug(value)
    else if (field === 'priceMonth') err = validatePrice(value)
    if (err) setValidationErrors(prev => ({ ...prev, [field]: err }))
  }

  const handleTranslationChangeWithValidation = (locale: string, field: string, value: string) => {
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
    if (field === 'title') {
      setValidationErrors(prev => {
        const next = { ...prev }
        delete next['translations']
        return next
      })
    }
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
      handleFieldChangeWithValidation('slug', slug)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const slugError = validateSlug(formData.slug)
    const priceError = validatePrice(formData.priceMonth)
    const translationError = validateTranslations()

    const newValidationErrors: Record<string, string> = {}
    if (slugError) newValidationErrors.slug = slugError
    if (priceError) newValidationErrors.priceMonth = priceError
    if (translationError) newValidationErrors.translations = translationError

    if (Object.keys(newValidationErrors).length > 0) {
      setValidationErrors(newValidationErrors)
      setError('Please fix the validation errors above')
      return
    }

    const price = parseFloat(formData.priceMonth)
    setSaving(true)
    setError(null)
    setValidationErrors({})

    try {
      const validTranslations = Object.entries(formData.translations)
        .filter(([, t]) => t.title.trim())
        .reduce((acc, [locale, t]) => {
          acc[locale] = {
            title: t.title.trim(),
            descriptionMd: t.descriptionMd || undefined,
            addressText: t.addressText || undefined
          }
          return acc
        }, {} as any)

      const payload = {
        slug: formData.slug.trim(),
        code: formData.code?.trim() || undefined,
        propertyType: 'ROOM' as PropertyType,
        priceMonth: price,
        areaSqm: formData.areaSqm ?? undefined,
        bedrooms: formData.bedrooms ?? undefined,
        bathrooms: formData.bathrooms ?? undefined,
        floorNo: formData.floorNo ?? undefined,
        petPolicy: formData.petPolicy?.trim() || undefined,
        viewDesc: formData.viewDesc?.trim() || undefined,
        latitude: formData.latitude ?? undefined,
        longitude: formData.longitude ?? undefined,
        addressLine: formData.addressLine?.trim() || undefined,
        status: formData.status,
        isFeatured: formData.isFeatured,
        translations: validTranslations,
        amenityIds: formData.amenityIds.length > 0 ? formData.amenityIds : undefined
      }

      if (isEdit && id) {
        await PropertyService.updateProperty(parseInt(id, 10), payload)
      } else {
        await PropertyService.createProperty(payload)
      }
      navigate(ROUTES.ADMIN.PROPERTIES)
    } catch (err: any) {
      console.error('Failed to save property:', err)
      const apiErrors = err?.response?.data?.errors
      if (apiErrors) {
        const errorMessages = Object.entries(apiErrors).map(([field, message]) => `${field}: ${message}`).join('\n')
        setError(`Validation errors:\n${errorMessages}`)
      } else {
        setError(err?.response?.data?.message || 'Failed to save property')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleLocationChange = (lat: number, lng: number) => {
    handleFieldChangeWithValidation('latitude', lat)
    handleFieldChangeWithValidation('longitude', lng)
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<BackIcon />} onClick={() => navigate(ROUTES.ADMIN.PROPERTIES)}>
          Back to Properties
        </Button>
        <Divider orientation="vertical" flexItem />
        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PropertyIcon />
          {isEdit ? 'Edit Property' : 'Create Property'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, whiteSpace: 'pre-line' }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <Tabs value={currentTab} onChange={(e, v) => setCurrentTab(v)}>
              <Tab label="Basic Information" />
              <Tab label="Multilingual Content" />
              <Tab label="Location & Amenities" />
              <Tab label="Images" />
            </Tabs>

            <TabPanel value={currentTab} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Slug"
                    value={formData.slug}
                    onChange={e => handleFieldChangeWithValidation('slug', e.target.value)}
                    helperText={validationErrors.slug || 'URL-friendly identifier (e.g., luxury-apartment-hanoi)'}
                    error={!!validationErrors.slug}
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
                    onChange={e => handleFieldChangeWithValidation('code', e.target.value)}
                    helperText="Internal reference code (optional)"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Property Type"
                    value="🏠 Room (Phòng trọ)"
                    disabled
                    helperText="System default - Room type only"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      onChange={e => handleFieldChangeWithValidation('status', e.target.value)}
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
                    onChange={e => handleFieldChangeWithValidation('priceMonth', e.target.value)}
                    placeholder="Enter monthly price..."
                    error={!!validationErrors.priceMonth}
                    helperText={validationErrors.priceMonth || 'Enter price in USD'}
                    InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Area (sqm)"
                    type="number"
                    value={formData.areaSqm ?? ''}
                    onChange={e => handleFieldChangeWithValidation('areaSqm', e.target.value ? parseFloat(e.target.value) : undefined)}
                    InputProps={{ endAdornment: <InputAdornment position="end">m²</InputAdornment> }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Bedrooms"
                    type="number"
                    value={formData.bedrooms ?? ''}
                    onChange={e => handleFieldChangeWithValidation('bedrooms', e.target.value ? parseInt(e.target.value, 10) : undefined)}
                    inputProps={{ min: 0, max: 20 }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Bathrooms"
                    type="number"
                    value={formData.bathrooms ?? ''}
                    onChange={e => handleFieldChangeWithValidation('bathrooms', e.target.value ? parseInt(e.target.value, 10) : undefined)}
                    inputProps={{ min: 0, max: 20 }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Floor Number"
                    type="number"
                    value={formData.floorNo ?? ''}
                    onChange={e => handleFieldChangeWithValidation('floorNo', e.target.value ? parseInt(e.target.value, 10) : undefined)}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Pet Policy"
                    value={formData.petPolicy}
                    onChange={e => handleFieldChangeWithValidation('petPolicy', e.target.value)}
                    helperText="e.g., Pets allowed, No pets, Small pets only"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="View Description"
                    value={formData.viewDesc}
                    onChange={e => handleFieldChangeWithValidation('viewDesc', e.target.value)}
                    helperText="e.g., City view, Garden view, Lake view"
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Switch checked={formData.isFeatured} onChange={e => handleFieldChangeWithValidation('isFeatured', e.target.checked)} />}
                    label="Featured Property"
                  />
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={currentTab} index={1}>
              <Stack spacing={4}>
                {locales.map(locale => (
                  <Card key={locale.code} variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span style={{ fontSize: '1.5rem' }}>{locale.flag}</span>
                        {locale.label}
                        {locale.code === 'vi' && <Chip label="Recommended" color="primary" size="small" />}
                      </Typography>

                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Title"
                            value={formData.translations[locale.code]?.title || ''}
                            onChange={e => handleTranslationChangeWithValidation(locale.code, 'title', e.target.value)}
                            helperText={locale.code === 'vi' ? (validationErrors.translations || 'Vietnamese title is recommended') : undefined}
                            error={!!validationErrors.translations && locale.code === 'vi'}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Description (Markdown)"
                            multiline
                            rows={4}
                            value={formData.translations[locale.code]?.descriptionMd || ''}
                            onChange={e => handleTranslationChangeWithValidation(locale.code, 'descriptionMd', e.target.value)}
                            helperText="Use Markdown syntax for formatting"
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Address Text"
                            value={formData.translations[locale.code]?.addressText || ''}
                            onChange={e => handleTranslationChangeWithValidation(locale.code, 'addressText', e.target.value)}
                            helperText="Human-readable address"
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </TabPanel>

            <TabPanel value={currentTab} index={2}>
              <Grid container spacing={3}>
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
                    onChange={e => handleFieldChangeWithValidation('addressLine', e.target.value)}
                    helperText="Street address, building name, etc."
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Latitude"
                    type="number"
                    value={formData.latitude ?? ''}
                    onChange={e => handleFieldChangeWithValidation('latitude', e.target.value ? parseFloat(e.target.value) : undefined)}
                    inputProps={{ step: 'any', min: -90, max: 90 }}
                    helperText="GPS coordinate (e.g., 21.0285)"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Longitude"
                    type="number"
                    value={formData.longitude ?? ''}
                    onChange={e => handleFieldChangeWithValidation('longitude', e.target.value ? parseFloat(e.target.value) : undefined)}
                    inputProps={{ step: 'any', min: -180, max: 180 }}
                    helperText="GPS coordinate (e.g., 105.8542)"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon />
                    Property Location
                  </Typography>
                <LeafletMapPicker
                  latitude={formData.latitude}
                  longitude={formData.longitude}
                  onLocationChange={handleLocationChange}
                  height={350}
                />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>

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
                    value={amenities.filter(a => formData.amenityIds.includes(a.id))}
                    onChange={(_, newValue) => {
                      handleFieldChangeWithValidation('amenityIds', newValue.map(a => a.id))
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip variant="outlined" label={option.label} {...getTagProps({ index })} key={option.id} />
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

                {formData.amenityIds.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Selected Amenities ({formData.amenityIds.length}):
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {amenities
                        .filter(a => formData.amenityIds.includes(a.id))
                        .map(a => (
                          <Chip key={a.id} label={a.label} color="primary" variant="outlined" size="small" />
                        ))}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </TabPanel>

            <TabPanel value={currentTab} index={3}>
              {isEdit && id ? (
                <PropertyImageUpload
                  propertyId={parseInt(id, 10)}
                  images={images}
                  onImagesChange={(newImages) => setImages(newImages)}
                />
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    📸 Images will be available after creating the property
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Save the property first, then you can upload images in the edit mode.
                  </Typography>
                  <Alert severity="info" sx={{ mt: 2, maxWidth: 500, mx: 'auto' }}>
                    <strong>Tip:</strong> Create the property with basic information first,
                    then come back to add images and make it more attractive!
                  </Alert>
                </Box>
              )}
            </TabPanel>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Button variant="outlined" onClick={() => navigate(ROUTES.ADMIN.PROPERTIES)} disabled={saving}>
                Cancel
              </Button>

              <Stack direction="row" spacing={2}>
                {currentTab > 0 && (
                  <Button variant="outlined" type="button" onClick={() => setCurrentTab(currentTab - 1)} disabled={saving}>
                    Previous
                  </Button>
                )}

                {currentTab < 3 ? (
                  <Button
                    variant="contained"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentTab(currentTab + 1)
                    }}
                    disabled={saving}
                  >
                    Next
                  </Button>
                ) : (
                  <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={saving}>
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
