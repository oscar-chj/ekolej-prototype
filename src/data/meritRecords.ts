import { MeritRecord, EventCategory } from '@/types/api.types';

/**
 * Mock data for merit records
 * This simulates data that would come from a database in a production application
 */
export const meritRecords: MeritRecord[] = [
  {
    id: '1',
    studentId: '1',
    eventId: '12',
    category: EventCategory.UNIVERSITY,
    points: 100,
    description: 'Participated in International Student Exchange Program',
    date: '2025-05-15'
  },
  {
    id: '2',
    studentId: '1',
    eventId: '13',
    category: EventCategory.FACULTY,
    points: 90,
    description: 'Won Faculty Innovation Challenge',
    date: '2025-05-20'
  },
  {    id: '3',
    studentId: '1',
    eventId: '11',
    category: EventCategory.COLLEGE,
    points: 60,
    description: 'Participated in Campus Blood Donation Drive',
    date: '2025-05-10'
  },
  {    
    id: '4',
    studentId: '1',
    eventId: '14',
    category: EventCategory.ASSOCIATION,
    points: 30,
    description: 'Performed in Drama Club Annual Performance',
    date: '2025-05-25'
  },
  {    id: '5',
    studentId: '2',
    eventId: '12',
    category: EventCategory.UNIVERSITY,
    points: 100,
    description: 'Participated in International Student Exchange Program',
    date: '2025-05-15'
  },
  {    
    id: '6',
    studentId: '2',
    eventId: '13',
    category: EventCategory.FACULTY,
    points: 90,
    description: 'Won Faculty Innovation Challenge',
    date: '2025-05-20'
  },
  {    
    id: '7',
    studentId: '3',
    eventId: '11',
    category: EventCategory.COLLEGE,
    points: 60,
    description: 'Participated in Campus Blood Donation Drive',
    date: '2025-05-10'
  },
  {    
    id: '8',
    studentId: '3',
    eventId: '14',
    category: EventCategory.ASSOCIATION,
    points: 30,
    description: 'Performed in Drama Club Annual Performance',
    date: '2025-05-25'
  }
];