import { MeritRecord, EventCategory } from '@/types/api.types';

/**
 * Mock data for merit records
 * This simulates data that would come from a database in a production application
 */
export const meritRecords: MeritRecord[] = [
  {
    id: '1',
    studentId: '1',
    eventId: '5',
    category: EventCategory.ACADEMIC,
    points: 75,
    description: 'Attended AI Research Symposium',
    date: '2025-04-30',
    isVerified: true,
    verifiedBy: 'Dr. Sarah Johnson',
    verificationDate: '2025-05-01'
  },
  {
    id: '2',
    studentId: '1',
    eventId: '8',
    category: EventCategory.COMMUNITY,
    points: 60,
    description: 'Participated in Campus Blood Donation Drive',
    date: '2025-05-10',
    isVerified: true,
    verifiedBy: 'Dr. Michael Chen',
    verificationDate: '2025-05-11'
  },
  {
    id: '3',
    studentId: '2',
    eventId: '5',
    category: EventCategory.ACADEMIC,
    points: 75,
    description: 'Attended AI Research Symposium',
    date: '2025-04-30',
    isVerified: true,
    verifiedBy: 'Dr. Sarah Johnson',
    verificationDate: '2025-05-01'
  },
  {
    id: '4',
    studentId: '3',
    eventId: '8',
    category: EventCategory.COMMUNITY,
    points: 60,
    description: 'Participated in Campus Blood Donation Drive',
    date: '2025-05-10',
    isVerified: true,
    verifiedBy: 'Dr. Michael Chen',
    verificationDate: '2025-05-11'
  },
  {
    id: '5',
    studentId: '2',
    category: EventCategory.LEADERSHIP,
    points: 50,
    description: 'Organized Freshman Orientation Program',
    date: '2025-04-15',
    isVerified: true,
    verifiedBy: 'Prof. Linda Martinez',
    verificationDate: '2025-04-16'
  },
  {
    id: '6',
    studentId: '4',
    eventId: '5',
    category: EventCategory.ACADEMIC,
    points: 75,
    description: 'Presented at AI Research Symposium',
    date: '2025-04-30',
    isVerified: true,
    verifiedBy: 'Dr. Sarah Johnson',
    verificationDate: '2025-05-01'
  },
  {
    id: '7',
    studentId: '1',
    category: EventCategory.SPORTS,
    points: 40,
    description: 'Represented faculty in Inter-Faculty Swimming Competition',
    date: '2025-03-20',
    isVerified: true,
    verifiedBy: 'Coach David Williams',
    verificationDate: '2025-03-21'
  },
  {
    id: '8',
    studentId: '5',
    category: EventCategory.COCURRICULAR,
    points: 35,
    description: 'Performed in University Orchestra',
    date: '2025-03-15',
    isVerified: true,
    verifiedBy: 'Prof. Robert Lee',
    verificationDate: '2025-03-16'
  },
  {
    id: '9',
    studentId: '3',
    category: EventCategory.ACADEMIC,
    points: 30,
    description: 'Published article in University Research Journal',
    date: '2025-02-28',
    isVerified: true,
    verifiedBy: 'Dr. Emily Thompson',
    verificationDate: '2025-03-01'
  },
  {
    id: '10',
    studentId: '2',
    eventId: '8',
    category: EventCategory.COMMUNITY,
    points: 60,
    description: 'Helped organize Campus Blood Donation Drive',
    date: '2025-05-10',
    isVerified: true,
    verifiedBy: 'Dr. Michael Chen',
    verificationDate: '2025-05-11'
  }
];