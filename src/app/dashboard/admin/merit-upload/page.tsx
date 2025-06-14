'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { getCategoryColor, getCategoryDisplayName } from '@/lib/categoryUtils';
import { EventCategory } from '@/types/api.types';
import { Check, CloudUpload, Download, Error } from '@mui/icons-material';
import { Alert, Box, Button, Card, CardContent, Chip, IconButton, LinearProgress, Paper, Step, StepLabel, Stepper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useRef, useState } from 'react';

// Sample event for merit upload
interface EventForMerit {
  id: string;
  name: string;
  category: EventCategory;
  maxPoints: number;
  date: string;
}

const sampleEvent: EventForMerit = {
  id: 'evt_001',
  name: 'Faculty Research Symposium 2024',
  category: EventCategory.FACULTY,
  maxPoints: 30,
  date: '2024-03-15'
};

// Sample CSV data structure
interface CSVMeritEntry {
  studentId: string;
  studentName: string;
  points: number;
  meritType: string;
  status: 'valid' | 'invalid' | 'duplicate';
  errorMessage?: string;
}

const sampleCSVData: CSVMeritEntry[] = [
  {
    studentId: 'S12001',
    studentName: 'Alice Johnson',
    points: 25,
    meritType: 'Event Participation',
    status: 'valid'
  },
  {
    studentId: 'S12002',
    studentName: 'Bob Chen',
    points: 20,
    meritType: 'Achievement Award',
    status: 'valid'
  },
  {
    studentId: 'S12345',
    studentName: 'John Doe',
    points: 22,
    meritType: 'Research Contribution',
    status: 'valid'
  },
  {
    studentId: 'S12999',
    studentName: 'Invalid Student',
    points: 25,
    meritType: 'Event Participation',
    status: 'invalid',
    errorMessage: 'Student ID not found in database'
  },
  {
    studentId: 'S12003',
    studentName: 'Carol Smith',
    points: 35,
    meritType: 'Special Achievement',
    status: 'invalid',
    errorMessage: `Points exceed maximum allowed (${sampleEvent.maxPoints})`
  }
];

const steps = ['Select Event', 'Upload CSV', 'Review Data', 'Submit'];

export default function AdminMeritUploadPage() {  const [activeStep, setActiveStep] = useState(0);
  const [csvData, setCsvData] = useState<CSVMeritEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      // Simulate file processing
      setTimeout(() => {
        setCsvData(sampleCSVData);
        setIsProcessing(false);
        setActiveStep(2); // Move to review step
      }, 2000);
    }
  };
  const handleSubmitMerit = () => {
    setIsProcessing(true);
    // Simulate submission
    setTimeout(() => {
      setIsProcessing(false);
      setActiveStep(3);
    }, 1500);
  };

  const validEntries = csvData.filter(entry => entry.status === 'valid');
  const invalidEntries = csvData.filter(entry => entry.status === 'invalid');

  const downloadTemplate = () => {
    // In a real app, this would download a CSV template
    alert('CSV template download started (demo functionality)');
  };

  const getStatusColor = (status: string): 'success' | 'error' | 'default' => {
    switch (status) {
      case 'valid': return 'success';
      case 'invalid': return 'error';
      default: return 'default';
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Event Selected for Merit Upload
            </Typography>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6">
                    {sampleEvent.name}
                  </Typography>
                  <Chip
                    label={getCategoryDisplayName(sampleEvent.category)}
                    sx={{ 
                      backgroundColor: getCategoryColor(sampleEvent.category),
                      color: 'white'
                    }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Event Date: {sampleEvent.date}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Maximum Points: {sampleEvent.maxPoints}
                </Typography>
              </CardContent>
            </Card>
            <Button 
              variant="contained" 
              onClick={() => setActiveStep(1)}
              size="large"
            >
              Proceed to Upload
            </Button>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Upload Merit Data (CSV)
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              Please upload a CSV file with columns: StudentID, StudentName, Points, MeritType
            </Alert>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={downloadTemplate}
              >
                Download CSV Template
              </Button>
            </Box>

            <Paper
              sx={{
                p: 4,
                textAlign: 'center',
                border: '2px dashed #ccc',
                cursor: 'pointer',
                '&:hover': { borderColor: 'primary.main' }
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Click to upload CSV file
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Or drag and drop your CSV file here
              </Typography>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
            </Paper>

            {isProcessing && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" gutterBottom>
                  Processing CSV file...
                </Typography>
                <LinearProgress />
              </Box>
            )}
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Merit Data
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Chip 
                label={`${validEntries.length} Valid Entries`} 
                color="success" 
                icon={<Check />}
              />
              <Chip 
                label={`${invalidEntries.length} Invalid Entries`} 
                color="error" 
                icon={<Error />}
              />
            </Box>

            {invalidEntries.length > 0 && (
              <Alert severity="warning" sx={{ mb: 3 }}>
                {invalidEntries.length} entries have validation errors. Only valid entries will be processed.
              </Alert>
            )}

            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student ID</TableCell>
                    <TableCell>Student Name</TableCell>
                    <TableCell align="right">Points</TableCell>
                    <TableCell>Merit Type</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {csvData.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{entry.studentId}</TableCell>
                      <TableCell>{entry.studentName}</TableCell>
                      <TableCell align="right">{entry.points}</TableCell>
                      <TableCell>{entry.meritType}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={entry.status}
                            color={getStatusColor(entry.status)}
                            size="small"
                          />
                          {entry.errorMessage && (
                            <IconButton size="small" title={entry.errorMessage}>
                              <Error color="error" fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => setActiveStep(1)}
              >
                Upload Different File
              </Button>
              <Button 
                variant="contained" 
                onClick={handleSubmitMerit}
                disabled={validEntries.length === 0 || isProcessing}
              >
                {isProcessing ? 'Processing...' : `Submit ${validEntries.length} Valid Entries`}
              </Button>
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Check 
              sx={{ 
                fontSize: 80, 
                color: 'success.main', 
                mb: 2 
              }} 
            />
            <Typography variant="h5" gutterBottom>
              Merit Upload Complete!
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Successfully processed {validEntries.length} merit entries for {sampleEvent.name}
            </Typography>
            
            <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" gutterBottom>
                <strong>Summary:</strong>
              </Typography>
              <Typography variant="body2">
                • Valid entries processed: {validEntries.length}
              </Typography>
              <Typography variant="body2">
                • Total points awarded: {validEntries.reduce((sum, entry) => sum + entry.points, 0)}
              </Typography>
              <Typography variant="body2">
                • Event: {sampleEvent.name}
              </Typography>
            </Box>            <Button 
              variant="contained" 
              onClick={() => {
                setActiveStep(0);
                setCsvData([]);
              }}
              sx={{ mt: 3 }}
            >
              Upload Merit for Another Event
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout title="Admin - Upload Merit">
      <Box sx={{ width: '100%' }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Admin Feature:</strong> This page allows merit administrators to upload and assign merit points to students based on event participation.
          </Typography>
        </Alert>

        <Card>
          <CardContent sx={{ p: 4 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {renderStepContent()}
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}
