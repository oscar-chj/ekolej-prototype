"use client";

import { Box, Typography, Chip, Button } from "@mui/material";
import { Check } from "@mui/icons-material";
import { toDateString } from "@/lib/dateUtils";
import { Event } from "@/types/api.types";
import { ParticipantMeritEntry, MeritWeightage } from "./useMeritUpload";
import { useRouter } from "next/navigation";

interface CompletionStepProps {
    validEntries: ParticipantMeritEntry[];
    selectedEvent: Event | null;
    meritWeightage: MeritWeightage;
    onReset: () => void;
}

export function CompletionStep({
    validEntries,
    selectedEvent,
    meritWeightage,
    onReset,
}: CompletionStepProps) {
    const router = useRouter();

    const getMeritTypeColor = (meritType: string) => {
        switch (meritType) {
            case "University": return "error";
            case "Faculty": return "primary";
            case "College": return "success";
            case "Club": return "warning";
            default: return "default";
        }
    };

    return (
        <Box sx={{ textAlign: "center" }}>
            <Check sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
            <Typography variant="h5" gutterBottom>Merit Upload Complete!</Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
                Successfully processed {validEntries.length} merit entries for <strong>{selectedEvent?.title}</strong>
            </Typography>

            <Box sx={{ mt: 3, p: 3, backgroundColor: "grey.50", borderRadius: 2, maxWidth: 600, mx: "auto" }}>
                <Typography variant="body1" gutterBottom sx={{ textAlign: "center", fontWeight: 600, mb: 2 }}>
                    Upload Summary:
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2">
                        Total Participants: <strong>{validEntries.filter((e) => e.role === "Participant").length}</strong>
                    </Typography>
                    <Typography variant="body2">
                        Total Organizers: <strong>{validEntries.filter((e) => e.role === "Organizer").length}</strong>
                    </Typography>
                    <Typography variant="body2">
                        Total points awarded: <strong>{validEntries.reduce((sum, entry) => sum + entry.points, 0)}</strong>
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="body2">Merit Type:</Typography>
                        <Chip
                            label={meritWeightage.meritType}
                            size="small"
                            color={getMeritTypeColor(meritWeightage.meritType)}
                            sx={{ fontWeight: 500 }}
                        />
                    </Box>

                    <Typography variant="body2">
                        Event: <strong>{selectedEvent?.title}</strong>
                    </Typography>
                    <Typography variant="body2">
                        Date: <strong>{selectedEvent && toDateString(selectedEvent.date)}</strong>
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "center" }}>
                <Button variant="contained" onClick={() => router.push("/dashboard")}>
                    Back to Dashboard
                </Button>
                <Button variant="outlined" onClick={onReset}>
                    Upload Merit for Another Event
                </Button>
            </Box>
        </Box>
    );
}
