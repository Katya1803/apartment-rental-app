// src/pages/admin/AdminProperties.tsx
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
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  Grid,
  Stack
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
  AspectRatio as AreaIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { PropertyService } from '../../services/propertyService'
import { ROUTES } from '../../config/constants'
import type { PropertySummary, PropertyType, PropertyStatus, PageResponse } from '../../types'
import type { PropertyFilters } from '../../services/propertyService'

const AdminProperties: React.FC = () => {
  const navigate = useNavigate()
  
  // State
  const [properties, setProperties] = useState<PropertySummary[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [filters, setFilters] = useState<PropertyFilters>({})
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; property: PropertySummary | null }>({
    open: false,
    property: null
  })
  const [menuAnchor, setMenuAnchor] = useState<{ element: HTMLElement | null; property: PropertySummary | null }>({
    element: null,
    property: null
  })

  // Fetch properties
  const fetchProperties = async (page = 0) => {
    try {
      setLoading(true)
      const data: PageResponse<PropertySummary> = await PropertyService.getPropertiesForAdmin(filters, page, 20)
      setProperties(data.content || [])
      setTotalPages(data.totalPages || 0)
      setCurrentPage(data.number || 0)
    } catch (error) {
      console.error('Failed to fetch properties:', error)
      setProperties([]) // Set empty array on error
      setTotalPages(0)
      setCurrentPage(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties(0)
  }, [filters])

  // Handlers
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    fetchProperties(page - 1) // MUI pagination is 1-based, API is 0-based
  }

  const handleFilterChange = (field: keyof PropertyFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value || undefined
    }))
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, property: PropertySummary) => {
    setMenuAnchor({ element: event.currentTarget, property })
  }

  const handleMenuClose = () => {
    setMenuAnchor({ element: null, property: null })
  }

  const handleEdit = (property: PropertySummary) => {
    navigate(`${ROUTES.ADMIN.PROPERTIES}/${property.id}/edit`)
    handleMenuClose()
  }

  const handleDeleteClick = (property: PropertySummary) => {
    setDeleteDialog({ open: true, property })
    handleMenuClose()
  }

  const handleDeleteConfirm = async () => {
    if (deleteDialog.property) {
      try {
        await PropertyService.deleteProperty(deleteDialog.property.id)
        setDeleteDialog({ open: false, property: null })
        fetchProperties(currentPage)
      } catch (error) {
        console.error('Failed to delete property:', error)
      }
    }
  }

  const getStatusColor = (status: PropertyStatus) => {
    switch (status) {
      case 'PUBLISHED': return 'success'
      case 'DRAFT': return 'warning'
      case 'HIDDEN': return 'default'
      default: return 'default'
    }
  }

  const getPropertyTypeIcon = (type: PropertyType) => {
    switch (type) {
      case 'APARTMENT': return '🏢'
      case 'ROOM': return '🏠'
      case 'STUDIO': return '🏙️'
      case 'HOUSE': return '🏘️'
      default: return '🏠'
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PropertyIcon />
          Properties
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/properties/new')}
        >
          Add Property
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
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
              onClick={() => navigate('/admin/properties/new')}
            >
              Add Property
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Grid container spacing={3}>
            {(properties || []).map((property) => (
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
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        height: '100%',
                        fontSize: '3rem'
                      }}>
                        {getPropertyTypeIcon(property.propertyType)}
                      </Box>
                    )}
                    
                    {/* Status Chip */}
                    <Chip
                      label={property.status}
                      color={getStatusColor(property.status)}
                      size="small"
                      sx={{ position: 'absolute', top: 8, left: 8 }}
                    />
                    
                    {/* Featured Badge */}
                    {property.isFeatured && (
                      <Chip
                        label="Featured"
                        color="primary"
                        size="small"
                        sx={{ position: 'absolute', top: 8, right: 40 }}
                      />
                    )}
                    
                    {/* Menu Button */}
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, property)}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'rgba(255,255,255,0.8)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>

                  <CardContent sx={{ flexGrow: 1 }}>
                    {/* Property Info */}
                    <Typography variant="h6" gutterBottom noWrap>
                      {property.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {property.propertyType} • {property.code}
                    </Typography>
                    
                    {property.shortDescription && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
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

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor.element}
        open={Boolean(menuAnchor.element)}
        onClose={handleMenuClose}
      >
        <MuiMenuItem onClick={() => menuAnchor.property && handleEdit(menuAnchor.property)}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Edit
        </MuiMenuItem>
        <MuiMenuItem onClick={() => menuAnchor.property && handleDeleteClick(menuAnchor.property)}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Delete
        </MuiMenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, property: null })}>
        <DialogTitle>Delete Property</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteDialog.property?.title}"? 
            This action will hide the property from public view.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, property: null })}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminProperties