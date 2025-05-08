'use client';

import { EmojiEvents } from '@mui/icons-material';
import { Avatar, Box, LinearProgress, Paper, Typography } from '@mui/material';
import { memo } from 'react';

/**
 * Props for the MeritSummaryCard component
 */
interface MeritSummaryCardProps {
  totalPoints: number;
  targetPoints: number;
}

/**
 * Card component that displays a student's merit points summary with a progress bar
 */
const MeritSummaryCard = memo(function MeritSummaryCard({ 
  totalPoints, 
  targetPoints 
}: MeritSummaryCardProps) {
  // Calculate percentage of target achieved (capped at 100%)
  const progressPercentage = Math.min((totalPoints / targetPoints) * 100, 100);
  
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        borderRadius: 2,
        border: '1px solid rgba(0, 0, 0, 0.05)'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Total Merit Points
          </Typography>
          <Typography variant="h3" component="div" sx={{ fontWeight: 700 }}>
            {totalPoints.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Target: {targetPoints.toLocaleString()} points
          </Typography>
        </Box>
        <Avatar 
          sx={{ 
            bgcolor: 'primary.light', 
            width: 56, 
            height: 56 
          }}
        >
          <EmojiEvents fontSize="large" />
        </Avatar>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="body2">Progress</Typography>
          <Typography variant="body2" fontWeight="medium">
            {Math.round(progressPercentage)}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={progressPercentage} 
          sx={{ 
            height: 8, 
            borderRadius: 4,
            '& .MuiLinearProgress-bar': {
              borderRadius: 4
            }
          }} 
        />
      </Box>
    </Paper>
  );
});

export default MeritSummaryCard;