"use server";

import { findUserByEmail } from "@/data/students";
import { type User, UserRole } from "@/types/auth.types";

// Server-side specific session storage
let currentUser: User | null = null;

/**
 * Server-side implementation of authentication service functions
 * These functions are compatible with Next.js Server Actions
 */

/**
 * Authenticate a user with email and password
 * @param email - User's email address
 * @param password - User's password
 * @returns The authenticated user or null if authentication fails
 */
export async function login(
  email: string,
  password: string
): Promise<User | null> {
  if (!email || !password) {
    return null;
  }

  // In a real app, this would validate credentials against a secure backend
  const user = findUserByEmail(email);

  if (user) {
    currentUser = { ...user }; // Clone to avoid reference issues
    return { ...user };
  }

  return null;
}

/**
 * End the user's session
 */
export async function logout(): Promise<void> {
  currentUser = null;
  // In real app: await signOut();
}

/**
 * Get the currently authenticated user
 * @returns The current user or null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  // In a real app, this would retrieve the user from a session
  return currentUser ? { ...currentUser } : null;
}

/**
 * Check if a user is currently authenticated
 * @returns True if a user is authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  return currentUser !== null;
}

/**
 * Check if the current user has a specific role
 * @param role - The role to check for
 * @returns True if the user has the specified role, false otherwise
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  return currentUser?.role === role;
}
