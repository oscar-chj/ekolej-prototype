"use client";

import authService from "@/services/auth/authService";
import DataService from "@/services/data/DataService";
import { UserRole } from "@/types/auth.types";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`leaderboard-tabpanel-${index}`}
      aria-labelledby={`leaderboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function getRankColor(rank: number): string {
  switch (rank) {
    case 1:
      return "#FFD700"; // Gold
    case 2:
      return "#C0C0C0"; // Silver
    case 3:
      return "#CD7F32"; // Bronze
    default:
      return "#757575"; // Gray
  }
}

function getRankIcon(rank: number): string {
  switch (rank) {
    case 1:
      return "🥇";
    case 2:
      return "🥈";
    case 3:
      return "🥉";
    default:
      return `#${rank}`;
  }
}

interface LeaderboardTableProps {
  sortBy: "total" | "university" | "faculty" | "college" | "association";
  currentUserId?: string;
}

function getCurrentUserRanking(
  currentUserId: string,
  sortBy: "total" | "university" | "faculty" | "college" | "association"
) {
  const sortedData = DataService.getLeaderboardData(sortBy);
  const userIndex = sortedData.findIndex((entry) => entry.id === currentUserId);

  if (userIndex === -1) return null;

  const userEntry = sortedData[userIndex];
  const rank = userIndex + 1;

  let points = userEntry.totalPoints;
  switch (sortBy) {
    case "university":
      points = userEntry.universityMerit;
      break;
    case "faculty":
      points = userEntry.facultyMerit;
      break;
    case "college":
      points = userEntry.collegeMerit;
      break;
    case "association":
      points = userEntry.associationMerit;
      break;
  }

  return { rank, points, total: sortedData.length };
}

interface CurrentUserRankingProps {
  currentUserId: string;
  sortBy: "total" | "university" | "faculty" | "college" | "association";
  isStudent: boolean;
}

function CurrentUserRanking({
  currentUserId,
  sortBy,
  isStudent,
}: CurrentUserRankingProps) {
  if (!isStudent) return null;

  const ranking = getCurrentUserRanking(currentUserId, sortBy);
  if (!ranking) return null;

  const categoryNames = {
    total: "Overall",
    university: "University Merit",
    faculty: "Faculty Merit",
    college: "College Merit",
    association: "Association Merit",
  };

  return (
    <Card sx={{ mb: 3, bgcolor: "primary.main", color: "white" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Your {categoryNames[sortBy]} Ranking
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Box>
            <Typography variant="h3" fontWeight="bold">
              #{ranking.rank}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              out of {ranking.total} students
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {ranking.points}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              points earned
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function LeaderboardTable({
  sortBy,
  currentUserId = "1",
}: LeaderboardTableProps) {
  const sortedData = DataService.getLeaderboardData(sortBy);

  // Show only top 10 students for leaderboard
  const displayData = sortedData.slice(0, 10);
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 80, minWidth: 80 }}>Rank</TableCell>
            <TableCell sx={{ width: 220, minWidth: 220 }}>Student</TableCell>
            <TableCell sx={{ width: 150, minWidth: 150 }}>Faculty</TableCell>
            <TableCell sx={{ width: 100, minWidth: 100 }}>Year</TableCell>
            <TableCell align="right" sx={{ width: 140, minWidth: 140 }}>
              {sortBy === "total" && "Total Points"}
              {sortBy === "university" && "University Merit"}
              {sortBy === "faculty" && "Faculty Merit"}
              {sortBy === "college" && "College Merit"}
              {sortBy === "association" && "Association Merit"}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayData.map((entry) => {
            // Calculate actual rank based on original position
            const actualIndex = sortedData.findIndex(
              (item) => item.id === entry.id
            );
            const displayRank = actualIndex + 1;
            const isCurrentUser = entry.id === currentUserId;

            let points = entry.totalPoints;

            switch (sortBy) {
              case "university":
                points = entry.universityMerit;
                break;
              case "faculty":
                points = entry.facultyMerit;
                break;
              case "college":
                points = entry.collegeMerit;
                break;
              case "association":
                points = entry.associationMerit;
                break;
            }

            return (
              <TableRow
                key={entry.id}
                sx={{
                  "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
                  ...(isCurrentUser && {
                    color: "primary.contrastText",
                    border: "2px solid",
                    borderColor: "primary.main",
                  }),
                }}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: getRankColor(displayRank),
                        fontWeight: "bold",
                      }}
                    >
                      {getRankIcon(displayRank)}
                    </Typography>
                    {isCurrentUser && (
                      <Chip label="You" size="small" color="primary" />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {entry.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {entry.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {entry.studentId}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{entry.faculty}</TableCell>
                <TableCell>
                  <Chip
                    label={`Year ${entry.year}`}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {points}
                  </Typography>
                </TableCell>{" "}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function TopThreePodium({ currentUserId = "1" }: { currentUserId?: string }) {
  const top3 = DataService.getLeaderboardData("total").slice(0, 3);

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        🏆 Top Performers
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        {top3.map((student, index) => {
          const isCurrentUser = student.id === currentUserId;
          return (
            <Card
              key={student.id}
              sx={{
                minWidth: 200,
                textAlign: "center",
                position: "relative",
                border: "2px solid #FFD700",
                ...(isCurrentUser && {
                  boxShadow: "0 0 20px rgba(25, 118, 210, 0.4)",
                  border: "2px solid",
                  borderColor: "primary.main",
                }),
              }}
            >
              <CardContent>
                {index === 0 && (
                  <Box sx={{ position: "absolute", top: -8, right: 0 }}>
                    <Typography fontSize="2rem">👑</Typography>
                  </Box>
                )}
                {isCurrentUser && (
                  <Box sx={{ position: "absolute", top: 8, left: 8 }}>
                    <Chip label="You!" size="small" color="primary" />
                  </Box>
                )}
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    mx: "auto",
                    mb: 2,
                    bgcolor: getRankColor(index + 1),
                  }}
                >
                  {student.name.charAt(0)}
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  {student.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {student.faculty} • Year {student.year}
                </Typography>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {student.totalPoints}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Points
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}

export default function Leaderboard() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string>("1"); // Default fallback
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(
    UserRole.STUDENT
  );
  useEffect(() => {
    // Get current user ID and role from authentication, initialize if needed
    const getCurrentUser = async () => {
      try {
        let user = await authService.getCurrentUser();
        if (!user) {
          // For prototype: initialize with default user (Ahmad Abdullah)
          user = await authService.initializeWithUser("1");
        }
        if (user) {
          setCurrentUserId(user.id);
          setCurrentUserRole(user.role);
        }
      } catch (error) {
        console.error("Error getting current user:", error);
        // Keep default values
      }
    };

    getCurrentUser();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const sortByOptions: Array<
    "total" | "university" | "faculty" | "college" | "association"
  > = ["total", "university", "faculty", "college", "association"];

  const currentSortBy = sortByOptions[selectedTab];
  const isStudent = currentUserRole === UserRole.STUDENT;

  return (
    <Box>
      {" "}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Merit Leaderboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          See how you rank among your peers across different merit categories
        </Typography>
      </Box>
      {/* Show current user's ranking if they're a student */}
      <CurrentUserRanking
        currentUserId={currentUserId}
        sortBy={currentSortBy}
        isStudent={isStudent}
      />
      <TopThreePodium currentUserId={currentUserId} />
      <Paper sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Overall Ranking" />
            <Tab label="University Merit" />
            <Tab label="Faculty Merit" />
            <Tab label="College Merit" />
            <Tab label="Association Merit" />
          </Tabs>
        </Box>

        <TabPanel value={selectedTab} index={0}>
          <LeaderboardTable sortBy="total" currentUserId={currentUserId} />
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          <LeaderboardTable sortBy="university" currentUserId={currentUserId} />
        </TabPanel>
        <TabPanel value={selectedTab} index={2}>
          <LeaderboardTable sortBy="faculty" currentUserId={currentUserId} />
        </TabPanel>
        <TabPanel value={selectedTab} index={3}>
          <LeaderboardTable sortBy="college" currentUserId={currentUserId} />
        </TabPanel>
        <TabPanel value={selectedTab} index={4}>
          <LeaderboardTable
            sortBy="association"
            currentUserId={currentUserId}
          />
        </TabPanel>
      </Paper>
    </Box>
  );
}
