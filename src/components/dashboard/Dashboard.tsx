'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { ErrorDisplay, LoadingDisplay } from '@/components/ui/ErrorDisplay';
import { sampleMeritData } from '@/data/dashboardData';
import { MeritSummary } from '@/types/merit.types';
import { Box, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import MeritSummaryCard from './MeritSummaryCard';
import PointsBreakdown from './PointsBreakdown';
import RecentActivities from './RecentActivities';
import UpcomingEvents from './UpcomingEvents';

export default function Dashboard() {
  const [meritData, setMeritData] = useState<MeritSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call with static data
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setMeritData(sampleMeritData);
      } catch (err) {
        console.error('Error fetching merit data:', err);
        setError('Failed to load dashboard data');
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
  if (error || !meritData) {
    return (
      <DashboardLayout title="Merit Dashboard">
        <ErrorDisplay 
          message={error || 'Unable to load dashboard data. Please try again later.'}
          showRetry
          onRetry={() => window.location.reload()}
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
            totalPoints={meritData.totalPoints} 
            targetPoints={meritData.targetPoints} 
          />
        </Grid>        <Grid size={{ xs: 12, md: 6 }}>
          <PointsBreakdown 
            academicPoints={meritData.academicPoints}
            cocurricularPoints={meritData.cocurricularPoints}
            communityPoints={meritData.communityPoints}
            associationPoints={meritData.associationPoints}
          />
        </Grid>
      </Grid>

      {/* Recent Activities and Upcoming Events */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <RecentActivities activities={meritData.recentActivities} />
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <UpcomingEvents events={meritData.upcomingEvents} />
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}