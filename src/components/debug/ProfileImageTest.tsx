"use client";

import { Typography, Paper } from "@mui/material";
import { useUserProfile } from "@/hooks/useUserProfile";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import ClearCacheUtility from "./ClearCacheUtility";

/**
 * Test component to verify profile image caching
 * This shows the profile image and last updated time to confirm it's not refreshing
 */
export default function ProfileImageTest() {
  const { student, lastUpdated } = useUserProfile();

  return (
    <>
      {/* Debug utility to clear cache */}
      <ClearCacheUtility />

      <Paper sx={{ p: 2, m: 2, textAlign: "center" }}>
        <Typography variant="h6" gutterBottom>
          Profile Image Cache Test
        </Typography>

        <ProfileAvatar
          src={student?.profileImage}
          alt={student?.name || "User"}
          sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
        />

        <Typography variant="body2">
          User: {student?.name || "Loading..."}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Image URL: {student?.profileImage || "Not loaded"}
        </Typography>
        <br />
        <Typography variant="caption" color="text.secondary">
          Last Updated:{" "}
          {lastUpdated ? new Date(lastUpdated).toLocaleString() : "Never"}
        </Typography>
        <br />
        <Typography variant="caption" color="success.main">
          ✅ Image should not refresh when switching tabs
        </Typography>
      </Paper>
    </>
  );
}
