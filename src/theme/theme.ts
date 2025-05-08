'use client';

import { createTheme, PaletteOptions, ThemeOptions } from '@mui/material/styles';

/**
 * Color palette constants
 */
const COLORS = {
  primary: {
    main: '#1565c0',    // Deep blue - professional and institutional
    light: '#5e92f3',
    dark: '#003c8f',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#26a69a',    // Teal - fresh but professional
    light: '#64d8cb',
    dark: '#00766c',
    contrastText: '#ffffff',
  },
  error: {
    main: '#d32f2f',
    light: '#ef5350',
    dark: '#c62828',
  },
  warning: {
    main: '#ff9800',
    light: '#ffb74d',
    dark: '#f57c00',
  },
  info: {
    main: '#2196f3',
    light: '#64b5f6',
    dark: '#1976d2',
  },
  success: {
    main: '#4caf50',
    light: '#81c784',
    dark: '#388e3c',
  },
  grey: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
};

/**
 * Palette configuration
 */
const palette: PaletteOptions = {
  primary: COLORS.primary,
  secondary: COLORS.secondary,
  error: COLORS.error,
  warning: COLORS.warning,
  info: COLORS.info,
  success: COLORS.success,
  background: {
    default: COLORS.grey[100],
    paper: '#ffffff',
  },
  text: {
    primary: COLORS.grey[900],
    secondary: COLORS.grey[700],
    disabled: COLORS.grey[500],
  },
};

/**
 * Typography configuration
 */
const typography: ThemeOptions['typography'] = {
  fontFamily: 'var(--font-geist-sans)',
  h1: { fontWeight: 600 },
  h2: { fontWeight: 600 },
  h3: { fontWeight: 500 },
  h4: { fontWeight: 500 },
  h5: { fontWeight: 500 },
  h6: { fontWeight: 500 },
  button: {
    textTransform: 'none', // Avoid all-caps buttons for a cleaner look
    fontWeight: 500,
  },
  subtitle1: {
    fontWeight: 500,
  },
  subtitle2: {
    fontWeight: 500,
  },
};

/**
 * Component style overrides
 */
const components: ThemeOptions['components'] = {
  MuiButton: {
    styleOverrides: {
      root: {
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
        },
      },
      containedPrimary: {
        '&:hover': {
          backgroundColor: COLORS.primary.dark,
        },
      },
      containedSecondary: {
        '&:hover': {
          backgroundColor: COLORS.secondary.dark,
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
        borderRadius: 12,
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      elevation1: {
        boxShadow: '0px 2px 8px rgba(0,0,0,0.05)',
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
        },
      },
    },
  },
  MuiLink: {
    defaultProps: {
      underline: 'hover',
    },
  },
};

/**
 * Create and export the theme configuration
 */
const theme = createTheme({
  palette,
  typography,
  shape: {
    borderRadius: 8,
  },
  components,
});

export default theme;