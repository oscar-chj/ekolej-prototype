'use client';

import { Box, CircularProgress, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LogoutComponent() {
  const router = useRouter();

  useEffect(() => {
    // Remove the authentication cookie
    Cookies.remove('auth_token');

    // Show the logout screen briefly before redirecting
    const redirectTimeout = setTimeout(() => {
      router.push('/auth/login');
    }, 1500);

    return () => clearTimeout(redirectTimeout);
  }, [router]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        p: 2
      }}
    >
      <CircularProgress size={48} sx={{ mb: 4 }} />
      <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
        Signing you out...
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Thank you for using eKolej University Merit System
      </Typography>
    </Box>
  );
}