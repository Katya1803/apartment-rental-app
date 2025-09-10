// app-frontend/src/pages/admin/AdminUsers.tsx - UPDATED
import React, { useState, useEffect } from 'react'
import {
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Alert
} from '@mui/material'
import {
  Add as AddIcon,
  Lock as LockIcon
} from '@mui/icons-material'
import { adminApi } from '../../config/axios'

// Simple types
interface User {
  id: number
  email: string
  fullName: string
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR'
  isActive: boolean
  createdAt: string
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  // Create user form
  const [newUser, setNewUser] = useState({
    email: '',
    fullName: '',
    role: 'EDITOR' as const,
    password: '',
    confirmPassword: ''
  })

  // Change password form
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  })

  // Load users
  const loadUsers = async () => {
    try {
      const response = await adminApi.get('/users')
      const userData = response.data.data.content || response.data.data || []
      setUsers(Array.isArray(userData) ? userData : [])
    } catch (error) {
      setMessage({type: 'error', text: 'Failed to load users'})
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  // Create user
  const handleCreateUser = async () => {
    if (newUser.password !== newUser.confirmPassword) {
      setMessage({type: 'error', text: 'Passwords do not match'})
      return
    }

    try {
      await adminApi.post('/users', {
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
        password: newUser.password
      })
      
      setMessage({type: 'success', text: 'User created successfully'})
      setCreateDialogOpen(false)
      setNewUser({email: '', fullName: '', role: 'EDITOR', password: '', confirmPassword: ''})
      loadUsers()
    } catch (error: any) {
      setMessage({type: 'error', text: error.response?.data?.message || 'Failed to create user'})
    }
  }

  // Change password
  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({type: 'error', text: 'Passwords do not match'})
      return
    }

    try {
      await adminApi.post(`/users/${selectedUserId}/change-password`, {
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword
      })
      
      setMessage({type: 'success', text: 'Password changed successfully'})
      setPasswordDialogOpen(false)
      setPasswordForm({newPassword: '', confirmPassword: ''})
    } catch (error: any) {
      setMessage({type: 'error', text: error.response?.data?.message || 'Failed to change password'})
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'error'
      case 'ADMIN': return 'primary'
      case 'EDITOR': return 'secondary'
      default: return 'default'
    }
  }

  if (loading) return <Box sx={{p: 3}}>Loading...</Box>

  return (
    <Box sx={{p: 3}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          User Management
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateDialogOpen(true)}>
          Create User
        </Button>
      </Box>

      {message && (
        <Alert severity={message.type} sx={{mb: 2}} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users && users.length > 0 ? users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip label={user.role} color={getRoleColor(user.role)} size="small" />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.isActive ? 'Active' : 'Inactive'} 
                    color={user.isActive ? 'success' : 'default'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <IconButton 
                    size="small" 
                    onClick={() => {
                      setSelectedUserId(user.id)
                      setPasswordDialogOpen(true)
                    }}
                  >
                    <LockIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create User Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <Box sx={{pt: 1}}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              sx={{mb: 2}}
            />
            <TextField
              fullWidth
              label="Full Name"
              value={newUser.fullName}
              onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
              sx={{mb: 2}}
            />
            <FormControl fullWidth sx={{mb: 2}}>
              <InputLabel>Role</InputLabel>
              <Select
                value={newUser.role}
                label="Role"
                onChange={(e) => setNewUser({...newUser, role: e.target.value as any})}
              >
                <MenuItem value="EDITOR">Editor</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              sx={{mb: 2}}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={newUser.confirmPassword}
              onChange={(e) => setNewUser({...newUser, confirmPassword: e.target.value})}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateUser} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{pt: 1}}>
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
              sx={{mb: 2}}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleChangePassword} variant="contained">Change Password</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminUsers