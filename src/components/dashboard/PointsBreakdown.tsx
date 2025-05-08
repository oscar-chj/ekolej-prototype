'use client';

import { Grid, Box, Paper, Typography, Avatar } from '@mui/material';
import { TrendingUp, School, Groups } from '@mui/icons-material';
import { memo } from 'react';

/**
 * Props for the PointsBreakdown component
 */
interface PointsBreakdownProps {
  academicPoints: number;
  cocurricularPoints: number;
  communityPoints: number;
}

/**
 * Component displaying a breakdown of merit points by category
 */
const PointsBreakdown = memo(function PointsBreakdown({ 
  academicPoints, 
  cocurricularPoints, 
  communityPoints 
}: PointsBreakdownProps) {
  // Define points categories with their respective properties
  const pointsCategories = [
    {
      type: 'Academic',
      points: academicPoints,
      icon: <School />,
      color: 'primary.light',
    },
    {
      type: 'Co-curricular',
      points: cocurricularPoints,
      icon: <TrendingUp />,
      color: 'secondary.light',
    },
    {
      type: 'Community',
      points: communityPoints,
      icon: <Groups />,
      color: 'success.light',
    },
  ];

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        borderRadius: 2,
        border: '1px solid rgba(0, 0, 0, 0.05)',
        height: '100%' 
      }}
    >
      <Typography variant="h6" gutterBottom>
        Points Breakdown
      </Typography>
      
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {pointsCategories.map((category) => (
          <Grid size={{ xs: 4 }} key={category.type}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar 
                sx={{ 
                  bgcolor: category.color, 
                  mx: 'auto', 
                  mb: 1,
                  width: 48,
                  height: 48
                }}
              >
                {category.icon}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {category.points.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {category.type}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
});

export default PointsBreakdown;