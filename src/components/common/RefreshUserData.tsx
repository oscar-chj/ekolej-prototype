"use client";

import { Button, Box, Typography } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { useUserStore } from "@/stores/userStore";

/**
 * Refresh button component that can be used anywhere to refresh user data
 */
export default function RefreshUserData() {
  const { isLoading, refreshUserProfile, profileData } = useUserStore();

  const handleRefresh = () => {
    refreshUserProfile();
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Button
        variant="outlined"
        size="small"
        startIcon={<Refresh />}
        onClick={handleRefresh}
        disabled={isLoading}
      >
        {isLoading ? "Refreshing..." : "Refresh Data"}
      </Button>
      {profileData?.lastUpdated && (
        <Typography variant="caption" color="text.secondary">
          Last updated: {new Date(profileData.lastUpdated).toLocaleTimeString()}
        </Typography>
      )}
    </Box>
  );
}
