"use client";

import { Grid, Paper, Typography, Avatar } from "@mui/material";
import { TrendingUp, School, Groups } from "@mui/icons-material";
import { memo } from "react";

/**
 * Props for the PointsBreakdown component
 */
interface PointsBreakdownProps {
  universityMerit: number;
  facultyMerit: number;
  collegeMerit: number;
  clubMerit: number;
}

/**
 * Component displaying a breakdown of merit points by category
 */
const PointsBreakdown = memo(function PointsBreakdown({
  universityMerit,
  facultyMerit,
  collegeMerit,
  clubMerit,
}: PointsBreakdownProps) {
  // Define points categories with their respective properties
  const pointsCategories = [
    {
      type: "University Merit",
      points: universityMerit,
      icon: <School />,
      color: "#1976d2", // Primary blue
      bgColor: "#e3f2fd", // Light blue background
    },
    {
      type: "Faculty Merit",
      points: facultyMerit,
      icon: <TrendingUp />,
      color: "#7b1fa2", // Purple
      bgColor: "#f3e5f5", // Light purple background
    },
    {
      type: "College Merit",
      points: collegeMerit,
      icon: <Groups />,
      color: "#388e3c", // Green
      bgColor: "#e8f5e8", // Light green background
    },
    {
      type: "Club Merit",
      points: clubMerit,
      icon: <TrendingUp />,
      color: "#f57c00", // Orange
      bgColor: "#fff3e0", // Light orange background
    },
  ];
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 2,
        border: "1px solid rgba(0, 0, 0, 0.05)",
        height: "100%",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Points Breakdown
      </Typography>
      <Grid container spacing={2} sx={{ mt: 0.5 }}>
        {pointsCategories.map((category) => (
          <Grid size={{ xs: 6, md: 3 }} key={category.type}>
            <Paper
              elevation={0}
              sx={{
                textAlign: "center",
                backgroundColor: category.bgColor,
                borderRadius: 3,
                py: 2.5,
                px: 1.5,
                border: `2px solid ${category.color}30`,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 4px 12px ${category.color}20`,
                },
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: category.color,
                  mx: "auto",
                  mb: 1.5,
                  width: 44,
                  height: 44,
                  color: "white",
                  boxShadow: `0 2px 8px ${category.color}40`,
                }}
              >
                {category.icon}
              </Avatar>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  fontSize: "2rem",
                  color: category.color,
                  mb: 0.8,
                  lineHeight: 1,
                }}
              >
                {category.points}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "text.primary",
                  lineHeight: 1.2,
                  textAlign: "center",
                }}
              >
                {category.type}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
});

export default PointsBreakdown;
