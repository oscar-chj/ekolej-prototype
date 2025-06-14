'use client';

import DataService from '@/services/data/DataService';
import { Event, EventCategory } from '@/types/api.types';
import { getCategoryColor, getCategoryDisplayName } from '@/lib/categoryUtils';
import { Check, CloudUpload, Download, Error } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  LinearProgress,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useRef, useState, useEffect } from 'react';

interface CSVMeritEntry {
  studentId: string;
  studentName: string;
  points: number;
  meritType?: string;
  remarks?: string;
  isValid: boolean;
  status: 'valid' | 'invalid';
  errors?: string[];
  errorMessage?: string;
}

interface AdminMeritUploadProps {
  eventId?: string;
  onComplete?: (uploadData: { validEntries: CSVMeritEntry[]; event: Event }) => void;
}

const steps = ['Select Event', 'Upload CSV', 'Review Data', 'Submit'];

export default function AdminMeritUpload({ 
  eventId,
  onComplete 
}: AdminMeritUploadProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [csvData, setCsvData] = useState<CSVMeritEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Sample CSV data for demonstration
  const sampleCSVData: CSVMeritEntry[] = [
    { 
      studentId: 'S12345', 
      studentName: 'Ahmad Ibrahim', 
      points: 15, 
      meritType: 'Academic Excellence',
      isValid: true, 
      status: 'valid' 
    },
    { 
      studentId: 'S12346', 
      studentName: 'Sarah Lee', 
      points: 20, 
      meritType: 'Research Presentation',
      isValid: true, 
      status: 'valid' 
    },
    { 
      studentId: 'S12347', 
      studentName: 'Raj Patel', 
      points: 10, 
      meritType: 'Community Service',
      isValid: true, 
      status: 'valid' 
    },
    { 
      studentId: 'INVALID', 
      studentName: 'Invalid Student', 
      points: 5, 
      meritType: 'Unknown',
      isValid: false, 
      status: 'invalid',
      errors: ['Student ID not found'],
      errorMessage: 'Student ID not found in system'
    }
  ];

  useEffect(() => {
    // Get event data from DataService
    if (eventId) {
      const event = DataService.getEventById(eventId);
      setSelectedEvent(event || null);
    } else {
      // Use first available event as default
      const events = DataService.getEvents();
      setSelectedEvent(events[0] || null);
    }
  }, [eventId]);

  const handleFileUpload = (uploadEvent: React.ChangeEvent<HTMLInputElement>) => {
    const file = uploadEvent.target.files?.[0];
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
    setTimeout(() => {      setIsProcessing(false);
      setActiveStep(3);
      
      // Call completion handler if provided
      if (onComplete && selectedEvent) {
        onComplete({
          validEntries: validEntries,
          event: selectedEvent
        });
      }
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

  const renderEventStep = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Event Selected for Merit Upload
      </Typography>
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6">
              {selectedEvent?.title}
            </Typography>
            <Chip
              label={getCategoryDisplayName(selectedEvent?.category || EventCategory.UNIVERSITY)}
              sx={{ 
                backgroundColor: getCategoryColor(selectedEvent?.category || EventCategory.UNIVERSITY),
                color: 'white'
              }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Event Date: {selectedEvent?.date}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Maximum Points: {selectedEvent?.points}
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

  const renderUploadStep = () => (
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

  const renderReviewStep = () => (
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

  const renderCompletionStep = () => (
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
        Successfully processed {validEntries.length} merit entries for {selectedEvent?.title}
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
          • Event: {selectedEvent?.title}
        </Typography>
      </Box>
      
      <Button 
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

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderEventStep();
      case 1:
        return renderUploadStep();
      case 2:
        return renderReviewStep();
      case 3:
        return renderCompletionStep();
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Admin Feature:</strong> This component allows merit administrators to upload and assign merit points to students based on event participation.
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
  );
}
