"use client";

import { Box, Typography, Alert, Button } from "@mui/material";
import { Assessment } from "@mui/icons-material";
import { EventCategory } from "@/types/api.types";
import { CategoryCard } from "./components/CategoryCard";
import { OverallSummary } from "./components/OverallSummary";
import { StatsGrid } from "./components/StatsGrid";

export interface MeritSummaryData {
  totalPoints: number;
  universityMerit: number;
  facultyMerit: number;
  collegeMerit: number;
  clubMerit: number;
  recentActivities: number;
  rank: number;
  totalStudents: number;
  targetPoints: number;
  progressPercentage: number;
  targetAchieved: boolean;
  remainingPoints: number;
  exceededPoints: number;
}

interface MeritSummaryProps {
  meritData: MeritSummaryData;
  onViewReports?: () => void;
}

export default function MeritSummary({ meritData, onViewReports }: MeritSummaryProps) {
  return (
    <Box sx={{ width: "100%" }}>
      <OverallSummary
        totalPoints={meritData.totalPoints}
        rank={meritData.rank}
        totalStudents={meritData.totalStudents}
        progressPercentage={meritData.progressPercentage}
        targetAchieved={meritData.targetAchieved}
        exceededPoints={meritData.exceededPoints}
        remainingPoints={meritData.remainingPoints}
      />

      <Alert severity={meritData.targetAchieved ? "success" : "info"} sx={{ mb: 4, borderRadius: 2, p: 2 }}>
        <Typography variant="body1" fontWeight={600} gutterBottom>Progress Overview</Typography>
        <Typography variant="body1">
          {meritData.targetAchieved
            ? `You've successfully reached your merit goal${meritData.exceededPoints > 0 ? ` and exceeded it by ${meritData.exceededPoints} points` : ""}.`
            : `${meritData.remainingPoints} more points needed to reach your goal.`}
        </Typography>
      </Alert>

      {onViewReports && (
        <Button
          variant="contained" size="large" startIcon={<Assessment />} onClick={onViewReports}
          sx={{ mb: 4, minWidth: 200 }}
        >
          View Detailed Report
        </Button>
      )}

      <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>Merit Categories Breakdown</Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }, gap: 3, mb: 4 }}>
        <CategoryCard category={EventCategory.UNIVERSITY} points={meritData.universityMerit} targetPoints={50} />
        <CategoryCard category={EventCategory.FACULTY} points={meritData.facultyMerit} targetPoints={50} />
        <CategoryCard category={EventCategory.COLLEGE} points={meritData.collegeMerit} targetPoints={30} />
        <CategoryCard category={EventCategory.CLUB} points={meritData.clubMerit} targetPoints={20} />
      </Box>

      <StatsGrid recentActivities={meritData.recentActivities} progressPercentage={meritData.progressPercentage} />
    </Box>
  );
}
