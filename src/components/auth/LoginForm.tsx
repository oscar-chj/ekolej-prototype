"use client";

import { FormError } from "@/components/ui/ErrorDisplay";
import { useAuth } from "@/hooks/useAuth";
import { useFormState } from "@/hooks/useFormState";
import { AUTH_COOKIE_EXPIRES_DAYS, AUTH_COOKIE_NAME } from "@/lib/constants";
import EventListService from "@/services/event/eventListService";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

/**
 * Props for LoginForm component
 */
interface LoginFormProps {
  redirectPath?: string;
}

/**
 * LoginForm component provides the UI and functionality for user authentication
 */
export default function LoginForm({
  redirectPath = "/dashboard",
}: LoginFormProps) {
  // Use custom auth hook
  const { login, isLoading, error, clearError } = useAuth();
  // Use form state hook
  const { values: formValues, handleChange } = useFormState({
    email: "",
    password: "",
  });

  // Local state for password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Hooks for routing
  const router = useRouter();

  /**
   * Toggle password visibility
   */
  const handleTogglePasswordVisibility = () => setShowPassword((show) => !show);

  /**
   * Prevent default on mouse down event
   */
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  /**
   * Handle form submission with event list fetching
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearError();

    const { email, password } = formValues;

    // Attempt to authenticate user (UC1)
    const user = await login(email, password);

    if (user) {
      // Set a cookie to maintain authenticated state
      // In a real app with NextAuth, this would be handled by the auth provider
      Cookies.set(AUTH_COOKIE_NAME, "sample_auth_token", {
        expires: AUTH_COOKIE_EXPIRES_DAYS,
        sameSite: "strict",
      }); // UC2: Provide Event List - Fetch latest events after successful login
      try {
        console.log("Fetching latest event list...");
        await EventListService.fetchEventList();
        console.log("Event list cached successfully");
      } catch (eventError) {
        console.warn(
          "Failed to fetch event list, continuing with login...",
          eventError
        );
        // Don't block login if event fetching fails
        sessionStorage.setItem("eventListCached", "false");
      }

      // Redirect to the requested page or dashboard
      router.push(redirectPath);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        p: 2,
        backgroundColor: "background.default",
      }}
    >
      <Paper
        elevation={2}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: { xs: 3, md: 6 },
          width: "100%",
          maxWidth: "450px",
          borderRadius: 2,
        }}
      >
        {/* Logo and Title */}
        <AppLogo />

        {/* Error message */}
        {error && <FormError error={error} onDismiss={clearError} />}

        {/* Login Form */}
        <Box
          component="form"
          sx={{ width: "100%", mt: 1 }}
          onSubmit={handleSubmit}
          noValidate
        >
          <Stack spacing={3}>
            <TextField
              fullWidth
              id="email"
              label="Email Address or Student ID"
              name="email"
              autoComplete="email"
              autoFocus
              required
              variant="outlined"
              value={formValues.email}
              onChange={handleChange}
              inputProps={{
                "aria-label": "Email Address",
              }}
            />

            <TextField
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              variant="outlined"
              required
              value={formValues.password}
              onChange={handleChange}
              inputProps={{
                "aria-label": "Password",
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              disabled={isLoading}
              sx={{ mt: 3, py: 1.5 }}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </Stack>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2">
              <MuiLink
                component={Link}
                href="/auth/forgot-password"
                underline="hover"
              >
                Forgot password?
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
        © {new Date().getFullYear()} Student Merit Management System
      </Typography>
    </Box>
  );
}

/**
 * App logo and title component
 */
function AppLogo() {
  return (
    <Box sx={{ mb: 4, textAlign: "center" }}>
      {/* Inline SVG to avoid loading issues */}
      <Box
        sx={{
          width: 80,
          height: 80,
          display: "block",
          margin: "0 auto",
          mb: 1,
        }}
      >
        <svg
          width="80"
          height="80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
        >
          <g clipPath="url(#a)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1"
              fill="#1976d2"
            />
          </g>
          <defs>
            <clipPath id="a">
              <path fill="#fff" d="M0 0h16v16H0z" />
            </clipPath>
          </defs>
        </svg>
      </Box>
      <Typography variant="h4" component="h1" sx={{ mt: 2, fontWeight: 700 }}>
        Merit System
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
        Student Merit Management System
      </Typography>
    </Box>
  );
}
