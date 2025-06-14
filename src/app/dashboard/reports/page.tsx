'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { getCategoryColor, getCategoryDisplayName } from '@/lib/categoryUtils';
import { formatDate } from '@/lib/dateUtils';
import { EventCategory } from '@/types/api.types';
import { Download, Print } from '@mui/icons-material';
import { Alert, Box, Button, Card, CardContent, Chip, Divider, List, ListItem, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';

// Sample merit record data
interface MeritRecord {
  id: string;
  eventName: string;
  category: EventCategory;
  points: number;
  date: string;
  description: string;
  meritType: string;
  certificate?: string;
}

const sampleMeritRecords: MeritRecord[] = [  {
    id: '1',
    eventName: 'International Student Exchange Program',
    category: EventCategory.UNIVERSITY,
    points: 100,
    date: '2025-05-15',
    description: 'Cultural exchange program with international partner universities',
    meritType: 'University Program',
    certificate: 'cert_001.pdf'
  },
  {
    id: '2',
    eventName: 'Faculty Innovation Challenge',
    category: EventCategory.FACULTY,
    points: 90,
    date: '2025-05-20',
    description: 'Won innovation competition showcasing student projects to faculty judges',
    meritType: 'Academic Achievement',
    certificate: 'cert_002.pdf'
  },
  {
    id: '3',
    eventName: 'Campus Blood Donation Drive',
    category: EventCategory.COLLEGE,    points: 60,
    date: '2025-05-10',
    description: 'Participated in campus blood donation drive helping community',
    meritType: 'Community Service'
  },
  {
    id: '4',
    eventName: 'Drama Club Annual Performance',
    category: EventCategory.ASSOCIATION,
    points: 30,
    date: '2025-05-25',
    description: 'Performed in annual theatrical performance featuring original student productions',
    meritType: 'Club Activity',
    certificate: 'cert_004.pdf'
  },
  {
    id: '5',
    eventName: 'Coding Hackathon 2025',
    category: EventCategory.FACULTY,
    points: 100,
    date: '2025-06-20',
    description: 'Won first place in 48-hour coding challenge for campus problems',
    meritType: 'Academic Competition',
    certificate: 'cert_005.pdf'
  },  {
    id: '6',
    eventName: 'International Conference Week',
    category: EventCategory.UNIVERSITY,
    points: 120,
    date: '2025-06-10',
    description: 'Attended week-long international conference with keynote speakers',
    meritType: 'University Event'
  }
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
      id={`merit-report-tabpanel-${index}`}
      aria-labelledby={`merit-report-tab-${index}`}
      {...other}
    >      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function MeritReportsPage() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleDownloadReport = () => {
    // In a real app, this would generate and download a PDF report
    alert('Merit report download started (demo functionality)');
  };

  const handlePrintReport = () => {
    // In a real app, this would open print dialog
    window.print();
  };

  const filterRecordsByCategory = (category?: EventCategory) => {
    if (!category) return sampleMeritRecords;
    return sampleMeritRecords.filter(record => record.category === category);
  };
  const calculateCategoryTotal = (category?: EventCategory) => {
    const records = filterRecordsByCategory(category);
    return records.reduce((total, record) => total + record.points, 0);
  };

  const renderMeritRecords = (records: MeritRecord[]) => {
    if (records.length === 0) {
      return (
        <Alert severity="info" sx={{ mt: 2 }}>
          No merit records found for this category.
        </Alert>
      );
    }

    return (
      <List sx={{ mt: 2 }}>
        {records.map((record, index) => (
          <Box key={record.id}>
            <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                <Typography variant="h6" component="h3">
                  {record.eventName}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Chip
                    label={getCategoryDisplayName(record.category)}
                    size="small"
                    color={getCategoryColor(record.category)}
                    sx={{ color: 'white', fontWeight: 600 }}
                  />
                  <Chip
                    label={record.meritType}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    +{record.points} pts
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {record.description}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 1 }}>                <Typography variant="caption" color="text.secondary">
                  Date: {formatDate(record.date)}
                </Typography>
              </Box>
              
              {record.certificate && (
                <Button
                  size="small"
                  variant="text"
                  sx={{ mt: 1, alignSelf: 'flex-start' }}
                  onClick={() => alert(`Opening certificate: ${record.certificate}`)}
                >
                  View Certificate
                </Button>
              )}
            </ListItem>
            {index < records.length - 1 && <Divider />}
          </Box>
        ))}
      </List>
    );
  };

  // Calculate totals
  const totalPoints = calculateCategoryTotal();

  return (
    <DashboardLayout title="Merit Reports">
      <Box sx={{ width: '100%' }}>
        {/* Summary Cards */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          <Card sx={{ minWidth: 200, flex: 1 }}>
            <CardContent>              <Typography variant="h6" color="primary" gutterBottom>
                Total Points Earned
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {totalPoints}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Across all categories
              </Typography>
            </CardContent>
          </Card>
            <Card sx={{ minWidth: 200, flex: 1 }}>
            <CardContent>
              <Typography variant="h6" color="success.main" gutterBottom>
                Records Count
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {sampleMeritRecords.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total activities
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ minWidth: 200, flex: 1 }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Progress to Target
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {Math.round((totalPoints / 150) * 100)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Target: 150 points
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleDownloadReport}
          >
            Download Report
          </Button>
          <Button
            variant="outlined"
            startIcon={<Print />}
            onClick={handlePrintReport}
          >
            Print Report
          </Button>
        </Box>

        {/* Merit Records by Category */}
        <Card>
          <CardContent>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={selectedTab} onChange={handleTabChange} aria-label="merit report tabs">
                <Tab label="All Records" />
                <Tab label="University Merit" />
                <Tab label="Faculty Merit" />
                <Tab label="College Merit" />
                <Tab label="Association Merit" />
              </Tabs>
            </Box>

            <TabPanel value={selectedTab} index={0}>
              <Typography variant="h6" gutterBottom>
                All Merit Records
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Complete history of all merit achievements ({sampleMeritRecords.length} records)
              </Typography>
              {renderMeritRecords(sampleMeritRecords)}
            </TabPanel>            <TabPanel value={selectedTab} index={1}>
              <Typography variant="h6" gutterBottom>
                University Merit Records
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Points earned: {calculateCategoryTotal(EventCategory.UNIVERSITY)} points
              </Typography>
              {renderMeritRecords(filterRecordsByCategory(EventCategory.UNIVERSITY))}
            </TabPanel>

            <TabPanel value={selectedTab} index={2}>
              <Typography variant="h6" gutterBottom>
                Faculty Merit Records
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Points earned: {calculateCategoryTotal(EventCategory.FACULTY)} points
              </Typography>
              {renderMeritRecords(filterRecordsByCategory(EventCategory.FACULTY))}
            </TabPanel>

            <TabPanel value={selectedTab} index={3}>
              <Typography variant="h6" gutterBottom>
                College Merit Records
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Points earned: {calculateCategoryTotal(EventCategory.COLLEGE)} points
              </Typography>
              {renderMeritRecords(filterRecordsByCategory(EventCategory.COLLEGE))}
            </TabPanel>

            <TabPanel value={selectedTab} index={4}>
              <Typography variant="h6" gutterBottom>
                Association/Club Merit Records
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Points earned: {calculateCategoryTotal(EventCategory.ASSOCIATION)} points
              </Typography>
              {renderMeritRecords(filterRecordsByCategory(EventCategory.ASSOCIATION))}
            </TabPanel>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}
