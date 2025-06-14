import { EventCategory } from '@/types/api.types';

/**
 * Sample merit records data for reports
 * In production, this would come from a database
 */

// Merit record interface for reports
export interface MeritRecord {
  id: string;
  eventName: string;
  category: EventCategory;
  points: number;
  date: string;
  description: string;
  meritType: string;
  certificate?: string;
}

export const sampleMeritRecords: MeritRecord[] = [
  {
    id: '1',
    eventName: 'International Student Exchange Program',
    category: EventCategory.UNIVERSITY,
    points: 100,
    date: '2025-05-15',
    description: 'Cultural exchange program with international partner universities',
    meritType: 'University Program',
    certificate: 'cert_001.pdf'
  },
  {
    id: '2',
    eventName: 'Faculty Innovation Challenge',
    category: EventCategory.FACULTY,
    points: 90,
    date: '2025-05-20',
    description: 'Won innovation competition showcasing student projects to faculty judges',
    meritType: 'Academic Achievement',
    certificate: 'cert_002.pdf'
  },
  {
    id: '3',
    eventName: 'Campus Blood Donation Drive',
    category: EventCategory.COLLEGE,
    points: 60,
    date: '2025-05-10',
    description: 'Participated in campus blood donation drive helping community',
    meritType: 'Community Service'
  },
  {
    id: '4',
    eventName: 'Drama Club Annual Performance',
    category: EventCategory.ASSOCIATION,
    points: 30,
    date: '2025-05-25',
    description: 'Performed in annual theatrical performance featuring original student productions',
    meritType: 'Club Activity',
    certificate: 'cert_004.pdf'
  },
  {
    id: '5',
    eventName: 'Coding Hackathon 2025',
    category: EventCategory.FACULTY,
    points: 100,
    date: '2025-06-20',
    description: 'Won first place in 48-hour coding challenge for campus problems',
    meritType: 'Academic Competition',
    certificate: 'cert_005.pdf'
  },
  {
    id: '6',
    eventName: 'International Conference Week',
    category: EventCategory.UNIVERSITY,
    points: 120,
    date: '2025-06-10',
    description: 'Attended week-long international conference with keynote speakers',
    meritType: 'University Event'
  }
];

/**
 * Utility functions for filtering merit records by category
 * These simulate database queries that would be used in production
 */
export function filterRecordsByCategory(category: EventCategory): MeritRecord[] {
  return sampleMeritRecords.filter(record => record.category === category);
}

export function calculateCategoryTotal(category: EventCategory): number {
  return filterRecordsByCategory(category)
    .reduce((total, record) => total + record.points, 0);
}

export function getTotalMeritPoints(): number {
  return sampleMeritRecords.reduce((total, record) => total + record.points, 0);
}

/**
 * Get merit records by date range
 */
export function getRecordsByDateRange(startDate: string, endDate: string): MeritRecord[] {
  return sampleMeritRecords.filter(record => {
    const recordDate = new Date(record.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return recordDate >= start && recordDate <= end;
  });
}

/**
 * Get recent merit records (last N records)
 */
export function getRecentRecords(limit: number = 5): MeritRecord[] {
  return [...sampleMeritRecords]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}
