/**
 * Event List Service - Implements UC2: Provide Event List
 * Handles caching and refreshing of event data
 */

import { Event, EventCategory, EventStatus } from '@/types/api.types';

// Sample event data
const sampleEvents: Event[] = [
  {
    id: 'evt_001',
    title: 'International AI Conference 2024',
    description: 'Annual conference on artificial intelligence and machine learning',
    date: '2024-07-15',
    time: '09:00',
    location: 'Main Auditorium',
    organizer: 'Computer Science Department',
    category: EventCategory.UNIVERSITY,
    points: 50,
    capacity: 200,
    registeredCount: 145,
    status: 'Upcoming',
    imageUrl: '/event-placeholder.jpg'
  },
  {
    id: 'evt_002',
    title: 'Faculty Research Symposium',
    description: 'Showcase of faculty research projects and student presentations',
    date: '2024-06-20',
    time: '14:00',
    location: 'Research Center',
    organizer: 'Faculty of Engineering',
    category: EventCategory.FACULTY,
    points: 30,
    capacity: 100,
    registeredCount: 78,
    status: 'Upcoming',
    imageUrl: '/event-placeholder.jpg'
  },
  {
    id: 'evt_003',
    title: 'Annual Sports Day',
    description: 'Inter-college sports competition with various athletic events',
    date: '2024-06-25',
    time: '08:00',
    location: 'Sports Complex',
    organizer: 'College Sports Committee',
    category: EventCategory.COLLEGE,
    points: 20,
    capacity: 500,
    registeredCount: 312,
    status: 'Upcoming',
    imageUrl: '/event-placeholder.jpg'
  },
  {
    id: 'evt_004',
    title: 'Programming Club Hackathon',
    description: '48-hour coding challenge with exciting prizes',
    date: '2024-07-01',
    time: '18:00',
    location: 'Computer Lab Building',
    organizer: 'Programming Club',
    category: EventCategory.ASSOCIATION,
    points: 25,
    capacity: 80,
    registeredCount: 65,
    status: 'Upcoming',
    imageUrl: '/event-placeholder.jpg'
  },
  {
    id: 'evt_005',
    title: 'Career Fair 2024',
    description: 'Meet with top employers and explore internship opportunities',
    date: '2024-06-30',
    time: '10:00',
    location: 'Exhibition Hall',
    organizer: 'Career Services',
    category: EventCategory.COLLEGE,
    points: 15,
    capacity: 300,
    registeredCount: 267,
    status: 'Upcoming',
    imageUrl: '/event-placeholder.jpg'
  }
];

// Cache configuration
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const CACHE_KEY = 'eventListCache';
const CACHE_TIMESTAMP_KEY = 'eventListTimestamp';

interface CachedEventList {
  events: Event[];
  timestamp: number;
}

/**
 * Event List Service Class
 */
export class EventListService {
  
  /**
   * Check if cached event list is still valid (within 15 minutes)
   */
  static isCacheValid(): boolean {
    try {
      const timestampStr = sessionStorage.getItem(CACHE_TIMESTAMP_KEY);
      if (!timestampStr) return false;
      
      const timestamp = parseInt(timestampStr, 10);
      const now = Date.now();
      
      return (now - timestamp) < CACHE_DURATION_MS;
    } catch (error) {
      console.error('Error checking cache validity:', error);
      return false;
    }
  }

  /**
   * Get cached event list if available and valid
   */
  static getCachedEvents(): Event[] | null {
    try {
      if (!this.isCacheValid()) {
        this.clearCache();
        return null;
      }

      const cachedData = sessionStorage.getItem(CACHE_KEY);
      if (!cachedData) return null;

      const parsed: CachedEventList = JSON.parse(cachedData);
      return parsed.events;
    } catch (error) {
      console.error('Error retrieving cached events:', error);
      this.clearCache();
      return null;
    }
  }

  /**
   * Cache event list with timestamp
   */
  static cacheEvents(events: Event[]): void {
    try {
      const cacheData: CachedEventList = {
        events,
        timestamp: Date.now()
      };

      sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      sessionStorage.setItem(CACHE_TIMESTAMP_KEY, cacheData.timestamp.toString());
      sessionStorage.setItem('eventListCached', 'true');
    } catch (error) {
      console.error('Error caching events:', error);
      sessionStorage.setItem('eventListCached', 'false');
    }
  }

  /**
   * Clear event cache
   */
  static clearCache(): void {
    try {
      sessionStorage.removeItem(CACHE_KEY);
      sessionStorage.removeItem(CACHE_TIMESTAMP_KEY);
      sessionStorage.removeItem('eventListCached');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  /**
   * Fetch event list from server (simulated)
   * UC2: Provide Event List implementation
   */
  static async fetchEventList(): Promise<Event[]> {
    try {
      // Check cache first
      const cachedEvents = this.getCachedEvents();
      if (cachedEvents) {
        console.log('Using cached event list');
        return cachedEvents;
      }

      console.log('Fetching fresh event list from server...');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate potential API failures (5% chance)
      if (Math.random() < 0.05) {
        throw new Error('Network error: Unable to fetch event list');
      }

      // Cache the fresh data
      this.cacheEvents(sampleEvents);
      
      console.log('Event list fetched and cached successfully');
      return sampleEvents;
    } catch (error) {
      console.error('Failed to fetch event list:', error);
      
      // Try to return stale cache if available
      const staleCache = sessionStorage.getItem(CACHE_KEY);
      if (staleCache) {
        console.warn('Using stale cached event list due to fetch failure');
        const parsed: CachedEventList = JSON.parse(staleCache);
        return parsed.events;
      }
      
      // No cache available, throw error
      throw new Error('Event data unavailable. Please try again later.');
    }
  }

  /**
   * Force refresh event list (ignores cache)
   */
  static async refreshEventList(): Promise<Event[]> {
    this.clearCache();
    return this.fetchEventList();
  }

  /**
   * Get cache status information
   */
  static getCacheStatus(): {
    isCached: boolean;
    isValid: boolean;
    cacheAge: number;
    nextRefresh: number;
  } {
    const timestampStr = sessionStorage.getItem(CACHE_TIMESTAMP_KEY);
    const isCached = !!timestampStr;
    const isValid = this.isCacheValid();
    
    let cacheAge = 0;
    let nextRefresh = 0;
    
    if (timestampStr) {
      const timestamp = parseInt(timestampStr, 10);
      const now = Date.now();
      cacheAge = now - timestamp;
      nextRefresh = Math.max(0, CACHE_DURATION_MS - cacheAge);
    }

    return {
      isCached,
      isValid,
      cacheAge,
      nextRefresh
    };
  }

  /**
   * Filter events by various criteria
   */
  static filterEvents(
    events: Event[], 
    filters: {
      category?: EventCategory;
      status?: EventStatus;
      search?: string;
    }
  ): Event[] {
    return events.filter(event => {
      if (filters.category && event.category !== filters.category) {
        return false;
      }
      
      if (filters.status && event.status !== filters.status) {
        return false;
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower) ||
          event.organizer.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  }
}

export default EventListService;
