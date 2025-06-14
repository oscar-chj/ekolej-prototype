import { Alert, Box, Button, Typography } from '@mui/material';
import { ErrorOutline, Refresh } from '@mui/icons-material';
import { ReactNode } from 'react';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  showRetry?: boolean;
  onRetry?: () => void;
  children?: ReactNode;
}

/**
 * Reusable error display component
 */
export function ErrorDisplay({ 
  title = 'Something went wrong',
  message, 
  showRetry = false, 
  onRetry,
  children 
}: ErrorDisplayProps) {
  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <ErrorOutline sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
      <Typography variant="h6" color="error" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {message}
      </Typography>
      {showRetry && onRetry && (
        <Button 
          variant="outlined" 
          startIcon={<Refresh />}
          onClick={onRetry}
          sx={{ mb: 2 }}
        >
          Try Again
        </Button>
      )}
      {children}
    </Box>
  );
}

interface LoadingDisplayProps {
  message?: string;
}

/**
 * Simple loading display component
 */
export function LoadingDisplay({ message = 'Loading...' }: LoadingDisplayProps) {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      py: 8 
    }}>
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}

interface FormErrorProps {
  error: string;
  onDismiss?: () => void;
}

/**
 * Form error alert component
 */
export function FormError({ error, onDismiss }: FormErrorProps) {
  return (
    <Alert 
      severity="error" 
      onClose={onDismiss}
      sx={{ mb: 2 }}
    >
      {error}
    </Alert>
  );
}
