"use client";

import { Box, Card, CardContent, Typography, Avatar, Chip, Button } from "@mui/material";
import { AccessTime, LocationOn, Person, Event as EventIcon } from "@mui/icons-material";
import { getCategoryColor, getCategoryDisplayName } from "@/lib/categoryUtils";
import { formatDate, toDateString } from "@/lib/dateUtils";
import { Event, EventStatus } from "@/types/api.types";

interface EventCardProps {
    event: Event;
    onRegister?: (event: Event) => void;
}

export function EventCard({ event, onRegister }: EventCardProps) {
    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 2,
                border: "1px solid rgba(0, 0, 0, 0.08)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar sx={{ bgcolor: getCategoryColor(event.category), mr: 2 }}>
                        <EventIcon sx={{ color: "white" }} />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>{event.title}</Typography>
                        <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                            <Chip
                                label={getCategoryDisplayName(event.category)}
                                size="small"
                                color={getCategoryColor(event.category)}
                                sx={{ color: "white", fontWeight: 600 }}
                            />
                            <Chip
                                label={`${event.points} points`}
                                color="primary"
                                size="small"
                                variant="outlined"
                            />
                        </Box>
                    </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {event.description}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <AccessTime sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
                    <Typography variant="caption" color="text.secondary">
                        {formatDate(toDateString(event.date))} at {event.time}
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocationOn sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
                    <Typography variant="caption" color="text.secondary">
                        {event.location}
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Person sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
                    <Typography variant="caption" color="text.secondary">
                        Organized by {event.organizer}
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {event.capacity && (
                        <Typography variant="caption" color="text.secondary">
                            {event.registeredCount}/{event.capacity} registered
                        </Typography>
                    )}
                </Box>
            </CardContent>

            {event.status === EventStatus.UPCOMING && (
                <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                        variant="contained"
                        fullWidth
                        disabled={event.registeredCount >= event.capacity}
                        onClick={() => onRegister && onRegister(event)}
                    >
                        {event.registeredCount >= event.capacity ? "Event Full" : "Register"}
                    </Button>
                </Box>
            )}
        </Card>
    );
}
