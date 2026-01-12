"use client";

import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import EventListSkeleton from "@/components/ui/skeletons/EventListSkeleton";
import { useEvents } from "./useEvents";
import { EventCard } from "./EventCard";
import { EventFilters } from "./EventFilters";
import {
  Box, Button, Grid, Tab, Tabs, Typography, Alert,
} from "@mui/material";
import { Refresh, Event as EventIcon } from "@mui/icons-material";
import React from "react";
import { Event as ApiEvent } from "@/types/api.types";

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

export default function EventList({ onRefresh, showHeader = true }: { onRefresh?: () => void, showHeader?: boolean }) {
  const {
    isLoading, error, isRefreshing, searchTerm, setSearchTerm,
    appliedFilters, setAppliedFilters, handleRefresh, uniqueOrganizers,
    upcomingEvents, ongoingEvents, completedEvents
  } = useEvents();

  const [tabValue, setTabValue] = React.useState(0);

  const internalRefresh = () => {
    handleRefresh();
    if (onRefresh) onRefresh();
  };

  if (isLoading) return <EventListSkeleton />;
  if (error) return <ErrorDisplay message={error} showRetry onRetry={internalRefresh} />;

  const renderEventGrid = (events: ApiEvent[]) => {
    if (events.length === 0) {
      return (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <EventIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" gutterBottom>No events found</Typography>
          <Typography variant="body2" color="text.secondary">Try adjusting your filters.</Typography>
        </Box>
      );
    }
    return (
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid key={event.id} size={{ xs: 12, md: 6, lg: 4 }}>
            <EventCard event={event} onRegister={(e) => alert(`Registering for ${e.title}`)} />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box>
      {showHeader && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Box>
              <Typography variant="h4" gutterBottom>Browse Events</Typography>
              <Typography variant="body1" color="text.secondary">Explore merit-earning opportunities</Typography>
            </Box>
            <Button variant="outlined" startIcon={<Refresh />} onClick={internalRefresh} disabled={isRefreshing}>
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </Box>

          <EventFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            appliedFilters={appliedFilters}
            setAppliedFilters={setAppliedFilters}
            uniqueOrganizers={uniqueOrganizers}
          />

          <Alert severity="info" sx={{ mb: 2 }}>
            Events are cached for performance. Refreshes every 15 minutes.
          </Alert>
        </Box>
      )}

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
          <Tab label={`Upcoming (${upcomingEvents.length})`} />
          <Tab label={`Ongoing (${ongoingEvents.length})`} />
          <Tab label={`Completed (${completedEvents.length})`} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>{renderEventGrid(upcomingEvents)}</TabPanel>
      <TabPanel value={tabValue} index={1}>{renderEventGrid(ongoingEvents)}</TabPanel>
      <TabPanel value={tabValue} index={2}>{renderEventGrid(completedEvents)}</TabPanel>
    </Box>
  );
}
