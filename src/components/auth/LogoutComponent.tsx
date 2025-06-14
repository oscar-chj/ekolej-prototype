"use client";

import { logout } from "@/services/auth/auth";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Component that handles the logout process and provides visual feedback
 */
export default function LogoutComponent() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Call the server logout action
        const result = await logout();

        // Check if result exists and has success property
        if (result && result.success) {
          // Remove the authentication cookie on client side as well
          Cookies.remove("auth_token", { path: "/" });

          // Show the logout screen briefly before redirecting
          setTimeout(() => {
            router.push("/auth/login");
          }, 1500);
        } else {
          // Handle logout failure
          setError(result?.message || "Failed to sign out properly");

          // Still redirect after a delay in case of error
          setTimeout(() => {
            Cookies.remove("auth_token", { path: "/" });
            router.push("/auth/login");
          }, 3000);
        }
      } catch (e) {
        console.error("Logout error:", e);
        setError("An unexpected error occurred while signing out");

        // Force logout on client side even if server action failed
        setTimeout(() => {
          Cookies.remove("auth_token", { path: "/" });
          router.push("/auth/login");
        }, 3000);
      }
    };

    handleLogout();

    // Clean up any potential memory leaks
    return () => {
      // Any cleanup code if needed
    };
  }, [router]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        p: 2,
      }}
    >
      {error ? (
        <Alert severity="error" sx={{ mb: 4, maxWidth: 450 }}>
          {error}
        </Alert>
      ) : (
        <CircularProgress size={48} sx={{ mb: 4 }} />
      )}

      <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
        {error ? "Error during sign out" : "Signing you out..."}
      </Typography>

      <Typography variant="body1" color="text.secondary">
        {error
          ? "Redirecting you to login page..."
          : "Thank you for using eKolej University Merit System"}
      </Typography>
    </Box>
  );
}
