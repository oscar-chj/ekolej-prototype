import { useState, useCallback } from "react";
import authService from "@/services/auth/authService";
import { User } from "@/types/auth.types";
import { validateLoginForm } from "@/lib/validations";
import { VALIDATION_MESSAGES } from "@/lib/constants";

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for authentication logic
 * Keeps auth state and provides login/logout functions
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<User | null> => {
      setIsLoading(true);
      setError(null);

      try {
        // Validate form inputs
        const validation = validateLoginForm(email, password);
        if (!validation.isValid) {
          const firstError = Object.values(validation.errors)[0];
          setError(firstError || VALIDATION_MESSAGES.FILL_ALL_FIELDS);
          setIsLoading(false);
          return null;
        }

        // Attempt authentication
        const authenticatedUser = await authService.login(email, password);

        if (authenticatedUser) {
          setUser(authenticatedUser);
          return authenticatedUser;
        } else {
          setError(VALIDATION_MESSAGES.LOGIN_FAILED);
          return null;
        }
      } catch (err) {
        console.error("Login error:", err);
        setError("An unexpected error occurred. Please try again.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  }, []);

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    clearError,
  };
}
