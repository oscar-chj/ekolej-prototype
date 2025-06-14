import { MeritSummary } from '@/types/merit.types';
import { EventCategory } from '@/types/api.types';

/**
 * Sample merit data for development and testing purposes
 * In production, this would come from an API
 */
export const sampleMeritData: MeritSummary = {
  totalPoints: 95,
  targetPoints: 150,
  academicPoints: 35,  // University/National/International Merit
  cocurricularPoints: 25,  // Faculty Merit  
  communityPoints: 20,     // College Merit
  associationPoints: 15,   // Association/Club Merit
  recentActivities: [
    {
      id: '1',
      title: 'University Conference Paper Presentation',
      category: EventCategory.UNIVERSITY,
      points: 25,
      date: '2025-04-15',
      description: 'Presented research paper at university conference'
    },
    {
      id: '2',
      title: 'Faculty Academic Competition',
      category: EventCategory.FACULTY,
      points: 15,
      date: '2025-04-10',
      description: 'Won first place in faculty-level programming contest'
    },
    {
      id: '3',
      title: 'College Cultural Festival',
      category: EventCategory.COLLEGE,
      points: 10,
      date: '2025-04-05',
      description: 'Participated in college annual cultural festival'
    }
  ],
  upcomingEvents: [
    {
      id: '1',
      title: 'Coding Hackathon 2025',
      date: '2025-06-20',
      points: 100,
      location: 'Computer Science Building, Lab 3',
      description: 'A 48-hour coding challenge to build innovative solutions for campus problems.',
      capacity: 50,
      registeredCount: 32,
      category: EventCategory.FACULTY
    },
    {
      id: '2',
      title: 'Research Paper Presentation',
      date: '2025-06-25',
      points: 80,
      location: 'Main Auditorium',
      description: 'Present your research findings to faculty and peers in this academic symposium.',
      capacity: 100,
      registeredCount: 45,
      category: EventCategory.UNIVERSITY
    },
    {
      id: '3',
      title: 'Sports Championship',
      date: '2025-07-01',
      points: 60,
      location: 'University Sports Complex',
      description: 'Annual inter-college sports championship featuring multiple sporting events.',
      capacity: 200,
      registeredCount: 120,
      category: EventCategory.COLLEGE
    },
    {
      id: '4',
      title: 'Programming Club Workshop',
      date: '2025-07-10',
      points: 40,
      location: 'CS Lab 2',
      description: 'Learn advanced programming techniques and best practices from industry experts.',
      capacity: 30,
      registeredCount: 25,
      category: EventCategory.ASSOCIATION
    }
  ]
};
