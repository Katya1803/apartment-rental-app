// app-frontend/src/components/admin/AdminLayout.tsx
import React, { useState } from 'react'
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  Message as MessageIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  Article as ArticleIcon,
  Logout as LogoutIcon,
  Lock as LockIcon,
  AccountCircle as AccountIcon
} from '@mui/icons-material'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { ROUTES, APP_NAME } from '../../config/constants'
import { AuthService } from '../../services/authService'
import type { UserRole } from '../../types'

// Constants
const DRAWER_WIDTH = 280

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  
  // States
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null)
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordMessage, setPasswordMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const [passwordLoading, setPasswordLoading] = useState(false)

  // Handlers
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null)
  }

  const handleLogout = async () => {
    handleUserMenuClose()
    await logout()
    navigate('/admin/login')
  }

  const handleChangePasswordOpen = () => {
    handleUserMenuClose()
    setChangePasswordOpen(true)
    setPasswordMessage(null)
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  const handleChangePasswordClose = () => {
    setChangePasswordOpen(false)
    setPasswordMessage(null)
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  const handleChangePassword = async () => {
    // Validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordMessage({type: 'error', text: 'All fields are required'})
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({type: 'error', text: 'Passwords do not match'})
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage({type: 'error', text: 'Password must be at least 6 characters'})
      return
    }

    if (passwordForm.newPassword === passwordForm.currentPassword) {
      setPasswordMessage({type: 'error', text: 'New password must be different from current password'})
      return
    }

    try {
      setPasswordLoading(true)
      setPasswordMessage(null)

      // Use AuthService with correct endpoint
      await AuthService.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      )
      
      setPasswordMessage({type: 'success', text: 'Password changed successfully!'})
      setPasswordForm({currentPassword: '', newPassword: '', confirmPassword: ''})
      
      // Auto close after 2 seconds
      setTimeout(() => {
        setChangePasswordOpen(false)
        setPasswordMessage(null)
      }, 2000)

    } catch (error: any) {
      console.error('Change password error:', error)
      const errorMessage = error.response?.data?.message || 'Failed to change password'
      setPasswordMessage({type: 'error', text: errorMessage})
    } finally {
      setPasswordLoading(false)
    }
  }

  // Helper functions
  const getUserRoleColor = (role: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'error'
      case 'ADMIN': return 'primary'
      case 'EDITOR': return 'secondary'
      default: return 'default'
    }
  }

  const getUserRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'Super Admin'
      case 'ADMIN': return 'Admin'
      case 'EDITOR': return 'Editor'
      default: return role
    }
  }

  const getNavigationItems = () => {
    const baseItems = [
      {
        text: 'Dashboard',
        icon: <DashboardIcon />,
        path: '/admin/dashboard',
        roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR']
      },
      {
        text: 'Quản lý phòng cho thuê',
        icon: <HomeIcon />,
        path: '/admin/properties',
        roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR']
      }
    ]

    const adminItems = [
      {
        text: 'Quản lý tin nhắn',
        icon: <MessageIcon />,
        path: '/admin/messages',
        roles: ['SUPER_ADMIN', 'ADMIN']
      },
      {
        text: 'Quản lý nội dung',
        icon: <ArticleIcon />,
        path: '/admin/content',
        roles: ['SUPER_ADMIN', 'ADMIN']
      },
      {
        text: 'Quản lý cài đặt',
        icon: <SettingsIcon />,
        path: '/admin/settings',
        roles: ['SUPER_ADMIN', 'ADMIN']
      }
    ]

    const superAdminItems = [
      {
        text: 'Quản lý người dùng',
        icon: <PeopleIcon />,
        path: '/admin/users',
        roles: ['SUPER_ADMIN']
      }
    ]

    return [...baseItems, ...adminItems, ...superAdminItems]
      .filter(item => user && item.roles.includes(user.role))
  }

  // Drawer content
  const drawer = (
    <Box>
      <Toolbar sx={{ px: 3 }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
          {APP_NAME}
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ px: 2, py: 1 }}>
        {getNavigationItems().map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  }
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ fontSize: '0.9rem' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          zIndex: theme.zIndex.drawer + 1
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin Panel
          </Typography>

          {user && (
            <>
              <Chip
                label={getUserRoleLabel(user.role)}
                color={getUserRoleColor(user.role)}
                size="small"
                sx={{ mr: 2 }}
              />
              
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="user-menu"
                aria-haspopup="true"
                onClick={handleUserMenuClick}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {user.fullName.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          bgcolor: 'grey.50',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Spacer for fixed AppBar */}
        <Toolbar />
        
        {/* Page Content */}
        <Box sx={{ flexGrow: 1, p: 3 }}>
          {children}
        </Box>
      </Box>

      {/* User Menu */}
      <Menu
        id="user-menu"
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: { minWidth: 200 }
        }}
      >
        {/* User Info */}
        <MenuItem disabled sx={{ opacity: 1 }}>
          <ListItemIcon>
            <AccountIcon fontSize="small" />
          </ListItemIcon>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {user?.fullName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </MenuItem>
        
        <Divider />
        
        {/* Change Password */}
        <MenuItem onClick={handleChangePasswordOpen}>
          <ListItemIcon>
            <LockIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Change Password</ListItemText>
        </MenuItem>
        
        {/* Logout */}
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

      {/* Change Password Dialog */}
      <Dialog 
        open={changePasswordOpen} 
        onClose={handleChangePasswordClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LockIcon color="primary" />
            Change Password
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          {passwordMessage && (
            <Alert 
              severity={passwordMessage.type} 
              sx={{ mb: 2 }}
              onClose={() => setPasswordMessage(null)}
            >
              {passwordMessage.text}
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
              disabled={passwordLoading}
              autoComplete="current-password"
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
              disabled={passwordLoading}
              autoComplete="new-password"
              helperText="Minimum 6 characters"
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
              disabled={passwordLoading}
              autoComplete="new-password"
            />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleChangePasswordClose}
            disabled={passwordLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleChangePassword} 
            variant="contained"
            disabled={
              passwordLoading ||
              !passwordForm.currentPassword || 
              !passwordForm.newPassword || 
              !passwordForm.confirmPassword
            }
            sx={{ minWidth: 120 }}
          >
            {passwordLoading ? 'Changing...' : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminLayout