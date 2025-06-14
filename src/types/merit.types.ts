import { EventCategory } from './api.types';

/**
 * Interface representing a merit activity
 */
export interface MeritActivity {
  id: string;
  title: string;
  category: EventCategory;
  points: number;
  date: string;
  description?: string;
  // Note: verification fields removed as verification is not required
}

/**
 * Interface representing a merit event
 */
export interface MeritEvent {
  id: string;
  title: string;
  date: string;
  points: number;
  location: string;
  description?: string;
  capacity?: number;
  registeredCount?: number;
  category: EventCategory;
}

/**
 * Interface representing a student's merit summary
 */
export interface MeritSummary {
  totalPoints: number;
  targetPoints: number;
  academicPoints: number;      // International/National/University Merit
  cocurricularPoints: number;  // Faculty Merit
  communityPoints: number;     // College Merit
  associationPoints: number;   // Association/Club Merit
  recentActivities: MeritActivity[];
  upcomingEvents: MeritEvent[];
}

/**
 * Interface for merit record creation request
 */
export interface CreateMeritRecordRequest {
  studentId: string;
  eventId?: string;
  category: EventCategory;
  points: number;
  description: string;
  date: string;
}

/**
 * Interface for merit verification request (deprecated - verification not required)
 */
export interface VerifyMeritRecordRequest {
  recordId: string;
  verifiedBy?: string; // Optional since verification is not required
}