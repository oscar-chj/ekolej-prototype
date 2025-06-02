'use client';

import { UserRole } from '@/types/auth.types';
import {
  AssessmentOutlined,
  Dashboard,
  EventNote,
  Logout,
  Person,
  Settings
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo } from 'react';

/**
 * Navigation item structure
 */
interface NavigationItem {
  text: string;
  icon: React.ReactNode;
  href: string;
  roles?: UserRole[];
  tooltip?: string;
}

/**
 * Sidebar component props
 */
interface SidebarProps {
  onItemClick?: () => void;
}

// Sample user profile data - in a real app this would come from context/state
const userProfile = {
  name: 'John Doe',
  role: UserRole.STUDENT,
  avatar: '/default-avatar.png',
  studentId: 'S12345',
  faculty: 'Computer Science',
  year: '3'
};

// Main navigation menu items
const mainNavigationItems: NavigationItem[] = [
  { 
    text: 'Dashboard', 
    icon: <Dashboard />, 
    href: '/dashboard',
    tooltip: 'View your dashboard' 
  },
  { 
    text: 'Merit Points', 
    icon: <AssessmentOutlined />, 
    href: '/dashboard/merits',
    tooltip: 'View and manage your merit points' 
  },
  { 
    text: 'Events', 
    icon: <EventNote />, 
    href: '/dashboard/events',
    tooltip: 'Browse and register for events' 
  },
  { 
    text: 'Profile', 
    icon: <Person />, 
    href: '/dashboard/profile',
    tooltip: 'View and edit your profile' 
  },
  { 
    text: 'Settings', 
    icon: <Settings />, 
    href: '/dashboard/settings',
    tooltip: 'Manage your account settings',
    roles: [UserRole.ADMIN, UserRole.STUDENT]
  },
];

/**
 * Sidebar component providing navigation for the dashboard
 */
const Sidebar = memo(function Sidebar({ onItemClick }: SidebarProps) {
  const pathname = usePathname();
  
  // Filter navigation items based on user role
  const visibleNavItems = mainNavigationItems.filter(item => 
    !item.roles || item.roles.includes(userProfile.role)
  );

  const handleItemClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <>
      {/* User Profile Section */}
      <Box sx={{ p: 2, pt: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <Avatar 
            sx={{ width: 80, height: 80, mb: 1.5 }} 
            alt={userProfile.name} 
            src={userProfile.avatar}
          />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {userProfile.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {userProfile.role}
          </Typography>
        </Box>

        {/* Student Information Card */}
        {userProfile.role === UserRole.STUDENT && (
          <Stack 
            spacing={0.5} 
            sx={{ 
              p: 1.5, 
              bgcolor: 'background.default', 
              borderRadius: 2, 
              mb: 3 
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Student ID: {userProfile.studentId}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Faculty: {userProfile.faculty}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Year: {userProfile.year}
            </Typography>
          </Stack>
        )}
      </Box>

      <Divider sx={{ mx: 2 }} />

      {/* Main Navigation */}
      <List sx={{ pt: 1, px: 1 }}>
        {visibleNavItems.map((item) => {
          const isSelected = pathname === item.href;
          
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={item.tooltip || ''} placement="right" arrow>
                <ListItemButton 
                  component={Link} 
                  href={item.href}
                  selected={isSelected}
                  onClick={handleItemClick}
                  sx={{ 
                    borderRadius: 1,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'primary.contrastText',
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ 
                      fontWeight: isSelected ? 500 : 400 
                    }} 
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      {/* Spacer */}
      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ mx: 2 }} />
      
      {/* Logout Section */}
      <List sx={{ p: 1 }}>
        <ListItem disablePadding>
          <Tooltip title="Sign out of your account" placement="right" arrow>
            <ListItemButton 
              component={Link} 
              href="/auth/logout"
              onClick={handleItemClick}
              sx={{ 
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'error.lighter',
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Logout color="error" />
              </ListItemIcon>
              <ListItemText 
                primary="Logout" 
                primaryTypographyProps={{ color: 'error' }} 
              />
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>
    </>
  );
});

export default Sidebar;