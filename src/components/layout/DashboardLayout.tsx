"use client";

import { DRAWER_WIDTH } from "@/lib/constants";
import authService from "@/services/auth/authService";
import {
  Menu as MenuIcon,
  NotificationsOutlined,
  PersonOutline,
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Container,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Chip,
} from "@mui/material";
import { memo, useState, useEffect } from "react";
import Sidebar from "./Sidebar";

/**
 * Props for DashboardLayout component
 */
interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

// Constants for layout dimensions
// Imported from constants file

/**
 * Dashboard layout component that provides the main application structure
 * with responsive sidebar and app bar
 */
const DashboardLayout = memo(function DashboardLayout({
  children,
  title = "Dashboard",
}: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUserName, setCurrentUserName] = useState<string>("User");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  useEffect(() => {
    // Get current user name for display, initialize if needed
    const getCurrentUserName = async () => {
      try {
        let user = await authService.getCurrentUser();
        if (!user) {
          // For prototype: initialize with default user (Ahmad Abdullah)
          user = await authService.initializeWithUser("1");
        }
        if (user) {
          setCurrentUserName(user.name);
        }
      } catch (error) {
        console.error("Error getting current user name:", error);
      }
    };

    getCurrentUserName();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Desktop sidebar - permanent drawer on larger screens */}
      <Box
        component="nav"
        sx={{
          width: { sm: DRAWER_WIDTH },
          flexShrink: { sm: 0 },
        }}
        aria-label="main navigation"
      >
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
              borderRight: "1px solid rgba(0, 0, 0, 0.08)",
            },
          }}
          open
        >
          <Sidebar />
        </Drawer>

        {/* Mobile drawer - temporary and conditionally rendered */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }} // Better mobile performance
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
            },
          }}
        >
          <Sidebar onItemClick={() => isMobile && setMobileOpen(false)} />
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <AppBar
          position="fixed"
          color="default"
          elevation={0}
          sx={{
            width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
            ml: { sm: `${DRAWER_WIDTH}px` },
            backgroundColor: "background.paper",
            borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
              {title}
            </Typography>
            {/* Current User Indicator */}
            <Chip
              avatar={
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  <PersonOutline />
                </Avatar>
              }
              label={currentUserName}
              variant="outlined"
              size="small"
              sx={{ mr: 2, display: { xs: "none", sm: "flex" } }}
            />
            <IconButton
              color="inherit"
              aria-label="notifications"
              size="medium"
            >
              <NotificationsOutlined />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: { xs: 8, sm: 9 }, // Toolbar offset
            px: { xs: 2, sm: 4 },
            pb: 4,
            backgroundColor: "background.default",
            overflow: "auto", // Allow scrolling in main content area
          }}
        >
          <Container maxWidth="lg" sx={{ height: "100%" }}>
            {children}
          </Container>
        </Box>
      </Box>
    </Box>
  );
});

export default DashboardLayout;
