'use client';

import { MeritActivity } from '@/services/merit/meritService';
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

interface RecentActivitiesProps {
  activities: MeritActivity[];
}

// Helper function for formatting dates
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Helper function to get category color
const getCategoryColor = (category: string) => {
  switch(category) {
    case 'Academic': return 'primary';
    case 'Co-curricular': return 'secondary';
    case 'Community Service': return 'success';
    default: return 'default';
  }
};

export default function RecentActivities({ activities }: RecentActivitiesProps) {
  return (
    <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid rgba(0, 0, 0, 0.05)' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Activities
        </Typography>
        <List>
          {activities.map((activity, index) => (
            <React.Fragment key={activity.id}>
              <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: `${getCategoryColor(activity.category)}.light` }}>
                    {activity.points}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={activity.title}
                  secondary={
                    <React.Fragment>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <Chip 
                          label={activity.category} 
                          color={getCategoryColor(activity.category) as any} 
                          size="small" 
                          sx={{ mr: 1 }} 
                        />
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(activity.date)}
                        </Typography>
                      </Box>
                    </React.Fragment>
                  }
                />
              </ListItem>
              {index < activities.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}