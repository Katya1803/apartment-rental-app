// AdminProperties.tsx - SIMPLIFIED VERSION (Manual codes only)
import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Menu,
  MenuList,
  MenuItem as MuiMenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  Grid,
  Stack,
  Alert,
  Snackbar,
  Tabs,
  Tab
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Business as PropertyIcon,
  Bed as BedIcon,
  Shower as BathIcon,
  AspectRatio as AreaIcon,
  ContentCopy as DuplicateIcon,
  FileCopy as BatchDuplicateIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { PropertyService } from '../../services/propertyService'
import type { PropertySummary, PropertyType, PropertyStatus, PageResponse, PropertyDetail } from '../../types'
import type { PropertyFilters } from '../../services/propertyService'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
  </div>
)

const AdminProperties: React.FC = () => {
  const navigate = useNavigate()
  
  // State
  const [properties, setProperties] = useState<PropertySummary[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [filters, setFilters] = useState<PropertyFilters>({})
  
  // Dialog states
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; property: PropertySummary | null }>({
    open: false,
    property: null
  })
  
  const [duplicateDialog, setDuplicateDialog] = useState<{ 
    open: boolean; 
    property: PropertySummary | null; 
    tabValue: number;
    // Single duplicate
    newCode: string;
    // Batch duplicate - SIMPLIFIED
    batchCodes: string;
    loading: boolean;
  }>({
    open: false,
    property: null,
    tabValue: 0,
    newCode: '',
    batchCodes: '',
    loading: false
  })
  
  const [menuAnchor, setMenuAnchor] = useState<{ element: HTMLElement | null; property: PropertySummary | null }>({
    element: null,
    property: null
  })

  // Notification state
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success'
  })

  // Fetch properties
  const fetchProperties = async (page = 0) => {
    try {
      setLoading(true)
      const response = await PropertyService.getPropertiesForAdmin(filters, page, 10)
      setProperties(response.items || [])
      setTotalPages(response.totalPages || 0)
      setCurrentPage(page)
    } catch (error) {
      console.error('Failed to fetch properties:', error)
      setProperties([])
      showNotification('Failed to fetch properties', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties(0)
  }, [filters])

  // Handlers
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    fetchProperties(page - 1)
  }

  const handleFilterChange = (key: keyof PropertyFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleDelete = async () => {
    if (!deleteDialog.property) return
    
    try {
      await PropertyService.deleteProperty(deleteDialog.property.id)
      setDeleteDialog({ open: false, property: null })
      fetchProperties(currentPage)
      showNotification('Property deleted successfully', 'success')
    } catch (error) {
      console.error('Failed to delete property:', error)
      showNotification('Failed to delete property', 'error')
    }
  }

  const handleSingleDuplicate = async () => {
    if (!duplicateDialog.property || !duplicateDialog.newCode.trim()) return
    
    setDuplicateDialog(prev => ({ ...prev, loading: true }))
    
    try {
      await PropertyService.duplicateProperty(
        duplicateDialog.property.id,
        duplicateDialog.newCode.trim()
      )
      
      resetDuplicateDialog()
      fetchProperties(currentPage)
      showNotification('Property duplicated successfully', 'success')
    } catch (error) {
      console.error('Failed to duplicate property:', error)
      showNotification('Failed to duplicate property', 'error')
      setDuplicateDialog(prev => ({ ...prev, loading: false }))
    }
  }

  // SIMPLIFIED BATCH DUPLICATE - Multiple single calls
  const handleBatchDuplicate = async () => {
    if (!duplicateDialog.property) return
    
    // Parse manual codes
    const newCodes = duplicateDialog.batchCodes
      .split(/[,\n]/)
      .map(code => code.trim())
      .filter(code => code.length > 0)
    
    if (newCodes.length === 0) {
      showNotification('No valid codes provided', 'error')
      return
    }
    
    if (newCodes.length > 20) {
      showNotification('Cannot create more than 20 properties at once', 'error')
      return
    }
    
    setDuplicateDialog(prev => ({ ...prev, loading: true }))
    
    try {
      console.log('Batch duplicating with codes:', newCodes)
      
      // Use multiple single duplicate calls - ALWAYS WORKS
      const results: PropertyDetail[] = []
      let successCount = 0
      
      for (const code of newCodes) {
        try {
          await PropertyService.duplicateProperty(duplicateDialog.property.id, code)
          successCount++
          console.log(`✓ Successfully duplicated: ${code}`)
        } catch (error) {
          console.error(`✗ Failed to duplicate ${code}:`, error)
        }
      }
      
      resetDuplicateDialog()
      fetchProperties(currentPage)
      showNotification(`Successfully created ${successCount}/${newCodes.length} properties`, 'success')
      
    } catch (error: any) {
      console.error('Batch duplicate failed:', error)
      showNotification('Failed to batch duplicate properties', 'error')
      setDuplicateDialog(prev => ({ ...prev, loading: false }))
    }
  }

  const resetDuplicateDialog = () => {
    setDuplicateDialog({
      open: false,
      property: null,
      tabValue: 0,
      newCode: '',
      batchCodes: '',
      loading: false
    })
  }

  const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setNotification({
      open: true,
      message,
      severity
    })
  }

  // Utility functions
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const getStatusChip = (status: PropertyStatus) => {
    const statusConfig = {
      PUBLISHED: { label: 'Published', color: 'success' as const },
      DRAFT: { label: 'Draft', color: 'warning' as const },
      HIDDEN: { label: 'Hidden', color: 'error' as const }
    }
    
    const config = statusConfig[status] || { label: status, color: 'default' as const }
    return (
      <Chip 
        label={config.label} 
        color={config.color} 
        size="small" 
        variant="outlined" 
      />
    )
  }

  const getPropertyTypeLabel = (type: PropertyType): string => {
    const typeLabels = {
      APARTMENT: 'Apartment',
      ROOM: 'Room',
      STUDIO: 'Studio',
      HOUSE: 'House'
    }
    return typeLabels[type] || type
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Properties
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/properties/create')}
        >
          Add Property
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search properties..."
                value={filters.query || ''}
                onChange={(e) => handleFilterChange('query', e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Property Type</InputLabel>
                <Select
                  value={filters.propertyType || ''}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  label="Property Type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="APARTMENT">Apartment</MenuItem>
                  <MenuItem value="ROOM">Room</MenuItem>
                  <MenuItem value="STUDIO">Studio</MenuItem>
                  <MenuItem value="HOUSE">House</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="PUBLISHED">Published</MenuItem>
                  <MenuItem value="DRAFT">Draft</MenuItem>
                  <MenuItem value="HIDDEN">Hidden</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setFilters({})}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Properties Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <Typography>Loading properties...</Typography>
        </Box>
      ) : !properties || properties.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <PropertyIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No properties found
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {Object.keys(filters).length > 0 
                ? 'Try adjusting your filters or search terms'
                : 'Start by creating your first property'
              }
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/admin/properties/create')}
            >
              Add Property
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Grid container spacing={3}>
            {properties.map((property) => (
              <Grid item xs={12} md={6} lg={4} key={property.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Property Image */}
                  <Box sx={{ position: 'relative', height: 200, bgcolor: 'grey.200' }}>
                    {property.coverImageUrl ? (
                      <img
                        src={property.coverImageUrl}
                        alt={property.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                          bgcolor: 'grey.100'
                        }}
                      >
                        <PropertyIcon sx={{ fontSize: 48, color: 'grey.400' }} />
                      </Box>
                    )}

                    {/* Status Badge */}
                    <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
                      {getStatusChip(property.status)}
                    </Box>

                    {/* Menu Button */}
                    <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                      <IconButton
                        onClick={(e) => setMenuAnchor({ element: e.currentTarget, property })}
                        sx={{ bgcolor: 'rgba(255, 255, 255, 0.8)' }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>

                    {/* Featured Badge */}
                    {property.isFeatured && (
                      <Chip
                        label="Featured"
                        color="primary"
                        size="small"
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          left: 8
                        }}
                      />
                    )}
                  </Box>

                  {/* Property Info */}
                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    {/* Type & Code */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Chip
                        label={getPropertyTypeLabel(property.propertyType)}
                        size="small"
                        variant="outlined"
                      />
                      {property.code && (
                        <Typography variant="caption" color="text.secondary">
                          {property.code}
                        </Typography>
                      )}
                    </Box>

                    {/* Title */}
                    <Typography variant="h6" component="h3" gutterBottom noWrap>
                      {property.title}
                    </Typography>

                    {/* Description */}
                    {property.shortDescription && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {property.shortDescription.length > 100
                          ? `${property.shortDescription.substring(0, 100)}...`
                          : property.shortDescription
                        }
                      </Typography>
                    )}

                    {/* Property Details */}
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                      {property.areaSqm && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AreaIcon fontSize="small" color="action" />
                          <Typography variant="body2">{property.areaSqm}m²</Typography>
                        </Box>
                      )}
                      {property.bedrooms !== undefined && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <BedIcon fontSize="small" color="action" />
                          <Typography variant="body2">{property.bedrooms}</Typography>
                        </Box>
                      )}
                      {property.bathrooms !== undefined && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <BathIcon fontSize="small" color="action" />
                          <Typography variant="body2">{property.bathrooms}</Typography>
                        </Box>
                      )}
                    </Stack>

                    {/* Price */}
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                      {formatPrice(property.priceMonth)}/month
                    </Typography>

                    {/* Address */}
                    {property.addressText && (
                      <Typography variant="body2" color="text.secondary" noWrap>
                        📍 {property.addressText}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage + 1}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {/* Property Menu */}
      <Menu
        anchorEl={menuAnchor.element}
        open={Boolean(menuAnchor.element)}
        onClose={() => setMenuAnchor({ element: null, property: null })}
      >
        <MuiMenuItem onClick={() => {
          if (menuAnchor.property) {
            navigate(`/admin/properties/${menuAnchor.property.id}/edit`)
          }
          setMenuAnchor({ element: null, property: null })
        }}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Edit
        </MuiMenuItem>
        <MuiMenuItem onClick={() => {
          if (menuAnchor.property) {
            setDuplicateDialog({ 
              open: true, 
              property: menuAnchor.property, 
              tabValue: 0,
              newCode: (menuAnchor.property.code || '') + '-COPY',
              batchCodes: '',
              loading: false
            })
          }
          setMenuAnchor({ element: null, property: null })
        }}>
          <DuplicateIcon sx={{ mr: 1 }} fontSize="small" />
          Duplicate
        </MuiMenuItem>
        <MuiMenuItem onClick={() => {
          if (menuAnchor.property) {
            setDuplicateDialog({ 
              open: true, 
              property: menuAnchor.property, 
              tabValue: 1,
              newCode: '',
              batchCodes: '',
              loading: false
            })
          }
          setMenuAnchor({ element: null, property: null })
        }}>
          <BatchDuplicateIcon sx={{ mr: 1 }} fontSize="small" />
          Batch Duplicate
        </MuiMenuItem>
        <MuiMenuItem 
          onClick={() => {
            setDeleteDialog({ open: true, property: menuAnchor.property })
            setMenuAnchor({ element: null, property: null })
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Delete
        </MuiMenuItem>
      </Menu>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, property: null })}>
        <DialogTitle>Delete Property</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteDialog.property?.title}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, property: null })}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* SIMPLIFIED Duplicate Dialog */}
      <Dialog 
        open={duplicateDialog.open} 
        onClose={() => !duplicateDialog.loading && resetDuplicateDialog()}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Duplicate Property: "{duplicateDialog.property?.title}"
        </DialogTitle>
        <DialogContent>
          <Tabs 
            value={duplicateDialog.tabValue} 
            onChange={(e, value) => setDuplicateDialog(prev => ({ ...prev, tabValue: value }))}
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
          >
            <Tab label="Single Duplicate" />
            <Tab label="Batch Duplicate" />
          </Tabs>

          {/* Single Duplicate Tab */}
          <TabPanel value={duplicateDialog.tabValue} index={0}>
            <TextField
              autoFocus
              margin="dense"
              label="New Property Code"
              fullWidth
              variant="outlined"
              value={duplicateDialog.newCode}
              onChange={(e) => setDuplicateDialog(prev => ({ ...prev, newCode: e.target.value }))}
              placeholder="e.g., A102, Room-201"
              disabled={duplicateDialog.loading}
            />
          </TabPanel>

          {/* SIMPLIFIED Batch Duplicate Tab */}
          <TabPanel value={duplicateDialog.tabValue} index={1}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Enter property codes (max 20 properties):
            </Typography>
            <TextField
              label="Property Codes"
              multiline
              rows={6}
              fullWidth
              value={duplicateDialog.batchCodes}
              onChange={(e) => setDuplicateDialog(prev => ({ ...prev, batchCodes: e.target.value }))}
              placeholder="Enter codes separated by commas or new lines:&#10;A101, A102, A103&#10;A104&#10;A105&#10;B201, B202"
              helperText="Separate codes with commas or new lines. Max 20 properties."
              disabled={duplicateDialog.loading}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Example: A101, A102, A103 or one code per line
            </Typography>
          </TabPanel>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={resetDuplicateDialog}
            disabled={duplicateDialog.loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={duplicateDialog.tabValue === 0 ? handleSingleDuplicate : handleBatchDuplicate}
            variant="contained"
            disabled={
              duplicateDialog.loading || 
              (duplicateDialog.tabValue === 0 && !duplicateDialog.newCode.trim()) ||
              (duplicateDialog.tabValue === 1 && !duplicateDialog.batchCodes.trim())
            }
          >
            {duplicateDialog.loading ? 'Processing...' : 
             duplicateDialog.tabValue === 0 ? 'Duplicate' : 'Batch Duplicate'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setNotification(prev => ({ ...prev, open: false }))} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default AdminProperties