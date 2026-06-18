"use client";

import { Box, Typography, Alert, Chip, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, FormControl, Select, MenuItem, Button } from "@mui/material";
import { ArrowBack, Check, Error } from "@mui/icons-material";
import { Event } from "@/types/api.types";
import { ParticipantMeritEntry } from "./useMeritUpload";

interface ParticipantReviewStepProps {
    selectedEvent: Event | null;
    participantData: ParticipantMeritEntry[];
    validEntries: ParticipantMeritEntry[];
    invalidEntries: ParticipantMeritEntry[];
    onBack: () => void;
    onReset: () => void;
    onRoleChange: (index: number, role: "Participant" | "Organizer") => void;
    onSubmit: () => void;
    isProcessing: boolean;
}

export function ParticipantReviewStep({
    selectedEvent,
    participantData,
    validEntries,
    invalidEntries,
    onBack,
    onReset,
    onRoleChange,
    onSubmit,
    isProcessing,
}: ParticipantReviewStepProps) {
    const getStatusColor = (status: string): "success" | "error" | "default" => {
        switch (status) {
            case "valid": return "success";
            case "invalid": return "error";
            default: return "default";
        }
    };

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
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Button startIcon={<ArrowBack />} onClick={onBack} sx={{ mr: 2 }}>Back to Weightages</Button>
                <Typography variant="h6">Review Participants & Assign Roles</Typography>
            </Box>

            {selectedEvent && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    Reviewing participants for: <strong>{selectedEvent.title}</strong>
                </Alert>
            )}

            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <Chip label={`${validEntries.length} Valid Entries`} color="success" icon={<Check />} />
                <Chip label={`${invalidEntries.length} Invalid Entries`} color="error" icon={<Error />} />
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
                            <TableCell>Role</TableCell>
                            <TableCell>Merit Type</TableCell>
                            <TableCell>Points</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {participantData.map((entry, index) => (
                            <TableRow key={`${entry.studentId}-${index}`}>
                                <TableCell>{entry.studentId}</TableCell>
                                <TableCell><Typography variant="body2">{entry.studentName}</Typography></TableCell>
                                <TableCell>
                                    <FormControl size="small" sx={{ minWidth: 120 }}>
                                        <Select
                                            value={entry.role}
                                            onChange={(e) => onRoleChange(index, e.target.value as "Participant" | "Organizer")}
                                            disabled={!entry.isValid}
                                        >
                                            <MenuItem value="Participant">Participant</MenuItem>
                                            <MenuItem value="Organizer">Organizer</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={entry.meritType}
                                        size="small"
                                        color={getMeritTypeColor(entry.meritType)}
                                        sx={{ fontWeight: 500 }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip label={entry.points} size="small" color={entry.isValid ? "primary" : "default"} />
                                </TableCell>
                                <TableCell>
                                    <Chip label={entry.status} size="small" color={getStatusColor(entry.status)} />
                                </TableCell>
                                <TableCell>
                                    {!entry.isValid && entry.errors && (
                                        <Box>
                                            {entry.errors.map((error, errorIndex) => (
                                                <Typography key={errorIndex} variant="caption" color="error" sx={{ display: "block" }}>
                                                    • {error}
                                                </Typography>
                                            ))}
                                        </Box>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                <Button variant="outlined" onClick={onReset}>Reset</Button>
                <Button
                    variant="contained"
                    onClick={onSubmit}
                    disabled={validEntries.length === 0 || isProcessing}
                >
                    {isProcessing ? "Submitting..." : `Submit Merit for ${validEntries.length} Participants`}
                </Button>
            </Box>
        </Box>
    );
}
