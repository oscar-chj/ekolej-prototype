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
  },  {
    id: '8',
    eventId: '5',
    studentId: '1',
    registrationDate: '2025-05-05',
    status: 'Registered',
    attendanceMarked: false,
    pointsAwarded: 0
  },
  
  // Completed event registrations with awarded points
  {
    id: '9',
    eventId: '11', // Campus Blood Donation Drive (6 points)
    studentId: '1',
    registrationDate: '2025-05-01',
    status: 'Attended',
    attendanceMarked: true,
    pointsAwarded: 6
  },
  {
    id: '10',
    eventId: '11', // Campus Blood Donation Drive
    studentId: '2',
    registrationDate: '2025-05-02',
    status: 'Attended',
    attendanceMarked: true,
    pointsAwarded: 6
  },
  {
    id: '11',
    eventId: '12', // Global Student Exchange Summit (10 points)
    studentId: '1',
    registrationDate: '2025-05-10',
    status: 'Attended',
    attendanceMarked: true,
    pointsAwarded: 10
  },
  {
    id: '12',
    eventId: '13', // Student Innovation Competition (9 points)
    studentId: '2',
    registrationDate: '2025-05-15',
    status: 'Attended',
    attendanceMarked: true,
    pointsAwarded: 9
  },
  {
    id: '13',
    eventId: '13', // Student Innovation Competition
    studentId: '3',
    registrationDate: '2025-05-16',
    status: 'Attended',
    attendanceMarked: true,
    pointsAwarded: 9
  },
  {
    id: '14',
    eventId: '14', // Annual Drama Performance Festival (3 points)
    studentId: '4',
    registrationDate: '2025-05-20',
    status: 'Attended',
    attendanceMarked: true,
    pointsAwarded: 3
  },
  {
    id: '15',
    eventId: '15', // National Mathematics Olympiad (10 points)
    studentId: '1',
    registrationDate: '2025-04-25',
    status: 'Attended',
    attendanceMarked: true,
    pointsAwarded: 10
  },
  {
    id: '16',
    eventId: '16', // Environmental Sustainability Workshop (4 points)
    studentId: '2',
    registrationDate: '2025-05-05',
    status: 'Attended',
    attendanceMarked: true,
    pointsAwarded: 4
  },
  {
    id: '17',
    eventId: '16', // Environmental Sustainability Workshop
    studentId: '5',
    registrationDate: '2025-05-06',
    status: 'Attended',
    attendanceMarked: true,
    pointsAwarded: 4
  },
  {
    id: '18',
    eventId: '14', // Annual Drama Performance Festival
    studentId: '3',
    registrationDate: '2025-05-22',
    status: 'Attended',
    attendanceMarked: true,
    pointsAwarded: 3
  }
];