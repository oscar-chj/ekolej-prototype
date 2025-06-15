import { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";

/**
 * Custom hook that automatically loads user profile data when component mounts
 * and provides easy access to user state
 */
export const useUserProfile = () => {
  const { profileData, isLoading, error, loadUserProfile, refreshUserProfile } =
    useUserStore();

  // Auto-load profile data when hook is first used
  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  return {
    student: profileData?.student,
    meritSummary: profileData?.meritSummary,
    isLoading,
    error,
    refresh: refreshUserProfile,
    lastUpdated: profileData?.lastUpdated,
  };
};

/**
 * Hook for components that only need basic user info (no auto-loading)
 */
export const useUserInfo = () => {
  const profileData = useUserStore((state) => state.profileData);
  return {
    student: profileData?.student,
    meritSummary: profileData?.meritSummary,
    lastUpdated: profileData?.lastUpdated,
  };
};
