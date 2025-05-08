"use server";

import * as serverAuth from '@/services/auth/serverAuthService';
import { AuthResult, LoginCredentials, User, UserRole } from '@/types/auth.types';

/**
 * Server action for user login
 * @param formData - Form data containing login credentials
 * @returns Authentication result with user or error
 */
export async function login(formData: FormData): Promise<AuthResult> {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    // Input validation
    if (!email?.trim() || !password) {
      return { 
        success: false, 
        user: null,
        message: 'Email and password are required' 
      };
    }
    
    const user = await serverAuth.login(email, password);
    
    if (user) {
      return { 
        success: true, 
        user,
        message: 'Login successful'
      };
    } else {
      return { 
        success: false, 
        user: null,
        message: 'Invalid credentials' 
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      user: null,
      message: 'An unexpected error occurred during login' 
    };
  }
}

/**
 * Server action for programmatic login with credentials
 * @param credentials - Login credentials object
 * @returns Authentication result with user or error
 */
export async function loginWithCredentials(credentials: LoginCredentials): Promise<AuthResult> {
  try {
    const { email, password } = credentials;
    
    if (!email?.trim() || !password) {
      return { 
        success: false, 
        user: null,
        message: 'Email and password are required' 
      };
    }
    
    const user = await serverAuth.login(email, password);
    
    if (user) {
      return { 
        success: true, 
        user 
      };
    } else {
      return { 
        success: false, 
        user: null,
        message: 'Invalid credentials' 
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      user: null,
      message: 'An unexpected error occurred during login' 
    };
  }
}

/**
 * Server action for user logout
 * @returns Success status and optional error message
 */
export async function logout(): Promise<{ success: boolean; message?: string }> {
  try {
    await serverAuth.logout();
    return { 
      success: true,
      message: 'Logout successful'
    };
  } catch (error) {
    console.error('Logout error:', error);
    return { 
      success: false, 
      message: 'An error occurred during logout' 
    };
  }
}

/**
 * Server action to get the current user
 * @returns The current authenticated user or null
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    return await serverAuth.getCurrentUser();
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Server action to check if user is authenticated
 * @returns Boolean indicating authentication status
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    return await serverAuth.isAuthenticated();
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
}

/**
 * Server action to check if user has a specific role
 * @param role - The role to check
 * @returns Boolean indicating if user has the role
 */
export async function hasRole(role: string): Promise<boolean> {
  try {
    return await serverAuth.hasRole(role as UserRole);
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
}