'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { getCategoryColor, getCategoryDisplayName } from '@/lib/categoryUtils';
import { EventCategory } from '@/types/api.types';
import { Assessment, CalendarToday, Leaderboard } from '@mui/icons-material';
import { Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Paper, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Sample merit summary data
interface MeritSummaryData {
  totalPoints: number;
  targetPoints: number;
  academicPoints: number;      // University Merit
  cocurricularPoints: number;  // Faculty Merit
  communityPoints: number;     // College Merit
  associationPoints: number;   // Association Merit
  recentActivities: number;
  rank: number;
  totalStudents: number;
  progressPercentage: number;
}

const sampleMeritSummary: MeritSummaryData = {
  totalPoints: 142,
  targetPoints: 150,
  academicPoints: 40,
  cocurricularPoints: 52,
  communityPoints: 30,
  associationPoints: 20,
  recentActivities: 6,
  rank: 4,
  totalStudents: 120,
  progressPercentage: 94.7
};

interface CategoryCardProps {
  category: EventCategory;
  points: number;
  targetPoints: number;
}

function CategoryCard({ category, points, targetPoints }: CategoryCardProps) {
  const percentage = Math.min((points / targetPoints) * 100, 100);
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="h3">
            {getCategoryDisplayName(category)}
          </Typography>
          <Chip
            label={`${points} pts`}
            sx={{ 
              backgroundColor: getCategoryColor(category),
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        </Box>
        
        <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
          <CircularProgress
            variant="determinate"
            value={percentage}
            size={60}
            thickness={6}
            sx={{
              color: getCategoryColor(category),
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="caption" component="div" color="text.secondary">
              {Math.round(percentage)}%
            </Typography>
          </Box>
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          Target: {targetPoints} points
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Remaining: {Math.max(0, targetPoints - points)} points
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function MeritsPage() {
  const [meritData, setMeritData] = useState<MeritSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Simulate fetching merit data
    const fetchMeritData = async () => {
      try {
        setIsLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMeritData(sampleMeritSummary);
      } catch (err) {
        console.error('Error fetching merit data:', err);
        setError('Failed to load merit data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeritData();
  }, []);

  const handleViewReports = () => {
    router.push('/dashboard/reports');
  };

  const handleViewLeaderboard = () => {
    router.push('/dashboard/leaderboard');
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Merit Points">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress size={60} />
        </Box>
      </DashboardLayout>
    );
  }

  if (error || !meritData) {
    return (
      <DashboardLayout title="Merit Points">
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Unable to load merit data. Please check if event data is available.'}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Merit Points">
      <Box sx={{ width: '100%' }}>
        {/* Overall Summary Card */}
        <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 3 }}>
              <Box>
                <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                  {meritData.totalPoints}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Total Merit Points
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8, mt: 1 }}>
                  {meritData.progressPercentage}% of target achieved
                </Typography>
              </Box>
              
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h5" fontWeight="bold">
                  #{meritData.rank}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  out of {meritData.totalStudents} students
                </Typography>
                <Chip 
                  label={`${meritData.targetPoints - meritData.totalPoints} points to target`}
                  sx={{ 
                    mt: 1, 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    color: 'white' 
                  }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Merit Categories */}
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
          Merit Categories Breakdown
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 3, mb: 4 }}>
          <CategoryCard 
            category={EventCategory.UNIVERSITY} 
            points={meritData.academicPoints} 
            targetPoints={50} 
          />
          <CategoryCard 
            category={EventCategory.FACULTY} 
            points={meritData.cocurricularPoints} 
            targetPoints={50} 
          />
          <CategoryCard 
            category={EventCategory.COLLEGE} 
            points={meritData.communityPoints} 
            targetPoints={30} 
          />
          <CategoryCard 
            category={EventCategory.ASSOCIATION} 
            points={meritData.associationPoints} 
            targetPoints={20} 
          />
        </Box>

        {/* Quick Stats */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <CalendarToday color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" color="primary">
              {meritData.recentActivities}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Recent Activities
            </Typography>
          </Paper>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Assessment color="success" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" color="success.main">
              {Math.round(meritData.progressPercentage)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Target Achievement
            </Typography>
          </Paper>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Assessment />}
            onClick={handleViewReports}
            sx={{ minWidth: 200 }}
          >
            View Detailed Report
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            startIcon={<Leaderboard />}
            onClick={handleViewLeaderboard}
            sx={{ minWidth: 200 }}
          >
            View Leaderboard
          </Button>
        </Box>

        {/* Progress Insight */}
        <Alert severity="info" sx={{ mt: 4 }}>
          <Typography variant="body1" gutterBottom>
            <strong>Progress Insight:</strong> You&apos;re doing great! You need {meritData.targetPoints - meritData.totalPoints} more points to reach your target.
          </Typography>
          <Typography variant="body2">
            Consider participating in more International/National events or Faculty activities to boost your score.
          </Typography>
        </Alert>
      </Box>
    </DashboardLayout>
  );
}
