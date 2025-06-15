"use client";

import { Box, Typography, Chip, Stack } from "@mui/material";
import { useUserProfile } from "@/hooks/useUserProfile";

/**
 * Debug component to show current user state from Zustand store
 * This can be temporarily added to any page to verify the store is working
 */
export default function UserStateDebug() {
  const { student, meritSummary, isLoading, error, lastUpdated } = useUserProfile();

  if (isLoading) {
    return (
      <Box sx={{ p: 2, bgcolor: "info.light", borderRadius: 1 }}>
        <Typography variant="caption">🔄 Loading user state...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2, bgcolor: "error.light", borderRadius: 1 }}>
        <Typography variant="caption" color="error">
          ❌ Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, bgcolor: "success.light", borderRadius: 1, mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        🟢 User State (Zustand Store)
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Chip label={`Name: ${student?.name || 'N/A'}`} size="small" />
        <Chip label={`ID: ${student?.studentId || 'N/A'}`} size="small" />
        <Chip label={`Faculty: ${student?.faculty || 'N/A'}`} size="small" />
        <Chip label={`Total Points: ${meritSummary?.totalPoints || 0}`} size="small" />
        {lastUpdated && (
          <Chip 
            label={`Updated: ${new Date(lastUpdated).toLocaleTimeString()}`} 
            size="small" 
            variant="outlined"
          />
        )}
      </Stack>
    </Box>
  );
}
