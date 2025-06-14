"use client";

import { mockUsers } from "@/data/mockUsers";
import { type User, UserRole } from "@/types/auth.types";

/**
 * Authentication service class that handles user authentication
 * In a real application, this would integrate with NextAuth.js
 */
class AuthService {
  private static instance: AuthService | null = null;
  private currentUser: User | null = null;

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  /**
   * Get the singleton instance of the AuthService
   */
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Authenticate a user with email and password
   * @param email - User's email address
   * @param password - User's password
   * @returns The authenticated user or null if authentication fails
   */
  public async login(email: string, password: string): Promise<User | null> {
    if (!email || !password) {
      return null;
    }

    // In a real app, this would validate credentials against a secure backend
    const normalizedEmail = email.toLowerCase().trim();
    const user = mockUsers.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (user) {
      this.currentUser = { ...user }; // Clone to avoid reference issues
      return { ...user };
    }

    return null;
  }

  /**
   * End the user's session
   */
  public async logout(): Promise<void> {
    this.currentUser = null;
    // In real app: await signOut();
  }

  /**
   * Get the currently authenticated user
   * @returns The current user or null if not authenticated
   */
  public async getCurrentUser(): Promise<User | null> {
    // In a real app, this would retrieve the user from a session
    return this.currentUser ? { ...this.currentUser } : null;
  }

  /**
   * Check if a user is currently authenticated
   * @returns True if a user is authenticated, false otherwise
   */
  public async isAuthenticated(): Promise<boolean> {
    return this.currentUser !== null;
  }

  /**
   * Check if the current user has a specific role
   * @param role - The role to check for
   * @returns True if the user has the specified role, false otherwise
   */
  public async hasRole(role: UserRole): Promise<boolean> {
    return this.currentUser?.role === role;
  }
}

// Export a singleton instance
const authService = AuthService.getInstance();
export default authService;
