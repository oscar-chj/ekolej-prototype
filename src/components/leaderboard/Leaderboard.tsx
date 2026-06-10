"use client";

import { UserRole } from "@/types/auth.types";
import {
  Box, FormControl, InputLabel, MenuItem, Paper, Select, Tabs, Tab,
  Typography, useMediaQuery, useTheme
} from "@mui/material";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { CurrentUserRanking } from "./components/CurrentUserRanking";
import { TopThreePodium } from "./components/TopThreePodium";
import { LeaderboardTable } from "./components/LeaderboardTable";

export default function Leaderboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedTab, setSelectedTab] = useState(0);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(UserRole.STUDENT);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.email) {
      setCurrentUserEmail(session.user.email);
      setCurrentUserRole((session.user.role as UserRole) ?? UserRole.STUDENT);
    }
  }, [session]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const sortByOptions: Array<"total" | "university" | "faculty" | "college" | "club"> =
    ["total", "university", "faculty", "college", "club"];

  const currentSortBy = sortByOptions[selectedTab];
  const isStudent = currentUserRole === UserRole.STUDENT;

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>Merit Leaderboard</Typography>
        <Typography variant="body1" color="text.secondary">
          See how you rank among your peers across different merit categories
        </Typography>
      </Box>

      <CurrentUserRanking
        currentUserEmail={currentUserEmail}
        sortBy={currentSortBy}
        isStudent={isStudent}
      />

      <TopThreePodium currentUserEmail={currentUserEmail} />

      <Paper>
        {isMobile ? (
          <Box sx={{ p: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedTab}
                label="Category"
                onChange={(e) => setSelectedTab(e.target.value as number)}
              >
                <MenuItem value={0}>Overall Ranking</MenuItem>
                <MenuItem value={1}>University Merit</MenuItem>
                <MenuItem value={2}>Faculty Merit</MenuItem>
                <MenuItem value={3}>College Merit</MenuItem>
                <MenuItem value={4}>Club Merit</MenuItem>
              </Select>
            </FormControl>
          </Box>
        ) : (
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}
          >
            <Tab label="Overall" />
            <Tab label="University" />
            <Tab label="Faculty" />
            <Tab label="College" />
            <Tab label="Club" />
          </Tabs>
        )}

        <Box sx={{ p: isMobile ? 0 : 3 }}>
          <LeaderboardTable sortBy={currentSortBy} currentUserEmail={currentUserEmail} />
        </Box>
      </Paper>
    </Box>
  );
}
