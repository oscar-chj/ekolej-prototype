"use client";

import {
  ApiResponse,
  Event,
  EventFilters,
  EventRegistration,
  PaginatedResponse,
  PaginationParams,
} from "@/types/api.types";

/**
 * Service for event-related operations
 */
export class EventService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private requestCache: Map<string, Promise<any>> = new Map();

  private async deduplicatedFetch<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    if (this.requestCache.has(key)) {
      return this.requestCache.get(key) as Promise<T>;
    }

    const promise = fetchFn().finally(() => {
      setTimeout(() => this.requestCache.delete(key), 100);
    });

    this.requestCache.set(key, promise);
    return promise;
  }

  /**
   * Get a list of events with pagination and optional filtering
   */
  async getEvents(
    params?: PaginationParams,
    filters?: EventFilters
  ): Promise<PaginatedResponse<Event[]>> {
    const cacheKey = `events-${JSON.stringify(params)}-${JSON.stringify(filters)}`;
    return this.deduplicatedFetch(cacheKey, async () => {
      try {
        const url = new URL("/api/events", window.location.origin);

        if (params?.page) {
          url.searchParams.set("page", params.page.toString());
        }
        if (params?.limit) {
          url.searchParams.set("limit", params.limit.toString());
        }
        if (filters?.category) {
          url.searchParams.set("category", filters.category);
        }
        if (filters?.status) {
          url.searchParams.set("status", filters.status);
        }
        if (filters?.search) {
          url.searchParams.set("search", filters.search);
        }

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          return this.createErrorPaginatedResponse(
            errorData.error || "Failed to retrieve events",
            params
          );
        }

        const data = await response.json();
        return {
          success: data.success,
          data: data.data,
          pagination: data.pagination,
        };
      } catch (error) {
        console.error("Error getting events:", error);
        return this.createErrorPaginatedResponse(
          "Failed to retrieve events",
          params
        );
      }
    });
  }

  /**
   * Get an event by ID
   */
  async getEventById(id: string): Promise<ApiResponse<Event>> {
    const cacheKey = `event-${id}`;
    return this.deduplicatedFetch(cacheKey, async () => {
      try {
        if (!id) {
          return {
            success: false,
            error: "Event ID is required",
          };
        }

        const response = await fetch(`/api/events/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          return {
            success: false,
            error: errorData.error || "Event not found",
          };
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error getting event by ID:", error);
        return {
          success: false,
          error: "Failed to retrieve event",
        };
      }
    });
  }

  /**
   * Register a student for an event
   */
  async registerForEvent(
    eventId: string
  ): Promise<ApiResponse<EventRegistration>> {
    try {
      if (!eventId) {
        return {
          success: false,
          error: "Event ID is required",
        };
      }

      const response = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.error || "Failed to register for event",
          data: errorData.data,
        };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error registering for event:", error);
      return {
        success: false,
        error: "Failed to register for event",
      };
    }
  }

  /**
   * Cancel registration for an event
   */
  async cancelRegistration(eventId: string): Promise<ApiResponse<void>> {
    try {
      if (!eventId) {
        return {
          success: false,
          error: "Event ID is required",
        };
      }

      const response = await fetch(`/api/events/${eventId}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.error || "Failed to cancel registration",
        };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error cancelling registration:", error);
      return {
        success: false,
        error: "Failed to cancel registration",
      };
    }
  }

  /**
   * Get all registrations for a student
   */
  async getStudentRegistrations(
    studentId?: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<EventRegistration[]>> {
    const cacheKey = `student-registrations-${studentId || "me"}-${JSON.stringify(params)}`;
    return this.deduplicatedFetch(cacheKey, async () => {
      try {
        const url = new URL("/api/registrations", window.location.origin);

        if (studentId) {
          url.searchParams.set("studentId", studentId);
        }
        if (params?.page) {
          url.searchParams.set("page", params.page.toString());
        }
        if (params?.limit) {
          url.searchParams.set("limit", params.limit.toString());
        }

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          return this.createErrorPaginatedResponse(
            errorData.error || "Failed to retrieve registrations",
            params
          );
        }

        const data = await response.json();
        return {
          success: data.success,
          data: data.data,
          pagination: data.pagination,
        };
      } catch (error) {
        console.error("Error getting student registrations:", error);
        return this.createErrorPaginatedResponse(
          "Failed to retrieve registrations",
          params
        );
      }
    });
  }

  /**
   * Get all registrations for an event
   */
  async getEventRegistrations(
    eventId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<EventRegistration[]>> {
    const cacheKey = `event-registrations-${eventId}-${JSON.stringify(params)}`;
    return this.deduplicatedFetch(cacheKey, async () => {
      try {
        if (!eventId) {
          return this.createErrorPaginatedResponse(
            "Event ID is required",
            params
          );
        }

        const url = new URL("/api/registrations", window.location.origin);
        url.searchParams.set("eventId", eventId);

        if (params?.page) {
          url.searchParams.set("page", params.page.toString());
        }
        if (params?.limit) {
          url.searchParams.set("limit", params.limit.toString());
        }

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          return this.createErrorPaginatedResponse(
            errorData.error || "Failed to retrieve registrations",
            params
          );
        }

        const data = await response.json();
        return {
          success: data.success,
          data: data.data,
          pagination: data.pagination,
        };
      } catch (error) {
        console.error("Error getting event registrations:", error);
        return this.createErrorPaginatedResponse(
          "Failed to retrieve registrations",
          params
        );
      }
    });
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
        itemsPerPage: params?.limit || 10,
      },
    };
  }
}

// Export singleton instance
const eventService = new EventService();
export default eventService;
