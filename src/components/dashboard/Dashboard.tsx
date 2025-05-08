'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { MeritSummary } from '@/services/merit/meritService';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import MeritSummaryCard from './MeritSummaryCard';
import PointsBreakdown from './PointsBreakdown';
import RecentActivities from './RecentActivities';
import UpcomingEvents from './UpcomingEvents';

// Use static data for now since we've moved everything to client components
const sampleMeritData: MeritSummary = {
  totalPoints: 450,
  targetPoints: 600,
  academicPoints: 250,
  cocurricularPoints: 125,
  communityPoints: 75,
  recentActivities: [
    {
      id: 1,
      title: 'Programming Competition',
      category: 'Academic',
      points: 50,
      date: '2025-04-28',
      description: 'Participated in the university coding competition and secured 2nd position.',
      verified: true,
      verifiedBy: 'Prof. Smith'
    },
    {
      id: 2,
      title: 'Community Outreach',
      category: 'Community Service',
      points: 25,
      date: '2025-04-15',
      description: 'Volunteered at the local community center to teach basic computer skills.',
      verified: true,
      verifiedBy: 'Dr. Johnson'
    },
    {
      id: 3,
      title: 'Sports Day Participant',
      category: 'Co-curricular',
      points: 20,
      date: '2025-04-10',
      description: 'Represented the department in 100m sprint and relay race.',
      verified: true,
      verifiedBy: 'Coach Williams'
    },
    {
      id: 4,
      title: 'Library Helper',
      category: 'Community Service',
      points: 15,
      date: '2025-04-05',
      description: 'Assisted in organizing and cataloging new books in the university library.',
      verified: true,
      verifiedBy: 'Ms. Davis'
    }
  ],
  upcomingEvents: [
    {
      id: 101,
      title: 'Leadership Workshop',
      date: '2025-05-15',
      points: 30,
      location: 'Main Hall',
      description: 'A workshop focused on developing leadership skills for students.',
      capacity: 50,
      registeredCount: 32,
      category: 'Co-curricular'
    },
    {
      id: 102,
      title: 'Hackathon',
      date: '2025-05-22',
      points: 50,
      location: 'CS Building',
      description: '24-hour coding event to develop innovative solutions for real-world problems.',
      capacity: 100,
      registeredCount: 75,
      category: 'Academic'
    },
    {
      id: 103,
      title: 'Charity Run',
      date: '2025-05-30',
      points: 40,
      location: 'University Stadium',
      description: 'Annual charity run to raise funds for local orphanages.',
      capacity: 200,
      registeredCount: 120,
      category: 'Community Service'
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