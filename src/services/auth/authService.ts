"use client";

// This is a sample authentication service that would integrate with NextAuth.js
// In a real application, this would be replaced with actual NextAuth implementation

// Sample user data structure
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'staff';
  profileImage?: string;
  studentId?: string;
  faculty?: string;
  year?: string;
}

// Sample users database
const usersDB: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@university.edu',
    role: 'student',
    profileImage: '/public/default-avatar.png',
    studentId: 'S12345',
    faculty: 'Computer Science',
    year: '3',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@university.edu',
    role: 'student',
    profileImage: '/public/default-avatar.png',
    studentId: 'S12346',
    faculty: 'Engineering',
    year: '2',
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@university.edu',
    role: 'admin',
  }
];

// Authentication service class
export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Simulate login functionality
   * In a real app, this would use NextAuth's signIn method
   */
  public async login(email: string, password: string): Promise<User | null> {
    // Simple simulation - in real app we would validate credentials
    if (!email || !password) return null;
    
    // Find the user by email (in real app, this would be a database query)
    const user = usersDB.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      this.currentUser = user;
      return user;
    }
    return null;
  }

  /**
   * Simulate logout functionality
   * In a real app, this would use NextAuth's signOut method
   */
  public async logout(): Promise<void> {
    this.currentUser = null;
    // In real app: await signOut();
  }

  /**
   * Get the currently logged in user
   * In a real app, this would use NextAuth's getSession or useSession
   */
  public async getCurrentUser(): Promise<User | null> {
    // In a real app, this would be an async call to a session API
    return this.currentUser;
  }

  /**
   * Check if the user is authenticated
   */
  public async isAuthenticated(): Promise<boolean> {
    // In a real app, this would be an async check of the session
    return this.currentUser !== null;
  }

  /**
   * Check if the current user has a specific role
   */
  public async hasRole(role: 'student' | 'admin' | 'staff'): Promise<boolean> {
    // In a real app, this would be an async check of the session and user roles
    return this.currentUser?.role === role;
  }
}

// Create a singleton instance
const authService = AuthService.getInstance();

export default authService;