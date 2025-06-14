"use client";

import { getCategoryColor, getCategoryDisplayName } from "@/lib/categoryUtils";
import { EventCategory } from "@/types/api.types";
import { Assessment, CalendarToday, Leaderboard } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";

interface MeritSummaryData {
  totalPoints: number;
  universityMerit: number;
  facultyMerit: number;
  collegeMerit: number;
  associationMerit: number;
  recentActivities: number;
  rank: number;
  totalStudents: number;
  targetPoints: number;
  progressPercentage: number;
  targetAchieved: boolean;
  remainingPoints: number;
  exceededPoints: number;
}

interface CategoryCardProps {
  category: EventCategory;
  points: number;
  targetPoints: number;
}

function CategoryCard({ category, points, targetPoints }: CategoryCardProps) {
  const percentage = Math.min((points / targetPoints) * 100, 100);

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Typography variant="h6" component="h3">
            {getCategoryDisplayName(category)}
          </Typography>
          <Chip
            label={`${points} pts`}
            sx={{
              backgroundColor: getCategoryColor(category),
              color: "white",
              fontWeight: "bold",
            }}
          />
        </Box>
        <Box sx={{ position: "relative", display: "inline-flex", mb: 2 }}>
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
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="caption"
              component="div"
              color="text.secondary"
            >
              {Math.round(percentage)}%
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Target: {targetPoints} points
        </Typography>{" "}
        <Typography variant="body2" color="text.secondary">
          {points >= targetPoints
            ? `Target achieved! (${points - targetPoints} above target)`
            : `Remaining: ${targetPoints - points} points`}
        </Typography>
      </CardContent>
    </Card>
  );
}

interface MeritSummaryProps {
  meritData: MeritSummaryData;
  onViewReports?: () => void;
  onViewLeaderboard?: () => void;
}

export default function MeritSummary({
  meritData,
  onViewReports,
  onViewLeaderboard,
}: MeritSummaryProps) {
  return (
    <Box sx={{ width: "100%" }}>
      {/* Overall Summary Card */}
      <Card
        sx={{
          mb: 4,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            <Box>
              <Typography
                variant="h3"
                component="h1"
                fontWeight="bold"
                gutterBottom
              >
                {meritData.totalPoints}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Total Merit Points
              </Typography>{" "}
              <Typography variant="body1" sx={{ opacity: 0.8, mt: 1 }}>
                {meritData.targetAchieved
                  ? meritData.exceededPoints > 0
                    ? `Target exceeded by ${meritData.exceededPoints} points!`
                    : "Target achieved! Congratulations!"
                  : `${meritData.progressPercentage}% of target achieved`}
              </Typography>
            </Box>

            <Box sx={{ textAlign: "right" }}>
              <Typography variant="h5" fontWeight="bold">
                #{meritData.rank}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                out of {meritData.totalStudents} students
              </Typography>{" "}
              <Chip
                label={
                  meritData.targetAchieved
                    ? meritData.exceededPoints > 0
                      ? `${meritData.exceededPoints} points above target`
                      : "Target achieved!"
                    : `${meritData.remainingPoints} points to target`
                }
                sx={{
                  mt: 1,
                  backgroundColor: meritData.targetAchieved
                    ? "rgba(76, 175, 80, 0.2)"
                    : "rgba(255,255,255,0.2)",
                  color: meritData.targetAchieved ? "success.main" : "white",
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
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 3,
          mb: 4,
        }}
      >
        <CategoryCard
          category={EventCategory.UNIVERSITY}
          points={meritData.universityMerit}
          targetPoints={50}
        />
        <CategoryCard
          category={EventCategory.FACULTY}
          points={meritData.facultyMerit}
          targetPoints={50}
        />
        <CategoryCard
          category={EventCategory.COLLEGE}
          points={meritData.collegeMerit}
          targetPoints={30}
        />
        <CategoryCard
          category={EventCategory.ASSOCIATION}
          points={meritData.associationMerit}
          targetPoints={20}
        />
      </Box>
      {/* Quick Stats */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 2,
          mb: 4,
        }}
      >
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <CalendarToday color="primary" sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h4" fontWeight="bold" color="primary">
            {meritData.recentActivities}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Recent Activities
          </Typography>
        </Paper>
        <Paper sx={{ p: 3, textAlign: "center" }}>
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
      {(onViewReports || onViewLeaderboard) && (
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 4 }}>
          {onViewReports && (
            <Button
              variant="contained"
              size="large"
              startIcon={<Assessment />}
              onClick={onViewReports}
              sx={{ minWidth: 200 }}
            >
              View Detailed Report
            </Button>
          )}

          {onViewLeaderboard && (
            <Button
              variant="outlined"
              size="large"
              startIcon={<Leaderboard />}
              onClick={onViewLeaderboard}
              sx={{ minWidth: 200 }}
            >
              View Leaderboard
            </Button>
          )}
        </Box>
      )}{" "}
      {/* Progress Insight */}
      <Alert severity={meritData.targetAchieved ? "success" : "info"}>
        <Typography variant="body1" gutterBottom>
          <strong>Progress Insight:</strong>{" "}
          {meritData.targetAchieved
            ? meritData.exceededPoints > 0
              ? `Excellent work! You've exceeded your target by ${meritData.exceededPoints} points.`
              : "Congratulations! You've achieved your merit target."
            : `You need ${meritData.remainingPoints} more points to reach your target.`}
        </Typography>
        {!meritData.targetAchieved && (
          <Typography variant="body2">
            Consider participating in more International/National events or
            Faculty activities to boost your score.
          </Typography>
        )}
      </Alert>
    </Box>
  );
}
