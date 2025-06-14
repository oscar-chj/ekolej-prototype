"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { ErrorDisplay, LoadingDisplay } from "@/components/ui/ErrorDisplay";
import DataService from "@/services/data/DataService";
import { Event, Student } from "@/types/api.types";
import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import MeritSummaryCard from "./MeritSummaryCard";
import PointsBreakdown from "./PointsBreakdown";
import RecentActivities from "./RecentActivities";
import UpcomingEvents from "./UpcomingEvents";

interface MeritSummary {
  totalPoints: number;
  targetPoints: number;
  universityMerit: number;
  facultyMerit: number;
  collegeMerit: number;
  associationMerit: number;
  recentActivities: number;
  rank: number;
  totalStudents: number;
  progressPercentage: number;
  targetAchieved: boolean;
  remainingPoints: number;
  exceededPoints: number;
}

interface DashboardData {
  student: Student;
  meritSummary: MeritSummary;
  upcomingEvents: Event[];
  totalRegistrations: number;
  recentActivities: number;
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data from centralized DataService
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        // Get data from DataService (simulated student ID)
        const studentId = "1"; // In real app, this would come from auth context
        const summary = DataService.getDashboardSummary(studentId);

        // Only set data if student exists
        if (summary.student) {
          setDashboardData(summary as DashboardData);
        } else {
          setError("Student not found");
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout title="Merit Dashboard">
        <LoadingDisplay message="Loading your dashboard..." />
      </DashboardLayout>
    );
  }

  if (error || !dashboardData) {
    return (
      <DashboardLayout title="Merit Dashboard">
        <ErrorDisplay
          message={
            error || "Unable to load dashboard data. Please try again later."
          }
          showRetry
          onRetry={() => window.location.reload()}
        />
      </DashboardLayout>
    );
  }

  const { meritSummary, upcomingEvents } = dashboardData;

  return (
    <DashboardLayout title="Merit Dashboard">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Merit Progress
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Track your merit points and upcoming activities
        </Typography>
      </Box>

      {/* Merit Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {" "}
        <Grid size={{ xs: 12, md: 6 }}>
          <MeritSummaryCard
            totalPoints={meritSummary.totalPoints}
            targetPoints={meritSummary.targetPoints}
            targetAchieved={meritSummary.targetAchieved}
            remainingPoints={meritSummary.remainingPoints}
            exceededPoints={meritSummary.exceededPoints}
            progressPercentage={meritSummary.progressPercentage}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PointsBreakdown
            academicPoints={meritSummary.universityMerit}
            cocurricularPoints={meritSummary.facultyMerit}
            communityPoints={meritSummary.collegeMerit}
            associationPoints={meritSummary.associationMerit}
          />
        </Grid>
      </Grid>

      {/* Recent Activities and Upcoming Events */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <RecentActivities studentId="1" />
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <UpcomingEvents events={upcomingEvents || []} />
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
