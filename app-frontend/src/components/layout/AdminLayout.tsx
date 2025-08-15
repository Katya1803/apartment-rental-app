import React from 'react'
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
  Chip
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  Message as MessageIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Article as ArticleIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { ROUTES, DRAWER_WIDTH, APP_NAME } from '../../config/constants'
import type { UserRole } from '../../types'

interface AdminLayoutProps {
  children: React.ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [userMenuAnchor, setUserMenuAnchor] = React.useState<null | HTMLElement>(null)

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

  // Navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      {
        text: 'Dashboard',
        icon: <DashboardIcon />,
        path: ROUTES.ADMIN.DASHBOARD,
        roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR']
      },
      {
        text: 'Properties',
        icon: <HomeIcon />,
        path: ROUTES.ADMIN.PROPERTIES,
        roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR']
      }
    ]

    const adminItems = [
      {
        text: 'Messages',
        icon: <MessageIcon />,
        path: ROUTES.ADMIN.MESSAGES,
        roles: ['SUPER_ADMIN', 'ADMIN']
      },
      {
        text: 'Content',
        icon: <ArticleIcon />,
        path: ROUTES.ADMIN.CONTENT,
        roles: ['SUPER_ADMIN', 'ADMIN']
      },
      {
        text: 'Settings',
        icon: <SettingsIcon />,
        path: ROUTES.ADMIN.SETTINGS,
        roles: ['SUPER_ADMIN', 'ADMIN']
      }
    ]

    const superAdminItems = [
      {
        text: 'Users',
        icon: <PersonIcon />,
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
              onClick={() => setMobileOpen(false)}
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
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` }
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin Panel
          </Typography>

          {/* User Menu */}
          {user && (
            <>
              <Chip
                label={getUserRoleLabel(user.role)}
                color={getUserRoleColor(user.role)}
                size="small"
                sx={{ mr: 2 }}
              />
              
              <IconButton
                color="inherit"
                onClick={handleUserMenuClick}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {user.fullName.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
              >
                <MenuItem disabled>
                  <Box>
                    <Typography variant="subtitle2">{user.fullName}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH 
            }
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH 
            }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` }
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  )
}

export default AdminLayout