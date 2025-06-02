/**
 * Auth-related type definitions
 */

/**
 * Enum for user roles in the system
 */
export enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin'
}

/**
 * User interface representing authenticated user data
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  studentId?: string;
  faculty?: string;
  year?: string;
}

/**
 * Authentication result interface
 */
export interface AuthResult {
  success: boolean;
  user: User | null;
  message?: string;
}

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  email: string;
  password: string;
}