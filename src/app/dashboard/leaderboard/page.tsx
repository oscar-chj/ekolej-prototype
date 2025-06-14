'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Avatar, Box, Card, CardContent, Chip, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from '@mui/material';
import { useState } from 'react';

// Sample leaderboard data
interface LeaderboardEntry {
  id: string;
  name: string;
  studentId: string;
  faculty: string;
  year: string;
  totalPoints: number;
  universityMerit: number;
  facultyMerit: number;
  collegeMerit: number;
  associationMerit: number;
  rank: number;
  avatar?: string;
}

const sampleLeaderboardData: LeaderboardEntry[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    studentId: 'S12001',
    faculty: 'Computer Science',
    year: '4',
    totalPoints: 285,
    universityMerit: 120,
    facultyMerit: 85,
    collegeMerit: 50,
    associationMerit: 30,
    rank: 1,
  },
  {
    id: '2', 
    name: 'Bob Chen',
    studentId: 'S12002',
    faculty: 'Engineering',
    year: '3',
    totalPoints: 245,
    universityMerit: 80,
    facultyMerit: 95,
    collegeMerit: 40,
    associationMerit: 30,
    rank: 2,
  },
  {
    id: '3',
    name: 'Carol Smith',
    studentId: 'S12003', 
    faculty: 'Business',
    year: '4',
    totalPoints: 210,
    universityMerit: 60,
    facultyMerit: 70,
    collegeMerit: 50,
    associationMerit: 30,
    rank: 3,
  },
  {
    id: '4',
    name: 'John Doe',
    studentId: 'S12345',
    faculty: 'Computer Science', 
    year: '3',
    totalPoints: 142,
    universityMerit: 40,
    facultyMerit: 52,
    collegeMerit: 30,
    associationMerit: 20,
    rank: 4,
  },
  {
    id: '5',
    name: 'Eva Rodriguez',
    studentId: 'S12004',
    faculty: 'Medicine',
    year: '2',
    totalPoints: 135,
    universityMerit: 30,
    facultyMerit: 55,
    collegeMerit: 35,
    associationMerit: 15,
    rank: 5,
  },
];

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

export default function LeaderboardPage() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };  const renderLeaderboardTable = (sortBy: 'total' | 'university' | 'faculty' | 'college' | 'association') => {
    let sortedData = [...sampleLeaderboardData];
    
    switch (sortBy) {      case 'university':
        sortedData = sortedData.sort((a, b) => b.universityMerit - a.universityMerit);
        break;
      case 'faculty':
        sortedData = sortedData.sort((a, b) => b.facultyMerit - a.facultyMerit);
        break;
      case 'college':
        sortedData = sortedData.sort((a, b) => b.collegeMerit - a.collegeMerit);
        break;
      case 'association':
        sortedData = sortedData.sort((a, b) => b.associationMerit - a.associationMerit);
        break;
      default:
        sortedData = sortedData.sort((a, b) => b.totalPoints - a.totalPoints);
    }

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
  };

  // Top 3 podium display
  const top3 = sampleLeaderboardData.slice(0, 3);

  return (
    <DashboardLayout title="Merit Leaderboard">
      <Box sx={{ width: '100%' }}>
        {/* Top 3 Podium */}
        <Card sx={{ mb: 4, p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom align="center">
            🏆 Top Performers
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            {/* 2nd Place */}
            {top3[1] && (
              <Box sx={{ textAlign: 'center', p: 2, minWidth: 200 }}>
                <Avatar 
                  sx={{ 
                    width: 60, 
                    height: 60, 
                    mx: 'auto', 
                    mb: 1,
                    border: `3px solid ${getRankColor(2)}`
                  }}
                >
                  {top3[1].name.charAt(0)}
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  🥈 {top3[1].name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {top3[1].totalPoints} points
                </Typography>
              </Box>
            )}
            
            {/* 1st Place */}
            {top3[0] && (
              <Box sx={{ textAlign: 'center', p: 2, position: 'relative', minWidth: 200 }}>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  👑
                </Typography>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    mx: 'auto', 
                    mb: 1,
                    border: `4px solid ${getRankColor(1)}`
                  }}
                >
                  {top3[0].name.charAt(0)}
                </Avatar>
                <Typography variant="h5" fontWeight="bold">
                  🥇 {top3[0].name}
                </Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {top3[0].totalPoints} points
                </Typography>
              </Box>
            )}
            
            {/* 3rd Place */}
            {top3[2] && (
              <Box sx={{ textAlign: 'center', p: 2, minWidth: 200 }}>
                <Avatar 
                  sx={{ 
                    width: 60, 
                    height: 60, 
                    mx: 'auto', 
                    mb: 1,
                    border: `3px solid ${getRankColor(3)}`
                  }}
                >
                  {top3[2].name.charAt(0)}
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  🥉 {top3[2].name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {top3[2].totalPoints} points
                </Typography>
              </Box>
            )}
          </Box>
        </Card>

        {/* Leaderboard Tabs */}
        <Card>
          <CardContent>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={selectedTab} onChange={handleTabChange} aria-label="leaderboard tabs">
                <Tab label="Overall Ranking" />
                <Tab label="University Merit" />
                <Tab label="Faculty Merit" />
                <Tab label="College Merit" />
                <Tab label="Association Merit" />
              </Tabs>
            </Box>

            <TabPanel value={selectedTab} index={0}>
              <Typography variant="h6" gutterBottom>
                Overall Merit Ranking
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Students ranked by total merit points across all categories
              </Typography>
              {renderLeaderboardTable('total')}
            </TabPanel>

            <TabPanel value={selectedTab} index={1}>
              <Typography variant="h6" gutterBottom>
                University/National/International Merit Ranking
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Students ranked by University, National, and International level achievements
              </Typography>
              {renderLeaderboardTable('university')}
            </TabPanel>

            <TabPanel value={selectedTab} index={2}>
              <Typography variant="h6" gutterBottom>
                Faculty Merit Ranking
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Students ranked by Faculty-level achievements and activities
              </Typography>
              {renderLeaderboardTable('faculty')}
            </TabPanel>

            <TabPanel value={selectedTab} index={3}>
              <Typography variant="h6" gutterBottom>
                College Merit Ranking
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Students ranked by College-level achievements and activities
              </Typography>
              {renderLeaderboardTable('college')}
            </TabPanel>

            <TabPanel value={selectedTab} index={4}>
              <Typography variant="h6" gutterBottom>
                Association/Club Merit Ranking
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Students ranked by Association and Club-level achievements and activities
              </Typography>
              {renderLeaderboardTable('association')}
            </TabPanel>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}
