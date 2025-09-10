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
  Alert
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
import { ROUTES, DRAWER_WIDTH, APP_NAME } from '../../config/constants'
import { adminApi } from '../../config/axios'
import type { UserRole } from '../../types'

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null)
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordMessage, setPasswordMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

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
    navigate(ROUTES.ADMIN.LOGIN)
  }

  const handleChangePassword = async () => {
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

    try {
      await adminApi.post('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
      
      setPasswordMessage({type: 'success', text: 'Password changed successfully!'})
      setPasswordForm({currentPassword: '', newPassword: '', confirmPassword: ''})
      
      setTimeout(() => {
        setChangePasswordOpen(false)
        setPasswordMessage(null)
      }, 2000)
    } catch (error: any) {
      setPasswordMessage({type: 'error', text: error.response?.data?.message || 'Failed to change password'})
    }
  }

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
        path: ROUTES.ADMIN.DASHBOARD,
        roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR']
      },
      {
        text: 'Quản lý phòng cho thuê',
        icon: <HomeIcon />,
        path: ROUTES.ADMIN.PROPERTIES,
        roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR']
      }
    ]

    const adminItems = [
      {
        text: 'Quản lý tin nhắn',
        icon: <MessageIcon />,
        path: ROUTES.ADMIN.MESSAGES,
        roles: ['SUPER_ADMIN', 'ADMIN']
      },
      {
        text: 'Quản lý nội dung',
        icon: <ArticleIcon />,
        path: ROUTES.ADMIN.CONTENT,
        roles: ['SUPER_ADMIN', 'ADMIN']
      },
      {
        text: 'Quản lý cài đặt',
        icon: <SettingsIcon />,
        path: ROUTES.ADMIN.SETTINGS,
        roles: ['SUPER_ADMIN', 'ADMIN']
      }
    ]

    const superAdminItems = [
      {
        text: 'Quản lý người dùng',
        icon: <PeopleIcon />,
        path: ROUTES.ADMIN.USERS,
        roles: ['SUPER_ADMIN']
      }
    ]

    return [...baseItems, ...adminItems, ...superAdminItems].filter(item =>
      user && item.roles.includes(user.role)
    )
  }

  const navigationItems = getNavigationItems()

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          {APP_NAME} Admin
        </Typography>
      </Toolbar>
      <Divider />
      
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText'
                  }
                }
              }}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
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
          bgcolor: 'grey.50'
        }}
      >
        <Toolbar /> {/* Spacer for fixed AppBar */}
        {children}
      </Box>

      {/* User Menu */}
      <Menu
        id="user-menu"
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleUserMenuClose} disabled>
          <ListItemIcon>
            <AccountIcon fontSize="small" />
          </ListItemIcon>
          <Box>
            <Typography variant="subtitle2">{user?.fullName}</Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={() => {
          handleUserMenuClose()
          setChangePasswordOpen(true)
        }}>
          <ListItemIcon>
            <LockIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Change Password</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          {passwordMessage && (
            <Alert severity={passwordMessage.type} sx={{mb: 2}}>
              {passwordMessage.text}
            </Alert>
          )}
          <Box sx={{pt: 1}}>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
              sx={{mb: 2}}
            />
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
          <Button onClick={() => {
            setChangePasswordOpen(false)
            setPasswordMessage(null)
            setPasswordForm({currentPassword: '', newPassword: '', confirmPassword: ''})
          }}>
            Cancel
          </Button>
          <Button 
            onClick={handleChangePassword} 
            variant="contained"
            disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminLayout