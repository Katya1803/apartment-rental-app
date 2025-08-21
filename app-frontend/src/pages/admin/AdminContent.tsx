// app-frontend/src/pages/admin/AdminContent.tsx  
import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Tab,
  Tabs,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress
} from '@mui/material'
import {
  Article as ContentIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material'
import { 
  contentPageService, 
} from '../../services/contentPageService'

import type { ContentPageUpdateRequest } from '../../services/contentPageService'
import type { ContentPageCreateRequest } from '../../services/contentPageService'
import type { ContentPage, PropertyStatus, Locale, PageResponse } from '../../types'
import { useAuthStore } from '../../stores/authStore'

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

const AdminContent: React.FC = () => {
  const { user } = useAuthStore()
  const [pages, setPages] = useState<ContentPage[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | ''>('')
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPage, setEditingPage] = useState<ContentPage | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  // Form states
  const [tabValue, setTabValue] = useState(0)
  const [formData, setFormData] = useState({
    slug: '',
    status: 'DRAFT' as PropertyStatus,
    translations: {
      vi: { title: '', content: '', metaDescription: '' },
      en: { title: '', content: '', metaDescription: '' },
      ja: { title: '', content: '', metaDescription: '' }
    }
  })

  const locales: Locale[] = ['vi', 'en', 'ja']
  const localeLabels = {
    vi: 'Tiếng Việt',
    en: 'English',
    ja: '日本語'
  }

  const statusLabels = {
    DRAFT: 'Draft',
    PUBLISHED: 'Published',
    HIDDEN: 'Hidden'
  }

  const statusColors = {
    DRAFT: 'warning',
    PUBLISHED: 'success',
    HIDDEN: 'error'
  } as const

  useEffect(() => {
    loadPages()
  }, [page, size, statusFilter])

  const loadPages = async () => {
    try {
      setLoading(true)
      const response: PageResponse<ContentPage> = await contentPageService.getAllPages({
        page,
        size,
        status: statusFilter || undefined,
        locale: 'vi'
      })
      
      setPages(response.items)
      setTotalPages(response.totalPages)
      setTotalElements(response.totalElements)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load content pages' })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (pageData?: ContentPage) => {
    if (pageData) {
      setEditingPage(pageData)
      setFormData({
        slug: pageData.slug,
        status: pageData.status,
        translations: {
          vi: {
            title: pageData.translations.vi?.title || '',
            content: pageData.translations.vi?.bodyMd || '', // ⚠️ SỬA: content -> bodyMd
            metaDescription: pageData.translations.vi?.metaDescription || ''
          },
          en: {
            title: pageData.translations.en?.title || '',
            content: pageData.translations.en?.bodyMd || '', // ⚠️ SỬA: content -> bodyMd
            metaDescription: pageData.translations.en?.metaDescription || ''
          },
          ja: {
            title: pageData.translations.ja?.title || '',
            content: pageData.translations.ja?.bodyMd || '', // ⚠️ SỬA: content -> bodyMd
            metaDescription: pageData.translations.ja?.metaDescription || ''
          }
        }
      })
    } else {
      setEditingPage(null)
      setFormData({
        slug: '',
        status: 'DRAFT',
        translations: {
          vi: { title: '', content: '', metaDescription: '' },
          en: { title: '', content: '', metaDescription: '' },
          ja: { title: '', content: '', metaDescription: '' }
        }
      })
    }
    setDialogOpen(true)
    setTabValue(0)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingPage(null)
    setMessage(null)
  }

  const handleInputChange = (field: string, value: any, locale?: Locale) => {
    if (locale) {
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
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  // ⚠️ THÊM: Helper function để map từ 'content' thành 'bodyMd'
  const mapTranslationsForAPI = (translations: any) => {
    const result: any = {}
    Object.entries(translations).forEach(([locale, data]: [string, any]) => {
      result[locale] = {
        title: data.title,
        bodyMd: data.content, // ⚠️ MAP: content -> bodyMd
      }
    })
    return result
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      if (editingPage) {
        // Update existing page
        const updateData: ContentPageUpdateRequest = {
          slug: formData.slug,
          status: formData.status,
          translations: mapTranslationsForAPI(formData.translations) // ⚠️ SỬ DỤNG mapper
        }
        await contentPageService.updatePage(editingPage.id, updateData)
        setMessage({ type: 'success', text: 'Page updated successfully' })
      } else {
        // Create new page
        const createData: ContentPageCreateRequest = {
          slug: formData.slug,
          status: formData.status,
          translations: mapTranslationsForAPI(formData.translations) // ⚠️ SỬ DỤNG mapper
        }
        await contentPageService.createPage(createData)
        setMessage({ type: 'success', text: 'Page created successfully' })
      }
      
      await loadPages()
      handleCloseDialog()
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to save page' 
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (pageId: number) => {
    if (!window.confirm('Are you sure you want to delete this page?'))
      return
    
    try {
      await contentPageService.deletePage(pageId)
      setMessage({ type: 'success', text: 'Page deleted successfully' })
      await loadPages()
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete page' })
    }
  }

  const canEdit = user?.role && ['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(user.role)
  const canDelete = user?.role && ['SUPER_ADMIN', 'ADMIN'].includes(user.role)

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ContentIcon />
          Content Management
        </Typography>
        
        {canEdit && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Page
          </Button>
        )}
      </Box>

      {message && (
        <Alert 
          severity={message.type} 
          sx={{ mb: 3 }}
          onClose={() => setMessage(null)}
        >
          {message.text}
        </Alert>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value as PropertyStatus)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="DRAFT">Draft</MenuItem>
                <MenuItem value="PUBLISHED">Published</MenuItem>
                <MenuItem value="HIDDEN">Hidden</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title (VI)</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Published</TableCell>
              <TableCell>Updated</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : pages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No content pages found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              pages.map((contentPage) => (
                <TableRow key={contentPage.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {contentPage.translations.vi?.title || contentPage.slug}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {contentPage.slug}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={statusLabels[contentPage.status]}
                      color={statusColors[contentPage.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {contentPage.publishedAt ? new Date(contentPage.publishedAt).toLocaleDateString() : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(contentPage.updatedAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      {contentPage.status === 'PUBLISHED' && (
                        <IconButton size="small" color="info">
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      )}
                      {canEdit && (
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleOpenDialog(contentPage)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                      {canDelete && (
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDelete(contentPage.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalElements}
          rowsPerPage={size}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setSize(parseInt(e.target.value, 10))
            setPage(0)
          }}
        />
      </TableContainer>

      {/* Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { minHeight: '70vh' } }}
      >
        <DialogTitle>
          {editingPage ? 'Edit Content Page' : 'Create Content Page'}
        </DialogTitle>
        
        <DialogContent dividers>
          {/* Basic Information */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                helperText="URL-friendly identifier (e.g., about-us)"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <MenuItem value="DRAFT">Draft</MenuItem>
                  <MenuItem value="PUBLISHED">Published</MenuItem>
                  <MenuItem value="HIDDEN">Hidden</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Translations Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
              {locales.map((locale, _index) => (
                <Tab key={locale} label={localeLabels[locale]} />
              ))}
            </Tabs>
          </Box>

          <Box>
            {locales.map((locale, index) => (
              <TabPanel key={locale} value={tabValue} index={index}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Title"
                      value={formData.translations[locale].title}
                      onChange={(e) => handleInputChange('title', e.target.value, locale)}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Meta Description"
                      value={formData.translations[locale].metaDescription}
                      onChange={(e) => handleInputChange('metaDescription', e.target.value, locale)}
                      helperText="SEO description for search engines"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Content"
                      value={formData.translations[locale].content}
                      onChange={(e) => handleInputChange('content', e.target.value, locale)}
                      multiline
                      rows={8}
                      helperText="Supports HTML and Markdown"
                      required
                    />
                  </Grid>
                </Grid>
              </TabPanel>
            ))}
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminContent