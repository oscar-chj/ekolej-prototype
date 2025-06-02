'use client';

import authService from '@/services/auth/authService';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

/**
 * Form values interface for login
 */
interface LoginFormValues {
  email: string;
  password: string;
}

/**
 * Props for LoginForm component
 */
interface LoginFormProps {
  redirectPath?: string;
}

/**
 * LoginForm component provides the UI and functionality for user authentication
 */
export default function LoginForm({ redirectPath = '/dashboard' }: LoginFormProps) {
  // State for form handling
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<LoginFormValues>({
    email: '',
    password: ''
  });

  // Hooks for routing
  const router = useRouter();

  /**
   * Toggle password visibility
   */
  const handleTogglePasswordVisibility = () => setShowPassword((show) => !show);

  /**
   * Prevent default on mouse down event
   */
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  /**
   * Handle form input changes
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { email, password } = formValues;
      
      // Input validation
      if (!email.trim() || !password) {
        setError('Please fill out all fields');
        setIsLoading(false);
        return;
      }

      // Attempt to authenticate user
      const user = await authService.login(email, password);
      
      if (!user) {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      // Set a cookie to maintain authenticated state
      // In a real app with NextAuth, this would be handled by the auth provider
      Cookies.set('auth_token', 'sample_auth_token', { 
        expires: 7,
        sameSite: 'strict'
      });

      // Redirect to the requested page or dashboard
      router.push(redirectPath);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 2,
        backgroundColor: 'background.default'
      }}
    >
      <Paper
        elevation={2}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: { xs: 3, md: 6 },
          width: '100%',
          maxWidth: '450px',
          borderRadius: 2,
        }}
      >
        {/* Logo and Title */}
        <AppLogo />

        {/* Error message */}
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Login Form */}
        <Box component="form" sx={{ width: '100%', mt: 1 }} onSubmit={handleSubmit} noValidate>
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
              onChange={handleInputChange}
              inputProps={{
                'aria-label': 'Email Address'
              }}
            />
            
            <TextField
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              variant="outlined"
              required
              value={formValues.password}
              onChange={handleInputChange}
              inputProps={{
                'aria-label': 'Password'
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
                )
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
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Stack>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2">
              <MuiLink component={Link} href="/auth/forgot-password" underline="hover">
                Forgot password?
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Paper>
      
      <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
        © {new Date().getFullYear()} eKolej University Merit System
      </Typography>
    </Box>
  );
}

/**
 * App logo and title component
 */
function AppLogo() {
  return (
    <Box sx={{ mb: 4, textAlign: 'center' }}>
      <Image
        src="/globe.svg"
        alt="eKolej Logo"
        width={80}
        height={80}
        priority
      />
      <Typography variant="h4" component="h1" sx={{ mt: 2, fontWeight: 700 }}>
        eKolej
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
        University Merit System
      </Typography>
    </Box>
  );
}