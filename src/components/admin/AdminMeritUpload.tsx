"use client";

import { Alert, Box, Card, CardContent, LinearProgress, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useMeritUpload, ParticipantMeritEntry } from "./merit-upload/useMeritUpload";
import { EventSelectionStep } from "./merit-upload/EventSelectionStep";
import { WeightageStep } from "./merit-upload/WeightageStep";
import { ParticipantReviewStep } from "./merit-upload/ParticipantReviewStep";
import { CompletionStep } from "./merit-upload/CompletionStep";
import { Event } from "@/types/api.types";

interface AdminMeritUploadProps {
  eventId?: string;
  onComplete?: (data: { validEntries: ParticipantMeritEntry[], event: Event }) => void;
}

const steps = ["Select Event", "Set Weightages", "Review Participants", "Submit"];

export default function AdminMeritUpload({ eventId, onComplete }: AdminMeritUploadProps) {
  const {
    activeStep,
    setActiveStep,
    participantData,
    isProcessing,
    selectedEvent,
    setSelectedEvent,
    completedEvents,
    meritWeightage,
    setMeritWeightage,
    handleEventSelect,
    handleWeightageNext,
    handleRoleChange,
    handleSubmitMerit,
    validEntries,
    invalidEntries,
  } = useMeritUpload(eventId, onComplete);

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <EventSelectionStep
            completedEvents={completedEvents}
            selectedEvent={selectedEvent}
            onSelect={setSelectedEvent}
            onNext={handleEventSelect}
          />
        );
      case 1:
        return (
          <WeightageStep
            selectedEvent={selectedEvent}
            meritWeightage={meritWeightage}
            setMeritWeightage={setMeritWeightage}
            onBack={() => setActiveStep(0)}
            onNext={handleWeightageNext}
            isProcessing={isProcessing}
          />
        );
      case 2:
        return (
          <ParticipantReviewStep
            selectedEvent={selectedEvent}
            participantData={participantData}
            validEntries={validEntries}
            invalidEntries={invalidEntries}
            onBack={() => setActiveStep(1)}
            onReset={() => {
              setActiveStep(1);
            }}
            onRoleChange={handleRoleChange}
            onSubmit={handleSubmitMerit}
            isProcessing={isProcessing}
          />
        );
      case 3:
        return (
          <CompletionStep
            validEntries={validEntries}
            selectedEvent={selectedEvent}
            meritWeightage={meritWeightage}
            onReset={() => {
              setActiveStep(0);
              setSelectedEvent(null);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Admin Feature:</strong> This component allows merit administrators to assign merit points to event participants with role-based weightages.
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

          {isProcessing && <LinearProgress sx={{ mb: 3 }} />}

          {renderStepContent(activeStep)}
        </CardContent>
      </Card>
    </Box>
  );
}
