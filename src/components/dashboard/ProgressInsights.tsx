"use client";

import { EventNote, Assessment } from "@mui/icons-material";
import { Box, Button, Chip, Paper, Typography } from "@mui/material";
import { memo } from "react";
import Link from "next/link";

/**
 * Props for the ProgressInsights component
 */
interface ProgressInsightsProps {
  targetAchieved?: boolean;
  remainingPoints?: number;
  exceededPoints?: number;
  progressPercentage?: number;
}

/**
 * Component that displays progress insights and action buttons
 */
const ProgressInsights = memo(function ProgressInsights({
  targetAchieved = false,
  remainingPoints = 0,
  exceededPoints = 0,
  progressPercentage = 0,
}: ProgressInsightsProps) {
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
          text: "🎯 Target achieved! Congratulations!",
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
        p: 3,
        borderRadius: 2,
        border: "1px solid rgba(0, 0, 0, 0.05)",
        height: "100%",
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Progress Insights
      </Typography>

      <Chip
        label={insight.text}
        sx={{
          backgroundColor: `${insight.color}15`,
          color: insight.color,
          fontWeight: 600,
          mb: 2.5,
          fontSize: "0.95rem",
          height: "auto",
          py: 1.2,
          px: 2,
          width: "100%",
          justifyContent: "center",
        }}
      />

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button
          component={Link}
          href="/dashboard/events"
          variant="contained"
          startIcon={<EventNote />}
          sx={{ minWidth: 140 }}
        >
          Browse Events
        </Button>
        <Button
          component={Link}
          href="/dashboard/reports"
          variant="outlined"
          startIcon={<Assessment />}
          sx={{ minWidth: 140 }}
        >
          View Reports
        </Button>
      </Box>
    </Paper>
  );
});

export default ProgressInsights;
