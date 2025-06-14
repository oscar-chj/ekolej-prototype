import { MeritSummary } from '@/types/merit.types';
import { EventCategory } from '@/types/api.types';

/**
 * Sample merit data for development and testing purposes
 * In production, this would come from an API
 */
export const sampleMeritData: MeritSummary = {
  totalPoints: 1850,
  targetPoints: 3000,
  academicPoints: 800,
  cocurricularPoints: 650,
  communityPoints: 400,
  recentActivities: [
    {
      id: '1',
      title: 'Research Paper Presentation',
      category: EventCategory.ACADEMIC,
      points: 100,
      date: '2025-04-15',
      description: 'Presented research paper at the annual symposium',
      verified: true
    },
    {
      id: '2',
      title: 'Community Cleanup Drive',
      category: EventCategory.COMMUNITY,
      points: 75,
      date: '2025-04-10',
      description: 'Participated in campus area cleanup initiative',
      verified: true
    },
    {
      id: '3',
      title: 'Debate Club Competition',
      category: EventCategory.COCURRICULAR,
      points: 50,
      date: '2025-04-05',
      description: 'Participated in inter-university debate competition',
      verified: true
    }
  ],
  upcomingEvents: [
    {
      id: '101',
      title: 'Leadership Workshop',
      date: '2025-05-15',
      points: 60,
      location: 'Student Center Room 302',
      description: 'Develop your leadership skills with industry experts',
      capacity: 30,
      registeredCount: 18,
      category: EventCategory.COCURRICULAR
    },
    {
      id: '102',
      title: 'Community Service Day',
      date: '2025-05-22',
      points: 80,
      location: 'Main Campus Courtyard',
      description: 'Join us for a day of giving back to our community',
      capacity: 50,
      registeredCount: 35,
      category: EventCategory.COMMUNITY
    }
  ]
};
