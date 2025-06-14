"use client";

import authService from "@/services/auth/authService";
import { UserRole } from "@/types/auth.types";
import { mainNavigationItems } from "@/data/navigationData";
import { getIconComponent } from "@/lib/iconUtils";
import { Logout } from "@mui/icons-material";
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
  Typography,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useState, useEffect } from "react";

/**
 * Sidebar component props
 */
interface SidebarProps {
  onItemClick?: () => void;
}

/**
 * Sidebar component providing navigation for the dashboard
 */
const Sidebar = memo(function Sidebar({ onItemClick }: SidebarProps) {
  const pathname = usePathname();
  const [userProfile, setUserProfile] = useState({
    name: "User",
    role: UserRole.STUDENT,
    avatar: "/default-avatar.png",
    studentId: "000000",
    faculty: "Loading...",
    year: "0",
  });

  useEffect(() => {
    // Get current user profile from authentication
    const getCurrentUserProfile = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          setUserProfile({
            name: user.name,
            role: user.role,
            avatar: user.profileImage || "/default-avatar.png",
            studentId: user.studentId || "000000",
            faculty: user.faculty || "Unknown Faculty",
            year: user.year || "0",
          });
        }
      } catch (error) {
        console.error("Error getting current user profile:", error);
        // Keep default values
      }
    };

    getCurrentUserProfile();
  }, []);

  // Filter navigation items based on user role
  const visibleNavItems = mainNavigationItems.filter(
    (item) => !item.roles || item.roles.includes(userProfile.role)
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Avatar
            sx={{ width: 80, height: 80, mb: 1.5 }}
            alt={userProfile.name}
            src={userProfile.avatar}
          />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {userProfile.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {userProfile.role.toUpperCase()}
          </Typography>
        </Box>

        {/* Student Information Card */}
        {userProfile.role === UserRole.STUDENT && (
          <Stack
            spacing={0.5}
            sx={{
              p: 1.5,
              bgcolor: "background.default",
              borderRadius: 2,
              mb: 3,
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
              <Tooltip title={item.tooltip || ""} placement="right" arrow>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  selected={isSelected}
                  onClick={handleItemClick}
                  sx={{
                    borderRadius: 1,
                    "&.Mui-selected": {
                      backgroundColor: "primary.main",
                      color: "primary.contrastText",
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                      "& .MuiListItemIcon-root": {
                        color: "primary.contrastText",
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {getIconComponent(item.iconName)}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isSelected ? 500 : 400,
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
                "&:hover": {
                  backgroundColor: "error.lighter",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Logout color="error" />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{ color: "error" }}
              />
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>
    </>
  );
});

export default Sidebar;
