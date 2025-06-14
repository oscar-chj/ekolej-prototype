"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import MeritSummary from "@/components/merits/MeritSummary";
import DataService from "@/services/data/DataService";
import authService from "@/services/auth/authService";
import { Alert, Box, Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

export default function MeritsPage() {
  const [meritData, setMeritData] = useState<ReturnType<
    typeof DataService.getStudentMeritSummary
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    // Simulate fetching merit data from centralized service
    const fetchMeritData = async () => {
      try {
        setIsLoading(true);
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Get current authenticated user, initialize if none
        let currentUser = await authService.getCurrentUser();
        if (!currentUser) {
          // For prototype: initialize with default user (Ahmad Abdullah)
          currentUser = await authService.initializeWithUser("1");
          if (!currentUser) {
            setError("User authentication failed");
            return;
          }
        }

        // Get merit data from centralized service using authenticated user's ID
        const data = DataService.getStudentMeritSummary(currentUser.id);
        setMeritData(data);
      } catch (err) {
        console.error("Error fetching merit data:", err);
        setError("Failed to load merit data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeritData();
  }, []);

  const handleViewReports = () => {
    // In production, this would navigate to reports page
    window.location.href = "/dashboard/reports";
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Merit Points">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 400,
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </DashboardLayout>
    );
  }

  if (error || !meritData) {
    return (
      <DashboardLayout title="Merit Points">
        <Alert severity="error" sx={{ mb: 3 }}>
          {error ||
            "Unable to load merit data. Please check if event data is available."}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Merit Points">
      <MeritSummary meritData={meritData} onViewReports={handleViewReports} />
    </DashboardLayout>
  );
}
