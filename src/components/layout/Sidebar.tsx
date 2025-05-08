'use client';

import {
  AssessmentOutlined as AssessmentIcon,
  Dashboard as DashboardIcon,
  EventNote as EventIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography
} from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Sample user profile data
const userProfile = {
  name: 'John Doe',
  role: 'Student',
  avatar: '/public/default-avatar.png',
  studentId: 'S12345',
  faculty: 'Computer Science',
  year: '3'
};

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, href: '/dashboard' },
  { text: 'Merit Points', icon: <AssessmentIcon />, href: '/dashboard/merits' },
  { text: 'Events', icon: <EventIcon />, href: '/dashboard/events' },
  { text: 'Settings', icon: <SettingsIcon />, href: '/dashboard/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0, 0, 0, 0.08)',
        },
      }}
    >
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

        <Stack spacing={0.5} sx={{ p: 1.5, bgcolor: 'background.default', borderRadius: 2, mb: 3 }}>
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
      </Box>

      <Divider sx={{ mx: 2 }} />

      <List sx={{ pt: 1, px: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton 
              component={Link} 
              href={item.href}
              selected={pathname === item.href}
              sx={{ 
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.light',
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
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ mx: 2 }} />
      
      <List sx={{ p: 1 }}>
        <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            href="/auth/logout"
            sx={{ borderRadius: 1 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}