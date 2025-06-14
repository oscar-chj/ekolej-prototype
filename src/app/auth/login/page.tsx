"use client";

import React, { Suspense } from "react";
import LoginRedirectWrapper from "@/components/auth/LoginRedirectWrapper";
import { Box, CircularProgress } from "@mui/material";

/**
 * Fallback loading component for Suspense
 */
function LoginFallback() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <CircularProgress />
    </Box>
  );
}

/**
 * Login page with proper Suspense boundary for useSearchParams
 */
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginRedirectWrapper />
    </Suspense>
  );
}
