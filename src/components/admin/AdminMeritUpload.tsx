"use client";

import { getCategoryColor, getCategoryDisplayName } from "@/lib/categoryUtils";
import DataService from "@/services/data/DataService";
import { students } from "@/data/students";
import { Event } from "@/types/api.types";
import {
  ArrowBack,
  Check,
  CheckCircle,
  CloudUpload,
  Download,
  Error,
  Event as EventIcon,
  RadioButtonUnchecked,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";

interface CSVMeritEntry {
  studentId: string;
  studentName: string;
  points: number;
  meritType?: string;
  remarks?: string;
  isValid: boolean;
  status: "valid" | "invalid";
  errors?: string[];
  errorMessage?: string;
}

interface AdminMeritUploadProps {
  eventId?: string;
  onComplete?: (uploadData: {
    validEntries: CSVMeritEntry[];
    event: Event;
  }) => void;
}

const steps = ["Select Event", "Upload CSV", "Review Data", "Submit"];

export default function AdminMeritUpload({
  eventId,
  onComplete,
}: AdminMeritUploadProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [csvData, setCsvData] = useState<CSVMeritEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [completedEvents, setCompletedEvents] = useState<Event[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Get completed events for selection
    const allEvents = DataService.getEvents();
    const completed = allEvents.filter((event) => event.status === "Completed");
    setCompletedEvents(completed);

    // Initialize selected event
    if (eventId) {
      const event = DataService.getEventById(eventId);
      setSelectedEvent(event || null);
      if (event) {
        setActiveStep(1); // Skip event selection if eventId is provided
      }
    }
  }, [eventId]);
  // Validate CSV entries against actual student data
  const validateCSVEntries = (
    entries: Omit<
      CSVMeritEntry,
      "isValid" | "status" | "errors" | "errorMessage"
    >[]
  ): CSVMeritEntry[] => {
    const validatedEntries: CSVMeritEntry[] = [];
    const seenStudentIds = new Set<string>();

    entries.forEach((entry) => {
      const errors: string[] = [];
      let isValid = true;

      // Check if student exists in the system
      const student = students.find((s) => s.studentId === entry.studentId);
      if (!student) {
        errors.push("Student ID not found in system");
        isValid = false;
      }

      // Check for duplicate entries in the same upload
      if (seenStudentIds.has(entry.studentId)) {
        errors.push("Duplicate entry for student in this upload");
        isValid = false;
      } else {
        seenStudentIds.add(entry.studentId);
      }

      // Validate points against event maximum
      if (selectedEvent && entry.points > selectedEvent.points) {
        errors.push(
          `Points exceed maximum allowed for event (${selectedEvent.points})`
        );
        isValid = false;
      }

      // Validate points are positive
      if (entry.points <= 0) {
        errors.push("Points must be positive");
        isValid = false;
      }

      // Validate merit type is not empty
      if (!entry.meritType || entry.meritType.trim() === "") {
        errors.push("Merit type is required");
        isValid = false;
      }

      validatedEntries.push({
        ...entry,
        isValid,
        status: isValid ? "valid" : "invalid",
        errors: errors.length > 0 ? errors : undefined,
        errorMessage: errors.length > 0 ? errors[0] : undefined,
      });
    });

    return validatedEntries;
  };
  const handleFileUpload = (
    uploadEvent: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = uploadEvent.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      // Simulate file processing with validation
      setTimeout(() => {
        // Get the merit type based on the selected event's category
        let eventMeritType = "University Merit"; // Default
        if (selectedEvent) {
          switch (selectedEvent.category) {
            case "University":
              eventMeritType = "University Merit";
              break;
            case "Faculty":
              eventMeritType = "Faculty Merit";
              break;
            case "College":
              eventMeritType = "College Merit";
              break;
            case "Club":
              eventMeritType = "Club Merit";
              break;
          }
        }

        // Use sample data with the correct merit type and event points
        const eventPoints = selectedEvent?.points || 6;
        const rawEntries = [
          {
            studentId: "223001",
            studentName: "Ahmad Abdullah",
            points: eventPoints,
            meritType: eventMeritType,
          },
          {
            studentId: "223002",
            studentName: "Sarah Lee",
            points: eventPoints,
            meritType: eventMeritType,
          },
          {
            studentId: "223003",
            studentName: "Raj Kumar",
            points: eventPoints,
            meritType: eventMeritType,
          },
          {
            studentId: "223004",
            studentName: "Li Wei",
            points: eventPoints,
            meritType: eventMeritType,
          },
          {
            studentId: "223005",
            studentName: "Fatimah Zahra",
            points: eventPoints,
            meritType: eventMeritType,
          },
          {
            studentId: "223006",
            studentName: "Chong Wei",
            points: eventPoints,
            meritType: eventMeritType,
          },
          {
            studentId: "INVALID001",
            studentName: "Unknown Student",
            points: eventPoints,
            meritType: eventMeritType,
          },
          {
            studentId: "223007",
            studentName: "Siti Aishah",
            points: eventPoints + 10, // Points exceed event maximum - will be invalid
            meritType: eventMeritType,
          },
          {
            studentId: "223008",
            studentName: "John Smith",
            points: eventPoints,
            meritType: eventMeritType,
          },
          {
            studentId: "223002",
            studentName: "Sarah Lee",
            points: eventPoints,
            meritType: eventMeritType,
          }, // Duplicate
          {
            studentId: "223009",
            studentName: "Priya Sharma",
            points: -5,
            meritType: eventMeritType,
          }, // Negative points
          {
            studentId: "223010",
            studentName: "Test Student",
            points: eventPoints,
            meritType: "",
          }, // Empty merit type
        ];

        const validatedData = validateCSVEntries(rawEntries);
        setCsvData(validatedData);
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

      // Call completion handler if provided
      if (onComplete && selectedEvent) {
        onComplete({
          validEntries: validEntries,
          event: selectedEvent,
        });
      }
    }, 1500);
  };

  const validEntries = csvData.filter((entry) => entry.status === "valid");
  const invalidEntries = csvData.filter((entry) => entry.status === "invalid");

  const downloadTemplate = () => {
    // In a real app, this would download a CSV template
    alert("CSV template download started (demo functionality)");
  };

  const getStatusColor = (status: string): "success" | "error" | "default" => {
    switch (status) {
      case "valid":
        return "success";
      case "invalid":
        return "error";
      default:
        return "default";
    }
  };
  const renderEventStep = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select a Completed Event for Merit Upload
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Choose from the list of completed events to upload merit points for
        participants.
      </Typography>

      {completedEvents.length === 0 ? (
        <Alert severity="info">
          No completed events available for merit upload.
        </Alert>
      ) : (
        <Box sx={{ mb: 3 }}>
          {completedEvents.map((event) => (
            <Card
              key={event.id}
              variant="outlined"
              sx={{
                mb: 2,
                cursor: "pointer",
                border: selectedEvent?.id === event.id ? 2 : 1,
                borderColor:
                  selectedEvent?.id === event.id ? "primary.main" : "divider",
                "&:hover": {
                  borderColor: "primary.main",
                  boxShadow: 1,
                },
              }}
              onClick={() => setSelectedEvent(event)}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {selectedEvent?.id === event.id ? (
                      <CheckCircle color="primary" />
                    ) : (
                      <RadioButtonUnchecked color="action" />
                    )}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Typography variant="h6">{event.title}</Typography>
                      <Chip
                        label={getCategoryDisplayName(event.category)}
                        sx={{
                          backgroundColor: getCategoryColor(event.category),
                          color: "white",
                        }}
                        size="small"
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {event.description}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        <EventIcon
                          fontSize="small"
                          sx={{ mr: 0.5, verticalAlign: "middle" }}
                        />
                        {event.date} • {event.location}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Max Points: {event.points}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Participants: {event.registeredCount}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Button
        variant="contained"
        onClick={() => setActiveStep(1)}
        size="large"
        disabled={!selectedEvent}
      >
        Proceed to Upload
      </Button>
    </Box>
  );
  const renderUploadStep = () => (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => setActiveStep(0)}
          sx={{ mr: 2 }}
        >
          Back to Event Selection
        </Button>
        <Typography variant="h6">Upload Merit Data (CSV)</Typography>
      </Box>

      {selectedEvent && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Uploading merit data for: <strong>{selectedEvent.title}</strong>
          <br />
          Please upload a CSV file with columns: StudentID, StudentName, Points,
          MeritType
        </Alert>
      )}

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
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
          textAlign: "center",
          border: "2px dashed #ccc",
          cursor: "pointer",
          "&:hover": { borderColor: "primary.main" },
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <CloudUpload sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
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
          style={{ display: "none" }}
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
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => setActiveStep(1)}
          sx={{ mr: 2 }}
        >
          Back to Upload
        </Button>
        <Typography variant="h6">Review Merit Data</Typography>
      </Box>
      {selectedEvent && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Reviewing merit data for: <strong>{selectedEvent.title}</strong>
        </Alert>
      )}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Chip
          label={`${validEntries.length} Valid Entries`}
          color="secondary" // green
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
          {invalidEntries.length} entries have validation errors. Only valid
          entries will be processed.
        </Alert>
      )}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student ID</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>Faculty</TableCell>
              <TableCell align="right">Points</TableCell>
              <TableCell>Merit Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Validation Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {csvData.map((entry, index) => {
              const student = students.find(
                (s) => s.studentId === entry.studentId
              );
              return (
                <TableRow key={index}>
                  <TableCell>{entry.studentId}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {entry.studentName}
                      </Typography>
                      {student && (
                        <Typography variant="caption" color="text.secondary">
                          Year {student.year} • {student.program}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {student ? student.faculty : "Unknown"}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      color={entry.isValid ? "text.primary" : "error.main"}
                      fontWeight={entry.isValid ? "normal" : "bold"}
                    >
                      {entry.points}
                    </Typography>
                  </TableCell>
                  <TableCell>{entry.meritType || "Not specified"}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Chip
                        label={entry.status}
                        color={getStatusColor(entry.status)}
                        size="small"
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    {entry.isValid ? (
                      <Typography variant="caption" color="success.main">
                        ✓ All validations passed
                      </Typography>
                    ) : (
                      <Box>
                        {entry.errors?.map((error, errorIndex) => (
                          <Typography
                            key={errorIndex}
                            variant="caption"
                            color="error.main"
                            display="block"
                          >
                            • {error}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="outlined" onClick={() => setActiveStep(1)}>
          Upload Different File
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmitMerit}
          disabled={validEntries.length === 0 || isProcessing}
        >
          {isProcessing
            ? "Processing..."
            : `Submit ${validEntries.length} Valid Entries`}
        </Button>
      </Box>
    </Box>
  );
  const renderCompletionStep = () => (
    <Box sx={{ textAlign: "center" }}>
      <Check
        sx={{
          fontSize: 80,
          color: "success.main",
          mb: 2,
        }}
      />
      <Typography variant="h5" gutterBottom>
        Merit Upload Complete!
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Successfully processed {validEntries.length} merit entries for{" "}
        <strong>{selectedEvent?.title}</strong>
      </Typography>

      <Box sx={{ mt: 3, p: 2, backgroundColor: "grey.50", borderRadius: 1 }}>
        <Typography variant="body2" gutterBottom>
          <strong>Upload Summary:</strong>
        </Typography>
        <Typography variant="body2">
          • Valid entries processed: {validEntries.length}
        </Typography>
        <Typography variant="body2">
          • Total points awarded:{" "}
          {validEntries.reduce((sum, entry) => sum + entry.points, 0)}
        </Typography>
        <Typography variant="body2">• Event: {selectedEvent?.title}</Typography>
        <Typography variant="body2">• Date: {selectedEvent?.date}</Typography>
      </Box>

      <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "center" }}>
        <Button
          variant="outlined"
          onClick={() => {
            setActiveStep(0);
            setCsvData([]);
            setSelectedEvent(null);
          }}
        >
          Upload Merit for Another Event
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setActiveStep(2);
          }}
        >
          View Upload Details
        </Button>
      </Box>
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
    <Box sx={{ width: "100%" }}>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Admin Feature:</strong> This component allows merit
          administrators to upload and assign merit points to students based on
          event participation.
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
