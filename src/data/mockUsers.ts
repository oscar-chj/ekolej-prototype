import { User, UserRole } from '../types/auth.types';

/**
 * Mock users for development and testing
 * In a real application, this would be replaced with a database connection
 */
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@university.edu',
    role: UserRole.STUDENT,
    profileImage: '/default-avatar.png',
    studentId: 'S12345',
    faculty: 'Computer Science',
    year: '3',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@university.edu',
    role: UserRole.STUDENT,
    profileImage: '/default-avatar.png',
    studentId: 'S12346',
    faculty: 'Engineering',
    year: '2',
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@university.edu',
    role: UserRole.ADMIN,
    profileImage: '/default-avatar.png',
  },
  {
    id: '4',
    name: 'Staff Member',
    email: 'staff@university.edu',
    role: UserRole.STAFF,
    profileImage: '/default-avatar.png',
  }
];