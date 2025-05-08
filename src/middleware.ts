import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = [
  '/auth/login',
  '/auth/forgot-password',
  '/auth/reset-password',
];

// Static assets and API routes
const bypassRoutes = [
  '/_next',
  '/api',
  '/favicon.ico',
  '/public',
];

/**
 * Check if the requested route is a public route
 */
const isPublicRoute = (path: string): boolean => {
  return publicRoutes.some(route => path === route || path.startsWith(`${route}/`));
};

/**
 * Check if the route should bypass the middleware
 */
const shouldBypass = (path: string): boolean => {
  return bypassRoutes.some(route => path.startsWith(route));
};

/**
 * Check if the user is authenticated
 * This is a simplified version - in a real app, you would check an auth token or cookie
 */
const isAuthenticated = (request: NextRequest): boolean => {
  // For development purposes, we'll check for an auth cookie
  // In a real app, you would verify the session token with your auth provider
  const authCookie = request.cookies.get('auth_token')?.value;
  return !!authCookie;
};

/**
 * Middleware function that executes on every request
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static assets and API routes
  if (shouldBypass(pathname)) {
    return NextResponse.next();
  }

  // Check authentication status
  const isUserAuthenticated = isAuthenticated(request);

  // Handle root path special case
  if (pathname === '/') {
    // If user is logged in, redirect to dashboard
    if (isUserAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // If not logged in, redirect to login page
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Handle protected routes - redirect to login if not authenticated
  if (!isPublicRoute(pathname) && !isUserAuthenticated) {
    const loginUrl = new URL('/auth/login', request.url);
    // Add a ?from= parameter to redirect back after login
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Handle public routes when user is already authenticated (like login page)
  if (isPublicRoute(pathname) && isUserAuthenticated) {
    // Allow the /auth/logout path even when authenticated
    if (pathname === '/auth/logout') {
      return NextResponse.next();
    }
    
    // If user is already logged in, redirect them to the dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Otherwise, continue to the requested page
  return NextResponse.next();
}

/**
 * Configure which paths this middleware will run on
 */
export const config = {
  // Apply middleware to all routes in the app except static assets
  matcher: ['/((?!_next/static|_next/image|images|public|favicon.ico).*)'],
};