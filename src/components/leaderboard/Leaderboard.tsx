'use client';

import DataService from '@/services/data/DataService';
import { Avatar, Box, Card, CardContent, Chip, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from '@mui/material';
import { useState } from 'react';

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
    case 1: return '#FFD700'; // Gold
    case 2: return '#C0C0C0'; // Silver  
    case 3: return '#CD7F32'; // Bronze
    default: return '#757575'; // Gray
  }
}

function getRankIcon(rank: number): string {
  switch (rank) {
    case 1: return '🥇';
    case 2: return '🥈';
    case 3: return '🥉';
    default: return `#${rank}`;
  }
}

interface LeaderboardTableProps {
  sortBy: 'total' | 'university' | 'faculty' | 'college' | 'association';
}

function LeaderboardTable({ sortBy }: LeaderboardTableProps) {
  const sortedData = DataService.getLeaderboardData(sortBy);

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
              {sortBy === 'total' && 'Total Points'}
              {sortBy === 'university' && 'University Merit'}
              {sortBy === 'faculty' && 'Faculty Merit'}
              {sortBy === 'college' && 'College Merit'}
              {sortBy === 'association' && 'Association Merit'}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((entry, index) => {
            const displayRank = index + 1;
            let points = entry.totalPoints;
            
            switch (sortBy) {
              case 'university':
                points = entry.universityMerit;
                break;
              case 'faculty':
                points = entry.facultyMerit;
                break;
              case 'college':
                points = entry.collegeMerit;
                break;
              case 'association':
                points = entry.associationMerit;
                break;
            }

            return (
              <TableRow 
                key={entry.id}
                sx={{ 
                  '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                  ...(entry.studentId === 'S12345' && { backgroundColor: 'primary.light', color: 'primary.contrastText' })
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{ 
                        color: getRankColor(displayRank),
                        fontWeight: 'bold'
                      }}
                    >
                      {getRankIcon(displayRank)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function TopThreePodium() {
  const top3 = DataService.getLeaderboardData('total').slice(0, 3);

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        🏆 Top Performers
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
        {top3.map((student, index) => (
          <Card 
            key={student.id}
            sx={{ 
              minWidth: 200,
              textAlign: 'center',
              position: 'relative',
              border: index === 0 ? '2px solid #FFD700' : '1px solid rgba(0, 0, 0, 0.12)'
            }}
          >
            <CardContent>
              {index === 0 && (
                <Box sx={{ position: 'absolute', top: -10, right: -10 }}>
                  <Typography fontSize="2rem">👑</Typography>
                </Box>
              )}
              <Avatar 
                sx={{ 
                  width: 64, 
                  height: 64, 
                  mx: 'auto', 
                  mb: 2,
                  bgcolor: getRankColor(index + 1)
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
        ))}
      </Box>
    </Box>
  );
}

export default function Leaderboard() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Merit Leaderboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          See how you rank among your peers across different merit categories
        </Typography>
      </Box>

      <TopThreePodium />

      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
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
          <LeaderboardTable sortBy="total" />
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          <LeaderboardTable sortBy="university" />
        </TabPanel>
        <TabPanel value={selectedTab} index={2}>
          <LeaderboardTable sortBy="faculty" />
        </TabPanel>
        <TabPanel value={selectedTab} index={3}>
          <LeaderboardTable sortBy="college" />
        </TabPanel>
        <TabPanel value={selectedTab} index={4}>
          <LeaderboardTable sortBy="association" />
        </TabPanel>
      </Paper>
    </Box>
  );
}
