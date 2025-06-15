"use client";

import { Button, Stack, Typography, Alert, Box } from "@mui/material";
import { useUserStore } from "@/stores/userStore";
import { useState } from "react";

/**
 * Debug utility to clear cached user data and force refresh
 * This helps fix issues with stale profile images or data
 */
export default function ClearCacheUtility() {
  const { forceClearCache, clearUserProfile } = useUserStore();
  const [isClearing, setIsClearing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleForceClearCache = async () => {
    setIsClearing(true);
    setMessage(null);
    try {
      await forceClearCache();
      setMessage("✅ Cache cleared and data refreshed successfully!");
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsClearing(false);
    }
  };

  const handleClearLocalStorage = () => {
    try {
      // Clear the specific user profile storage
      localStorage.removeItem('user-profile-storage');
      clearUserProfile();
      setMessage("✅ localStorage cleared! Please refresh the page to reload data.");
    } catch (error) {
      setMessage(`❌ Error clearing localStorage: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h6" gutterBottom>
        🔧 Cache Debug Utility
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Use these buttons to fix issues with stale profile images or cached data:
      </Typography>

      <Stack spacing={2}>
        <Button
          variant="contained"
          onClick={handleForceClearCache}
          disabled={isClearing}
          color="primary"
        >
          {isClearing ? "Clearing Cache..." : "🔄 Force Refresh Data"}
        </Button>

        <Button
          variant="outlined"
          onClick={handleClearLocalStorage}
          color="warning"
        >
          🗑️ Clear All Cached Data
        </Button>

        {message && (
          <Alert severity={message.includes('✅') ? 'success' : 'error'}>
            {message}
          </Alert>
        )}        <Typography variant="caption" color="text.secondary">
          💡 If you&apos;re seeing 404 errors for profile images, try &quot;Force Refresh Data&quot; first.
          If that doesn&apos;t work, use &quot;Clear All Cached Data&quot; and refresh the page.
        </Typography>
      </Stack>
    </Box>
  );
}
