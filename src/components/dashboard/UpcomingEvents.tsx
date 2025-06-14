'use client';

import { MeritEvent } from '@/types/merit.types';
import { formatDate as formatEventDate } from '@/lib/dateUtils';
import { getCategoryColor } from '@/lib/categoryUtils';
import { 
  Event as EventIcon, 
  LocationOn, 
  ArrowForward, 
  EventBusy 
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Stack
} from '@mui/material';
import { memo } from 'react';
import Link from 'next/link';

/**
 * Props for the UpcomingEvents component
 */
interface UpcomingEventsProps {
  events: MeritEvent[];
}



/**
 * Component that displays a list of upcoming events
 */
const UpcomingEvents = memo(function UpcomingEvents({ events }: UpcomingEventsProps) {
  // Handle empty state
  if (!events || events.length === 0) {
    return (
      <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid rgba(0, 0, 0, 0.05)' }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <EventBusy sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" gutterBottom>
            No Upcoming Events
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Check back later for new events or browse all available events.
          </Typography>
          <Button 
            component={Link}
            href="/dashboard/events" 
            variant="outlined" 
            endIcon={<ArrowForward />}
          >
            Browse Events
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid rgba(0, 0, 0, 0.05)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Upcoming Events
          </Typography>
          <Button 
            component={Link}
            href="/dashboard/events" 
            endIcon={<ArrowForward fontSize="small" />}
            size="small"
          >
            View All
          </Button>
        </Box>
        
        <List disablePadding>
          {events.map((event, index) => (
            <Box key={event.id}>
              <ListItem 
                alignItems="flex-start"
                component={Link}
                href={`/dashboard/events/${event.id}`}
                sx={{ 
                  textDecoration: 'none', 
                  color: 'inherit',
                  py: 1.5, 
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    borderRadius: 1
                  }
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: `${getCategoryColor(event.category)}.light` }}>
                    <EventIcon />
                  </Avatar>
                </ListItemAvatar>
                
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {event.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      {/* Replace Box with Stack to avoid div inside p hydration error */}
                      <Stack direction="row" alignItems="center" sx={{ color: 'text.secondary', mb: 0.5 }}>
                        <EventIcon sx={{ fontSize: 14, mr: 0.5 }} />                        <Typography variant="caption" component="span">
                          {formatEventDate(event.date)}
                        </Typography>
                        <Typography component="span" sx={{ mx: 0.5 }}>•</Typography>
                        <LocationOn sx={{ fontSize: 14, mr: 0.5 }} />
                        <Typography variant="caption" component="span">
                          {event.location}
                        </Typography>
                      </Stack>
                      
                      {/* Replace Box with Stack for the second row as well */}
                      <Stack direction="row" alignItems="center" sx={{ mt: 0.5 }}>
                        <Chip 
                          label={`${event.points} points`} 
                          color={getCategoryColor(event.category)} 
                          size="small" 
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }} 
                        />
                        {event.capacity && event.registeredCount !== undefined && (
                          <Typography variant="caption" component="span" sx={{ ml: 1, color: 
                            event.registeredCount >= event.capacity 
                              ? 'error.main' 
                              : event.registeredCount >= event.capacity * 0.8 
                                ? 'warning.main' 
                                : 'success.main' 
                          }}>
                            {event.registeredCount}/{event.capacity} registered
                          </Typography>
                        )}
                      </Stack>
                    </>
                  }
                />
              </ListItem>
              {index < events.length - 1 && <Divider variant="inset" />}
            </Box>
          ))}
        </List>
      </CardContent>
    </Card>
  );
});

export default UpcomingEvents;