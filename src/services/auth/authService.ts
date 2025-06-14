"use client";

import { findUserByEmail } from "@/data/students";
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
    // No auto-login - user must explicitly log in
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
    const user = findUserByEmail(email);

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
  /**
   * Switch to a different user (for prototype testing)
   * @param userId - The ID of the user to switch to
   * @returns The switched user or null if not found
   */
  public async switchUser(userId: string): Promise<User | null> {
    try {
      // Import students data to find user by ID
      const { students } = await import("@/data/students");
      const student = students.find((s) => s.id === userId);

      if (student) {
        // Convert student to user
        const { studentToUser } = await import("@/data/students");
        const user = studentToUser(student);
        this.currentUser = { ...user };
        console.log(`Prototype: Switched to user ${user.name} (ID: ${userId})`);
        return { ...user };
      }
      return null;
    } catch (error) {
      console.error("Error switching user:", error);
      return null;
    }
  }

  /**
   * Initialize with a default user for prototype (call this manually)
   * @param userId - The ID of the user to initialize with (defaults to "1")
   */
  public async initializeWithUser(userId: string = "1"): Promise<User | null> {
    if (!this.currentUser) {
      return await this.switchUser(userId);
    }
    return this.currentUser;
  }
}

// Export a singleton instance
const authService = AuthService.getInstance();
export default authService;
