import { ApiResponse, MeritRecord } from "@/types/api.types";

interface MeritSummary {
  totalPoints: number;
  universityMerit: number;
  facultyMerit: number;
  collegeMerit: number;
  clubMerit: number;
  recentActivities: number;
  rank: number;
  totalStudents: number;
  targetPoints: number;
  progressPercentage: number;
  targetAchieved: boolean;
  remainingPoints: number;
  exceededPoints: number;
}

class MeritService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private requestCache: Map<string, Promise<any>> = new Map();

  private async deduplicatedFetch<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    if (this.requestCache.has(key)) {
      return this.requestCache.get(key) as Promise<T>;
    }

    const promise = fetchFn().finally(() => {
      // Clear cache after a short delay to allow concurrent renders to share the promise
      // but still allow subsequent refreshes to fetch new data
      setTimeout(() => this.requestCache.delete(key), 100);
    });

    this.requestCache.set(key, promise);
    return promise;
  }

  async getStudentMeritSummary(
    studentId?: string
  ): Promise<ApiResponse<MeritSummary>> {
    const cacheKey = `summary-${studentId || "me"}`;
    return this.deduplicatedFetch(cacheKey, async () => {
      try {
        const url = new URL("/api/merits/summary", window.location.origin);
        if (studentId) {
          url.searchParams.set("studentId", studentId);
        }

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          return {
            success: false,
            error: errorData.error || "Failed to fetch merit summary",
          };
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching merit summary:", error);
        return {
          success: false,
          error: "Failed to fetch merit summary",
        };
      }
    });
  }

  async getStudentMeritRecords(
    studentId?: string,
    options: { page?: number; limit?: number } = {}
  ): Promise<ApiResponse<{ records: MeritRecord[]; total: number }>> {
    const cacheKey = `records-${studentId || "me"}-${options.page || 1}-${options.limit || 50}`;
    return this.deduplicatedFetch(cacheKey, async () => {
      try {
        const url = new URL("/api/merits/records", window.location.origin);
        if (studentId) {
          url.searchParams.set("studentId", studentId);
        }
        if (options.page) {
          url.searchParams.set("page", options.page.toString());
        }
        if (options.limit) {
          url.searchParams.set("limit", options.limit.toString());
        }

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          return {
            success: false,
            error: errorData.error || "Failed to fetch merit records",
          };
        }

        const data = await response.json();
        return {
          success: data.success,
          data: data.data,
        };
      } catch (error) {
        console.error("Error fetching merit records:", error);
        return {
          success: false,
          error: "Failed to fetch merit records",
        };
      }
    });
  }
}

const meritService = new MeritService();
export default meritService;
