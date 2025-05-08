'use client';

import React from 'react';
import { Grid, Box, Paper, Typography, Avatar } from '@mui/material';
import { TrendingUp, School, Event as EventIcon } from '@mui/icons-material';

interface PointsBreakdownProps {
  academicPoints: number;
  cocurricularPoints: number;
  communityPoints: number;
}

export default function PointsBreakdown({ 
  academicPoints, 
  cocurricularPoints, 
  communityPoints 
}: PointsBreakdownProps) {
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
        <Grid size={{ xs: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.light', mx: 'auto', mb: 1 }}>
              <School />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {academicPoints}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Academic
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: 'secondary.light', mx: 'auto', mb: 1 }}>
              <TrendingUp />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {cocurricularPoints}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Co-curricular
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: 'success.light', mx: 'auto', mb: 1 }}>
              <EventIcon />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {communityPoints}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Community
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}