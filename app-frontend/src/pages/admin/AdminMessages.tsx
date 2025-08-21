// app-frontend/src/pages/admin/AdminMessages.tsx
import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
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
  Button,
  TextField,
  Stack,
  Card,
  CardContent,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Tooltip
} from '@mui/material'
import {
  Message as MessageIcon,
  Visibility as ViewIcon,
  CheckCircle as HandleIcon,
  Search as SearchIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as PropertyIcon,
  Person as PersonIcon,
  Close as CloseIcon
} from '@mui/icons-material'
import { ContactService } from '../../services/contactServices'
import type { ContactMessage, PageResponse } from '../../types'

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

const AdminMessages: React.FC = () => {
  const [tabValue, setTabValue] = useState(0)
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [processing, setProcessing] = useState<number | null>(null)
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)
  
  // Success/Error states
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    loadMessages()
  }, [tabValue, page, size])

  const loadMessages = async () => {
    try {
      setLoading(true)
      let response: PageResponse<ContactMessage>
      
      if (searchQuery.trim()) {
        response = await ContactService.searchMessages(searchQuery, page, size)
      } else {
        // Tab 0: All, Tab 1: Unhandled, Tab 2: Handled
        if (tabValue === 1) {
          response = await ContactService.getMessages(false, page, size) // unhandled
        } else if (tabValue === 2) {
          response = await ContactService.getMessages(true, page, size) // handled
        } else {
          // Get all messages using unhandled endpoint with larger size
          const unhandledResponse = await ContactService.getMessages(false, page, size)
          const handledResponse = await ContactService.getMessages(true, page, size)
          
          // Combine and sort by date
          const allMessages = [...unhandledResponse.items, ...handledResponse.items]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          
          response = {
            items: allMessages,
            totalElements: unhandledResponse.totalElements + handledResponse.totalElements,
            totalPages: Math.ceil((unhandledResponse.totalElements + handledResponse.totalElements) / size),
            size,
            number: page,
            first: page === 0,
            last: page >= Math.ceil((unhandledResponse.totalElements + handledResponse.totalElements) / size) - 1,
            numberOfElements: allMessages.length
          }
        }
      }
      
      setMessages(response.items)
      setTotalPages(response.totalPages)
      setTotalElements(response.totalElements)
      
    } catch (error) {
      console.error('Failed to load messages:', error)
      setMessage({ type: 'error', text: 'Failed to load messages' })
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadMessages()
      return
    }
    
    try {
      setSearching(true)
      setPage(0) // Reset to first page
      const response = await ContactService.searchMessages(searchQuery, 0, size)
      setMessages(response.items)
      setTotalPages(response.totalPages)
      setTotalElements(response.totalElements)
    } catch (error) {
      console.error('Search failed:', error)
      setMessage({ type: 'error', text: 'Search failed' })
    } finally {
      setSearching(false)
    }
  }

  const handleViewMessage = async (messageId: number) => {
    try {
      const messageDetail = await ContactService.getMessageById(messageId)
      setSelectedMessage(messageDetail)
      setViewDialogOpen(true)
    } catch (error) {
      console.error('Failed to load message detail:', error)
      setMessage({ type: 'error', text: 'Failed to load message detail' })
    }
  }

  const handleMarkAsHandled = async (messageId: number) => {
    try {
      setProcessing(messageId)
      await ContactService.markMessageAsHandled(messageId)
      setMessage({ type: 'success', text: 'Message marked as handled' })
      
      // Refresh messages
      await loadMessages()
    } catch (error) {
      console.error('Failed to mark message as handled:', error)
      setMessage({ type: 'error', text: 'Failed to mark message as handled' })
    } finally {
      setProcessing(null)
    }
  }

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
    setPage(0)
    setSearchQuery('')
  }

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSize(parseInt(event.target.value, 10))
    setPage(0)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getUnhandledCount = () => {
    return messages.filter(m => !m.isHandled).length
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <MessageIcon />
        Messages
        {!loading && tabValue === 1 && (
          <Chip 
            label={`${getUnhandledCount()} unhandled`} 
            color="warning" 
            size="small" 
          />
        )}
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

      {/* Search */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            fullWidth
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button
            variant="contained"
            startIcon={searching ? <CircularProgress size={20} /> : <SearchIcon />}
            onClick={handleSearch}
            disabled={searching}
          >
            Search
          </Button>
          {searchQuery && (
            <Button onClick={() => { setSearchQuery(''); loadMessages(); }}>
              Clear
            </Button>
          )}
        </Stack>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="All Messages" />
          <Tab label="Unhandled" />
          <Tab label="Handled" />
        </Tabs>
      </Paper>

      {/* Messages Table */}
      <TabPanel value={tabValue} index={tabValue}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>From</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Property</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : messages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="text.secondary">
                      {searchQuery ? 'No messages found' : 'No messages yet'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                messages.map((msg) => (
                  <TableRow key={msg.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {msg.fullName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {msg.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {msg.subject || 'No subject'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {msg.property ? (
                        <Typography variant="body2" color="primary">
                          {msg.property.title}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          General inquiry
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(msg.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={msg.isHandled ? 'Handled' : 'Unhandled'}
                        color={msg.isHandled ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="View message">
                          <IconButton
                            size="small"
                            onClick={() => handleViewMessage(msg.id)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        
                        {!msg.isHandled && (
                          <Tooltip title="Mark as handled">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleMarkAsHandled(msg.id)}
                              disabled={processing === msg.id}
                            >
                              {processing === msg.id ? (
                                <CircularProgress size={16} />
                              ) : (
                                <HandleIcon />
                              )}
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {!loading && messages.length > 0 && (
            <TablePagination
              component="div"
              count={totalElements}
              page={page}
              onPageChange={handlePageChange}
              rowsPerPage={size}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          )}
        </TableContainer>
      </TabPanel>

      {/* View Message Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Message Details</Typography>
            <IconButton onClick={() => setViewDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent dividers>
          {selectedMessage && (
            <Stack spacing={3}>
              {/* Contact Info */}
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon />
                    Contact Information
                  </Typography>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight="medium">Name:</Typography>
                      <Typography variant="body2">{selectedMessage.fullName}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon fontSize="small" />
                      <Typography variant="body2">{selectedMessage.email}</Typography>
                    </Box>
                    {selectedMessage.phone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon fontSize="small" />
                        <Typography variant="body2">{selectedMessage.phone}</Typography>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              {/* Property Info */}
              {selectedMessage.property && (
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PropertyIcon />
                      Related Property
                    </Typography>
                    <Typography variant="body2" color="primary">
                      {selectedMessage.property.title}
                    </Typography>
                  </CardContent>
                </Card>
              )}

              {/* Message Content */}
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Subject: {selectedMessage.subject || 'No subject'}
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 2 }}>
                    {selectedMessage.message}
                  </Typography>
                </CardContent>
              </Card>

              {/* Status Info */}
              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight="medium">Status:</Typography>
                      <Chip
                        label={selectedMessage.isHandled ? 'Handled' : 'Unhandled'}
                        color={selectedMessage.isHandled ? 'success' : 'warning'}
                        size="small"
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight="medium">Received:</Typography>
                      <Typography variant="body2">{formatDate(selectedMessage.createdAt)}</Typography>
                    </Box>
                    {selectedMessage.isHandled && selectedMessage.handledAt && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight="medium">Handled:</Typography>
                        <Typography variant="body2">{formatDate(selectedMessage.handledAt)}</Typography>
                      </Box>
                    )}
                    {selectedMessage.responseTimeFormatted && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight="medium">Response time:</Typography>
                        <Typography variant="body2">{selectedMessage.responseTimeFormatted}</Typography>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 2 }}>
          {selectedMessage && !selectedMessage.isHandled && (
            <Button
              variant="contained"
              color="success"
              startIcon={processing === selectedMessage.id ? <CircularProgress size={16} /> : <HandleIcon />}
              onClick={() => {
                handleMarkAsHandled(selectedMessage.id)
                setViewDialogOpen(false)
              }}
              disabled={processing === selectedMessage.id}
            >
              Mark as Handled
            </Button>
          )}
          
          <Button
            variant="outlined"
            onClick={() => setViewDialogOpen(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminMessages