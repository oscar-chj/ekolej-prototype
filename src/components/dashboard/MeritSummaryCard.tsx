"use client";

import { EmojiEvents, EventNote, TrendingUp } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";
import { memo } from "react";

/**
 * Props for the MeritSummaryCard component
 */
interface MeritSummaryCardProps {
  totalPoints: number;
  targetPoints: number;
  targetAchieved?: boolean;
  remainingPoints?: number;
  exceededPoints?: number;
  progressPercentage?: number;
}

/**
 * Card component that displays a student's merit points summary with a progress bar
 */
const MeritSummaryCard = memo(function MeritSummaryCard({
  totalPoints,
  targetPoints,
  targetAchieved = false,
  remainingPoints = 0,
  exceededPoints = 0,
  progressPercentage = 0,
}: MeritSummaryCardProps) {
  // Insights based on progress
  const getInsight = () => {
    if (targetAchieved) {
      if (exceededPoints > 0) {
        return {
          text: `🎉 Target exceeded by ${exceededPoints} points!`,
          color: "success.main",
        };
      } else {
        return {
          text: "� Target achieved! Congratulations!",
          color: "success.main",
        };
      }
    } else if (progressPercentage >= 80) {
      return {
        text: `Just ${remainingPoints} points to go!`,
        color: "warning.main",
      };
    } else if (progressPercentage >= 50) {
      return {
        text: "You're halfway there! Keep it up!",
        color: "info.main",
      };
    } else {
      return {
        text: "Time to get started on events!",
        color: "primary.main",
      };
    }
  };

  const insight = getInsight();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 2,
        border: "1px solid rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* Insights and Action Buttons */}
      <Box sx={{ mb: 2 }}>
        <Chip
          label={insight.text}
          sx={{
            backgroundColor: `${insight.color}15`,
            color: insight.color,
            fontWeight: 500,
            mb: 1.5,
          }}
        />
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<EventNote />}
            onClick={() => (window.location.href = "/dashboard/events")}
          >
            Browse Events
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<TrendingUp />}
            onClick={() => (window.location.href = "/dashboard/leaderboard")}
          >
            View Leaderboard
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
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
            bgcolor: "primary.light",
            width: 56,
            height: 56,
          }}
        >
          <EmojiEvents fontSize="large" />
        </Avatar>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
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
            "& .MuiLinearProgress-bar": {
              borderRadius: 4,
            },
          }}
        />
      </Box>
    </Paper>
  );
});

export default MeritSummaryCard;
