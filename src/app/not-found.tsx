'use client';

import { Box, Button, Container, Paper, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          py: 6
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '600px',
            border: '1px solid rgba(0, 0, 0, 0.05)'
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="h1" 
              component="h1" 
              sx={{ 
                fontWeight: 700, 
                fontSize: { xs: '5rem', md: '6rem' },
                color: 'primary.main',
                mb: 1
              }}
            >
              404
            </Typography>
            <Image
              src="/globe.svg"
              alt="eKolej Logo"
              width={60}
              height={60}
              priority
            />
          </Box>
          
          <Typography variant="h4" component="h2" sx={{ mb: 3 }}>
            Page Not Found
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '450px' }}>
            The page you&apos;re looking for doesn&apos;t exist or has been moved. 
            Please check the URL or return to the homepage.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              component={Link} 
              href="/"
              variant="contained" 
              color="primary"
            >
              Back to Home
            </Button>
            
            <Button 
              component={Link} 
              href="/dashboard"
              variant="outlined" 
              color="primary"
            >
              Go to Dashboard
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}