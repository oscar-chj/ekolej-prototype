import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import theme from '@/theme/theme';
import "./globals.css";

// Configure fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Optimize font display
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap', // Optimize font display
});

// Metadata for SEO and browser tab
export const metadata: Metadata = {
  title: "eKolej - University Merit System",
  description: "A comprehensive system for tracking university student merit points and activities",
  keywords: ["university", "merit system", "student achievements", "eKolej"],
  authors: [{ name: "eKolej Team" }],
};

/**
 * Root layout component that wraps all pages
 * Provides theme, fonts and global styles
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
