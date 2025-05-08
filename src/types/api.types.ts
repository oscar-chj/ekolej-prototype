// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

// Student Types
export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  faculty: string;
  year: number;
  program: string;
  totalMeritPoints: number;
  enrollmentDate: string;
  profileImage?: string;
}

export interface StudentFilters {
  faculty?: string;
  year?: number;
  program?: string;
  search?: string;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  category: EventCategory;
  points: number;
  capacity: number;
  registeredCount: number;
  status: EventStatus;
  imageUrl?: string;
}

// Convert from type to enum object for EventCategory
export enum EventCategory {
  ACADEMIC = 'Academic',
  COCURRICULAR = 'Co-curricular',
  COMMUNITY = 'Community Service',
  LEADERSHIP = 'Leadership',
  SPORTS = 'Sports'
}

export type EventStatus = 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';

export interface EventFilters {
  category?: EventCategory;
  status?: EventStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
  minPoints?: number;
  maxPoints?: number;
}

// Registration Types
export interface EventRegistration {
  id: string;
  eventId: string;
  studentId: string;
  registrationDate: string;
  status: RegistrationStatus;
  attendanceMarked: boolean;
  pointsAwarded: number;
}

export type RegistrationStatus = 'Registered' | 'Waitlisted' | 'Cancelled' | 'Attended';

// Merit Types
export interface MeritRecord {
  id: string;
  studentId: string;
  eventId?: string;
  category: EventCategory;
  points: number;
  description: string;
  date: string;
  isVerified: boolean;
  verifiedBy?: string;
  verificationDate?: string;
}