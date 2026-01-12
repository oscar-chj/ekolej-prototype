"use client";

import { Student } from "@/types/api.types";
import { MeritSummary } from "@/types/merit.types";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import studentService from "@/services/student/studentService";
import meritService from "@/services/merit/meritService";

interface UseUserProfileReturn {
  student: Student | null;
  meritSummary: MeritSummary | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Hook to fetch and manage user profile data
 * Fetches student data and merit summary from API
 */
export function useUserProfile(): UseUserProfileReturn {
  const { data: session, status } = useSession();
  const [student, setStudent] = useState<Student | null>(null);
  const [meritSummary, setMeritSummary] = useState<MeritSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    if (!session?.user?.email) {
      if (status !== "loading") setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch student data using deduplicated service
      const studentResponse = await studentService.getCurrentStudent();

      if (studentResponse.success && studentResponse.data) {
        setStudent(studentResponse.data);

        // Fetch merit summary using deduplicated service
        const meritResponse = await meritService.getStudentMeritSummary(studentResponse.data.id);

        if (meritResponse.success && meritResponse.data) {
          // Wrap in summary object to match the component's expected MeritSummary type
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setMeritSummary(meritResponse.data as any);
        }
      } else {
        throw new Error(studentResponse.error || "Failed to load profile");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = async () => {
    await fetchUserProfile();
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchUserProfile();
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return {
    student,
    meritSummary,
    isLoading: isLoading || status === "loading",
    error,
    refresh,
  };
}
