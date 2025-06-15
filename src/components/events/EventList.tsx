"use client";

import { ErrorDisplay, LoadingDisplay } from "@/components/ui/ErrorDisplay";
import { getCategoryColor, getCategoryDisplayName } from "@/lib/categoryUtils";
import { formatDate } from "@/lib/dateUtils";
import EventListService from "@/services/event/eventListService";
import { Event } from "@/types/api.types";
import {
  AccessTime,
  Event as EventIcon,
  LocationOn,
  Person,
  Refresh,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index} style={{ paddingTop: "1rem" }}>
      {value === index && children}
    </div>
  );
}

interface EventCardListProps {
  events: Event[];
}

function EventCardList({ events }: EventCardListProps) {
  if (events.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <EventIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          No events found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Check other tabs for available events.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {events.map((event) => (
        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={event.id}>
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
                <Avatar
                  sx={{ bgcolor: getCategoryColor(event.category), mr: 2 }}
                >
                  <EventIcon sx={{ color: "white" }} />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {event.title}
                  </Typography>
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
                <AccessTime
                  sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                />
                <Typography variant="caption" color="text.secondary">
                  {formatDate(event.date)} at {event.time}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <LocationOn
                  sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                />
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

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {event.capacity && (
                  <Typography variant="caption" color="text.secondary">
                    {event.registeredCount}/{event.capacity} registered
                  </Typography>
                )}
              </Box>
            </CardContent>

            {event.status === "Upcoming" && (
              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={event.registeredCount >= event.capacity}
                  onClick={() => {
                    // In production, this would handle event registration
                    alert(`Register for ${event.title} (demo functionality)`);
                  }}
                >
                  {event.registeredCount >= event.capacity
                    ? "Event Full"
                    : "Register"}
                </Button>
              </Box>
            )}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

interface EventListProps {
  onRefresh?: () => void;
  showHeader?: boolean;
}

export default function EventList({
  onRefresh,
  showHeader = true,
}: EventListProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchEvents = async (forceRefresh = false) => {
    try {
      setIsLoading(!forceRefresh);
      setIsRefreshing(forceRefresh);
      setError(null);

      // Use EventListService to fetch events (implements UC2)
      const fetchedEvents = forceRefresh
        ? await EventListService.refreshEventList()
        : await EventListService.fetchEventList();

      setEvents(fetchedEvents);
    } catch (err) {
      console.error("Error fetching events:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to load events. Please try again later.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRefresh = () => {
    fetchEvents(true);
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Filter events by status
  const upcomingEvents = events.filter((event) => event.status === "Upcoming");
  const ongoingEvents = events.filter((event) => event.status === "Ongoing");
  const completedEvents = events.filter(
    (event) => event.status === "Completed"
  );

  if (isLoading) {
    return <LoadingDisplay message="Loading events..." />;
  }

  if (error) {
    return <ErrorDisplay message={error} showRetry onRetry={handleRefresh} />;
  }

  return (
    <Box>
      {showHeader && (
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                Browse Events
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Explore merit-earning opportunities categorized by time status
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? "Refreshing..." : "Refresh Events"}
            </Button>
          </Box>

          {/* Cache Status Indicator */}
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Events are cached for better performance. Data refreshes
              automatically every 15 minutes or when you click refresh.
            </Typography>
          </Alert>
        </Box>
      )}

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={`Upcoming (${upcomingEvents.length})`} />
          <Tab label={`Ongoing (${ongoingEvents.length})`} />
          <Tab label={`Completed (${completedEvents.length})`} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <EventCardList events={upcomingEvents} />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <EventCardList events={ongoingEvents} />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <EventCardList events={completedEvents} />
      </TabPanel>
    </Box>
  );
}
