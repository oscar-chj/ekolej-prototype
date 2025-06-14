import { Student } from "@/types/api.types";
import { UserRole, User } from "@/types/auth.types";

/**
 * Convert a Student to a User (for authentication purposes)
 * @param student - The student object to convert
 * @returns A User object compatible with auth types
 */
export function studentToUser(student: Student): User {
  return {
    id: student.id,
    name: student.name,
    email: student.email,
    role: student.role,
    profileImage: student.profileImage,
    studentId: student.studentId,
    faculty: student.faculty,
    year: student.year.toString(),
  };
}

/**
 * Find a user (student/admin) by email
 * @param email - The email to search for
 * @returns The user object or null if not found
 */
export function findUserByEmail(email: string): User | null {
  const normalizedEmail = email.toLowerCase().trim();
  const student = students.find(
    (s) => s.email.toLowerCase() === normalizedEmail
  );
  return student ? studentToUser(student) : null;
}

/**
 * Mock data for students (who are also users in the system)
 * This simulates data that would come from a database in a production application
 */
export const students: Student[] = [
  {
    id: "1",
    name: "Ahmad Abdullah",
    email: "ahmad@student.edu.my",
    studentId: "223001",
    faculty: "Computer Science",
    year: 2,
    program: "Software Engineering",
    totalMeritPoints: 0, // Will be calculated dynamically from events
    enrollmentDate: "2023-09-01",
    profileImage: "/images/avatars/ahmad.jpg",
    role: UserRole.STUDENT,
  },
  {
    id: "2",
    name: "Sarah Lee",
    email: "sarah@student.edu.my",
    studentId: "223002",
    faculty: "Computer Science",
    year: 3,
    program: "Artificial Intelligence",
    totalMeritPoints: 0, // Will be calculated dynamically from events
    enrollmentDate: "2022-09-01",
    profileImage: "/images/avatars/sarah.jpg",
    role: UserRole.STUDENT,
  },
  {
    id: "3",
    name: "Raj Kumar",
    email: "raj@student.edu.my",
    studentId: "223003",
    faculty: "Engineering",
    year: 2,
    program: "Electrical Engineering",
    totalMeritPoints: 0,
    enrollmentDate: "2023-09-01",
    role: UserRole.STUDENT,
  },
  {
    id: "4",
    name: "Li Wei",
    email: "li@student.edu.my",
    studentId: "223004",
    faculty: "Business",
    year: 4,
    program: "Business Administration",
    totalMeritPoints: 0,
    enrollmentDate: "2021-09-01",
    profileImage: "/images/avatars/li.jpg",
    role: UserRole.STUDENT,
  },
  {
    id: "5",
    name: "Fatimah Zahra",
    email: "fatimah@student.edu.my",
    studentId: "223005",
    faculty: "Medicine",
    year: 3,
    program: "Medicine",
    totalMeritPoints: 0,
    enrollmentDate: "2022-09-01",
    role: UserRole.STUDENT,
  },
  {
    id: "6",
    name: "Chong Wei",
    email: "chong@student.edu.my",
    studentId: "223006",
    faculty: "Science",
    year: 2,
    program: "Chemistry",
    totalMeritPoints: 0,
    enrollmentDate: "2023-09-01",
    profileImage: "/images/avatars/chong.jpg",
    role: UserRole.STUDENT,
  },
  {
    id: "7",
    name: "Siti Aishah",
    email: "siti@student.edu.my",
    studentId: "223007",
    faculty: "Social Sciences",
    year: 4,
    program: "Psychology",
    totalMeritPoints: 0,
    enrollmentDate: "2021-09-01",
    role: UserRole.STUDENT,
  },
  {
    id: "8",
    name: "John Smith",
    email: "john@student.edu.my",
    studentId: "223008",
    faculty: "Computer Science",
    year: 1,
    program: "Cybersecurity",
    totalMeritPoints: 0,
    enrollmentDate: "2024-09-01",
    profileImage: "/images/avatars/john.jpg",
    role: UserRole.STUDENT,
  },
  {
    id: "9",
    name: "Priya Sharma",
    email: "priya@student.edu.my",
    studentId: "223009",
    faculty: "Engineering",
    year: 3,
    program: "Civil Engineering",
    totalMeritPoints: 0,
    enrollmentDate: "2022-09-01",
    role: UserRole.STUDENT,
  },
  {
    id: "10",
    name: "Tan Wei",
    email: "tan@student.edu.my",
    studentId: "223010",
    faculty: "Business",
    year: 2,
    program: "Finance",
    totalMeritPoints: 0,
    enrollmentDate: "2023-09-01",
    profileImage: "/images/avatars/tan.jpg",
    role: UserRole.STUDENT,
  },

  // Admin users (staff who can manage the system)
  {
    id: "admin1",
    name: "Dr. Aminah Hassan",
    email: "admin@edu.my",
    studentId: "229001", // Administrative ID
    faculty: "Administration",
    year: 0, // Not applicable for admin
    program: "Administration",
    totalMeritPoints: 0,
    enrollmentDate: "2020-01-01",
    profileImage: "/images/avatars/admin.jpg",
    role: UserRole.ADMIN,
  },
  {
    id: "admin2",
    name: "John Doe",
    email: "john.doe@edu.my",
    studentId: "229002",
    faculty: "Computer Science",
    year: 0,
    program: "Administration",
    totalMeritPoints: 0,
    enrollmentDate: "2021-01-01",
    profileImage: "/default-avatar.png",
    role: UserRole.ADMIN,
  },
];
