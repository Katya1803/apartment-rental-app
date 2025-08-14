import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  Visibility,
  VisibilityOff
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { adminApi } from '../../config/axios'
import { Property } from '../../types/common'
import { formatDate, formatPriceRange } from '../../utils/helpers'

const AdminProperties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; property: Property | null }>({
    open: false,
    property: null
  })
  const [error, setError] = useState<string | null>(null)
  
  const navigate = useNavigate()

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await adminApi.get('/properties')
      console.log('API Response:', response.data) // Debug log
      
      // Handle different response structures
      let propertiesData = []
      if (response.data?.data?.content) {
        // Paginated response
        propertiesData = response.data.data.content
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        // Direct array response
        propertiesData = response.data.data
      } else if (Array.isArray(response.data)) {
        // Raw array response
        propertiesData = response.data
      } else {
        console.error('Unexpected response structure:', response.data)
        propertiesData = []
      }
      
      setProperties(Array.isArray(propertiesData) ? propertiesData : [])
    } catch (error: any) {
      setError('Failed to fetch properties')
      console.error('Error fetching properties:', error)
      setProperties([]) // Ensure properties is always an array
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (property: Property) => {
    try {
      await adminApi.patch(`/properties/${property.id}/toggle-active`)
      fetchProperties()
    } catch (error) {
      setError('Failed to update property status')
    }
  }

  const handleDeleteClick = (property: Property) => {
    setDeleteDialog({ open: true, property })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.property) return

    try {
      await adminApi.delete(`/properties/${deleteDialog.property.id}`)
      setDeleteDialog({ open: false, property: null })
      fetchProperties()
    } catch (error) {
      setError('Failed to delete property')
      setDeleteDialog({ open: false, property: null })
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, property: null })
  }

  const getPropertyTitle = (property: Property): string => {
    if (property.title && typeof property.title === 'object') {
      return property.title.vi || property.title.en || property.title.ja || 'Untitled'
    }
    return 'Untitled'
  }

  const getPropertyTypeColor = (type: string) => {
    switch (type) {
      case 'APARTMENT': return 'primary'
      case 'ROOM': return 'secondary'
      case 'STUDIO': return 'success'
      case 'HOUSE': return 'warning'
      default: return 'default'
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Properties Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/admin/properties/new')}
        >
          Add Property
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Debug info - remove in production */}
      {import.meta.env.DEV && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Debug: Properties is {Array.isArray(properties) ? 'array' : typeof properties} with {Array.isArray(properties) ? properties.length : 'N/A'} items
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>District</TableCell>
              <TableCell>Price Range</TableCell>
              <TableCell>Units</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : !Array.isArray(properties) || properties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  {!Array.isArray(properties) ? 'Error: Invalid data format' : 'No properties found'}
                </TableCell>
              </TableRow>
            ) : (
              properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">
                        {getPropertyTitle(property)}
                      </Typography>
                      {property.featured && (
                        <Chip label="Featured" size="small" color="warning" sx={{ mt: 0.5 }} />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={property.propertyType}
                      color={getPropertyTypeColor(property.propertyType) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{property.district}</TableCell>
                  <TableCell>
                    {formatPriceRange(property.priceRange.min, property.priceRange.max)}
                  </TableCell>
                  <TableCell>
                    {property.availableUnits} / {property.totalUnits}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={property.active ? 'Active' : 'Inactive'}
                      color={property.active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(property.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/admin/properties/${property.id}/edit`)}
                        title="Edit"
                      >
                        <Edit />
                      </IconButton>
                      
                      <IconButton
                        size="small"
                        onClick={() => handleToggleActive(property)}
                        title={property.active ? 'Deactivate' : 'Activate'}
                      >
                        {property.active ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                      
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(property)}
                        title="Delete"
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteDialog.property ? getPropertyTitle(deleteDialog.property) : ''}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminProperties