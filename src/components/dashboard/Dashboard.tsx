"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { ErrorDisplay, LoadingDisplay } from "@/components/ui/ErrorDisplay";
import { useUserProfile } from "@/hooks/useUserProfile";
import DataService from "@/services/data/DataService";
import { Box, Grid, Typography } from "@mui/material";
import { useMemo } from "react";
import MeritSummaryCard from "./MeritSummaryCard";
import PointsBreakdown from "./PointsBreakdown";
import ProgressInsights from "./ProgressInsights";
import RecentActivities from "./RecentActivities";
import UpcomingEvents from "./UpcomingEvents";

export default function Dashboard() {
  const { student, meritSummary, isLoading, error, refresh } = useUserProfile();

  // Get additional dashboard data using useMemo to prevent unnecessary recalculations
  const dashboardExtras = useMemo(() => {
    if (!student) return null;

    const summary = DataService.getDashboardSummary(student.id);
    return {
      upcomingEvents: summary.upcomingEvents,
      totalRegistrations: summary.totalRegistrations,
      recentActivities: summary.recentActivities,
    };
  }, [student]);

  if (isLoading) {
    return (
      <DashboardLayout title="Merit Dashboard">
        <LoadingDisplay message="Loading your dashboard..." />
      </DashboardLayout>
    );
  }

  if (error || !student || !meritSummary) {
    return (
      <DashboardLayout title="Merit Dashboard">
        <ErrorDisplay
          message={
            error || "Unable to load dashboard data. Please try again later."
          }
          showRetry
          onRetry={refresh}
        />
      </DashboardLayout>
    );
  }

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
          <ProgressInsights
            targetAchieved={meritSummary.targetAchieved}
            remainingPoints={meritSummary.remainingPoints}
            exceededPoints={meritSummary.exceededPoints}
            progressPercentage={meritSummary.progressPercentage}
          />
        </Grid>
      </Grid>

      {/* Points Breakdown */}
      <Box sx={{ mb: 4 }}>
        <PointsBreakdown
          universityMerit={meritSummary.universityMerit}
          facultyMerit={meritSummary.facultyMerit}
          collegeMerit={meritSummary.collegeMerit}
          clubMerit={meritSummary.clubMerit}
        />
      </Box>

      {/* Recent Activities and Upcoming Events */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <RecentActivities studentId={student.id} />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <UpcomingEvents events={dashboardExtras?.upcomingEvents || []} />
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
