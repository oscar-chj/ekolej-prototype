"use client";

import { Box, Typography, Card, CardContent, Chip, Alert, Button } from "@mui/material";
import { CheckCircle, Event as EventIcon } from "@mui/icons-material";
import { getCategoryColor, getCategoryDisplayName } from "@/lib/categoryUtils";
import { toDateString } from "@/lib/dateUtils";
import { Event } from "@/types/api.types";

interface EventSelectionStepProps {
    completedEvents: Event[];
    selectedEvent: Event | null;
    onSelect: (event: Event) => void;
    onNext: (event: Event) => void;
}

export function EventSelectionStep({
    completedEvents,
    selectedEvent,
    onSelect,
    onNext,
}: EventSelectionStepProps) {
    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Select a Completed Event for Merit Upload
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Choose from the list of completed events to upload merit points for participants.
            </Typography>

            {completedEvents.length === 0 ? (
                <Alert severity="info">No completed events available for merit upload.</Alert>
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
                                borderColor: selectedEvent?.id === event.id ? "primary.main" : "divider",
                                "&:hover": {
                                    borderColor: "primary.main",
                                    boxShadow: 1,
                                },
                            }}
                            onClick={() => onSelect(event)}
                        >
                            <CardContent>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <Box>
                                        {selectedEvent?.id === event.id ? (
                                            <CheckCircle color="primary" />
                                        ) : (
                                            <Box
                                                sx={{
                                                    width: 24,
                                                    height: 24,
                                                    borderRadius: "50%",
                                                    border: "2px solid",
                                                    borderColor: "action.disabled",
                                                }}
                                            />
                                        )}
                                    </Box>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                            <Typography variant="h6">{event.title}</Typography>
                                            <Chip
                                                label={getCategoryDisplayName(event.category)}
                                                size="small"
                                                color={getCategoryColor(event.category)}
                                            />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            {event.description}
                                        </Typography>
                                        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                <EventIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: "middle" }} />
                                                {toDateString(event.date)} • {event.location}
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
                onClick={() => selectedEvent && onNext(selectedEvent)}
                size="large"
                disabled={!selectedEvent}
            >
                Proceed to Set Weightages
            </Button>
        </Box>
    );
}
