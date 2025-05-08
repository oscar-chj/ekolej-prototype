'use client';

import { MeritActivity } from '@/types/merit.types';
import { EventCategory } from '@/types/api.types';
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
  Typography,
  Button,
  Stack
} from '@mui/material';
import { ArrowForward, Assignment } from '@mui/icons-material';
import { memo } from 'react';
import Link from 'next/link';

/**
 * Props for the RecentActivities component
 */
interface RecentActivitiesProps {
  activities: MeritActivity[];
}

/**
 * Format a date string to a more readable format
 * @param dateString - ISO date string
 * @returns Formatted date
 */
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

/**
 * Get the material UI color for a category
 * @param category - Activity category
 * @returns MUI color name
 */
const getCategoryColor = (category: EventCategory): "primary" | "secondary" | "success" | "default" => {
  switch(category) {
    case EventCategory.ACADEMIC: return 'primary';
    case EventCategory.COCURRICULAR: return 'secondary';
    case EventCategory.COMMUNITY: return 'success';
    default: return 'default';
  }
};

/**
 * Get a display name for a category
 * @param category - Activity category
 * @returns Display name
 */
const getCategoryDisplayName = (category: EventCategory): string => {
  return category; // The enum values are already the display names we want
};

/**
 * Component that displays a list of recent merit activities
 */
const RecentActivities = memo(function RecentActivities({ activities }: RecentActivitiesProps) {
  // Handle empty state
  if (!activities || activities.length === 0) {
    return (
      <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid rgba(0, 0, 0, 0.05)' }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Assignment sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" gutterBottom>
            No Recent Activities
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Participate in university events to earn merit points.
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
            Recent Activities
          </Typography>
          <Button 
            component={Link}
            href="/dashboard/merits" 
            endIcon={<ArrowForward fontSize="small" />}
            size="small"
          >
            View All
          </Button>
        </Box>
        
        <List disablePadding>
          {activities.map((activity, index) => (
            <Box key={activity.id}>
              <ListItem alignItems="flex-start" sx={{ py: 1.5, px: 0 }}>
                <ListItemAvatar>
                  <Avatar sx={{ 
                    bgcolor: `${getCategoryColor(activity.category)}.light`,
                    fontWeight: 'bold'
                  }}>
                    {activity.points}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {activity.title}
                    </Typography>
                  }
                  // Fix: Change Box to Typography with display="block" to avoid div inside p
                  secondary={
                    <>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                        <Chip 
                          label={getCategoryDisplayName(activity.category)} 
                          color={getCategoryColor(activity.category)}
                          size="small" 
                          sx={{ fontSize: '0.7rem' }} 
                        />
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(activity.date)}
                        </Typography>
                      </Stack>
                    </>
                  }
                />
              </ListItem>
              {index < activities.length - 1 && <Divider variant="inset" />}
            </Box>
          ))}
        </List>
      </CardContent>
    </Card>
  );
});

export default RecentActivities;