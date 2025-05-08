'use client';

import { MeritEvent } from '@/services/merit/meritService';
import { Event as EventIcon } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography
} from '@mui/material';
import React from 'react';

interface UpcomingEventsProps {
  events: MeritEvent[];
}

// Helper function for formatting dates
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export default function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid rgba(0, 0, 0, 0.05)' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Upcoming Events
        </Typography>
        <List>
          {events.map((event, index) => (
            <React.Fragment key={event.id}>
              <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'info.light' }}>
                    <EventIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={event.title}
                  secondary={
                    <React.Fragment>
                      <Typography variant="body2" component="span">
                        {formatDate(event.date)} • {event.location}
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        <Chip 
                          label={`${event.points} points`} 
                          color="primary" 
                          size="small" 
                          variant="outlined"
                        />
                      </Box>
                    </React.Fragment>
                  }
                />
              </ListItem>
              {index < events.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}