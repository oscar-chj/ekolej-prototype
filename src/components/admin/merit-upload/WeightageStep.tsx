"use client";

import { getCategoryColor, getCategoryDisplayName } from "@/lib/categoryUtils";
import { Event } from "@/types/api.types";
import { ArrowBack, Event as EventIcon } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { MeritWeightage } from "./useMeritUpload";

interface WeightageStepProps {
  selectedEvent: Event | null;
  meritWeightage: MeritWeightage;
  setMeritWeightage: (w: MeritWeightage) => void;
  onBack: () => void;
  onNext: () => void;
  isProcessing: boolean;
}

export function WeightageStep({
  selectedEvent,
  meritWeightage,
  setMeritWeightage,
  onBack,
  onNext,
  isProcessing,
}: WeightageStepProps) {
  const getMeritTypeColor = (meritType: string) => {
    switch (meritType) {
      case "University":
        return "error";
      case "Faculty":
        return "primary";
      case "College":
        return "success";
      case "Club":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Set Merit Point Weightages
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure the merit points for different roles in the selected event
      </Typography>

      {selectedEvent && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <EventIcon color="primary" />
              <Box>
                <Typography variant="h6">{selectedEvent.title}</Typography>
                <Chip
                  label={getCategoryDisplayName(selectedEvent.category)}
                  size="small"
                  color={getCategoryColor(selectedEvent.category)}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Merit Configuration
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Typography variant="body2">Merit Type:</Typography>
              <Chip
                label={meritWeightage.meritType}
                size="small"
                color={getMeritTypeColor(meritWeightage.meritType)}
                sx={{ fontWeight: 500 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Based on event category: {selectedEvent?.category}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            <TextField
              label="Participant Points"
              type="number"
              value={meritWeightage.participantPoints}
              onChange={(e) =>
                setMeritWeightage({
                  ...meritWeightage,
                  participantPoints: parseInt(e.target.value) || 0,
                })
              }
              slotProps={{
                htmlInput: { min: 1, max: meritWeightage.maxPointsThreshold },
              }}
              sx={{ minWidth: 200 }}
            />

            <TextField
              label="Organizer Points"
              type="number"
              value={meritWeightage.organizerPoints}
              onChange={(e) =>
                setMeritWeightage({
                  ...meritWeightage,
                  organizerPoints: parseInt(e.target.value) || 0,
                })
              }
              slotProps={{
                htmlInput: { min: 1, max: meritWeightage.maxPointsThreshold },
              }}
              sx={{ minWidth: 200 }}
            />

            <TextField
              label="Max Points Threshold"
              type="number"
              value={meritWeightage.maxPointsThreshold}
              onChange={(e) =>
                setMeritWeightage({
                  ...meritWeightage,
                  maxPointsThreshold: parseInt(e.target.value) || 1,
                })
              }
              slotProps={{
                htmlInput: { min: 1 },
              }}
              sx={{ minWidth: 200 }}
            />
          </Box>
          <Alert severity="info">
            Participants will receive {meritWeightage.participantPoints} points,
            while organizers will receive {meritWeightage.organizerPoints}{" "}
            points. Maximum threshold is set to{" "}
            {meritWeightage.maxPointsThreshold} points.
          </Alert>
        </Box>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
          <Button startIcon={<ArrowBack />} onClick={onBack}>
            Back to Event Selection
          </Button>
          <Button variant="contained" onClick={onNext} disabled={isProcessing}>
            {isProcessing
              ? "Loading Participants..."
              : "Next: Review Participants"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
