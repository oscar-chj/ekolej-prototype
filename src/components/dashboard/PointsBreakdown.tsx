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
  associationPoints: number;
}

/**
 * Component displaying a breakdown of merit points by category
 */
const PointsBreakdown = memo(function PointsBreakdown({ 
  academicPoints, 
  cocurricularPoints, 
  communityPoints,
  associationPoints 
}: PointsBreakdownProps) {  // Define points categories with their respective properties
  const pointsCategories = [
    {
      type: 'University Merit',
      points: academicPoints,
      icon: <School />,
      color: '#1976d2', // Primary blue
      bgColor: '#e3f2fd', // Light blue background
    },
    {
      type: 'Faculty Merit',
      points: cocurricularPoints,
      icon: <TrendingUp />,
      color: '#7b1fa2', // Purple
      bgColor: '#f3e5f5', // Light purple background
    },
    {
      type: 'College Merit',
      points: communityPoints,
      icon: <Groups />,
      color: '#388e3c', // Green
      bgColor: '#e8f5e8', // Light green background
    },
    {
      type: 'Association Merit',
      points: associationPoints,
      icon: <TrendingUp />,
      color: '#f57c00', // Orange
      bgColor: '#fff3e0', // Light orange background
    },
  ];
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2.5, 
        borderRadius: 2,
        border: '1px solid rgba(0, 0, 0, 0.05)',
        height: '100%' 
      }}
    >
      <Typography variant="h6" gutterBottom>
        Points Breakdown
      </Typography>
        <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
        {pointsCategories.map((category) => (
          <Grid size={{ xs: 3 }} key={category.type}>
            <Box 
              sx={{ 
                textAlign: 'center',
                backgroundColor: category.bgColor,
                borderRadius: 2,
                py: 1.5,
                px: 1,
                border: `1px solid ${category.color}20`
              }}
            >
              <Avatar 
                sx={{ 
                  bgcolor: category.color, 
                  mx: 'auto', 
                  mb: 1,
                  width: 36,
                  height: 36,
                  color: 'white'
                }}
              >
                {category.icon}
              </Avatar>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700, 
                  fontSize: '1.25rem',
                  color: category.color,
                  mb: 0.5
                }}
              >
                {category.points}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  color: 'text.primary',
                  lineHeight: 1.2
                }}
              >
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