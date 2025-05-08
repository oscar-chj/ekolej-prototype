'use client';

import { events } from '@/data/events';
import { registrations } from '@/data/registrations';
import { ApiResponse, Event, EventFilters, EventRegistration, PaginatedResponse, PaginationParams } from '@/types/api.types';

/**
 * Service for event-related operations
 * This provides an abstraction layer for accessing event data
 * and can be easily replaced with a real API implementation later
 */
export class EventService {
  /**
   * Get a list of events with pagination and optional filtering
   * @param params - Optional pagination parameters
   * @param filters - Optional event filters
   * @returns A paginated response containing events
   */
  async getEvents(
    params?: PaginationParams,
    filters?: EventFilters
  ): Promise<PaginatedResponse<Event[]>> {
    try {
      // Apply filters
      const filteredEvents = this.applyEventFilters(events, filters);
      
      // Apply pagination
      return this.paginateResults(filteredEvents, params);
    } catch (error) {
      console.error('Error getting events:', error);
      return this.createErrorPaginatedResponse('Failed to retrieve events', params);
    }
  }
  
  /**
   * Get an event by ID
   * @param id - The event ID
   * @returns API response containing the event or an error
   */
  async getEventById(id: string): Promise<ApiResponse<Event>> {
    try {
      if (!id) {
        return {
          success: false,
          error: 'Event ID is required'
        };
      }
      
      const event = events.find(e => e.id === id);
      
      if (!event) {
        return {
          success: false,
          error: 'Event not found'
        };
      }
      
      return {
        success: true,
        data: event
      };
    } catch (error) {
      console.error('Error getting event by ID:', error);
      return {
        success: false,
        error: 'Failed to retrieve event'
      };
    }
  }
  
  /**
   * Register a student for an event
   * @param eventId - The event ID
   * @param studentId - The student ID
   * @returns API response containing the registration or an error
   */
  async registerForEvent(eventId: string, studentId: string): Promise<ApiResponse<EventRegistration>> {
    try {
      // Input validation
      if (!eventId || !studentId) {
        return {
          success: false,
          error: 'Event ID and Student ID are required'
        };
      }
      
      // Check if event exists
      const event = events.find(e => e.id === eventId);
      if (!event) {
        return {
          success: false,
          error: 'Event not found'
        };
      }
      
      // Check if student is already registered
      const existingRegistration = registrations.find(
        r => r.eventId === eventId && r.studentId === studentId
      );
      
      if (existingRegistration) {
        return {
          success: false,
          error: 'Student is already registered for this event',
          data: existingRegistration
        };
      }
      
      // Check if event is at capacity
      const eventRegistrations = registrations.filter(
        r => r.eventId === eventId && r.status === 'Registered'
      );
      
      // Determine registration status based on capacity
      const registrationStatus: 'Registered' | 'Waitlisted' = 
        eventRegistrations.length < event.capacity ? 'Registered' : 'Waitlisted';
      
      // Create new registration with a unique ID
      const newRegistration: EventRegistration = {
        id: `reg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        eventId,
        studentId,
        registrationDate: new Date().toISOString().split('T')[0],
        status: registrationStatus,
        attendanceMarked: false,
        pointsAwarded: 0
      };
      
      // Add to registrations (in a real app, this would be a database operation)
      registrations.push(newRegistration);
      
      // Update event registered count
      if (registrationStatus === 'Registered') {
        const eventIndex = events.findIndex(e => e.id === eventId);
        if (eventIndex !== -1) {
          events[eventIndex].registeredCount += 1;
        }
      }
      
      return {
        success: true,
        data: newRegistration,
        message: registrationStatus === 'Registered' 
          ? 'Successfully registered for the event' 
          : 'Added to the waitlist for the event'
      };
    } catch (error) {
      console.error('Error registering for event:', error);
      return {
        success: false,
        error: 'Failed to register for event'
      };
    }
  }
  
  /**
   * Cancel registration for an event
   * @param eventId - The event ID
   * @param studentId - The student ID
   * @returns API response indicating success or failure
   */
  async cancelRegistration(eventId: string, studentId: string): Promise<ApiResponse<void>> {
    try {
      // Input validation
      if (!eventId || !studentId) {
        return {
          success: false,
          error: 'Event ID and Student ID are required'
        };
      }
      
      // Find the registration
      const registrationIndex = registrations.findIndex(
        r => r.eventId === eventId && r.studentId === studentId
      );
      
      if (registrationIndex === -1) {
        return {
          success: false,
          error: 'Registration not found'
        };
      }
      
      // Get the registration before removing it
      const registration = registrations[registrationIndex];
      
      // Check if the registration can be cancelled
      if (registration.status === 'Attended') {
        return {
          success: false,
          error: 'Cannot cancel registration after attendance has been marked'
        };
      }
      
      // Remove the registration (in a real app, this would be a database operation)
      registrations.splice(registrationIndex, 1);
      
      // Update event registered count if the student was registered (not waitlisted)
      if (registration.status === 'Registered') {
        const eventIndex = events.findIndex(e => e.id === eventId);
        if (eventIndex !== -1 && events[eventIndex].registeredCount > 0) {
          events[eventIndex].registeredCount -= 1;
          
          // Move someone from waitlist to registered if available
          const waitlistedRegistration = registrations.find(
            r => r.eventId === eventId && r.status === 'Waitlisted'
          );
          
          if (waitlistedRegistration) {
            waitlistedRegistration.status = 'Registered';
            events[eventIndex].registeredCount += 1;
          }
        }
      }
      
      return {
        success: true,
        message: 'Registration cancelled successfully'
      };
    } catch (error) {
      console.error('Error cancelling registration:', error);
      return {
        success: false,
        error: 'Failed to cancel registration'
      };
    }
  }
  
  /**
   * Get all registrations for a student
   * @param studentId - The student ID
   * @returns API response containing the student's registrations
   */
  async getStudentRegistrations(
    studentId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<EventRegistration[]>> {
    try {
      if (!studentId) {
        return this.createErrorPaginatedResponse('Student ID is required', params);
      }
      
      const studentRegistrations = registrations.filter(r => r.studentId === studentId);
      
      return this.paginateResults(studentRegistrations, params);
    } catch (error) {
      console.error('Error getting student registrations:', error);
      return this.createErrorPaginatedResponse('Failed to retrieve registrations', params);
    }
  }
  
  /**
   * Get all registrations for an event
   * @param eventId - The event ID
   * @returns API response containing the event's registrations
   */
  async getEventRegistrations(
    eventId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<EventRegistration[]>> {
    try {
      if (!eventId) {
        return this.createErrorPaginatedResponse('Event ID is required', params);
      }
      
      const eventRegistrations = registrations.filter(r => r.eventId === eventId);
      
      return this.paginateResults(eventRegistrations, params);
    } catch (error) {
      console.error('Error getting event registrations:', error);
      return this.createErrorPaginatedResponse('Failed to retrieve registrations', params);
    }
  }

  /**
   * Apply filters to an array of events
   * @private
   */
  private applyEventFilters(eventsArray: Event[], filters?: EventFilters): Event[] {
    if (!filters) return [...eventsArray];
    
    let filteredEvents = [...eventsArray];
    
    if (filters.category) {
      filteredEvents = filteredEvents.filter(
        event => event.category === filters.category
      );
    }
    
    if (filters.status) {
      filteredEvents = filteredEvents.filter(
        event => event.status === filters.status
      );
    }
    
    if (filters.startDate) {
      filteredEvents = filteredEvents.filter(
        event => new Date(event.date) >= new Date(filters.startDate!)
      );
    }
    
    if (filters.endDate) {
      filteredEvents = filteredEvents.filter(
        event => new Date(event.date) <= new Date(filters.endDate!)
      );
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase().trim();
      filteredEvents = filteredEvents.filter(
        event => event.title.toLowerCase().includes(searchTerm) || 
                event.description.toLowerCase().includes(searchTerm) ||
                event.location.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.minPoints !== undefined) {
      filteredEvents = filteredEvents.filter(
        event => event.points >= filters.minPoints!
      );
    }
    
    if (filters.maxPoints !== undefined) {
      filteredEvents = filteredEvents.filter(
        event => event.points <= filters.maxPoints!
      );
    }

    return filteredEvents;
  }

  /**
   * Helper method to paginate results
   * @private
   */
  private paginateResults<T>(
    items: T[], 
    params?: PaginationParams
  ): PaginatedResponse<T[]> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedItems = items.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: paginatedItems,
      pagination: {
        totalItems: items.length,
        totalPages: Math.ceil(items.length / limit),
        currentPage: page,
        itemsPerPage: limit
      }
    };
  }

  /**
   * Helper method to create error response with pagination
   * @private
   */
  private createErrorPaginatedResponse<T>(
    error: string,
    params?: PaginationParams
  ): PaginatedResponse<T> {
    return {
      success: false,
      error,
      pagination: {
        totalItems: 0,
        totalPages: 0,
        currentPage: params?.page || 1,
        itemsPerPage: params?.limit || 10
      }
    };
  }
}

// Export singleton instance
const eventService = new EventService();
export default eventService;