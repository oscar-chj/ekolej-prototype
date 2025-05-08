'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Link as MuiLink,
  Stack,
  InputAdornment,
  IconButton,
  Alert
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('from') || '/dashboard';

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      
      // Simple validation
      if (!email || !password) {
        setError('Please fill out all fields');
        return;
      }

      // In a real app, you would call an API endpoint to authenticate
      // For now, let's just simulate a successful login after a delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Set a cookie to simulate authenticated state
      // In a real app, this would be a secure HTTP-Only cookie set by the server
      Cookies.set('auth_token', 'sample_auth_token', { expires: 7 });

      // Redirect to the requested page or dashboard
      router.push(redirectPath);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
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

        {/* Error message */}
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Login Form */}
        <Box component="form" sx={{ width: '100%', mt: 1 }} onSubmit={handleSubmit}>
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
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
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