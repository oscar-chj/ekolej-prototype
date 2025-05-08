'use client';

import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { AppBar, Box, Container, IconButton, Toolbar, Typography } from '@mui/material';
import React from 'react';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function DashboardLayout({ children, title = 'Dashboard' }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Desktop sidebar */}
      <Box
        component="nav"
        sx={{ width: { sm: 280 }, flexShrink: { sm: 0 }, display: { xs: 'none', sm: 'block' } }}
      >
        <Sidebar />
      </Box>

      {/* Main content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <AppBar 
          position="fixed" 
          color="default" 
          elevation={0}
          sx={{ 
            width: { sm: `calc(100% - 280px)` }, 
            ml: { sm: `280px` },
            backgroundColor: 'background.paper',
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {title}
            </Typography>
            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        
        {/* Mobile drawer */}
        <Box
          component="nav"
          sx={{ 
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 280 
            } 
          }}
        >
          {mobileOpen && <Sidebar />}
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: { xs: 8, sm: 9 }, // Toolbar offset
            px: { xs: 2, sm: 4 },
            pb: 4,
            backgroundColor: 'background.default'
          }}
        >
          <Container maxWidth="lg" sx={{ height: '100%' }}>
            {children}
          </Container>
        </Box>
      </Box>
    </Box>
  );
}