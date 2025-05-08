"use client";

// This is a sample merit service that handles merit points and activities
// In a real application, this would fetch data from an API or database

// Merit data types
export interface MeritActivity {
  id: number;
  title: string;
  category: 'Academic' | 'Co-curricular' | 'Community Service';
  points: number;
  date: string;
  description?: string;
  verified?: boolean;
  verifiedBy?: string;
}

export interface MeritEvent {
  id: number;
  title: string;
  date: string;
  points: number;
  location: string;
  description?: string;
  capacity?: number;
  registeredCount?: number;
  category: 'Academic' | 'Co-curricular' | 'Community Service';
}

export interface MeritSummary {
  totalPoints: number;
  targetPoints: number;
  academicPoints: number;
  cocurricularPoints: number;
  communityPoints: number;
  recentActivities: MeritActivity[];
  upcomingEvents: MeritEvent[];
}

// Sample merit data
const sampleMeritData: MeritSummary = {
  totalPoints: 450,
  targetPoints: 600,
  academicPoints: 250,
  cocurricularPoints: 125,
  communityPoints: 75,
  recentActivities: [
    {
      id: 1,
      title: 'Programming Competition',
      category: 'Academic',
      points: 50,
      date: '2025-04-28',
      description: 'Participated in the university coding competition and secured 2nd position.',
      verified: true,
      verifiedBy: 'Prof. Smith'
    },
    {
      id: 2,
      title: 'Community Outreach',
      category: 'Community Service',
      points: 25,
      date: '2025-04-15',
      description: 'Volunteered at the local community center to teach basic computer skills.',
      verified: true,
      verifiedBy: 'Dr. Johnson'
    },
    {
      id: 3,
      title: 'Sports Day Participant',
      category: 'Co-curricular',
      points: 20,
      date: '2025-04-10',
      description: 'Represented the department in 100m sprint and relay race.',
      verified: true,
      verifiedBy: 'Coach Williams'
    },
    {
      id: 4,
      title: 'Library Helper',
      category: 'Community Service',
      points: 15,
      date: '2025-04-05',
      description: 'Assisted in organizing and cataloging new books in the university library.',
      verified: true,
      verifiedBy: 'Ms. Davis'
    }
  ],
  upcomingEvents: [
    {
      id: 101,
      title: 'Leadership Workshop',
      date: '2025-05-15',
      points: 30,
      location: 'Main Hall',
      description: 'A workshop focused on developing leadership skills for students.',
      capacity: 50,
      registeredCount: 32,
      category: 'Co-curricular'
    },
    {
      id: 102,
      title: 'Hackathon',
      date: '2025-05-22',
      points: 50,
      location: 'CS Building',
      description: '24-hour coding event to develop innovative solutions for real-world problems.',
      capacity: 100,
      registeredCount: 75,
      category: 'Academic'
    },
    {
      id: 103,
      title: 'Charity Run',
      date: '2025-05-30',
      points: 40,
      location: 'University Stadium',
      description: 'Annual charity run to raise funds for local orphanages.',
      capacity: 200,
      registeredCount: 120,
      category: 'Community Service'
    }
  ]
};

// Merit Service class
export class MeritService {
  private static instance: MeritService;
  private meritData: MeritSummary = sampleMeritData;

  private constructor() {}

  public static async getInstance(): Promise<MeritService> {
    if (!MeritService.instance) {
      MeritService.instance = new MeritService();
    }
    return MeritService.instance;
  }

  /**
   * Get merit summary for the current user
   * In a real app, this would fetch data for the specific logged-in user
   */
  public async getMeritSummary(userId?: string): Promise<MeritSummary> {
    // In a real app, fetch data for specific user
    // For now, return sample data
    return this.meritData;
  }

  /**
   * Get list of all activities for the current user
   */
  public async getActivities(userId?: string): Promise<MeritActivity[]> {
    return this.meritData.recentActivities;
  }

  /**
   * Get list of upcoming events
   */
  public async getUpcomingEvents(): Promise<MeritEvent[]> {
    return this.meritData.upcomingEvents;
  }

  /**
   * Register user for an event
   * In a real app, this would update a database
   */
  public async registerForEvent(eventId: number, userId: string): Promise<boolean> {
    const event = this.meritData.upcomingEvents.find(e => e.id === eventId);
    if (!event) return false;

    // Check if there's space available
    if (event.capacity && event.registeredCount && event.registeredCount >= event.capacity) {
      return false;
    }

    // In a real app, we would update the registration in a database
    if (event.registeredCount) {
      event.registeredCount += 1;
    } else {
      event.registeredCount = 1;
    }
    
    return true;
  }
}

// Create a singleton instance
const meritServicePromise = MeritService.getInstance();
let meritService: MeritService;

// Export an async function to get the service
export async function getMeritService(): Promise<MeritService> {
  if (!meritService) {
    meritService = await meritServicePromise;
  }
  return meritService;
}