import { EventCategory } from '@/types/api.types';

/**
 * Sample data for admin merit upload functionality
 * In production, this would come from database queries
 */

// Event interface for merit upload
export interface EventForMerit {
  id: string;
  name: string;
  category: EventCategory;
  maxPoints: number;
  date: string;
}

// CSV merit entry interface
export interface CSVMeritEntry {
  studentId: string;
  studentName: string;
  points: number;
  meritType: string;
  status: 'valid' | 'invalid' | 'duplicate';
  errorMessage?: string;
}

// Sample event for demonstration
export const sampleEvent: EventForMerit = {
  id: 'evt_001',
  name: 'Faculty Research Symposium 2024',
  category: EventCategory.FACULTY,
  maxPoints: 30,
  date: '2024-03-15'
};

// Sample CSV data for upload preview
export const sampleCSVData: CSVMeritEntry[] = [
  {
    studentId: 'S12001',
    studentName: 'Alice Johnson',
    points: 25,
    meritType: 'Event Participation',
    status: 'valid'
  },
  {
    studentId: 'S12002',
    studentName: 'Bob Chen',
    points: 20,
    meritType: 'Achievement Award',
    status: 'valid'
  },
  {
    studentId: 'S12345',
    studentName: 'John Doe',
    points: 22,
    meritType: 'Research Contribution',
    status: 'valid'
  },
  {
    studentId: 'S12999',
    studentName: 'Invalid Student',
    points: 15,
    meritType: 'Participation',
    status: 'invalid',
    errorMessage: 'Student ID not found in system'
  },
  {
    studentId: 'S12001',
    studentName: 'Alice Johnson',
    points: 25,
    meritType: 'Event Participation',
    status: 'duplicate',
    errorMessage: 'Merit already awarded for this event'
  }
];

/**
 * Available events for merit assignment
 * In production, this would be fetched from the events table
 */
export const availableEvents: EventForMerit[] = [
  {
    id: 'evt_001',
    name: 'Faculty Research Symposium 2024',
    category: EventCategory.FACULTY,
    maxPoints: 30,
    date: '2024-03-15'
  },
  {
    id: 'evt_002',
    name: 'University Innovation Challenge',
    category: EventCategory.UNIVERSITY,
    maxPoints: 50,
    date: '2024-04-20'
  },
  {
    id: 'evt_003',
    name: 'College Cultural Festival',
    category: EventCategory.COLLEGE,
    maxPoints: 25,
    date: '2024-05-10'
  },
  {
    id: 'evt_004',
    name: 'Student Association Leadership Workshop',
    category: EventCategory.ASSOCIATION,
    maxPoints: 20,
    date: '2024-06-05'
  }
];

/**
 * Validation functions for CSV upload
 */
export function validateStudentId(studentId: string): boolean {
  // In production, this would check against the students database
  return studentId.startsWith('S') && studentId.length === 6;
}

export function validatePoints(points: number, maxPoints: number): boolean {
  return points > 0 && points <= maxPoints;
}

export function checkForDuplicates(entries: CSVMeritEntry[]): CSVMeritEntry[] {
  const seen = new Set<string>();
  return entries.map(entry => {
    const key = `${entry.studentId}-${entry.meritType}`;
    if (seen.has(key)) {
      return {
        ...entry,
        status: 'duplicate',
        errorMessage: 'Duplicate entry found in CSV'
      };
    }
    seen.add(key);
    return entry;
  });
}

/**
 * Process CSV data for upload
 */
export function processCSVData(rawData: Record<string, unknown>[], selectedEvent: EventForMerit): CSVMeritEntry[] {
  return rawData.map((row) => {
    const entry: CSVMeritEntry = {
      studentId: String(row.studentId || ''),
      studentName: String(row.studentName || ''),
      points: parseInt(String(row.points || '0')) || 0,
      meritType: String(row.meritType || 'Event Participation'),
      status: 'valid'
    };

    // Validate entry
    if (!validateStudentId(entry.studentId)) {
      entry.status = 'invalid';
      entry.errorMessage = 'Invalid student ID format';
    } else if (!validatePoints(entry.points, selectedEvent.maxPoints)) {
      entry.status = 'invalid';
      entry.errorMessage = `Points must be between 1 and ${selectedEvent.maxPoints}`;
    } else if (!entry.studentName.trim()) {
      entry.status = 'invalid';
      entry.errorMessage = 'Student name is required';
    }

    return entry;
  });
}
