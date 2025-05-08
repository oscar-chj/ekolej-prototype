'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { MeritSummary } from '@/types/merit.types';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import MeritSummaryCard from './MeritSummaryCard';
import PointsBreakdown from './PointsBreakdown';
import RecentActivities from './RecentActivities';
import UpcomingEvents from './UpcomingEvents';
import { EventCategory } from '@/types/api.types';

// Sample merit data for development and testing purposes
const sampleMeritData: MeritSummary = {
  totalPoints: 1850,
  targetPoints: 3000,
  academicPoints: 800,
  cocurricularPoints: 650,
  communityPoints: 400,
  recentActivities: [
    {
      id: '1',
      title: 'Research Paper Presentation',
      category: EventCategory.ACADEMIC,
      points: 100,
      date: '2025-04-15',
      description: 'Presented research paper at the annual symposium',
      verified: true
    },
    {
      id: '2',
      title: 'Community Cleanup Drive',
      category: EventCategory.COMMUNITY,
      points: 75,
      date: '2025-04-10',
      description: 'Participated in campus area cleanup initiative',
      verified: true
    },
    {
      id: '3',
      title: 'Debate Club Competition',
      category: EventCategory.COCURRICULAR,
      points: 50,
      date: '2025-04-05',
      description: 'Participated in inter-university debate competition',
      verified: true
    }
  ],
  upcomingEvents: [
    {
      id: '101',
      title: 'Leadership Workshop',
      date: '2025-05-15',
      points: 60,
      location: 'Student Center Room 302',
      description: 'Develop your leadership skills with industry experts',
      capacity: 30,
      registeredCount: 18,
      category: EventCategory.COCURRICULAR
    },
    {
      id: '102',
      title: 'Community Service Day',
      date: '2025-05-22',
      points: 80,
      location: 'Main Campus Courtyard',
      description: 'Join us for a day of giving back to our community',
      capacity: 50,
      registeredCount: 35,
      category: EventCategory.COMMUNITY
    }
  ]
};

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
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  if (error || !meritData) {
    return (
      <DashboardLayout title="Merit Dashboard">
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="error" gutterBottom>
            {error || 'Something went wrong'}
          </Typography>
          <Typography>
            Unable to load dashboard data. Please try again later.
          </Typography>
        </Box>
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
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <PointsBreakdown 
            academicPoints={meritData.academicPoints}
            cocurricularPoints={meritData.cocurricularPoints}
            communityPoints={meritData.communityPoints}
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