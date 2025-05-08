import { EventRegistration } from '@/types/api.types';

// Mock data for event registrations
export const registrations: EventRegistration[] = [
  {
    id: '1',
    eventId: '1',
    studentId: '1',
    registrationDate: '2025-05-01',
    status: 'Registered',
    attendanceMarked: false,
    pointsAwarded: 0
  },
  {
    id: '2',
    eventId: '1',
    studentId: '3',
    registrationDate: '2025-05-02',
    status: 'Registered',
    attendanceMarked: false,
    pointsAwarded: 0
  },
  {
    id: '3',
    eventId: '2',
    studentId: '1',
    registrationDate: '2025-04-28',
    status: 'Registered',
    attendanceMarked: false,
    pointsAwarded: 0
  },
  {
    id: '4',
    eventId: '2',
    studentId: '2',
    registrationDate: '2025-04-30',
    status: 'Registered',
    attendanceMarked: false,
    pointsAwarded: 0
  },
  {
    id: '5',
    eventId: '3',
    studentId: '4',
    registrationDate: '2025-05-01',
    status: 'Registered',
    attendanceMarked: false,
    pointsAwarded: 0
  },
  {
    id: '6',
    eventId: '3',
    studentId: '5',
    registrationDate: '2025-05-03',
    status: 'Waitlisted',
    attendanceMarked: false,
    pointsAwarded: 0
  },
  {
    id: '7',
    eventId: '4',
    studentId: '2',
    registrationDate: '2025-04-25',
    status: 'Registered',
    attendanceMarked: false,
    pointsAwarded: 0
  },
  {
    id: '8',
    eventId: '5',
    studentId: '1',
    registrationDate: '2025-05-05',
    status: 'Registered',
    attendanceMarked: false,
    pointsAwarded: 0
  }
];