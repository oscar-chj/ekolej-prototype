"use server";

import { User } from '@/services/auth/authService';
import authService from '@/services/auth/authService';

/**
 * Server action for user login
 */
export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  try {
    const user = await authService.login(email, password);
    if (user) {
      return { success: true, user };
    } else {
      return { success: false, error: 'Invalid credentials' };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'An error occurred during login' };
  }
}

/**
 * Server action for user logout
 */
export async function logout() {
  try {
    await authService.logout();
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: 'An error occurred during logout' };
  }
}

/**
 * Server action to get the current user
 */
export async function getCurrentUser(): Promise<User | null> {
  return await authService.getCurrentUser();
}

/**
 * Server action to check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  return await authService.isAuthenticated();
}