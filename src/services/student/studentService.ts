"use client";

import { ApiResponse, Student } from "@/types/api.types";

class StudentService {
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

    async getCurrentStudent(): Promise<ApiResponse<Student>> {
        const cacheKey = "student-me";
        return this.deduplicatedFetch(cacheKey, async () => {
            try {
                const response = await fetch("/api/students/me", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    return {
                        success: false,
                        error: errorData.error || "Failed to fetch student profile",
                    };
                }

                const data = await response.json();
                return data;
            } catch (error) {
                console.error("Error fetching current student:", error);
                return {
                    success: false,
                    error: "Failed to fetch student profile",
                };
            }
        });
    }

    async getStudentById(id: string): Promise<ApiResponse<Student>> {
        const cacheKey = `student-${id}`;
        return this.deduplicatedFetch(cacheKey, async () => {
            try {
                const response = await fetch(`/api/students/by-id/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    return {
                        success: false,
                        error: errorData.error || "Failed to fetch student data",
                    };
                }

                const data = await response.json();
                return data;
            } catch (error) {
                console.error(`Error fetching student ${id}:`, error);
                return {
                    success: false,
                    error: "Failed to fetch student data",
                };
            }
        });
    }
}

const studentService = new StudentService();
export default studentService;
